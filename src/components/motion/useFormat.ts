'use client'

import { useLocale } from 'next-intl'
import { useMemo } from 'react'
import type { Locale } from '@/i18n/routing'
import { formatDate, formatLength, formatMoney, formatNumber, formatWeight } from '@/lib/format'

/** Клиентская обёртка над @/lib/format с текущей локалью */
export function useFormat() {
  const locale = useLocale() as Locale
  return useMemo(
    () => ({
      locale,
      money: (cents: number, currency?: string) => formatMoney(cents, locale, currency),
      number: (value: number, options?: Intl.NumberFormatOptions) => formatNumber(value, locale, options),
      date: (value: string | number | Date, style?: 'long' | 'short' | 'dateTime') => formatDate(value, locale, style),
      length: (cm: number) => formatLength(cm, locale),
      weight: (kg: number) => formatWeight(kg, locale),
    }),
    [locale],
  )
}
