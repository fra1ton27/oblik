import { cn } from '@/lib/cn'
import { colorVar, toneOnTone, type ShapeColor } from './tokens'

type Props = {
  color?: ShapeColor
  className?: string
  /** Высота боковой грани подиума относительно ширины */
  depth?: number
}

/**
 * Шейп «Подиум» (Disc): пастельный круглый подиум под вырезанным фото товара.
 * Верхняя грань — эллипс, боковая — тот же цвет «тон в тон».
 */
export function Disc({ color = 'lavender', className, depth = 0.09 }: Props) {
  const w = 400
  const ry = 64
  const side = w * depth
  return (
    <svg
      aria-hidden
      focusable="false"
      viewBox={`0 0 ${w} ${ry * 2 + side + 4}`}
      className={cn('pointer-events-none w-full select-none', className)}
    >
      <path
        d={`M2,${ry} A${w / 2 - 2},${ry} 0 0 0 ${w - 2},${ry} L${w - 2},${ry + side} A${w / 2 - 2},${ry} 0 0 1 2,${ry + side} Z`}
        fill={toneOnTone(color, 14)}
      />
      <ellipse cx={w / 2} cy={ry} rx={w / 2 - 2} ry={ry - 2} fill={colorVar(color)} />
      <ellipse cx={w / 2} cy={ry} rx={w / 2 - 2} ry={ry - 2} fill="none" stroke={toneOnTone(color, 10)} strokeWidth="1.5" />
    </svg>
  )
}
