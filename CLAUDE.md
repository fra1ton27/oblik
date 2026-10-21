# Oblik — сайт-магазин дизайнерской мебели (RU / EN / SR)

Полное ТЗ: [docs/SPEC.md](docs/SPEC.md). Работаем по этапам из раздела 15, не переходим дальше без приёмки текущего.

## Стек
Next.js 16 (App Router, `src/proxy.ts` вместо middleware) + React 19 + TypeScript strict · Payload CMS 3 внутри Next (`/admin`, `/api`) · PostgreSQL 16+ (`@payloadcms/db-postgres`) · Tailwind CSS 4 (токены в `src/styles/tokens.css`) · next-intl 4 · GSAP 3 + @gsap/react · Lenis · three / R3F (только ленивый чанк витрины) · Zustand · react-hook-form + zod · Vitest, Playwright, axe-core.

## Команды
```bash
pnpm install
pnpm db:dev            # локальный PostgreSQL без Docker (или: docker compose up -d)
pnpm dev               # http://localhost:3000, админка /admin
pnpm seed              # демо-данные (идемпотентно)
pnpm lint && pnpm typecheck && pnpm test && pnpm i18n:check   # перед каждым коммитом
pnpm test:e2e          # Playwright, нужен запущенный dev/start
pnpm generate:types    # после изменения коллекций Payload
pnpm generate:importmap
pnpm payload migrate:create <name>   # после изменения схемы; prod применяет только миграции из src/migrations
docker compose -f docker-compose.prod.yml up -d --build   # прод: postgres → migrate → app, подробно в README.md
# Netlify: netlify.toml → pnpm netlify:build (миграции + сборка), загрузки в Netlify Blobs, README.md
```

## Правила кода
- Весь текст интерфейса из `messages/{ru,en,sr}.json`. Ни одной строки в JSX (ESLint `react/jsx-no-literals`). Ключи во всех трёх файлах одинаковые (`pnpm i18n:check`). Сербский латиницей с диакритикой.
- Навигация только через `@/i18n/navigation` (`Link`, `redirect`, `useRouter`), не `next/link`.
- Цены и даты только через `@/lib/format` (Intl с локалями ru-RU / en-GB / sr-Latn-RS). Деньги в центах (int).
- Цвета только токенами (`bg-milk`, `text-ink`, `var(--color-…)`), hex в компонентах запрещён. На пастельных фонах текст только ink / ink-soft.
- GSAP: плагины регистрируются в `src/components/motion/gsap.ts`, анимации через `useGSAP` со scope, разное поведение через `gsap.matchMedia()`. Анимируем только transform / opacity / clip-path. `prefers-reduced-motion` выключает тяжёлое движение.
- Контент доступен без JS: стартовые состояния анимаций только под классом `.js-ready`.
- Данные читаем через Payload Local API в Server Components (`src/lib/data`). Цене с клиента не доверяем.
- Если в ТЗ нет ответа: самый простой вариант + комментарий `TODO(spec): <вопрос>`.
- Подпись `@fra1ton27` (компонент `DeveloperCredit`) обязательна на всех страницах, не выключается из CMS.

## Структура
`src/app/(frontend)/[locale]` публичные страницы (внутренние имена маршрутов английские, локализованные адреса в `src/i18n/routing.ts`) · `src/app/(payload)` админка и API · `src/collections`, `src/globals`, `src/blocks` схемы Payload · `src/components/{ui,layout,catalog,product,cart,checkout,account,forms,motion,shapes}` · `src/lib` форматы, цены, SEO, платёжный адаптер · `src/seed` демо-данные · `tests/unit`, `tests/e2e`.
