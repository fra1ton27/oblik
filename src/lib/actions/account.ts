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

/** При входе гостевое избранное переносится в кабинет: объединение без дублей */
export async function mergeFavorites(guestIds: number[]): Promise<number[] | null> {
  const customer = await getSessionCustomer()
  if (!customer) return null
  const payload = await getPayloadClient()
  const doc = await payload.findByID({ collection: 'customers', id: customer.id, depth: 0, overrideAccess: true })
  const current = (doc.favorites ?? []).map((f) => (typeof f === 'object' ? f.id : f))
  const merged = [...new Set([...current, ...guestIds.filter(Number.isFinite)])]
  if (merged.length !== current.length) await payload.update({ collection: 'customers', id: customer.id, data: { favorites: merged }, overrideAccess: true })
  return merged
}

export type CheckoutProfile = {
  name: string
  email: string
  phone: string
  addresses: Array<{ label?: string | null; city: string; street: string; apartment?: string | null; postalCode?: string | null; floor?: number | null; elevator?: boolean | null; isDefault?: boolean | null }>
} | null

/** Данные вошедшего покупателя для подстановки в оформление */
export async function getCheckoutProfile(): Promise<CheckoutProfile> {
  const customer = await getSessionCustomer()
  if (!customer) return null
  const payload = await getPayloadClient()
  const doc = await payload.findByID({ collection: 'customers', id: customer.id, depth: 0, overrideAccess: true })
  return {
    name: doc.name ?? '',
    email: doc.email,
    phone: doc.phone ?? '',
    addresses: (doc.addresses ?? []).map((a) => ({ label: a.label, city: a.city, street: a.street, apartment: a.apartment, postalCode: a.postalCode, floor: a.floor, elevator: a.elevator, isDefault: a.isDefault })),
  }
}
