import { Terrace } from '@/components/shapes'
import type { ShapeColor } from '@/components/shapes/tokens'
import { StepReveal } from '@/components/motion/StepReveal'
import { cn } from '@/lib/cn'

type Props = {
  title: React.ReactNode
  text?: React.ReactNode
  actions?: React.ReactNode
  color?: ShapeColor
  steps?: number
  className?: string
  headingLevel?: 'h1' | 'h2' | 'h3'
  /** Иллюстрация вместо террасы по умолчанию */
  illustration?: React.ReactNode
}

/** Пустое состояние: ступенчатая иллюстрация, текст, действия */
export function EmptyState({ title, text, actions, color = 'lavender', steps = 4, className, headingLevel = 'h2', illustration }: Props) {
  const H = headingLevel
  return (
    <div className={cn('flex flex-col items-center px-4 py-12 text-center', className)}>
      {illustration ?? (
        <StepReveal className="w-[160px] md:w-[200px]">
          <Terrace color={color} steps={steps} className="w-full" />
        </StepReveal>
      )}
      <H className={cn('mt-8', headingLevel === 'h1' ? 't-h1' : 't-h2')}>{title}</H>
      {text && <p className="t-lead mt-4 max-w-xl text-ink-soft">{text}</p>}
      {actions && <div className="mt-8 flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row">{actions}</div>}
    </div>
  )
}
