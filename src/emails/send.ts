import type { Payload } from 'payload'
import { isLocale, type Locale } from '@/i18n/routing'
import { renderInquiryCustomer, renderInquiryManager, renderOrderManager, renderOrderPlaced, renderOrderStatus, type EmailInquiry, type EmailOrder } from './orders'

async function managerEmails(payload: Payload): Promise<string[]> {
  try {
    const settings = await payload.findGlobal({ slug: 'siteSettings', depth: 0, overrideAccess: true })
    const list = (settings.managerEmails ?? []).map((m) => m.email).filter(Boolean) as string[]
    if (list.length) return list
  } catch {}
  return process.env.MANAGER_EMAIL ? [process.env.MANAGER_EMAIL] : []
}

async function responseTime(payload: Payload, locale: Locale): Promise<string> {
  try {
    const settings = await payload.findGlobal({ slug: 'siteSettings', locale, depth: 0, overrideAccess: true })
    if (settings.responseTime) return settings.responseTime
  } catch {}
  return ''
}

function localeOf(value: unknown): Locale {
  return isLocale(value) ? value : 'ru'
}

/**
 * Письма о заказе: покупателю на языке заказа, менеджеру по-русски.
 * Ошибка почты не отменяет заказ — она логируется.
 */
export async function sendOrderPlacedEmails(payload: Payload, order: EmailOrder) {
  const locale = localeOf(order.locale)
  const jobs: Array<Promise<unknown>> = []
  const customer = renderOrderPlaced(order, locale)
  jobs.push(payload.sendEmail({ to: order.contact.email, subject: customer.subject, html: customer.html }))
  const managers = await managerEmails(payload)
  if (managers.length) {
    const m = renderOrderManager(order)
    jobs.push(payload.sendEmail({ to: managers, subject: m.subject, html: m.html }))
  }
  const results = await Promise.allSettled(jobs)
  for (const r of results) if (r.status === 'rejected') payload.logger.error({ err: r.reason, msg: `письмо по заказу ${order.number} не ушло` })
}

export async function sendOrderStatusEmail(payload: Payload, order: EmailOrder) {
  if (!order.contact?.email) return
  const { subject, html } = renderOrderStatus(order, localeOf(order.locale))
  await payload.sendEmail({ to: order.contact.email, subject, html })
}

export async function sendInquiryEmails(payload: Payload, inquiry: EmailInquiry) {
  const locale = localeOf(inquiry.locale)
  const jobs: Array<Promise<unknown>> = []
  if (inquiry.email && inquiry.type !== 'newsletter') {
    const c = renderInquiryCustomer(inquiry, locale, await responseTime(payload, locale))
    jobs.push(payload.sendEmail({ to: inquiry.email, subject: c.subject, html: c.html }))
  }
  const managers = await managerEmails(payload)
  if (managers.length) {
    const m = renderInquiryManager(inquiry)
    jobs.push(payload.sendEmail({ to: managers, subject: m.subject, html: m.html }))
  }
  const results = await Promise.allSettled(jobs)
  for (const r of results) if (r.status === 'rejected') payload.logger.error({ err: r.reason, msg: `письмо по заявке ${inquiry.number} не ушло` })
}
