import { cn } from '@/lib/cn'
import { columnPath, terraceColumns } from './geometry'

/** Маленький SVG-знак логотипа: терраса из трёх ступеней и диск-«солнце» */
export function LogoMark({ className }: { className?: string }) {
  const cols = terraceColumns(3, 24, 24)
  return (
    <svg aria-hidden focusable="false" viewBox="0 0 28 28" className={cn('shrink-0', className)}>
      <circle cx="7" cy="7" r="4" fill="var(--color-lavender-600)" />
      <g transform="translate(2 2)">
        {cols.map((c, i) => (
          <path key={i} d={columnPath(c.x, c.y, c.width + (i < 2 ? 0.3 : 0), c.height, 2.5, i === 2)} fill="currentColor" />
        ))}
      </g>
    </svg>
  )
}
