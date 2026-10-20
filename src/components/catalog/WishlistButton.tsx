'use client'

import { Heart } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useWishlist } from '@/components/account/wishlistStore'
import { useIsClient } from '@/components/motion/useIsClient'
import { gsap, prefersReducedMotion } from '@/components/motion/gsap'
import { syncWishlistToggle } from '@/components/account/wishlistSync'
import { cn } from '@/lib/cn'

type Props = { productId: number; title: string; className?: string; size?: 'sm' | 'md'; tone?: 'paper' | 'line' }

/** Сердечко избранного: отдельная кнопка поверх кликабельной карточки (доступна с клавиатуры) */
export function WishlistButton({ productId, title, className, size = 'sm', tone = 'paper' }: Props) {
  const t = useTranslations('catalog')
  const isClient = useIsClient()
  const on = useWishlist((s) => s.ids.some((x) => String(x) === String(productId)))
  const toggle = useWishlist((s) => s.toggle)
  const active = isClient && on

  return (
    <button
      type="button"
      aria-pressed={active}
      aria-label={active ? t('wishlistRemove', { title }) : t('wishlistAdd', { title })}
      onClick={(e) => {
        const nowOn = toggle(productId)
        void syncWishlistToggle(productId, nowOn)
        if (nowOn && !prefersReducedMotion()) {
          gsap.fromTo(e.currentTarget.querySelector('svg'), { scale: 0.6 }, { scale: 1, duration: 0.4, ease: 'back.out(3)' })
        }
      }}
      className={cn(
        // позиционирование задаёт вызывающий (absolute в карточке), иначе relative
        className?.match(/(absolute|fixed|sticky)/) ? '' : 'relative',
        'z-10 inline-flex items-center justify-center rounded-pill transition-colors duration-200',
        size === 'sm' ? 'size-11' : 'size-12',
        tone === 'paper' ? 'bg-paper/90 hover:bg-paper' : 'border border-line bg-paper hover:border-ink',
        className,
      )}
    >
      <Heart aria-hidden className={cn('size-5 transition-colors', active ? 'fill-ink text-ink' : 'text-ink')} strokeWidth={1.5} />
    </button>
  )
}
