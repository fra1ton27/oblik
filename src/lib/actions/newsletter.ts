'use server'

import { checkSpam } from '@/lib/antispam'
import { newsletterSchema, type NewsletterInput } from '@/lib/schemas/forms'
import { fieldErrorsFrom, type ActionResult } from './result'
import { saveInquiry } from '@/lib/inquiries'
import { isLocale } from '@/i18n/routing'

/** Подписка из подвала. Сохраняется в inquiries (type: newsletter), успех показывается на месте. */
export async function subscribeNewsletter(input: NewsletterInput, locale: string, sourcePage: string): Promise<ActionResult> {
  const parsed = newsletterSchema.safeParse(input)
  if (!parsed.success) return { ok: false, fieldErrors: fieldErrorsFrom(parsed.error) }
  const spam = await checkSpam(parsed.data, 'newsletter')
  if (!spam.ok) return { ok: false, error: spam.reason === 'rateLimited' ? 'rateLimited' : 'spam' }
  await saveInquiry({
    type: 'newsletter',
    locale: isLocale(locale) ? locale : 'ru',
    sourcePage,
    email: parsed.data.email,
    data: { email: parsed.data.email },
  })
  return { ok: true }
}
