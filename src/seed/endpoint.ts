import type { Endpoint } from 'payload'
import { revalidate, tags } from '@/lib/revalidate'

/** Сколько seed работает за один запрос: функция Netlify обрывается на 60 с */
const BUDGET_MS = 35_000

/**
 * POST /api/demo-seed — демо-данные из админки там, где нет командной строки (Netlify, README).
 * Работает только при ALLOW_DEMO_SEED=1 и только для администратора. Каждый вызов создаёт недостающее
 * и останавливается по времени; кнопка на дашборде (src/admin/DemoSeed.tsx) повторяет вызовы до done.
 */
export const demoSeedEndpoint: Endpoint = {
  path: '/demo-seed',
  method: 'post',
  handler: async (req) => {
    if (process.env.ALLOW_DEMO_SEED !== '1') return Response.json({ error: 'disabled' }, { status: 404 })
    const user = req.user
    if (!user || user.collection !== 'users' || user.role !== 'admin') return Response.json({ error: 'forbidden' }, { status: 403 })

    const { runSeed } = await import('./seed')
    const result = await runSeed(req.payload, { createOnly: true, deadline: Date.now() + BUDGET_MS, skipAdmin: true, customerFromEnvOnly: true })
    // seed пишет с skipRevalidate, поэтому в конце сбрасываем все теги разом
    if (result.done) {
      revalidate(tags.products, tags.categories, tags.collections, tags.materials, tags.designers, tags.reviews, tags.pages)
      revalidate(...['header', 'footer', 'homepage', 'siteSettings'].map(tags.global))
    }
    return Response.json(result)
  },
}
