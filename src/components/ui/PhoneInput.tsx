'use client'

import { AsYouType, getCountries, getCountryCallingCode, parsePhoneNumberFromString, type CountryCode } from 'libphonenumber-js/min'
import { useLocale, useTranslations } from 'next-intl'
import { useMemo, useState } from 'react'
import type { Locale } from '@/i18n/routing'
import { regionName } from '@/lib/format'
import { cn } from '@/lib/cn'
import { fieldClasses } from './Field'
import { useIsClient } from '@/components/motion/useIsClient'

const PRIORITY: CountryCode[] = ['RS', 'ME', 'BA', 'HR', 'MK', 'SI', 'RU', 'DE', 'AT', 'CH', 'GB']

type Props = {
  value?: string
  onChange?: (value: string) => void
  onBlur?: () => void
  defaultCountry?: CountryCode
  id?: string
  name?: string
  disabled?: boolean
  'aria-invalid'?: boolean
  'aria-describedby'?: string
  'aria-required'?: boolean
}

function optionLabel(code: CountryCode, name: string) {
  return `${flag(code)} ${name} +${getCountryCallingCode(code)}`
}

function flag(code: string) {
  return String.fromCodePoint(...[...code.toUpperCase()].map((c) => 0x1f1a5 + c.charCodeAt(0)))
}

/**
 * Телефон с выбором страны (по умолчанию RS). Значение — международный формат «+381 64 123 4567»,
 * проверка в zod-схеме через libphonenumber-js.
 */
export function PhoneInput({ value = '', onChange, onBlur, defaultCountry = 'RS', id, name, disabled, ...aria }: Props) {
  const t = useTranslations('forms')
  const locale = useLocale() as Locale
  const parsed = value ? parsePhoneNumberFromString(value) : undefined
  const [country, setCountry] = useState<CountryCode>(parsed?.country ?? defaultCountry)
  const code = `+${getCountryCallingCode(country)}`
  const national = value.startsWith(code) ? value.slice(code.length).trim() : value.replace(/^\+\d+\s?/, '')

  // Названия стран из ICU отличаются в Node и браузере: полный список строим только после гидрации
  const isClient = useIsClient()
  const countries = useMemo(() => {
    if (!isClient) return [{ code: country, name: country }]
    const rest = getCountries()
      .filter((c) => !PRIORITY.includes(c))
      .map((c) => ({ code: c, name: regionName(c, locale) }))
      .sort((a, b) => a.name.localeCompare(b.name, locale))
    return [...PRIORITY.map((c) => ({ code: c, name: regionName(c, locale) })), ...rest]
  }, [locale, isClient, country])

  function emit(nextCountry: CountryCode, nationalDigits: string) {
    const digits = nationalDigits.replace(/[^\d]/g, '')
    if (!digits) return onChange?.('')
    const formatter = new AsYouType(nextCountry)
    const formatted = formatter.input(`+${getCountryCallingCode(nextCountry)}${digits.replace(/^0/, '')}`)
    onChange?.(formatted)
  }

  return (
    <div className={cn('flex gap-2', disabled && 'opacity-60')}>
      <label className="relative shrink-0">
        <span className="sr-only">{t('phoneCountry')}</span>
        <select
          value={country}
          disabled={disabled}
          onChange={(e) => {
            const next = e.target.value as CountryCode
            setCountry(next)
            emit(next, national)
          }}
          className={cn(fieldClasses, '!w-[112px] cursor-pointer appearance-none pr-2 pl-3 text-transparent tabular-nums [&_option]:text-ink')}
          autoComplete="tel-country-code"
        >
          {countries.map((c) => (
            <option key={c.code} value={c.code}>
              {optionLabel(c.code, c.name)}
            </option>
          ))}
        </select>
        <span aria-hidden className="pointer-events-none absolute inset-y-0 left-3 flex items-center pr-1 text-ink tabular-nums">
          {[flag(country), code].join(' ')}
        </span>
      </label>
      <input
        id={id}
        name={name}
        type="tel"
        inputMode="tel"
        autoComplete="tel-national"
        disabled={disabled}
        className={cn(fieldClasses, 'min-w-0 flex-1 tabular-nums')}
        value={national}
        onChange={(e) => emit(country, e.target.value)}
        onBlur={onBlur}
        {...aria}
      />
    </div>
  )
}
