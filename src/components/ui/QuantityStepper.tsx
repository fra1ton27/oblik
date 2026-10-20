'use client'

import { Minus, Plus } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { RollingNumber } from '@/components/motion/RollingNumber'
import { cn } from '@/lib/cn'

type Props = {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  size?: 'sm' | 'md'
  label?: string
  disabled?: boolean
  className?: string
}

export function QuantityStepper({ value, onChange, min = 1, max = 99, size = 'md', label, disabled, className }: Props) {
  const t = useTranslations('common')
  const btn = cn(
    'inline-flex shrink-0 items-center justify-center rounded-pill transition-colors duration-200',
    'hover-device:hover:bg-sand disabled:opacity-35 disabled:hover:bg-transparent',
    size === 'sm' ? 'size-11' : 'size-12',
  )
  return (
    <div
      role="group"
      aria-label={label ?? t('quantity')}
      className={cn('inline-flex items-center rounded-pill border border-line bg-paper', disabled && 'opacity-50', className)}
    >
      <button
        type="button"
        className={btn}
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={disabled || value <= min}
        aria-label={t('decrease')}
      >
        <Minus aria-hidden className="size-4" strokeWidth={1.5} />
      </button>
      <output aria-live="polite" className={cn('min-w-8 text-center font-semibold', size === 'sm' ? 'text-[15px]' : 'text-[16px]')}>
        <RollingNumber value={String(value)} />
      </output>
      <button
        type="button"
        className={btn}
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={disabled || value >= max}
        aria-label={t('increase')}
      >
        <Plus aria-hidden className="size-4" strokeWidth={1.5} />
      </button>
    </div>
  )
}
