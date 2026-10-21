/**
 * pnpm seed — демо-данные из командной строки (раздел 12.4 ТЗ). Сам seed — в seed.ts.
 */
import fs from 'node:fs'
import path from 'node:path'
import { getPayload } from 'payload'
import config from '@payload-config'
import { runSeed } from './seed'

/**
 * Seed пишет в базу мимо Next, поэтому сбросить теги unstable_cache он не может, а кэш данных
 * Next хранит на диске и переживает перезапуск. Удаляем его, чтобы страницы перечитали базу.
 * В Docker seed работает в отдельном контейнере: после него приложение пересоздаётся (README, «Деплой»).
 */
function dropDataCache() {
  for (const dir of ['.next/dev/cache/fetch-cache', '.next/cache/fetch-cache']) {
    fs.rmSync(path.resolve(process.cwd(), dir), { recursive: true, force: true })
  }
}

// `payload run` импортирует модуль и сразу завершает процесс, поэтому ждём через top-level await
try {
  const payload = await getPayload({ config })
  await runSeed(payload)
  dropDataCache()
  payload.logger.info('seed: кэш данных Next очищен — перезапустите dev-сервер, если он запущен')
} catch (error) {
  const details = (error as { data?: { errors?: unknown } })?.data?.errors
  if (details) console.error('validation errors:', JSON.stringify(details, null, 2))
  console.error(error)
  process.exit(1)
}
