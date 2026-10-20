import 'server-only'

export type InquiryType = 'contact' | 'custom' | 'question' | 'newsletter'

export type InquiryInput = {
  type: InquiryType
  locale: 'ru' | 'en' | 'sr'
  sourcePage: string
  name?: string
  email?: string
  phone?: string
  data: Record<string, unknown>
}

/** Сохранение заявки. Коллекция inquiries появляется на этапе 4 — до этого заявка пишется в лог. */
export async function saveInquiry(input: InquiryInput): Promise<{ number: string | null }> {
  console.info('[inquiry]', input.type, input.email ?? input.phone ?? '', input.sourcePage)
  return { number: null }
}
