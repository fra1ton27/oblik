/**
 * pnpm seed — наполняет базу демо-данными. Идемпотентен: повторный запуск не создаёт дублей.
 */
import { getPayload } from 'payload'
import config from '@payload-config'

async function seed() {
  const payload = await getPayload({ config })
  const email = process.env.SEED_ADMIN_EMAIL
  const password = process.env.SEED_ADMIN_PASSWORD
  if (!email || !password) throw new Error('SEED_ADMIN_EMAIL и SEED_ADMIN_PASSWORD должны быть заданы в .env')

  const existing = await payload.find({ collection: 'users', where: { email: { equals: email } }, limit: 1 })
  if (existing.docs.length === 0) {
    await payload.create({ collection: 'users', data: { email, password, name: 'Admin', role: 'admin' } })
    payload.logger.info(`seed: создан админ ${email}`)
  } else {
    payload.logger.info(`seed: админ ${email} уже есть`)
  }
}

// `payload run` импортирует модуль и сразу завершает процесс, поэтому ждём через top-level await
try {
  await seed()
} catch (error) {
  console.error(error)
  process.exit(1)
}
