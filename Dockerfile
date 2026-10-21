# syntax=docker/dockerfile:1
#
# Oblik: Next.js (output: 'standalone') + Payload CMS. Цели:
#   runner — продакшен-сервер (node server.js), без исходников и dev-зависимостей
#   tools  — исходники и все зависимости: миграции (pnpm payload migrate) и seed (pnpm seed)
# Порядок запуска и тома описаны в docker-compose.prod.yml и README.md.

ARG NODE_VERSION=24

# --- base: Node + pnpm ---------------------------------------------------------------
FROM node:${NODE_VERSION}-bookworm-slim AS base
ARG PNPM_VERSION=10.34.7
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm install -g pnpm@${PNPM_VERSION} && npm cache clean --force
WORKDIR /app

# --- deps: зависимости по lockfile (слой кэшируется, пока не меняется pnpm-lock.yaml) -----
FROM base AS deps
COPY package.json pnpm-lock.yaml ./
RUN --mount=type=cache,id=oblik-pnpm-store,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile

# --- builder: next build ----------------------------------------------------------------------
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# NEXT_PUBLIC_* вшиваются в бандл при сборке, поэтому это аргументы сборки, а не env контейнера
ARG NEXT_PUBLIC_SITE_URL=http://localhost:3000
ARG NEXT_PUBLIC_TURNSTILE_SITE_KEY=
ARG NEXT_PUBLIC_ANALYTICS_SRC=
ARG NEXT_PUBLIC_ANALYTICS_ID=
ENV NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL} \
    NEXT_PUBLIC_TURNSTILE_SITE_KEY=${NEXT_PUBLIC_TURNSTILE_SITE_KEY} \
    NEXT_PUBLIC_ANALYTICS_SRC=${NEXT_PUBLIC_ANALYTICS_SRC} \
    NEXT_PUBLIC_ANALYTICS_ID=${NEXT_PUBLIC_ANALYTICS_ID}
# База при сборке не нужна (src/lib/build.ts): страницы собираются по первому запросу и живут в ISR-кэше.
# Адрес и секрет ниже — заглушки только для этого шага, в образ они не попадают.
RUN BUILD_WITHOUT_DB=1 \
    DATABASE_URL=postgres://build:build@127.0.0.1:1/build \
    PAYLOAD_SECRET=build-only-placeholder \
    pnpm build
# Нативные части sharp (libvips) трассировка находит не всегда: кладём пакеты @img целиком, с симлинками pnpm
RUN rm -rf .next/standalone/node_modules/.pnpm/@img+sharp-* \
    && cp -a node_modules/.pnpm/@img+sharp-* .next/standalone/node_modules/.pnpm/ \
    && rm -f .next/standalone/.env*

# --- tools: миграции и seed ----------------------------------------------------------------
FROM base AS tools
ENV NODE_ENV=production \
    MEDIA_DIR=/data/media \
    FILES_DIR=/data/private-files
COPY --from=deps --chown=node:node /app/node_modules ./node_modules
COPY --chown=node:node . .
RUN mkdir -p /data/media /data/private-files && chown -R node:node /data
USER node
# NODE_ENV=production обязателен: в dev Payload синхронизирует схему push'ем мимо миграций
CMD ["pnpm", "payload", "migrate"]

# --- runner: продакшен ---------------------------------------------------------------------
FROM node:${NODE_VERSION}-bookworm-slim AS runner
WORKDIR /app
# HOSTNAME=0.0.0.0 обязателен: Docker сам задаёт HOSTNAME = id контейнера. Не 127.0.0.1: Next приводит его
# к localhost в URL прокси, и rewrite next-intl на локализованные адреса превращается в бесконечный редирект.
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0 \
    MEDIA_DIR=/data/media \
    FILES_DIR=/data/private-files
RUN mkdir -p /data/media /data/private-files && chown -R node:node /data
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static
COPY --from=builder --chown=node:node /app/public ./public
# сборка падает здесь, если sharp не загружается (картинки, OG, плейсхолдеры)
RUN node -e "require('sharp')"
USER node
EXPOSE 3000
VOLUME ["/data/media", "/data/private-files"]
HEALTHCHECK --interval=30s --timeout=5s --start-period=40s --retries=3 \
  CMD ["node", "-e", "fetch('http://127.0.0.1:3000/robots.txt').then((r) => process.exit(r.ok ? 0 : 1), () => process.exit(1))"]
CMD ["node", "server.js"]
