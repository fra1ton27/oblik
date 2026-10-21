'use server'

import crypto from 'node:crypto'
import type { PayloadRequest } from 'payload'
import { isLocale, type Locale } from '@/i18n/routing'
import { getPayloadClient } from '@/lib/payload'
import { getSessionCustomer } from '@/lib/auth'
import { getUtm } from '@/lib/utm'
import { checkoutSchema, cartLineSchema, type CartLineInput, type CheckoutInput } from '@/lib/schemas/checkout'
import { quoteCart, type Quote } from '@/lib/cart/quote'
import { adjustStock } from '@/lib/stock'
import { getPaymentProvider } from '@/lib/payments'
import { sendOrderPlacedEmails } from '@/emails/send'
import { z } from 'zod'
import { password as passwordRule } from '@/lib/schemas/auth'
import { fieldErrorsFrom } from './result'

export type PlaceOrderResult =
  | { ok: true; number: string; token: string }
  | { ok: false; fieldErrors?: Record<string, string>; error?: 'cartEmpty' | 'generic'; priceChanged?: Quote }

/**
 * Оформление заказа (раздел 8.4): валидация той же zod-схемой, пересчёт цен/скидок/доставки/наличия,
 * при изменении итога — заказ не создаётся и покупатель подтверждает новую сумму.
 * Заказ создаётся в транзакции вместе со списанием остатков; повторный клик не создаёт дубль.
 */
export async function placeOrder(input: CheckoutInput, rawLines: CartLineInput[], meta: { locale: string; expectedTotal: number }): Promise<PlaceOrderResult> {
  const parsed = checkoutSchema.safeParse(input)
  if (!parsed.success) return { ok: false, fieldErrors: fieldErrorsFrom(parsed.error) }
  const lines = z.array(cartLineSchema).max(100).safeParse(rawLines)
  if (!lines.success || !lines.data.length) return { ok: false, error: 'cartEmpty' }
  const data = parsed.data
  const locale: Locale = isLocale(meta.locale) ? meta.locale : 'ru'
  const payload = await getPayloadClient()

  // Повторная отправка той же формы: возвращаем уже созданный заказ
  const existing = await payload.find({ collection: 'orders', where: { idempotencyKey: { equals: data.idempotencyKey } }, limit: 1, depth: 0, overrideAccess: true })
  if (existing.docs[0]) return { ok: true, number: existing.docs[0].number ?? '', token: existing.docs[0].accessToken ?? '' }

  const floor = data.delivery.floor ? Number(data.delivery.floor) : null
  const quote = await quoteCart({
    lines: lines.data,
    locale,
    promoCode: data.promoCode,
    delivery: { method: data.delivery.method, lift: data.delivery.lift, assembly: data.delivery.assembly, floor, elevator: data.delivery.elevator },
  })
  const available = quote.lines.filter((l) => l.available)
  if (!available.length) return { ok: false, error: 'cartEmpty' }
  if (quote.totals.total !== meta.expectedTotal) return { ok: false, priceChanged: quote }

  const customer = await getSessionCustomer()
  const token = crypto.randomBytes(24).toString('hex')
  const transactionID = await payload.db.beginTransaction()
  const req = (transactionID ? { transactionID } : {}) as Partial<PayloadRequest>
  let order
  try {
    // Списываем остатки для позиций из наличия (отмена заказа вернёт их хуком)
    const items = []
    for (const l of available) {
      const reserved = l.inStock ? -(await adjustStock(payload, l.productId, l.variantSku, -l.qty, req)) : 0
      items.push({
        product: l.productId,
        title: l.title,
        variantSku: l.variantSku ?? undefined,
        variantLabel: l.variantLabel || undefined,
        qty: l.qty,
        unitPrice: l.unitPrice,
        lineTotal: l.lineTotal,
        reserved,
        image: l.image?.src,
        slug: l.slug ?? undefined,
        leadTime: l.inStock ? undefined : `${l.leadTime[0]}-${l.leadTime[1]}`,
      })
    }
    order = await payload.create({
      collection: 'orders',
      data: {
        status: 'new',
        paymentStatus: 'pending',
        paymentMethod: data.payment.method,
        customer: customer ? Number(customer.id) : undefined,
        contact: data.contacts,
        items,
        totals: {
          subtotal: quote.totals.subtotal,
          bundleDiscount: quote.totals.bundleDiscount,
          promoDiscount: quote.totals.promoDiscount,
          delivery: quote.totals.delivery,
          services: quote.totals.services,
          total: quote.totals.total,
          currency: quote.currency,
        },
        promoCode: quote.promo?.status === 'applied' ? quote.promo.code : undefined,
        delivery: {
          method: data.delivery.method,
          city: data.delivery.city || undefined,
          street: data.delivery.street || undefined,
          apartment: data.delivery.apartment || undefined,
          postalCode: data.delivery.postalCode || undefined,
          floor: floor ?? undefined,
          elevator: data.delivery.elevator,
          lift: data.delivery.lift,
          assembly: data.delivery.assembly,
          date: data.delivery.date || undefined,
        },
        comment: data.comment || undefined,
        newsletter: Boolean(data.newsletter),
        locale,
        utm: await getUtm(),
        accessToken: token,
        idempotencyKey: data.idempotencyKey,
      },
      overrideAccess: true,
      req,
    })
    if (transactionID) await payload.db.commitTransaction(transactionID)
  } catch (error) {
    if (transactionID) await payload.db.rollbackTransaction(transactionID)
    // гонка двойного клика: уникальный idempotencyKey уже занят
    const again = await payload.find({ collection: 'orders', where: { idempotencyKey: { equals: data.idempotencyKey } }, limit: 1, depth: 0, overrideAccess: true })
    if (again.docs[0]) return { ok: true, number: again.docs[0].number ?? '', token: again.docs[0].accessToken ?? '' }
    payload.logger.error({ err: error, msg: 'placeOrder: не удалось создать заказ' })
    return { ok: false, error: 'generic' }
  }

  await getPaymentProvider(data.payment.method).initiate({
    id: order.id,
    number: order.number ?? '',
    total: quote.totals.total,
    currency: quote.currency,
    locale,
    email: data.contacts.email,
  })

  if (quote.promo?.status === 'applied') {
    const promo = await payload.find({ collection: 'promoCodes', where: { code: { equals: quote.promo.code } }, limit: 1, overrideAccess: true })
    if (promo.docs[0]) await payload.update({ collection: 'promoCodes', id: promo.docs[0].id, data: { usedCount: (promo.docs[0].usedCount ?? 0) + 1 }, overrideAccess: true })
  }
  if (customer) {
    await payload.update({ collection: 'customers', id: customer.id, data: { ...(data.newsletter ? { newsletter: true } : {}) }, overrideAccess: true })
    const cart = await payload.find({ collection: 'carts', where: { customer: { equals: customer.id } }, limit: 1, overrideAccess: true })
    if (cart.docs[0]) await payload.update({ collection: 'carts', id: cart.docs[0].id, data: { items: [] }, overrideAccess: true })
  }

  // Письма: ошибка почты не отменяет заказ — она логируется
  try {
    await sendOrderPlacedEmails(payload, { ...order, number: order.number ?? '', status: 'new', contact: data.contacts })
  } catch (error) {
    payload.logger.error({ err: error, msg: `письма по заказу ${order.number} не отправлены` })
  }

  return { ok: true, number: order.number ?? '', token }
}

