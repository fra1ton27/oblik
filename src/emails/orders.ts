import type { Locale } from '@/i18n/routing'
import { site } from '@/config/site'
import { formatMoney } from '@/lib/format'
import { localizedPath } from '@/lib/paths'
import { palette as c } from '@/styles/palette'
import { button, emailLayout, emailTranslator, escapeHtml, paragraph } from './layout'

export type EmailOrder = {
  id: number | string
  number: string
  status: string
  locale?: string | null
  accessToken?: string | null
  contact: { name: string; email: string; phone: string }
  items?: Array<{ title: string; variantLabel?: string | null; qty: number; lineTotal: number }> | null
  totals?: { total?: number | null; delivery?: number | null; currency?: string | null } | null
  delivery?: { method?: string | null; city?: string | null; street?: string | null } | null
}

function itemsTable(order: EmailOrder, locale: Locale) {
  const currency = order.totals?.currency ?? site.currency
  const rows = (order.items ?? [])
    .map(
      (i) => `<tr>
  <td style="padding:10px 0;border-bottom:1px solid ${c.line}">${escapeHtml(i.title)}${i.variantLabel ? `<br><span style="color:${c['ink-soft']};font-size:14px">${escapeHtml(i.variantLabel)}</span>` : ''}</td>
  <td style="padding:10px 8px;border-bottom:1px solid ${c.line};white-space:nowrap">× ${i.qty}</td>
  <td align="right" style="padding:10px 0;border-bottom:1px solid ${c.line};white-space:nowrap">${escapeHtml(formatMoney(i.lineTotal, locale, currency))}</td>
</tr>`,
    )
    .join('')
  const t = emailTranslator(locale)
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:15px;margin:8px 0 16px">${rows}
<tr><td colspan="2" style="padding:12px 0 0;font-weight:700">${escapeHtml(t('orderTotal'))}</td><td align="right" style="padding:12px 0 0;font-weight:700;white-space:nowrap">${escapeHtml(formatMoney(order.totals?.total ?? 0, locale, currency))}</td></tr></table>`
}

function orderLink(order: EmailOrder, locale: Locale) {
  return `${site.url}${localizedPath('/order-confirmed/[number]', { number: order.number }, locale)}?token=${encodeURIComponent(order.accessToken ?? '')}`
}

export function renderOrderPlaced(order: EmailOrder, locale: Locale) {
  const t = emailTranslator(locale)
  const subject = t('orderSubject', { number: order.number })
  const body = [
    paragraph(t('hello', { name: order.contact.name })),
    paragraph(t('orderIntro')),
    `<h2 style="font-size:16px;margin:24px 0 4px">${escapeHtml(t('orderItems'))}</h2>`,
    itemsTable(order, locale),
    paragraph(t('orderNext')),
    `<p style="margin:24px 0 0">${button(orderLink(order, locale), t('orderButton'))}</p>`,
  ].join('')
  return { subject, html: emailLayout({ locale, title: subject, body }) }
}

export function renderOrderStatus(order: EmailOrder, locale: Locale) {
  const t = emailTranslator(locale)
  const statusKey = (['new', 'confirmed', 'production', 'ready', 'delivered', 'cancelled'].includes(order.status) ? order.status : 'new') as
    | 'new'
    | 'confirmed'
    | 'production'
    | 'ready'
    | 'delivered'
    | 'cancelled'
  const status = t(`status.${statusKey}`)
  const subject = t('statusSubject', { number: order.number, status })
  const body = [
    paragraph(t('hello', { name: order.contact.name })),
    paragraph(t('statusText', { status })),
    `<p style="margin:24px 0 0">${button(orderLink(order, locale), t('orderButton'))}</p>`,
  ].join('')
  return { subject, html: emailLayout({ locale, title: subject, body }) }
}

const deliveryMethods: Record<string, string> = { city: 'по городу', country: 'по стране', pickup: 'самовывоз из шоурума' }

function deliveryLine(order: EmailOrder) {
  const d = order.delivery
  const method = (d?.method && deliveryMethods[d.method]) || '—'
  return [method, d?.city, d?.street].filter(Boolean).join(', ')
}

/** Менеджеру — всегда по-русски, со ссылкой на заказ в админке */
export function renderOrderManager(order: EmailOrder) {
  const subject = `Новый заказ ${order.number} — ${formatMoney(order.totals?.total ?? 0, 'ru', order.totals?.currency ?? site.currency)}`
  const body = [
    paragraph(`${order.contact.name}, ${order.contact.phone}, ${order.contact.email}`),
    paragraph(`Доставка: ${deliveryLine(order)}. Язык заказа: ${order.locale ?? 'ru'}.`),
    itemsTable(order, 'ru'),
    `<p style="margin:24px 0 0">${button(`${site.url}/admin/collections/orders/${order.id}`, 'Открыть в админке')}</p>`,
  ].join('')
  return { subject, html: emailLayout({ locale: 'ru', title: subject, body }) }
}

export type EmailInquiry = {
  id: number | string
  number: string
  type: string
  name?: string | null
  email?: string | null
  phone?: string | null
  locale?: string | null
  sourcePage?: string | null
  data?: unknown
}

export function renderInquiryCustomer(inquiry: EmailInquiry, locale: Locale, responseTime: string) {
  const t = emailTranslator(locale)
  const subject = t('inquirySubject', { number: inquiry.number })
  const body = [paragraph(inquiry.name ? t('hello', { name: inquiry.name }) : t('helloAnon')), paragraph(t('inquiryText', { responseTime }))].join('')
  return { subject, html: emailLayout({ locale, title: subject, body }) }
}

const inquiryTypeRu: Record<string, string> = {
  contact: 'Обратная связь',
  custom: 'Индивидуальный заказ',
  question: 'Вопрос по товару',
  newsletter: 'Подписка',
}

export function renderInquiryManager(inquiry: EmailInquiry) {
  const subject = `${inquiryTypeRu[inquiry.type] ?? inquiry.type}: заявка ${inquiry.number}`
  const data = inquiry.data && typeof inquiry.data === 'object' ? (inquiry.data as Record<string, unknown>) : {}
  const rows = Object.entries(data)
    .filter(([, v]) => v !== '' && v !== null && v !== undefined)
    .map(([k, v]) => `<tr><td style="padding:6px 12px 6px 0;color:${c['ink-soft']};vertical-align:top">${escapeHtml(k)}</td><td style="padding:6px 0">${escapeHtml(typeof v === 'object' ? JSON.stringify(v) : v)}</td></tr>`)
    .join('')
  const body = [
    paragraph(`${inquiry.name ?? '—'} · ${inquiry.phone ?? '—'} · ${inquiry.email ?? '—'} · ${inquiry.locale ?? 'ru'}`),
    paragraph(`Страница: ${inquiry.sourcePage ?? '—'}`),
    `<table role="presentation" cellpadding="0" cellspacing="0" style="font-size:14px">${rows}</table>`,
    `<p style="margin:24px 0 0">${button(`${site.url}/admin/collections/inquiries/${inquiry.id}`, 'Открыть в админке')}</p>`,
  ].join('')
  return { subject, html: emailLayout({ locale: 'ru', title: subject, body }) }
}
