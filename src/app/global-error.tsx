'use client'

import '@/styles/globals.css'
import { RotateCcw } from 'lucide-react'
import { useEffect, useSyncExternalStore } from 'react'
import { fallbackTexts } from '@/i18n/fallback'
import { htmlLang, isLocale, routing, type Locale } from '@/i18n/routing'
import { site } from '@/config/site'
import { BlockDigit } from '@/components/shapes/BlockDigit'
import { CreditLine } from '@/components/layout/CreditLine'
import { buttonClasses } from '@/components/ui/Button'
import { fontVariables } from './(frontend)/fonts'

const noop = () => () => {}
function localeFromPath(): Locale {
  const first = window.location.pathname.split('/')[1]
  return isLocale(first) ? first : routing.defaultLocale
}

/**
 * Ошибка в корневом layout: заменяет его целиком, поэтому рисуем свои html/body.
 * Язык берём из первого сегмента адреса, тексты — из fallbackTexts (копия словарей под тестом).
 */
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const locale = useSyncExternalStore(noop, localeFromPath, () => routing.defaultLocale)

  useEffect(() => {
    console.error(error)
  }, [error])

  const t = fallbackTexts[locale]
  return (
    <html lang={htmlLang[locale]} className={fontVariables}>
      <body className="flex min-h-svh flex-col bg-milk text-ink">
        <main id="main" className="container-site flex flex-1 flex-col items-center justify-center py-16 text-center">
          <div className="grid w-full max-w-[560px] grid-cols-3 gap-[4vw] md:gap-8" aria-hidden>
            <BlockDigit char="5" tone="var(--color-blush)" />
            <BlockDigit char="0" tone="var(--color-sand)" />
            <BlockDigit char="0" tone="var(--color-mist)" />
          </div>
          <h1 className="t-h2 mt-10 max-w-3xl">{t.serverTitle}</h1>
          <p className="t-lead mt-4 max-w-xl text-ink-soft">{t.serverText}</p>
          <div className="mt-8 flex w-full max-w-md flex-col gap-3 sm:w-auto sm:flex-row">
            <button type="button" onClick={reset} className={buttonClasses({ fullWidth: true, className: 'sm:w-auto' })}>
              <RotateCcw aria-hidden className="size-5" strokeWidth={1.5} />
              {t.retry}
            </button>
            <a href={`/${locale}`} className={buttonClasses({ variant: 'secondary', fullWidth: true, className: 'sm:w-auto' })}>
              {t.toHome}
            </a>
          </div>
        </main>
        <footer className="container-site border-t border-line py-4">
          <CreditLine template={(handle) => t.credit.replace('{handle}', handle)} tone="light" />
          <span className="sr-only">{site.name}</span>
        </footer>
      </body>
    </html>
  )
}
