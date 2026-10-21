'use client'

import { Copy } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useEffect, useRef } from 'react'
import { StepsToCheck } from '@/components/motion/StepsToCheck'
import { toast } from '@/components/ui/Toast'

/**
 * Первый экран «Спасибо» (раздел 10.2 ТЗ): ступени собираются в галочку, display-заголовок,
 * текст под тип формы, номер заявки чипом с копированием. Фокус на заголовке для скринридера.
 */
export function ThankYouHero({ text, reference, children }: { text: string; reference: string | null; children?: React.ReactNode }) {
  const t = useTranslations('thanks')
  const tc = useTranslations('common')
  const headingRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    headingRef.current?.focus()
  }, [])

  async function copy() {
    if (!reference) return
    try {
      await navigator.clipboard.writeText(reference)
      toast({ message: tc('copied'), tone: 'success' })
    } catch {}
  }

  return (
    <section className="flex min-h-[calc(100svh-var(--header-h)-24px)] flex-col items-center justify-center rounded-section bg-lavender px-5 py-12 text-center md:min-h-[min(760px,calc(100svh-var(--header-h)-40px))]">
      <StepsToCheck />
      <h1 ref={headingRef} tabIndex={-1} className="t-display mt-6 text-[clamp(40px,9vw,128px)] outline-none">
        {t('title')}
      </h1>
      <p className="t-lead mt-4 max-w-[46ch] text-ink-soft">{text}</p>
      {reference && (
        <div className="mt-6 inline-flex items-center gap-1 rounded-pill bg-paper py-1 pr-1 pl-4">
          <span className="text-[14px] text-ink-soft">{t('reference')}</span>
          <span className="ml-1 font-semibold tracking-wide">{reference}</span>
          <button type="button" onClick={copy} className="ml-1 inline-flex size-11 items-center justify-center rounded-pill hover:bg-milk" aria-label={t('copyReference')}>
            <Copy aria-hidden className="size-4" strokeWidth={1.5} />
          </button>
        </div>
      )}
      {children && <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">{children}</div>}
    </section>
  )
}
