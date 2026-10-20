/**
 * Локальный PostgreSQL без Docker: настоящие бинарники Postgres из npm-пакета embedded-postgres.
 * Данные лежат в .data/postgres и переживают перезапуск. Остановка: Ctrl+C.
 *
 *   pnpm db:dev
 *
 * Если Docker установлен, вместо этого можно запустить `docker compose up -d`.
 */
import EmbeddedPostgres from 'embedded-postgres'
import { existsSync } from 'node:fs'
import path from 'node:path'

const url = new URL(process.env.DATABASE_URL ?? 'postgres://oblik:oblik@127.0.0.1:5432/oblik')
const databaseDir = path.resolve(process.cwd(), '.data/postgres')
const database = url.pathname.replace(/^\//, '') || 'oblik'

const pg = new EmbeddedPostgres({
  databaseDir,
  user: decodeURIComponent(url.username || 'oblik'),
  password: decodeURIComponent(url.password || 'oblik'),
  port: Number(url.port || 5432),
  persistent: true,
  // UTF-8 обязательно: иначе на Windows кластер создаётся в WIN1251 и сербские č, ć, đ, š, ž не сохраняются
  initdbFlags: ['--encoding=UTF8', '--locale=C', '--lc-collate=C', '--lc-ctype=C'],
  onLog: () => {},
  onError: (message) => console.error('[postgres]', message),
})

async function main() {
  if (!existsSync(path.join(databaseDir, 'PG_VERSION'))) {
    console.log('[db] initdb →', databaseDir)
    await pg.initialise()
  }
  await pg.start()
  try {
    await pg.createDatabase(database)
    console.log(`[db] база "${database}" создана`)
  } catch {
    // база уже есть
  }
  console.log(`[db] PostgreSQL слушает ${url.hostname}:${url.port || 5432}, база "${database}". Ctrl+C для остановки.`)

  const stop = async () => {
    console.log('\n[db] остановка…')
    await pg.stop()
    process.exit(0)
  }
  process.on('SIGINT', stop)
  process.on('SIGTERM', stop)
  // держим процесс живым
  setInterval(() => {}, 1 << 30)
}

main().catch(async (error) => {
  console.error('[db] не удалось запустить PostgreSQL:', error)
  await pg.stop().catch(() => {})
  process.exit(1)
})
