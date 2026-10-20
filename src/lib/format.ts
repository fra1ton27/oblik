import { intlLocale, type Locale } from '@/i18n/routing'
import { site } from '@/config/site'

/**
 * Все цены, числа, даты и размеры форматируются только здесь, через Intl.
 * Деньги хранятся в целых центах (минимальных единицах), не float.
 *   ru-RU: 1 290 €, 20 октября 2026
 *   en-GB: €1,290, 20 October 2026
 *   sr-Latn-RS: 1.290 €, 20. oktobar 2026.
 */

const moneyCache = new Map<string, Intl.NumberFormat>()

function moneyFormatter(locale: Locale, currency: string, fraction: boolean) {
  const key = `${locale}|${currency}|${fraction}`
  let f = moneyCache.get(key)
  if (!f) {
    f = new Intl.NumberFormat(intlLocale[locale], {
      style: 'currency',
      currency,
      currencyDisplay: currency === 'RSD' ? 'code' : 'symbol',
      minimumFractionDigits: fraction ? 2 : 0,
      maximumFractionDigits: fraction ? 2 : 0,
    })
    moneyCache.set(key, f)
  }
  return f
}

export function formatMoney(cents: number, locale: Locale, currency: string = site.currency): string {
  const fraction = Math.round(cents) % 100 !== 0
  return moneyFormatter(locale, currency, fraction).format(Math.round(cents) / 100)
}

/** Показ во второй валюте по курсу из админки (только для информации) */
export function formatConverted(cents: number, locale: Locale, rate: number, currency: string): string {
  const converted = Math.round((cents / 100) * rate)
  return moneyFormatter(locale, currency, false).format(converted)
}

export function formatNumber(value: number, locale: Locale, options?: Intl.NumberFormatOptions): string {
  return new Intl.NumberFormat(intlLocale[locale], options).format(value)
}

export function formatDate(
  value: string | number | Date,
  locale: Locale,
  style: 'long' | 'short' | 'dateTime' = 'long',
): string {
  const date = value instanceof Date ? value : new Date(value)
  const options: Intl.DateTimeFormatOptions =
    style === 'long'
      ? { day: 'numeric', month: 'long', year: 'numeric' }
      : style === 'short'
        ? { day: '2-digit', month: '2-digit', year: 'numeric' }
        : { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }
  let out = new Intl.DateTimeFormat(intlLocale[locale], { ...options, timeZone: 'Europe/Belgrade' }).format(date)
  // ru-RU добавляет «г.» после года: в ТЗ формат «20 октября 2026»
  if (locale === 'ru') out = out.replace(/\s?г\.(?=,|$)/, '')
  return out
}

const CM_PER_INCH = 2.54

/** Длина в см; в EN рядом показываем дюймы: 220 cm (86.6 in) */
export function formatLength(cm: number, locale: Locale): string {
  const unit = (u: 'centimeter' | 'inch', v: number, digits = 0) =>
    new Intl.NumberFormat(intlLocale[locale], {
      style: 'unit',
      unit: u,
      unitDisplay: 'short',
      maximumFractionDigits: digits,
    }).format(v)
  const base = unit('centimeter', cm)
  if (locale !== 'en') return base
  return `${base} (${unit('inch', cm / CM_PER_INCH, 1)})`
}

export function formatWeight(kg: number, locale: Locale): string {
  const base = new Intl.NumberFormat(intlLocale[locale], {
    style: 'unit',
    unit: 'kilogram',
    unitDisplay: 'short',
    maximumFractionDigits: 1,
  }).format(kg)
  if (locale !== 'en') return base
  const lb = new Intl.NumberFormat('en-GB', {
    style: 'unit',
    unit: 'pound',
    unitDisplay: 'short',
    maximumFractionDigits: 0,
  }).format(kg * 2.20462)
  return `${base} (${lb})`
}

/** Названия стран на языке интерфейса — без словарей, через Intl.DisplayNames */
export function regionName(code: string, locale: Locale): string {
  try {
    return new Intl.DisplayNames([intlLocale[locale]], { type: 'region' }).of(code) ?? code
  } catch {
    return code
  }
}

export function pad(value: number, length = 2): string {
  return String(value).padStart(length, '0')
}
