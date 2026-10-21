import type { Locale } from '@/i18n/routing'
import { site } from '@/config/site'
import { localizedPath } from '@/lib/paths'
import { button, emailLayout, emailTranslator, paragraph } from './layout'

type Kind = 'verify' | 'reset' | 'emailChange'

/** Письма авторизации на языке покупателя: подтверждение email, сброс пароля, смена email */
export function renderAuthEmail(kind: Kind, locale: Locale, { token, name }: { token: string; name?: string | null }) {
  const t = emailTranslator(locale)
  const link = {
    verify: `${site.url}${localizedPath('/login', {}, locale)}?verify=${encodeURIComponent(token)}`,
    reset: `${site.url}${localizedPath('/reset-password', {}, locale)}?token=${encodeURIComponent(token)}`,
    emailChange: `${site.url}${localizedPath('/account/profile', {}, locale)}?confirmEmail=${encodeURIComponent(token)}`,
  }[kind]
  const copy = {
    verify: { subject: t('verifySubject', { brand: site.name }), text: t('verifyText'), cta: t('verifyButton') },
    reset: { subject: t('resetSubject', { brand: site.name }), text: t('resetText'), cta: t('resetButton') },
    emailChange: { subject: t('emailChangeSubject', { brand: site.name }), text: t('emailChangeText'), cta: t('emailChangeButton') },
  }[kind]
  const html = emailLayout({
    locale,
    title: copy.subject,
    body: [paragraph(name ? t('hello', { name }) : t('helloAnon')), paragraph(copy.text), `<p style="margin:24px 0">${button(link, copy.cta)}</p>`].join(''),
  })
  return { subject: copy.subject, html, link }
}

/** Менеджеру — по-русски: покупатель просит удалить аккаунт и данные */
export function renderDeletionManager(customer: { id: number | string; email: string; name?: string | null }) {
  const subject = `Запрос на удаление данных: ${customer.email}`
  const body = [
    paragraph(`${customer.name ?? '—'}, ${customer.email} просит удалить аккаунт и персональные данные.`),
    paragraph('Проверьте незакрытые заказы и ответьте покупателю в течение 30 дней.'),
    `<p style="margin:24px 0 0">${button(`${site.url}/admin/collections/customers/${customer.id}`, 'Открыть в админке')}</p>`,
  ].join('')
  return { subject, html: emailLayout({ locale: 'ru', title: subject, body }) }
}
