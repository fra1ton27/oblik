'use server'

import crypto from 'node:crypto'
import { cookies } from 'next/headers'
import { AuthenticationError } from 'payload'
import { getPayloadClient } from '@/lib/payload'
import { getSessionCustomer, type SessionCustomer } from '@/lib/auth'
import { getCatalogIndex } from '@/lib/data/catalog'
import { sendAuthEmail, sendDeletionRequestEmail } from '@/emails/send'
import { isLocale, type Locale } from '@/i18n/routing'
import type { ProductCard } from '@/lib/catalog'
import {
  addressSchema,
  emailChangeSchema,
  passwordChangeSchema,
  profileSchema,
  type AddressInput,
  type EmailChangeInput,
  type PasswordChangeInput,
  type ProfileInput,
} from '@/lib/schemas/auth'
import { fieldErrorsFrom, type ActionResult } from './result'

const EMAIL_CHANGE_TTL = 24 * 60 * 60 * 1000
const MAX_ADDRESSES = 10

const hash = (token: string) => crypto.createHash('sha256').update(token).digest('hex')

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

/** Карточки для страницы избранного (гостевого и в кабинете) в порядке добавления, только опубликованные */
export async function getWishlistCards(ids: Array<number | string>, locale: string): Promise<ProductCard[]> {
  const index = await getCatalogIndex(isLocale(locale) ? locale : 'ru')
  const byId = new Map(index.map((c) => [String(c.id), c]))
  return ids
    .slice(0, 200)
    .map((id) => byId.get(String(id)))
    .filter((c): c is ProductCard => Boolean(c))
    .reverse()
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

async function withCustomer<R>(fn: (customer: SessionCustomer) => Promise<R>): Promise<R | { ok: false; error: string }> {
  const customer = await getSessionCustomer()
  if (!customer) return { ok: false, error: 'unauthorized' }
  return fn(customer)
}

/** Проверка текущего пароля без побочных эффектов для сессии: неверный пароль считается попыткой входа */
async function checkPassword(email: string, password: string): Promise<'ok' | 'wrong' | 'locked'> {
  const payload = await getPayloadClient()
  try {
    await payload.login({ collection: 'customers', data: { email, password } })
    return 'ok'
  } catch (error) {
    return error instanceof AuthenticationError ? 'wrong' : 'locked'
  }
}

export async function updateProfile(input: ProfileInput): Promise<ActionResult> {
  return withCustomer(async (customer) => {
    const parsed = profileSchema.safeParse(input)
    if (!parsed.success) return { ok: false, fieldErrors: fieldErrorsFrom(parsed.error) }
    const payload = await getPayloadClient()
    await payload.update({
      collection: 'customers',
      id: customer.id,
      data: { name: parsed.data.name, phone: parsed.data.phone || null, locale: parsed.data.locale, newsletter: parsed.data.newsletter },
      overrideAccess: true,
    })
    return { ok: true }
  })
}

/**
 * Смена пароля. Payload при смене пароля закрывает все сессии покупателя (в том числе на других
 * устройствах), поэтому текущую сразу открываем заново новым паролем.
 */
export async function changePassword(input: PasswordChangeInput): Promise<ActionResult> {
  return withCustomer(async (customer) => {
    const parsed = passwordChangeSchema.safeParse(input)
    if (!parsed.success) return { ok: false, fieldErrors: fieldErrorsFrom(parsed.error) }
    const check = await checkPassword(customer.email, parsed.data.current)
    if (check === 'wrong') return { ok: false, fieldErrors: { current: 'wrongPassword' } }
    if (check === 'locked') return { ok: false, error: 'locked' }
    const payload = await getPayloadClient()
    await payload.update({ collection: 'customers', id: customer.id, data: { password: parsed.data.next }, overrideAccess: true })
    const res = await payload.login({ collection: 'customers', data: { email: customer.email, password: parsed.data.next } })
    if (res.token) {
      const store = await cookies()
      const name = `${payload.config.cookiePrefix}-token`
      const persistent = Boolean(store.get(name)) && res.exp ? { expires: new Date(res.exp * 1000) } : {}
      store.set(name, res.token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/', ...persistent })
    }
    return { ok: true }
  })
}

/** Смена email: письмо со ссылкой уходит на новый адрес, до подтверждения действует старый */
export async function requestEmailChange(input: EmailChangeInput): Promise<ActionResult<{ email: string }>> {
  return withCustomer(async (customer) => {
    const parsed = emailChangeSchema.safeParse(input)
    if (!parsed.success) return { ok: false, fieldErrors: fieldErrorsFrom(parsed.error) }
    const next = parsed.data.email.toLowerCase()
    if (next === customer.email.toLowerCase()) return { ok: false, fieldErrors: { email: 'sameEmail' } }
    const check = await checkPassword(customer.email, parsed.data.password)
    if (check === 'wrong') return { ok: false, fieldErrors: { password: 'wrongPassword' } }
    if (check === 'locked') return { ok: false, error: 'locked' }
    const payload = await getPayloadClient()
    const taken = await payload.find({ collection: 'customers', where: { email: { equals: next } }, limit: 1, depth: 0, overrideAccess: true })
    if (taken.docs.length) return { ok: false, fieldErrors: { email: 'emailTaken' } }
    const token = crypto.randomBytes(24).toString('hex')
    const doc = await payload.update({
      collection: 'customers',
      id: customer.id,
      data: { pendingEmail: next, pendingEmailToken: hash(token), pendingEmailExpiresAt: new Date(Date.now() + EMAIL_CHANGE_TTL).toISOString() },
      overrideAccess: true,
    })
    try {
      await sendAuthEmail(payload, 'emailChange', next, doc.locale, { token, name: doc.name })
    } catch (error) {
      payload.logger.error({ err: error, msg: 'письмо о смене email не ушло' })
      return { ok: false, error: 'generic' }
    }
    return { ok: true, data: { email: next } }
  })
}

/** Ссылка из письма: /account/profile?confirmEmail=… (страница вызывает это при рендере) */
export async function confirmEmailChange(token: string): Promise<'ok' | 'invalid' | 'taken'> {
  const customer = await getSessionCustomer()
  if (!customer || !token || token.length > 200) return 'invalid'
  const payload = await getPayloadClient()
  const doc = await payload.findByID({ collection: 'customers', id: customer.id, depth: 0, overrideAccess: true, showHiddenFields: true })
  const expires = doc.pendingEmailExpiresAt ? new Date(doc.pendingEmailExpiresAt).getTime() : 0
  const stored = doc.pendingEmailToken ?? ''
  const given = hash(token)
  const same = stored.length === given.length && crypto.timingSafeEqual(Buffer.from(stored), Buffer.from(given))
  if (!doc.pendingEmail || !same || expires < Date.now()) return 'invalid'
  const taken = await payload.find({ collection: 'customers', where: { email: { equals: doc.pendingEmail } }, limit: 1, depth: 0, overrideAccess: true })
  if (taken.docs.some((d) => d.id !== doc.id)) return 'taken'
  await payload.update({
    collection: 'customers',
    id: doc.id,
    data: { email: doc.pendingEmail, pendingEmail: null, pendingEmailToken: null, pendingEmailExpiresAt: null },
    overrideAccess: true,
  })
  return 'ok'
}

export async function cancelEmailChange(): Promise<ActionResult> {
  return withCustomer(async (customer) => {
    const payload = await getPayloadClient()
    await payload.update({ collection: 'customers', id: customer.id, data: { pendingEmail: null, pendingEmailToken: null, pendingEmailExpiresAt: null }, overrideAccess: true })
    return { ok: true }
  })
}

/**
 * Запрос на удаление аккаунта и данных: фиксируем дату и пишем менеджерам.
 * TODO(spec): срок и порядок удаления (заказы хранятся по закону о бухучёте) — уточнить у заказчика.
 */
export async function requestDeletion(): Promise<ActionResult<{ at: string }>> {
  return withCustomer(async (customer) => {
    const payload = await getPayloadClient()
    const at = new Date().toISOString()
    await payload.update({ collection: 'customers', id: customer.id, data: { deletionRequestedAt: at }, overrideAccess: true })
    try {
      await sendDeletionRequestEmail(payload, customer)
    } catch (error) {
      payload.logger.error({ err: error, msg: 'письмо о запросе удаления не ушло' })
    }
    return { ok: true, data: { at } }
  })
}

export type AddressDTO = {
  id: string
  label: string | null
  city: string
  postalCode: string | null
  street: string
  apartment: string | null
  floor: number | null
  elevator: boolean
  isDefault: boolean
}

type StoredAddress = NonNullable<Awaited<ReturnType<typeof loadAddresses>>>[number]

async function loadAddresses(customerId: number | string) {
  const payload = await getPayloadClient()
  const doc = await payload.findByID({ collection: 'customers', id: customerId, depth: 0, overrideAccess: true })
  return doc.addresses ?? []
}

function toAddressDTO(a: StoredAddress): AddressDTO {
  return {
    id: a.id ?? '',
    label: a.label ?? null,
    city: a.city,
    postalCode: a.postalCode ?? null,
    street: a.street,
    apartment: a.apartment ?? null,
    floor: a.floor ?? null,
    elevator: Boolean(a.elevator),
    isDefault: Boolean(a.isDefault),
  }
}

/** Ровно один адрес по умолчанию: первый, если покупатель не выбрал сам */
function normalizeDefault(list: StoredAddress[], preferId?: string): StoredAddress[] {
  if (!list.length) return list
  const target = preferId ?? list.find((a) => a.isDefault)?.id ?? list[0].id
  return list.map((a) => ({ ...a, isDefault: a.id === target }))
}

async function storeAddresses(customerId: number | string, list: StoredAddress[]): Promise<AddressDTO[]> {
  const payload = await getPayloadClient()
  const doc = await payload.update({ collection: 'customers', id: customerId, data: { addresses: list }, overrideAccess: true })
  return (doc.addresses ?? []).map(toAddressDTO)
}

export async function getAddresses(): Promise<AddressDTO[]> {
  const customer = await getSessionCustomer()
  if (!customer) return []
  return (await loadAddresses(customer.id)).map(toAddressDTO)
}

/** Добавить (id = null) или изменить адрес */
export async function saveAddress(id: string | null, input: AddressInput): Promise<ActionResult<AddressDTO[]>> {
  return withCustomer(async (customer) => {
    const parsed = addressSchema.safeParse(input)
    if (!parsed.success) return { ok: false, fieldErrors: fieldErrorsFrom(parsed.error) }
    const d = parsed.data
    const row = {
      label: d.label || null,
      city: d.city,
      postalCode: d.postalCode || null,
      street: d.street,
      apartment: d.apartment || null,
      floor: d.floor === '' ? null : Number(d.floor),
      elevator: d.elevator,
      isDefault: d.isDefault,
    }
    const list = await loadAddresses(customer.id)
    let next: StoredAddress[]
    let preferId: string | undefined
    if (id) {
      if (!list.some((a) => a.id === id)) return { ok: false, error: 'generic' }
      next = list.map((a) => (a.id === id ? { ...a, ...row } : a))
      if (d.isDefault) preferId = id
    } else {
      if (list.length >= MAX_ADDRESSES) return { ok: false, error: 'tooMany' }
      const newId = crypto.randomUUID().replace(/-/g, '').slice(0, 24)
      next = [...list, { id: newId, ...row }]
      if (d.isDefault || !list.length) preferId = newId
    }
    return { ok: true, data: await storeAddresses(customer.id, normalizeDefault(next, preferId)) }
  })
}

export async function deleteAddress(id: string): Promise<ActionResult<AddressDTO[]>> {
  return withCustomer(async (customer) => {
    const list = (await loadAddresses(customer.id)).filter((a) => a.id !== id)
    return { ok: true, data: await storeAddresses(customer.id, normalizeDefault(list)) }
  })
}

export async function setDefaultAddress(id: string): Promise<ActionResult<AddressDTO[]>> {
  return withCustomer(async (customer) => {
    const list = await loadAddresses(customer.id)
    if (!list.some((a) => a.id === id)) return { ok: false, error: 'generic' }
    return { ok: true, data: await storeAddresses(customer.id, normalizeDefault(list, id)) }
  })
}

export type RepeatLine = {
  productId: number
  variantSku: string | null
  qty: number
  snapshot: { title: string; variantLabel: string | null; price: number; image: string | null; slug: string; collectionTitle: string | null; leadTime: null; inStock: boolean }
}

/**
 * «Повторить заказ»: позиции снова в корзину по текущим ценам (их пересчитает сервер в корзине).
 * Снятые с продажи товары пропускаются, клиент сообщает об этом тостом.
 */
export async function repeatOrder(number: string, locale: string): Promise<ActionResult<{ lines: RepeatLine[]; skipped: number }>> {
  return withCustomer(async (customer) => {
    const payload = await getPayloadClient()
    const res = await payload.find({
      collection: 'orders',
      where: { and: [{ number: { equals: number } }, { customer: { equals: customer.id } }] },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    })
    const order = res.docs[0]
    if (!order) return { ok: false, error: 'generic' }
    const loc: Locale = isLocale(locale) ? locale : 'ru'
    const index = new Map((await getCatalogIndex(loc)).map((c) => [c.id, c]))
    const lines: RepeatLine[] = []
    let skipped = 0
    for (const item of order.items ?? []) {
      const productId = typeof item.product === 'object' ? item.product?.id : item.product
      const card = productId ? index.get(Number(productId)) : undefined
      if (!card) {
        skipped++
        continue
      }
      lines.push({
        productId: card.id,
        variantSku: item.variantSku ?? null,
        qty: item.qty,
        snapshot: {
          title: card.title,
          variantLabel: item.variantLabel ?? null,
          price: item.unitPrice,
          image: card.images[0]?.src ?? item.image ?? null,
          slug: card.slug,
          collectionTitle: card.collection?.title ?? null,
          leadTime: null,
          inStock: card.availability === 'in_stock',
        },
      })
    }
    return { ok: true, data: { lines, skipped } }
  })
}
