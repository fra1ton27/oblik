/**
 * Сборка на Netlify (netlify.toml): миграции Payload, затем next build.
 * Адрес сайта по умолчанию — основной адрес проекта на Netlify (URL), если NEXT_PUBLIC_SITE_URL не задан.
 */
import { execSync } from 'node:child_process'
import fs from 'node:fs'

const env = { ...process.env }
if (!env.NEXT_PUBLIC_SITE_URL && env.URL) env.NEXT_PUBLIC_SITE_URL = env.URL

const missing = ['DATABASE_URL', 'PAYLOAD_SECRET'].filter((name) => !env[name])
if (missing.length) {
  console.error(`[netlify] задайте ${missing.join(', ')} в Project configuration → Environment variables`)
  process.exit(1)
}

console.log(`[netlify] адрес сайта: ${env.NEXT_PUBLIC_SITE_URL}`)
const run = (command: string) => execSync(command, { stdio: 'inherit', env })
run('pnpm payload migrate')
// Netlify переносит .next/cache между сборками, а правки из админки идут в кэш работающего сайта,
// не сюда: без очистки новая сборка пререндерила бы страницы по данным прошлой сборки
fs.rmSync('.next/cache/fetch-cache', { recursive: true, force: true })
run('pnpm build')
