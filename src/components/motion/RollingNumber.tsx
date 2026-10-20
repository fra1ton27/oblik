'use client'

import { useLayoutEffect, useRef } from 'react'
import { gsap, prefersReducedMotion } from './gsap'
import { cn } from '@/lib/cn'

type Props = {
  /** Готовая отформатированная строка (через Intl), цифры в ней перекатываются */
  value: string
  className?: string
}

/**
 * Цифры перекатываются снизу вверх при изменении (счётчик корзины, суммы).
 * Скринридер читает итоговое значение целиком.
 */
export function RollingNumber({ value, className }: Props) {
  const ref = useRef<HTMLSpanElement>(null)
  const prev = useRef(value)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el || prev.current === value) return
    const direction = compare(value, prev.current)
    prev.current = value
    if (prefersReducedMotion()) return
    const digits = el.querySelectorAll<HTMLElement>('[data-digit]')
    gsap.fromTo(
      digits,
      { yPercent: direction >= 0 ? 100 : -100, opacity: 0 },
      { yPercent: 0, opacity: 1, duration: 0.4, ease: 'soft', stagger: 0.03 },
    )
  }, [value])

  return (
    <span ref={ref} className={cn('inline-flex overflow-hidden align-baseline tabular-nums', className)}>
      <span className="sr-only">{value}</span>
      <span aria-hidden className="inline-flex">
        {Array.from(value).map((ch, i) =>
          /\d/.test(ch) ? (
            <span key={`${i}-${ch}`} data-digit className="inline-block">
              {ch}
            </span>
          ) : (
            <span key={`${i}-s`} className="inline-block whitespace-pre">
              {ch}
            </span>
          ),
        )}
      </span>
    </span>
  )
}

function compare(a: string, b: string) {
  const na = Number(a.replace(/[^\d]/g, ''))
  const nb = Number(b.replace(/[^\d]/g, ''))
  return na - nb
}
