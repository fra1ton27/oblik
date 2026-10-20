import { cn } from '@/lib/cn'
import { columnPath, terraceColumns } from './geometry'
import { colorVar, toneOnTone, type ShapeColor } from './tokens'

type Props = {
  /** Цвет заливки: токен палитры */
  color?: ShapeColor
  /** Притемнить «тон в тон» относительно цвета */
  tone?: boolean
  /** Число ступеней: 3–7 */
  steps?: number
  /** Размер одной ступени в единицах сетки 8 px */
  unit?: number
  /** Зеркально: ступени спускаются слева направо */
  flip?: boolean
  className?: string
  style?: React.CSSProperties
}

/**
 * Шейп «Терраса» (Step): лесенка из 3–7 ступеней на сетке 8 px, скругление 4 px.
 * Каждая ступень отдельной колонкой с data-step — так её можно проявлять по очереди (StepReveal).
 * Декоративный: aria-hidden.
 */
export function Terrace({ color = 'lavender', tone = false, steps = 5, unit = 8, flip = false, className, style }: Props) {
  const n = Math.min(7, Math.max(3, Math.round(steps)))
  const cell = unit * 8 // ширина ступени: unit × 8 px
  const width = n * cell
  const height = n * cell
  const fill = tone ? toneOnTone(color) : colorVar(color)
  const columns = terraceColumns(n, width, height)

  return (
    <svg
      aria-hidden
      focusable="false"
      viewBox={`0 0 ${width} ${height}`}
      className={cn('pointer-events-none select-none', className)}
      style={{ ...style, transform: flip ? 'scaleX(-1)' : undefined }}
      preserveAspectRatio="xMaxYMax meet"
    >
      {columns.map((c, i) => (
        <path
          key={i}
          data-step={i}
          d={columnPath(c.x, c.y, c.width + (i < n - 1 ? 0.5 : 0), c.height, 4 * (unit / 8) * 2, i === n - 1)}
          fill={fill}
        />
      ))}
    </svg>
  )
}
