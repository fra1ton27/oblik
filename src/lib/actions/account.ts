'use server'

import { getPayloadClient } from '@/lib/payload'
import { getSessionCustomer } from '@/lib/auth'

/** Избранное вошедшего покупателя: добавить или убрать товар */
export async function toggleFavorite(productId: number, on: boolean): Promise<{ ok: boolean }> {
  const customer = await getSessionCustomer()
  if (!customer) return { ok: false }
  const payload = await getPayloadClient()
  const doc = await payload.findByID({ collection: 'customers', id: customer.id, depth: 0, overrideAccess: true })
  const current = (doc.favorites ?? []).map((f) => (typeof f === 'object' ? f.id : f))
  const next = on ? [...new Set([...current, productId])] : current.filter((id) => id !== productId)
  await payload.update({ collection: 'customers', id: customer.id, data: { favorites: next }, overrideAccess: true })
  return { ok: true }
}
