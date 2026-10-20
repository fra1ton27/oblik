import { Check } from 'lucide-react'
import { cn } from '@/lib/cn'

type Props = {
  steps: string[]
  current: number
  className?: string
  /** Подпись для скринридера: «Шаг 2 из 3» */
  label: string
}

/** Степпер шагов (оформление заказа). На мобайле — три точки и название текущего шага. */
export function Stepper({ steps, current, className, label }: Props) {
  return (
    <nav aria-label={label} className={className}>
      <ol className="hidden items-center gap-3 md:flex">
        {steps.map((step, i) => {
          const done = i < current
          const active = i === current
          return (
            <li key={step} className="flex items-center gap-3" aria-current={active ? 'step' : undefined}>
              <span
                className={cn(
                  'inline-flex size-9 items-center justify-center rounded-full border text-[14px] font-semibold tabular-nums transition-colors duration-200',
                  done && 'border-ink bg-ink text-milk',
                  active && 'border-ink bg-lavender text-ink',
                  !done && !active && 'border-line bg-paper text-ink-soft',
                )}
              >
                {done ? <Check aria-hidden className="size-4" strokeWidth={2} /> : i + 1}
              </span>
              <span className={cn('t-small', active ? 'text-ink' : 'text-ink-soft')}>{step}</span>
              {i < steps.length - 1 && <span aria-hidden className="h-px w-10 bg-line lg:w-16" />}
            </li>
          )
        })}
      </ol>
      <div className="flex items-center gap-3 md:hidden">
        <span className="flex items-center gap-1.5" aria-hidden>
          {steps.map((step, i) => (
            <span
              key={step}
              className={cn(
                'h-2 rounded-pill transition-[width,background-color] duration-[400ms]',
                i === current ? 'w-6 bg-ink' : i < current ? 'w-2 bg-ink' : 'w-2 bg-line',
              )}
            />
          ))}
        </span>
        <span className="t-small">{steps[current]}</span>
      </div>
    </nav>
  )
}
