import { createTranslator } from 'next-intl'
import ru from '../../messages/ru.json'
import en from '../../messages/en.json'
import sr from '../../messages/sr.json'
import { palette as c } from '@/styles/palette'
import { site } from '@/config/site'
import type { Locale } from '@/i18n/routing'
import { htmlLang } from '@/i18n/routing'

const messages = { ru, en, sr }

export function emailTranslator(locale: Locale) {
  return createTranslator({ locale, messages: messages[locale], namespace: 'emails' })
}

export function escapeHtml(value: unknown): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export function button(href: string, label: string) {
  return `<a href="${escapeHtml(href)}" style="display:inline-block;background:${c.ink};color:${c.milk};text-decoration:none;font-weight:600;font-size:15px;padding:14px 26px;border-radius:999px">${escapeHtml(label)}</a>`
}

/**
 * Общий шаблон писем в стиле дизайн-системы: фон milk, карточка paper, акцент lavender.
 * Таблицы и инлайн-стили — для почтовых клиентов.
 */
export function emailLayout({ locale, title, preheader, body }: { locale: Locale; title: string; preheader?: string; body: string }) {
  const t = emailTranslator(locale)
  return `<!doctype html>
<html lang="${htmlLang[locale]}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(title)}</title></head>
<body style="margin:0;padding:0;background:${c.milk};color:${c.ink};font-family:Manrope,Arial,Helvetica,sans-serif">
<span style="display:none;max-height:0;overflow:hidden">${escapeHtml(preheader ?? title)}</span>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${c.milk};padding:32px 12px">
<tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px">
<tr><td style="padding:0 8px 20px">
  <span style="display:inline-block;width:14px;height:14px;border-radius:50%;background:${c['lavender-600']};vertical-align:middle"></span>
  <span style="font-family:Unbounded,Arial,sans-serif;font-size:20px;font-weight:600;letter-spacing:-0.02em;vertical-align:middle;margin-left:6px">${escapeHtml(site.name.toLowerCase())}</span>
</td></tr>
<tr><td style="background:${c.paper};border:1px solid ${c.line};border-radius:24px;padding:32px 28px;font-size:16px;line-height:1.6">
  <h1 style="margin:0 0 16px;font-family:Unbounded,Arial,sans-serif;font-weight:500;font-size:24px;line-height:1.2">${escapeHtml(title)}</h1>
  ${body}
  <p style="margin:28px 0 0;color:${c['ink-soft']}">${escapeHtml(t('signature', { brand: site.name }))}</p>
</td></tr>
<tr><td style="padding:20px 8px;font-size:13px;line-height:1.5;color:${c['ink-soft']}">${escapeHtml(t('footer'))}<br>${escapeHtml(site.contacts.phone)} · ${escapeHtml(site.url.replace(/^https?:\/\//, ''))}</td></tr>
</table></td></tr></table></body></html>`
}

export function paragraph(text: string) {
  return `<p style="margin:0 0 16px">${escapeHtml(text)}</p>`
}
