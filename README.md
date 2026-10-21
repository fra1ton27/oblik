# Oblik

Трёхъязычный (RU / EN / SR) сайт-магазин дизайнерской мебели: Next.js 16 и Payload CMS 3 в одном приложении, PostgreSQL, Tailwind CSS 4, next-intl, GSAP.

Полное ТЗ: [docs/SPEC.md](docs/SPEC.md). Правила кода и структура проекта: [CLAUDE.md](CLAUDE.md).

Дизайн и разработка: [@fra1ton27](https://github.com/fra1ton27).

## Быстрый старт (локально)

Нужны Node.js 22+ (проверено на 24) и pnpm 10 (`corepack enable` или `npm i -g pnpm@10.34.7`).

С Docker всё делается одной последовательностью команд:

```bash
git clone https://github.com/fra1ton27/oblik.git
cd oblik
pnpm install
cp .env.example .env
docker compose up -d --wait
pnpm seed
pnpm dev
```

Без Docker PostgreSQL можно поднять из npm: вместо `docker compose up -d --wait` выполните `pnpm db:dev` в отдельном терминале и оставьте его открытым. Данные лежат в `.data/postgres` и сохраняются между запусками. В PowerShell вместо `cp` используйте `Copy-Item .env.example .env`.

После запуска:

- сайт: http://localhost:3000 (откроется `/ru`, есть также `/en` и `/sr`);
- админка: http://localhost:3000/admin, вход по `SEED_ADMIN_EMAIL` и `SEED_ADMIN_PASSWORD` из `.env`;
- демо-покупатель для личного кабинета: `SEED_CUSTOMER_EMAIL` и `SEED_CUSTOMER_PASSWORD`;
- письма: без `RESEND_API_KEY` и `SMTP_HOST` они печатаются в консоль `pnpm dev`.

Значения из `.env.example` подходят для локальной работы. Пароли `SEED_*` лучше сразу заменить своими.

Seed идемпотентен, повторный запуск не создаёт дублей. Если `pnpm seed` запускался при работающем `pnpm dev`, перезапустите dev-сервер: seed пишет в базу в обход Next, и кэш данных сам не обновится.

## Команды

| Команда | Что делает |
| :- | :- |
| `pnpm dev` | dev-сервер на http://localhost:3000 |
| `pnpm db:dev` | локальный PostgreSQL без Docker |
| `pnpm db:reset --yes` | удалить все таблицы локальной базы (после этого `pnpm seed`) |
| `pnpm seed` | демо-данные: 24 товара, коллекции, страницы, админ, демо-покупатель |
| `pnpm build` / `pnpm start` | production-сборка и запуск (сборке нужна база) |
| `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm i18n:check` | проверки перед каждым коммитом |
| `pnpm test:e2e`, `pnpm test:e2e:sweep` | Playwright: сценарии и обход всех страниц |
| `pnpm generate:types` | типы Payload после изменения коллекций |
| `pnpm generate:importmap` | карта компонентов админки |
| `pnpm payload migrate:create <имя>` | новая миграция базы |

## Проверки

Перед каждым коммитом:

```bash
pnpm lint && pnpm typecheck && pnpm test && pnpm i18n:check
```

E2E-тесты идут на production-сборке. Playwright сам запускает `pnpm start` на порту 3000. Предупреждение Next о `output: 'standalone'` при `next start` можно не замечать.

```bash
pnpm exec playwright install chromium
pnpm build
pnpm test:e2e
pnpm test:e2e:sweep
```

- Прогон против уже запущенного сервера: `E2E_BASE_URL=http://localhost:3000 pnpm test:e2e`. Для dev-сервера добавьте `E2E_DEV=1`: бюджеты производительности в dev пропускаются.
- Бюджеты (JS, LCP, CLS на мобильном профиле) лучше мерить в один поток: `pnpm exec playwright test --project=mobile tests/e2e/perf.spec.ts --workers=1`.
- Бюджет JS первой загрузки временно 280 КБ gzip вместо 200 по ТЗ, по решению заказчика. Для проверки исходной цели: `PERF_JS_BUDGET_KB=200`.
- Lighthouse: `npx -y lighthouse@12.8.2 http://localhost:3000/ru --form-factor=mobile --only-categories=performance,accessibility,best-practices,seo --view`. На Windows может понадобиться `CHROME_PATH` с путём к установленному Chrome.

## База данных и миграции

- В dev Payload синхронизирует схему с коллекциями сам (drizzle push) при `pnpm dev` и `pnpm seed`. Если push спрашивает, переименовать колонку или создать новую (так бывает после смены полей), проще всего выполнить `pnpm db:reset --yes` и `pnpm seed`.
- В production схема меняется только миграциями из `src/migrations`.

После изменения коллекций, глобалов или блоков:

```bash
pnpm generate:types
pnpm payload migrate:create <имя>
```

Закоммитьте `src/migrations` вместе с изменением схемы. В Docker миграции применяет сервис `migrate` до старта приложения. Без Docker выполните `pnpm payload migrate` перед `pnpm start`.

Не запускайте `pnpm dev` и обычный `pnpm seed` на production-базе. Push пометит её как dev-базу, и `payload migrate` начнёт останавливаться на вопросе о потере данных.

## Рендеринг и кэш

- Главная, товары, коллекции и контентные страницы статические (ISR). Их сбрасывают теги из хуков Payload: правка в админке обновляет страницу со следующего запроса.
- Корзина, оформление, кабинет, вход и каталог с фильтрами рендерятся на каждый запрос. Запросы к базе кэшируются с теми же тегами.
- Docker-образ собирается без базы (`BUILD_WITHOUT_DB=1`, см. [src/lib/build.ts](src/lib/build.ts)). Статические страницы тогда не пререндерятся при сборке: каждая собирается при первом запросе и дальше отдаётся из кэша.

## Деплой: Docker на VPS

Понадобятся сервер с Docker Engine и Compose v2 и домен, A-запись которого указывает на сервер. Сборка Next.js требует несколько гигабайт памяти. На маленьком VPS добавьте swap или соберите образы на другой машине и перенесите их через registry.

Состав [docker-compose.prod.yml](docker-compose.prod.yml):

| Сервис | Что делает |
| :- | :- |
| `postgres` | PostgreSQL 16, данные в томе `pgdata` |
| `migrate` | применяет миграции Payload и завершается; `app` стартует только после его успеха |
| `app` | Next.js standalone (`node server.js`); медиа и файлы заявок в томах `media` и `private-files` |
| `caddy` | HTTPS с автоматическим сертификатом (профиль `https`) |
| `seed` | демо-данные по запросу (профиль `seed`) |

### 1. Код и переменные

```bash
git clone https://github.com/fra1ton27/oblik.git
cd oblik
cp .env.example .env
openssl rand -hex 32
openssl rand -hex 24
```

Первое случайное значение пойдёт в `PAYLOAD_SECRET`, второе в `POSTGRES_PASSWORD`. Заполните `.env`:

| Переменная | Значение |
| :- | :- |
| `NEXT_PUBLIC_SITE_URL` | адрес сайта, например `https://oblik.example`; по нему Caddy получает сертификат |
| `PAYLOAD_SECRET` | случайная строка от 32 символов |
| `POSTGRES_PASSWORD` | пароль базы; `DATABASE_URL` для контейнеров собирается из `POSTGRES_*` автоматически |
| `RESEND_API_KEY` или `SMTP_*` | отправка писем; без них письма только в логах `app` |
| `MAIL_FROM`, `MANAGER_EMAIL` | отправитель и адрес менеджера для заказов и заявок |
| `SEED_ADMIN_EMAIL`, `SEED_ADMIN_PASSWORD` | нужны, только если будете запускать seed |
| `ROBOTS_DISALLOW_ALL=1` | для стенда: закрыть сайт от индексации |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY` | антиспам Cloudflare Turnstile (необязательно) |
| `S3_*` | хранить медиатеку в S3-совместимом бакете вместо тома (необязательно) |
| `NEXT_PUBLIC_ANALYTICS_*` | аналитика, грузится после согласия на cookie (необязательно) |

`NEXT_PUBLIC_*` вшиваются в сборку. После их изменения образ нужно пересобрать (`--build`).

### 2. Запуск

```bash
docker compose -f docker-compose.prod.yml --profile https up -d --build
```

Compose соберёт образы и поднимет PostgreSQL. Затем сервис `migrate` применит миграции, после чего стартуют приложение и Caddy. Caddy получает сертификат Let's Encrypt при старте, поэтому к этому моменту домен уже должен указывать на сервер, а порты 80 и 443 быть открыты.

Со своим nginx запускайте без `--profile https`. Приложение слушает `127.0.0.1:3000`, пример конфигурации ниже.

### 3. Контент и первый вход

Есть два варианта:

- **Демо-данные.** Выполните команды ниже. Seed пишет в базу из отдельного контейнера, поэтому приложение нужно пересоздать: так сбросится кэш страниц.

  ```bash
  docker compose -f docker-compose.prod.yml run --rm seed
  docker compose -f docker-compose.prod.yml up -d --force-recreate app
  ```

  После этого вход в `/admin` по `SEED_ADMIN_*`.
- **Пустой сайт.** Откройте `https://<домен>/admin`. Пока пользователей нет, Payload предложит создать первого администратора.

### 4. Проверка

```bash
docker compose -f docker-compose.prod.yml ps
docker compose -f docker-compose.prod.yml logs -f app
```

Чтобы не писать `-f` каждый раз, задайте `export COMPOSE_FILE=docker-compose.prod.yml COMPOSE_PROFILES=https`.

### Обновление

```bash
git pull
docker compose -f docker-compose.prod.yml --profile https up -d --build
```

`migrate` применит только новые миграции, затем контейнер `app` пересоздаётся, и кэш страниц начинается заново.

### Резервные копии

```bash
docker compose -f docker-compose.prod.yml exec -T postgres sh -c 'pg_dump -U "$POSTGRES_USER" -d "$POSTGRES_DB" -Fc' > oblik-db.dump
docker run --rm -v oblik_media:/from -v "$PWD":/to alpine tar czf /to/oblik-media.tgz -C /from .
docker run --rm -v oblik_private-files:/from -v "$PWD":/to alpine tar czf /to/oblik-private-files.tgz -C /from .
```

Восстановление базы: `pg_restore --clean --if-exists -U "$POSTGRES_USER" -d "$POSTGRES_DB"` внутри контейнера `postgres`.

### Свой nginx вместо Caddy

```nginx
server {
    server_name oblik.example;
    # заявка «на заказ»: до 5 файлов по 10 МБ
    client_max_body_size 60m;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Сертификат выпустите certbot или другим удобным способом.

### Если что-то пошло не так

- **`app` не стартует.** Смотрите `docker compose -f docker-compose.prod.yml logs migrate`: приложение ждёт успешного завершения миграций.
- **Бесконечный редирект на `/ru/katalog` и других локализованных адресах.** Сервер запущен с `HOSTNAME=127.0.0.1`. В образе стоит `0.0.0.0`; вне Docker используйте `0.0.0.0` или `localhost`.
- **Данные не обновились после seed.** Пересоздайте `app`, как описано в шаге 3.

## Деплой на Netlify

На Netlify сайт работает без сервера: Next.js через адаптер Netlify, PostgreSQL в [Neon](https://neon.tech), медиатека и вложения заявок в Netlify Blobs ([src/lib/storage/netlifyBlobs.ts](src/lib/storage/netlifyBlobs.ts)). Настройки сборки лежат в [netlify.toml](netlify.toml): команда `pnpm netlify:build` применяет миграции и собирает сайт.

### 1. База в Neon

1. Создайте проект в Neon. Регион — AWS US East 2 (Ohio): там по умолчанию работают функции Netlify, и запросы к базе идут быстрее.
2. В разделе Connect включите Connection pooling и скопируйте строку подключения (`postgresql://…-pooler…/neondb?sslmode=require`).

### 2. Проект на Netlify

1. Add new project → Import an existing project → GitHub, выберите репозиторий. Команда сборки и папка подтянутся из `netlify.toml`.
2. До первого деплоя задайте переменные в Project configuration → Environment variables:

| Переменная | Значение |
| :- | :- |
| `DATABASE_URL` | строка подключения Neon из шага 1 |
| `PAYLOAD_SECRET` | случайная строка от 32 символов: `openssl rand -hex 32` |
| `ALLOW_DEMO_SEED` | `1`, чтобы загрузить демо-данные из админки; после загрузки можно удалить |
| `SEED_CUSTOMER_EMAIL`, `SEED_CUSTOMER_PASSWORD` | демо-покупатель для личного кабинета (необязательно) |
| `RESEND_API_KEY` или `SMTP_*`, `MAIL_FROM`, `MANAGER_EMAIL` | отправка писем; без них письма только в логах функций |
| `NEXT_PUBLIC_SITE_URL` | свой домен; по умолчанию берётся основной адрес проекта на Netlify |
| `ROBOTS_DISALLOW_ALL` | `1` — закрыть сайт от индексации |

3. Запустите деплой. Сборка применит миграции к пустой базе и соберёт сайт (страницы пока без товаров).

### 3. Администратор и демо-данные

1. Откройте `https://<проект>.netlify.app/admin`. Пока пользователей нет, Payload предложит создать первого администратора.
2. На дашборде нажмите «Загрузить демо-данные» (кнопка видна при `ALLOW_DEMO_SEED=1`). Seed идёт частями по 15 секунд, укладываясь в лимит функции, и занимает несколько минут. Уже существующие записи он не трогает.
3. Deploys → Trigger deploy → Deploy project: статические страницы пересоберутся с данными.

### Ограничения Netlify

- Тело запроса к функции — до 6 МБ. Поэтому вложения к заявке «на заказ» там до 4 МБ вместе (на Docker — 5 файлов по 10 МБ), а один файл в медиатеку через админку — примерно до 4,5 МБ.
- Запрос к функции длится не больше 30 секунд. Первый запрос после простоя медленнее: просыпаются функция и база Neon.
- Лимиты антиспама хранятся в памяти экземпляра функции, поэтому на Netlify они слабее (TODO(spec) ниже).
- Новые правки из админки видны сразу (кэш сбрасывается по тегам). Каждая сборка заново читает данные из базы: кэш данных прошлой сборки удаляет `scripts/netlify-build.ts`.

## Открытые вопросы (TODO(spec))

- Бюджет JS первой загрузки: временно 280 КБ вместо 200 (`tests/e2e/perf.spec.ts`).
- Онлайн-оплата: провайдер не выбран, сейчас ручное подтверждение менеджером (`src/lib/payments`).
- CSP с nonce вместо `'unsafe-inline'`, когда это поддержит админка Payload (`next.config.ts`).
- Лимиты антиспама хранятся в памяти процесса. Пока запущен один экземпляр `app`, этого достаточно; для нескольких нужен общий стор.
- Срок и порядок удаления аккаунта (`src/lib/actions/account.ts`).
- Фильтрация каталога в SQL при тысячах товаров (`src/lib/data/catalog.ts`).

Остальные вопросы к заказчику перечислены в разделе 15.2 ТЗ.

---

Подпись `@fra1ton27` со ссылкой на GitHub есть на каждой странице (компонент `DeveloperCredit`) и из CMS не отключается.
