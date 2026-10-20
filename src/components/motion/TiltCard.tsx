import { cn } from '@/lib/cn'

/**
 * Наклонённая парящая карточка (−4…+6°): при наведении или фокусе внутри выравнивается в 0°.
 * На мобайле без наклона (формы на всю ширину), если не задан mobileTilt.
 */
export function TiltCard({ tilt = -3, mobileTilt = 0, className, children }: { tilt?: number; mobileTilt?: number; className?: string; children: React.ReactNode }) {
  return (
    <div className={cn('tilt-card', className)} style={{ ['--tilt-md' as string]: `${tilt}deg`, ['--tilt-sm' as string]: `${mobileTilt}deg` }}>
      {children}
    </div>
  )
}