/**
 * «Создайте пароль, чтобы следить за заказом»: кабинет на email из заказа, заказ привязывается.
 * Вход станет доступен после подтверждения email (письмо уходит на языке заказа).
 * Если кабинет на этот email уже есть, заказ не привязываем без входа: просим войти.
 */
export async function createAccountFromOrder(number: string, token: string, password: string): Promise<{ ok: boolean; error?: string }> {
  const parsed = passwordRule.safeParse(password)
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? 'passwordShort' }
  const payload = await getPayloadClient()
  const res = await payload.find({ collection: 'orders', where: { number: { equals: number } }, limit: 1, depth: 0, overrideAccess: true })
  const order = res.docs[0]
  if (!order || !order.accessToken || order.accessToken !== token || order.customer) return { ok: false, error: 'generic' }
  const email = order.contact.email.toLowerCase()
  const existing = await payload.find({ collection: 'customers', where: { email: { equals: email } }, limit: 1, depth: 0, overrideAccess: true })
  if (existing.docs.length) return { ok: false, error: 'accountExists' }
  const created = await payload.create({
    collection: 'customers',
    data: { email, password: parsed.data, name: order.contact.name, phone: order.contact.phone, locale: (order.locale as 'ru' | 'en' | 'sr') ?? 'ru' },
    overrideAccess: true,
  })
  const customerId = created.id
  await payload.update({ collection: 'orders', id: order.id, data: { customer: customerId }, overrideAccess: true, context: { skipEmail: true } })
  return { ok: true }
}
