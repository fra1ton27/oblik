'use client'

import { useTranslations } from 'next-intl'
import { cn } from '@/lib/cn'

type Props = {
  count: number
  active: number
  onSelect?: (index: number) => void
  className?: string
  tone?: 'light' | 'dark'
}

/** Точки в пилюле, как у слайдера 1minus1: активная вытянута (scaleX — только transform) */
export function DotsPagination({ count, active, onSelect, className, tone = 'light' }: Props) {
  const t = useTranslations('common')
  if (count <= 1) return null
  return (
    <div
      className={cn(
        'inline-flex items-center gap-0 rounded-pill px-1.5',
        tone === 'light' ? 'bg-paper/85 border border-line' : 'bg-ink/60',
        className,
      )}
    >
      {Array.from({ length: count }, (_, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onSelect?.(i)}
          aria-label={t('slideOf', { index: i + 1, total: count })}
          aria-current={i === active ? 'true' : undefined}
          className="group inline-flex h-8 w-6 items-center justify-center"
        >
          <span
            aria-hidden
            className={cn(
              'block size-1.5 rounded-pill transition-[transform,background-color] duration-[400ms] ease-soft',
              i === active ? 'scale-x-[2.6] ' + (tone === 'light' ? 'bg-ink' : 'bg-milk') : tone === 'light' ? 'bg-ink/25 group-hover:bg-ink/50' : 'bg-milk/40',
            )}
          />
        </button>
      ))}
    </div>
  )
}
