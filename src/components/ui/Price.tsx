'use client'

import { useTranslations } from 'next-intl'
import { useFormat } from '@/components/motion/useFormat'
import { RollingNumber } from '@/components/motion/RollingNumber'
import { cn } from '@/lib/cn'

type Props = {
  /** Цена в центах */
  amount: number
  compareAt?: number | null
  /** «от …», если у товара есть варианты с разной ценой */
  from?: boolean
  currency?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  rolling?: boolean
}

export function Price({ amount, compareAt, from, currency, size = 'md', className, rolling }: Props) {
  const t = useTranslations('common')
  const f = useFormat()
  const value = f.money(amount, currency)
  const sizes = { sm: 'text-[15px]', md: 'text-[18px]', lg: 'text-[24px]', xl: 'text-[clamp(28px,22px+1.5vw,40px)]' }
  const sale = compareAt && compareAt > amount
  return (
    <span className={cn('inline-flex flex-wrap items-baseline gap-x-2', className)}>
      <span className={cn('t-price', sizes[size], sale && 'text-error')}>
        {from && <span className="mr-1 font-sans text-[0.75em] font-medium">{t('priceFrom')}</span>}
        {rolling ? <RollingNumber value={value} /> : value}
      </span>
      {sale && (
        <span className="text-[0.85em] text-ink-soft line-through">
          <span className="sr-only">{t('priceWas')}</span>
          {f.money(compareAt, currency)}
        </span>
      )}
    </span>
  )
}
