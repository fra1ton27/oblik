/**
 * Полный сброс схемы локальной БД (только для разработки):
 *   pnpm db:reset --yes
 * Удаляет все таблицы в схеме public. После этого `pnpm dev` или `pnpm seed` создадут схему заново.
 * Нужен, когда drizzle push в dev спрашивает «переименовать или создать колонку» после смены полей.
 */
import EmbeddedPostgres from 'embedded-postgres'
import path from 'node:path'

if (!process.argv.includes('--yes')) {
  console.error('Это удалит все данные локальной базы. Запустите с флагом --yes.')
  process.exit(1)
}

const url = new URL(process.env.DATABASE_URL ?? 'postgres://oblik:oblik@127.0.0.1:5432/oblik')
if (!['127.0.0.1', 'localhost'].includes(url.hostname)) {
  console.error(`Отказ: ${url.hostname} не локальный хост.`)
  process.exit(1)
}

const pg = new EmbeddedPostgres({
  databaseDir: path.resolve(process.cwd(), '.data/postgres'),
  user: decodeURIComponent(url.username || 'oblik'),
  password: decodeURIComponent(url.password || 'oblik'),
  port: Number(url.port || 5432),
  persistent: true,
})

const client = pg.getPgClient(url.pathname.replace(/^\//, '') || 'oblik', url.hostname)
await client.connect()
await client.query('DROP SCHEMA IF EXISTS public CASCADE')
await client.query('CREATE SCHEMA public')
await client.query(`GRANT ALL ON SCHEMA public TO ${client.user ?? 'oblik'}`)
await client.end()
console.log('[db] схема public пересоздана')
