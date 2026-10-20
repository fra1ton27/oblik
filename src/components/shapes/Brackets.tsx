import { cn } from '@/lib/cn'

type Props = {
  className?: string
  /** Всегда видимы (иначе появляются на hover/focus-within родителя .group) */
  visible?: boolean
  /** Длина уголка, px */
  size?: number
  /** Отступ наружу, px */
  inset?: number
  tone?: 'ink' | 'milk' | 'lavender'
}

/** Уголки (Brackets): четыре угловых маркера вокруг объекта — hover карточки, фокус витрины, рамка миникарты */
export function Brackets({ className, visible, size = 14, inset = 6, tone = 'ink' }: Props) {
  const color = { ink: 'border-ink', milk: 'border-milk', lavender: 'border-lavender' }[tone]
  const base = cn(
    'absolute border-[1.5px] transition-[opacity,transform] duration-200 ease-soft',
    color,
    visible
      ? 'opacity-100'
      : 'opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 group-focus-within:opacity-100',
  )
  const s = { width: size, height: size }
  return (
    <span aria-hidden className={cn('pointer-events-none absolute', className)} style={{ inset: -inset }}>
      <span className={cn(base, 'top-0 left-0 rounded-tl-[3px] border-r-0 border-b-0')} style={s} />
      <span className={cn(base, 'top-0 right-0 rounded-tr-[3px] border-b-0 border-l-0')} style={s} />
      <span className={cn(base, 'bottom-0 left-0 rounded-bl-[3px] border-t-0 border-r-0')} style={s} />
      <span className={cn(base, 'right-0 bottom-0 rounded-br-[3px] border-t-0 border-l-0')} style={s} />
    </span>
  )
}
