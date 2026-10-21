'use client'

import { RotateCcw } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useEffect, useRef } from 'react'
import { Link } from '@/i18n/navigation'
import { site } from '@/config/site'
import { StepReveal } from '@/components/motion/StepReveal'
import { Button, buttonClasses } from '@/components/ui/Button'
import { BlockDigit } from '@/components/shapes/BlockDigit'
import { Logo } from './Logo'
import { CreditLine } from './CreditLine'

type Props = {
  error: Error & { digest?: string }
  reset: () => void
  /** вне группы (site) нет шапки и подвала — рисуем логотип и подпись сами */
  standalone?: boolean
}

/**
 * 500 / ошибка (раздел 10.3 ТЗ): «500» из ступенчатых блоков, спокойный текст, «Попробовать снова»,
 * контакты. Технических деталей пользователю не показываем — только в консоль для отладки.
 */
export function ErrorView({ error, reset, standalone }: Props) {
  const t = useTranslations('errors')
  const tf = useTranslations('footer')
  const headingRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    console.error(error)
    headingRef.current?.focus()
  }, [error])

  const body = (
    <section className="container-site pt-10 pb-16 md:pt-16">
      <StepReveal immediate className="mx-auto grid w-full max-w-[880px] grid-cols-3 gap-[4vw] md:gap-10">
        <BlockDigit char="5" tone="var(--color-blush)" />
        <BlockDigit char="0" tone="var(--color-sand)" />
        <BlockDigit char="0" tone="var(--color-mist)" />
      </StepReveal>
      <h1 ref={headingRef} tabIndex={-1} className="t-h2 mx-auto mt-10 max-w-3xl text-center outline-none">
        {t('serverTitle')}
      </h1>
      <p className="t-lead mx-auto mt-4 max-w-xl text-center text-ink-soft">{t('serverText')}</p>
      <div className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row sm:justify-center">
        <Button onClick={reset} fullWidth className="sm:w-auto">
          <RotateCcw aria-hidden className="size-5" strokeWidth={1.5} />
          {t('retry')}
        </Button>
        <Link href="/" className={buttonClasses({ variant: 'secondary', fullWidth: true, className: 'sm:w-auto' })}>
          {t('toHome')}
        </Link>
      </div>
      <p className="t-small mx-auto mt-8 flex max-w-xl flex-wrap justify-center gap-x-3 gap-y-1 text-center font-normal text-ink-soft">
        <span>{t('serverContact')}</span>
        <a href={`tel:${site.contacts.phone.replace(/[^\d+]/g, '')}`} className="font-semibold text-ink underline-offset-4 hover:underline">
          {site.contacts.phone}
        </a>
        <a href={`mailto:${site.contacts.email}`} className="font-semibold text-ink underline-offset-4 hover:underline">
          {site.contacts.email}
        </a>
      </p>
    </section>
  )

  if (!standalone) return body
  return (
    <div className="flex min-h-svh flex-col">
      <header className="container-site flex h-[var(--header-h)] items-center">
        <Link href="/" aria-label={site.name}>
          <Logo name={site.name} />
        </Link>
      </header>
      <main id="main" className="flex-1">
        {body}
      </main>
      <footer className="container-site border-t border-line py-4">
        <CreditLine template={(handle) => tf('credit', { handle })} tone="light" />
      </footer>
    </div>
  )
}
