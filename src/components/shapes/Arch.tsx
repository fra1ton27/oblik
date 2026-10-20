import { cn } from '@/lib/cn'

type Props = {
  children: React.ReactNode
  className?: string
  /** Радиус нижних углов, px */
  bottomRadius?: number
  /** Соотношение сторон, например '4 / 5' */
  aspect?: string
  style?: React.CSSProperties
}

/**
 * Шейп «Арка»: прямоугольник с полукруглым верхом — маска для фото в hero и на посадочных.
 * Радиус верха = половина ширины через container query units (50cqi), без JS.
 */
export function Arch({ children, className, bottomRadius = 16, aspect = '4 / 5', style }: Props) {
  return (
    <div className={cn('relative w-full', className)} style={{ containerType: 'inline-size', ...style }}>
      <div
        className="relative w-full overflow-hidden bg-sand"
        style={{
          aspectRatio: aspect,
          borderRadius: `50cqi 50cqi ${bottomRadius}px ${bottomRadius}px`,
        }}
      >
        {children}
      </div>
    </div>
  )
}
