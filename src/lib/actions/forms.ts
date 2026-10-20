'use server'

import { getTranslations } from 'next-intl/server'
import { checkSpam } from '@/lib/antispam'
import { contactSchema, customSchema, questionSchema, type ContactInput, type QuestionInput } from '@/lib/schemas/forms'
import { saveInquiry } from '@/lib/inquiries'
import { getSessionCustomer } from '@/lib/auth'
import { getPayloadClient } from '@/lib/payload'
import { detectMime, MAX_FILE_SIZE, MAX_FILES, safeFileName } from '@/lib/files'
import { isLocale, type Locale } from '@/i18n/routing'
import { fieldErrorsFrom, type ActionResult } from './result'

type Meta = { locale: string; sourcePage: string; turnstileToken?: string }

function loc(value: string): Locale {
  return isLocale(value) ? value : 'ru'
}

/** Обратная связь: имя, телефон или email, тема, сообщение, согласие */
export async function submitContact(input: ContactInput, meta: Meta): Promise<ActionResult<{ number: string }>> {
  const parsed = contactSchema.safeParse(input)
  if (!parsed.success) return { ok: false, fieldErrors: fieldErrorsFrom(parsed.error) }
  const spam = await checkSpam({ ...parsed.data, turnstileToken: meta.turnstileToken }, 'contact')
  if (!spam.ok) return { ok: false, error: spam.reason === 'rateLimited' ? 'rateLimited' : 'spam' }
  const customer = await getSessionCustomer()
  const { website: _w, startedAt: _s, consent: _c, ...data } = parsed.data
  const res = await saveInquiry({
    type: 'contact',
    locale: loc(meta.locale),
    sourcePage: meta.sourcePage,
    name: data.name,
    email: data.email || undefined,
    phone: data.phone || undefined,
    customerId: customer?.id,
    data,
  })
  return { ok: true, data: { number: res.number } }
}

/** Вопрос по товару: товар и вариант подставляются скрыто */
export async function submitQuestion(input: QuestionInput, meta: Meta): Promise<ActionResult<{ number: string }>> {
  const parsed = questionSchema.safeParse(input)
  if (!parsed.success) return { ok: false, fieldErrors: fieldErrorsFrom(parsed.error) }
  const spam = await checkSpam({ ...parsed.data, turnstileToken: meta.turnstileToken }, 'question')
  if (!spam.ok) return { ok: false, error: spam.reason === 'rateLimited' ? 'rateLimited' : 'spam' }
  const customer = await getSessionCustomer()
  const { website: _w, startedAt: _s, consent: _c, ...data } = parsed.data
  const res = await saveInquiry({
    type: 'question',
    locale: loc(meta.locale),
    sourcePage: meta.sourcePage,
    name: data.name,
    email: data.email || undefined,
    phone: data.phone || undefined,
    productId: data.productId ? Number(data.productId) : null,
    customerId: customer?.id,
    data,
  })
  return { ok: true, data: { number: res.number } }
}

/**
 * Индивидуальный заказ: поля + до 5 файлов по 10 МБ (jpg/png/heic/pdf).
 * Файлы проверяются на сервере по сигнатуре и размеру и сохраняются в закрытую коллекцию files.
 */
export async function submitCustom(formData: FormData): Promise<ActionResult<{ number: string }>> {
  let raw: Record<string, unknown> = {}
  let meta: Meta = { locale: 'ru', sourcePage: '' }
  try {
    raw = JSON.parse(String(formData.get('data') ?? '{}'))
    meta = JSON.parse(String(formData.get('meta') ?? '{}'))
  } catch {
    return { ok: false, error: 'generic' }
  }
  const parsed = customSchema.safeParse(raw)
  if (!parsed.success) return { ok: false, fieldErrors: fieldErrorsFrom(parsed.error) }

  const files = formData.getAll('files').filter((f): f is File => typeof f === 'object' && 'arrayBuffer' in f && f.size > 0)
  if (files.length > MAX_FILES) return { ok: false, fieldErrors: { files: 'files' } }
  const buffers: Array<{ name: string; mime: string; data: Buffer }> = []
  for (const file of files) {
    if (file.size > MAX_FILE_SIZE) return { ok: false, fieldErrors: { files: 'files' } }
    const data = Buffer.from(await file.arrayBuffer())
    const mime = detectMime(data)
    if (!mime) return { ok: false, fieldErrors: { files: 'files' } }
    buffers.push({ name: safeFileName(file.name), mime, data })
  }

  const spam = await checkSpam({ ...parsed.data, turnstileToken: meta.turnstileToken }, 'custom')
  if (!spam.ok) return { ok: false, error: spam.reason === 'rateLimited' ? 'rateLimited' : 'spam' }

  const payload = await getPayloadClient()
  const fileIds: number[] = []
  for (const f of buffers) {
    const doc = await payload.create({
      collection: 'files',
      data: {},
      file: { data: f.data, mimetype: f.mime, name: f.name, size: f.data.length },
      overrideAccess: true,
    })
    fileIds.push(doc.id)
  }

  const t = await getTranslations({ locale: loc(meta.locale), namespace: 'forms' })
  const customer = await getSessionCustomer()
  const { website: _w, startedAt: _s, consent: _c, ...data } = parsed.data
  const res = await saveInquiry({
    type: 'custom',
    locale: loc(meta.locale),
    sourcePage: meta.sourcePage,
    name: data.name,
    email: data.email || undefined,
    phone: data.phone,
    productId: data.productId ? Number(data.productId) : null,
    customerId: customer?.id,
    fileIds,
    data: { ...data, furnitureTypeLabel: t(`furniture.${data.furnitureType}`), files: buffers.map((b) => b.name) },
  })
  return { ok: true, data: { number: res.number } }
}
