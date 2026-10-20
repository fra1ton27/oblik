import 'server-only'
import { getPayload } from 'payload'
import config from '@payload-config'
import { sendInquiryEmails } from '@/emails/send'
import { getUtm } from './utm'

export type InquiryType = 'contact' | 'custom' | 'question' | 'newsletter'

export type InquiryInput = {
  type: InquiryType
  locale: 'ru' | 'en' | 'sr'
  sourcePage: string
  name?: string
  email?: string
  phone?: string
  productId?: number | string | null
  customerId?: number | string | null
  fileIds?: Array<number | string>
  data: Record<string, unknown>
}

/**
 * Сохранение заявки в inquiries (номер Z-2026-00042 из последовательности) и письма:
 * клиенту на его языке, менеджеру по-русски. Ошибка почты не теряет заявку.
 */
export async function saveInquiry(input: InquiryInput): Promise<{ id: number | string; number: string }> {
  const payload = await getPayload({ config })
  const doc = await payload.create({
    collection: 'inquiries',
    data: {
      type: input.type,
      status: 'new',
      name: input.name,
      email: input.email || undefined,
      phone: input.phone || undefined,
      locale: input.locale,
      sourcePage: input.sourcePage.slice(0, 500),
      utm: await getUtm(),
      data: input.data,
      product: input.productId ? Number(input.productId) : undefined,
      customer: input.customerId ? Number(input.customerId) : undefined,
      files: input.fileIds?.map(Number),
    },
    overrideAccess: true,
  })
  try {
    await sendInquiryEmails(payload, { ...doc, number: doc.number ?? '' })
  } catch (error) {
    payload.logger.error({ err: error, msg: `письма по заявке ${doc.number} не отправлены` })
  }
  return { id: doc.id, number: doc.number ?? '' }
}
