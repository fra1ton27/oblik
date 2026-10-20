import { cn } from '@/lib/cn'

type Props = {
  items: string[]
  className?: string
  itemClassName?: string
  /** Длительность одного прохода, с */
  duration?: number
  separator?: React.ReactNode
  reverse?: boolean
}

/**
 * Бесконечная бегущая строка на CSS (transform). Пауза на hover и при reduced motion.
 * Дубль содержимого скрыт от скринридеров.
 */
export function Marquee({ items, className, itemClassName, duration = 40, separator, reverse }: Props) {
  const row = (hidden: boolean) => (
    <div className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {items.map((item, i) => (
        <span key={i} className="flex shrink-0 items-center">
          <span className={cn('whitespace-nowrap', itemClassName)}>{item}</span>
          <span className="mx-[0.35em] inline-flex" aria-hidden>
            {separator ?? '·'}
          </span>
        </span>
      ))}
    </div>
  )
  return (
    <div className={cn('group relative flex overflow-hidden', className)}>
      <div
        className="flex w-max motion-safe:animate-[marquee_var(--marquee-dur)_linear_infinite] group-hover:[animation-play-state:paused]"
        style={{ ['--marquee-dur' as string]: `${duration}s`, animationDirection: reverse ? 'reverse' : undefined }}
      >
        {row(false)}
        {row(true)}
      </div>
    </div>
  )
}
