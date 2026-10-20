import { LogoMark } from '@/components/shapes'
import { cn } from '@/lib/cn'

/** Логотип: маленький SVG-знак из шейпа «терраса» + текстовый знак дисплейным шрифтом */
export function Logo({ name, className, tone = 'ink' }: { name: string; className?: string; tone?: 'ink' | 'milk' }) {
  return (
    <span className={cn('inline-flex items-center gap-2', tone === 'ink' ? 'text-ink' : 'text-milk', className)}>
      <LogoMark className="size-7" />
      <span className="font-display text-[20px] leading-none font-medium tracking-[-0.02em] lowercase md:text-[22px]">{name}</span>
    </span>
  )
}
