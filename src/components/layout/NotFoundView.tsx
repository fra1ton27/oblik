import { getTranslations } from 'next-intl/server'
import { TransitionLink } from '@/components/motion/TransitionLink'
import { StepReveal } from '@/components/motion/StepReveal'
import { buttonClasses } from '@/components/ui/Button'
import { ShelfGame } from './ShelfGame'

// Цифры из «ступенчатых» блоков на сетке 3 × 5
const DIGITS: Record<string, string[]> = {
  '4': ['1.1', '1.1', '111', '..1', '..1'],
  '0': ['111', '1.1', '1.1', '1.1', '111'],
}

function BlockDigit({ char, tone }: { char: string; tone: string }) {
  const rows = DIGITS[char]
  return (
    <svg viewBox="0 0 30 50" className="h-auto w-full" aria-hidden>
      {rows.flatMap((row, y) =>
        [...row].map((cell, x) =>
          cell === '1' ? (
            <rect key={`${x}-${y}`} data-step x={x * 10 + 0.5} y={y * 10 + 0.5} width={9} height={9} rx={2} fill={tone} />
          ) : null,
        ),
      )}
    </svg>
  )
}

/** 404: огромное «404» из ступенчатых блоков, текст, кнопки на главную и в каталог, мини-игра (только десктоп) */
export async function NotFoundView() {
  const t = await getTranslations('errors')
  return (
    <section className="container-site pt-10 pb-16 md:pt-16">
      <StepReveal immediate className="mx-auto grid w-full max-w-[880px] grid-cols-3 gap-[4vw] md:gap-10">
        <BlockDigit char="4" tone="var(--color-lavender)" />
        <BlockDigit char="0" tone="var(--color-pistachio)" />
        <BlockDigit char="4" tone="var(--color-blush)" />
      </StepReveal>
      <h1 className="t-h2 mx-auto mt-10 max-w-3xl text-center">{t('notFoundTitle')}</h1>
      <p className="t-lead mx-auto mt-4 max-w-xl text-center text-ink-soft">{t('notFoundText')}</p>
      <div className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row sm:justify-center">
        <TransitionLink href="/" className={buttonClasses({ variant: 'secondary', fullWidth: true, className: 'sm:w-auto' })}>
          {t('toHome')}
        </TransitionLink>
        <TransitionLink href="/catalog" className={buttonClasses({ fullWidth: true, className: 'sm:w-auto' })}>
          {t('toCatalog')}
        </TransitionLink>
      </div>
      <ShelfGame />
    </section>
  )
}
