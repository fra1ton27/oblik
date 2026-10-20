'use client'

import { RotateCcw } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'
import { cn } from '@/lib/cn'

const PATTERN = ['1.1', '1.1', '111', '..1', '..1', '111', '1.1', '1.1', '1.1', '111', '1.1', '1.1', '111', '..1', '..1']
// 3 цифры (4, 0, 4) × сетка 3 × 5; читаем построчно для каждой цифры
const DIGIT_ROWS = [PATTERN.slice(0, 5), PATTERN.slice(5, 10), PATTERN.slice(10, 15)]

/**
 * Мини-игра «Собери стеллаж» для 404: ставьте блоки-ступени в клетки, чтобы собрать «404».
 * Каждая клетка — кнопка (работает с клавиатуры). На мобайле скрыта.
 */
export function ShelfGame() {
  const t = useTranslations('errors')
  const target = useMemo(
    () => DIGIT_ROWS.flatMap((rows, d) => rows.flatMap((row, y) => [...row].map((c, x) => ({ id: `${d}-${y}-${x}`, need: c === '1' })))),
    [],
  )
  const [placed, setPlaced] = useState<Set<string>>(new Set())
  const total = target.filter((c) => c.need).length
  const correct = target.filter((c) => c.need && placed.has(c.id)).length
  const extra = target.filter((c) => !c.need && placed.has(c.id)).length
  const done = correct === total && extra === 0

  function toggle(id: string) {
    setPlaced((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <div className="mx-auto mt-20 hidden max-w-[880px] rounded-section bg-paper p-8 lg:block">
      <div className="flex items-start justify-between gap-6">
        <div>
          <h2 className="t-h3">{t('gameTitle')}</h2>
          <p className="t-small mt-1 font-normal text-ink-soft">{t('gameHint')}</p>
        </div>
        <button
          type="button"
          onClick={() => setPlaced(new Set())}
          className="inline-flex h-11 shrink-0 items-center gap-2 rounded-pill border border-line px-4 text-[14px] font-semibold hover:bg-sand"
        >
          <RotateCcw aria-hidden className="size-4" strokeWidth={1.5} />
          {t('gameReset')}
        </button>
      </div>
      <div className="mt-8 grid grid-cols-3 gap-10">
        {DIGIT_ROWS.map((_, d) => (
          <div key={d} className="grid grid-cols-3 gap-1.5">
            {target
              .filter((c) => c.id.startsWith(`${d}-`))
              .map((cell) => {
                const on = placed.has(cell.id)
                return (
                  <button
                    key={cell.id}
                    type="button"
                    aria-pressed={on}
                    aria-label={t('gameCell', { index: Number(cell.id.split('-')[1]) * 3 + Number(cell.id.split('-')[2]) + 1 })}
                    onClick={() => toggle(cell.id)}
                    className={cn(
                      'aspect-square rounded-[6px] border transition-[background-color,transform] duration-200 ease-soft',
                      on
                        ? cn('scale-100 border-transparent', ['bg-lavender', 'bg-pistachio', 'bg-blush'][d])
                        : 'scale-95 border-dashed border-ink-soft/40 hover:border-ink',
                      done && on && 'motion-safe:animate-[float-y_2s_ease-in-out_infinite]',
                    )}
                  />
                )
              })}
          </div>
        ))}
      </div>
      <p className="t-small mt-6" aria-live="polite">
        {done ? t('gameDone') : t('gameProgress', { correct, total })}
      </p>
    </div>
  )
}
