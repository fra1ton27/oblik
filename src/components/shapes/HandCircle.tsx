import { cn } from '@/lib/cn'
import { handCirclePath } from './geometry'
import { colorVar, type ShapeColor } from './tokens'

type Props = {
  className?: string
  color?: ShapeColor
  /** Нарисован ли круг (иначе рисуется на hover родителя с классом group) */
  active?: boolean
  seed?: number
  /** Пропорция овала: ширина / высота */
  ratio?: number
}

/**
 * Рукописный круг: неровный овал линией 1.5 px. Линия «рисуется» за 600 ms
 * через stroke-dashoffset (pathLength = 1) при hover/focus родителя .group или при active.
 */
export function HandCircle({ className, color = 'ink', active, seed = 3, ratio = 1.6 }: Props) {
  const h = 100
  const w = Math.round(h * ratio)
  return (
    <svg
      aria-hidden
      focusable="false"
      viewBox={`0 0 ${w} ${h}`}
      preserveAspectRatio="none"
      className={cn('hand-circle pointer-events-none absolute overflow-visible', className)}
      data-active={active ? 'true' : undefined}
    >
      <path
        d={handCirclePath(w, h, seed)}
        pathLength={1}
        fill="none"
        stroke={colorVar(color)}
        strokeWidth={1.5}
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}
