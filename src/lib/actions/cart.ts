'use server'

import { z } from 'zod'
import { isLocale } from '@/i18n/routing'
import { quoteCart, type DeliveryOptions, type Quote } from '@/lib/cart/quote'
import { cartLineSchema, type CartLineInput } from '@/lib/schemas/checkout'
import { getSessionCustomer } from '@/lib/auth'
import { getPayloadClient } from '@/lib/payload'

const linesSchema = z.array(cartLineSchema).max(100)

/** Пересчёт корзины для страницы корзины и оформления (цены и наличие — из БД) */
export async function quoteCartAction(lines: CartLineInput[], locale: string, promoCode?: string, delivery?: DeliveryOptions): Promise<Quote> {
  const parsed = linesSchema.safeParse(lines)
  return quoteCart({ lines: parsed.success ? parsed.data : [], locale: isLocale(locale) ? locale : 'ru', promoCode, delivery })
}

type StoredLine = { key: string; productId: number | string; variantSku: string | null; qty: number; snapshot: Record<string, unknown>; addedAt?: number }

/** У вошедшего корзина дублируется в коллекцию carts */
export async function saveCart(lines: StoredLine[]): Promise<{ ok: boolean }> {
  const customer = await getSessionCustomer()
  if (!customer) return { ok: false }
  const payload = await getPayloadClient()
  const items = lines.slice(0, 100)
  const found = await payload.find({ collection: 'carts', where: { customer: { equals: customer.id } }, limit: 1, overrideAccess: true })
  if (found.docs[0]) await payload.update({ collection: 'carts', id: found.docs[0].id, data: { items }, overrideAccess: true })
  else await payload.create({ collection: 'carts', data: { customer: Number(customer.id), items }, overrideAccess: true })
  return { ok: true }
}

/**
 * При входе гостевая и серверная корзины сливаются: количества одинаковых позиций складываются.
 * Возвращает итоговый список, который клиент кладёт в localStorage.
 */
export async function mergeCart(guest: StoredLine[]): Promise<StoredLine[]> {
  const customer = await getSessionCustomer()
  if (!customer) return guest
  const payload = await getPayloadClient()
  const found = await payload.find({ collection: 'carts', where: { customer: { equals: customer.id } }, limit: 1, overrideAccess: true })
  const server = (Array.isArray(found.docs[0]?.items) ? found.docs[0]?.items : []) as StoredLine[]
  const map = new Map<string, StoredLine>()
  for (const l of server) map.set(l.key, { ...l })
  for (const l of guest) {
    const ex = map.get(l.key)
    map.set(l.key, ex ? { ...ex, qty: Math.min(99, ex.qty + l.qty), snapshot: l.snapshot } : { ...l })
  }
  const merged = [...map.values()]
  await saveCart(merged)
  return merged
}
