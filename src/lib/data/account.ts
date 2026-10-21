import 'server-only'
import { headers } from 'next/headers'
import { redirect } from '@/i18n/navigation'
import type { Locale } from '@/i18n/routing'
import { PATH_HEADER } from '@/config/headers'
import { getSessionCustomer, type SessionCustomer } from '@/lib/auth'
import { getPayloadClient } from '@/lib/payload'
import { safeReturnTo } from '@/lib/paths'
import { findOwnedOrder } from '@/lib/ownership'
import type { Customer, File as InquiryFile, Inquiry, Order } from '@/payload-types'

/**
 * Проверка сессии кабинета на сервере (раздел 9.3 ТЗ): без входа — на страницу входа
 * с returnTo на текущий адрес. Путь приходит из proxy.ts заголовком PATH_HEADER.
 */
export async function requireCustomer(locale: Locale): Promise<SessionCustomer> {
  const customer = await getSessionCustomer()
  if (customer) return customer
  const path = (await headers()).get(PATH_HEADER)
  return redirect({ href: { pathname: '/login', query: { returnTo: safeReturnTo(path, locale) } }, locale })
}

export async function getCustomerDoc(id: number | string): Promise<Customer> {
  const payload = await getPayloadClient()
  return payload.findByID({ collection: 'customers', id, depth: 0, overrideAccess: true })
}

export async function getCustomerOrders(customerId: number | string, limit = 50): Promise<Order[]> {
  const payload = await getPayloadClient()
  const res = await payload.find({ collection: 'orders', where: { customer: { equals: customerId } }, sort: '-createdAt', limit, depth: 0, overrideAccess: true })
  return res.docs
}

export async function getCustomerOrder(customerId: number | string, number: string) {
  return findOwnedOrder(await getPayloadClient(), customerId, number)
}

export type InquiryDTO = {
  id: number
  number: string
  type: Inquiry['type']
  status: NonNullable<Inquiry['status']>
  createdAt: string
  summary: string | null
  files: Array<{ name: string; size: number | null; url: string | null }>
}

/** Заявки покупателя (индивидуальный заказ, вопросы, обратная связь) с прикреплёнными файлами */
export async function getCustomerInquiries(customerId: number | string): Promise<InquiryDTO[]> {
  const payload = await getPayloadClient()
  const res = await payload.find({
    collection: 'inquiries',
    where: { and: [{ customer: { equals: customerId } }, { type: { not_equals: 'newsletter' } }] },
    sort: '-createdAt',
    limit: 100,
    depth: 1,
    overrideAccess: true,
  })
  return res.docs.map((d) => {
    const data = (d.data ?? {}) as Record<string, unknown>
    const summary = [data.furnitureTypeLabel, data.subject, data.message, data.question].find((v) => typeof v === 'string' && v.trim()) as string | undefined
    return {
      id: d.id,
      number: d.number ?? '',
      type: d.type,
      status: d.status ?? 'new',
      createdAt: d.createdAt,
      summary: summary ? summary.slice(0, 140) : null,
      files: (d.files ?? [])
        .filter((f): f is InquiryFile => typeof f === 'object' && f !== null)
        .map((f) => ({ name: f.filename ?? '', size: f.filesize ?? null, url: f.url ?? null })),
    }
  })
}
