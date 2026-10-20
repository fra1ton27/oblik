'use client'

import Image from 'next/image'
import { useEffect, useLayoutEffect, useRef, useState, type RefObject } from 'react'
import { useTranslations } from 'next-intl'
import type { ProductCard } from '@/lib/catalog'
import { Button } from '@/components/ui/Button'
import { Price } from '@/components/ui/Price'
import { gsap, prefersReducedMotion } from '@/components/motion/gsap'
import { cn } from '@/lib/cn'

type Props = { target: RefObject<HTMLButtonElement | null>; card: ProductCard; variantLabel: string; price: number; onAdd: () => void }

/**
 * Липкая плашка «В корзину»: появляется, когда основная кнопка уходит за край экрана
 * (на мобайле — всегда после первого экрана). Миниатюра, название, вариант, цена, кнопка.
 * Странице добавляется нижний отступ (--sticky-bar-h), cookie-баннер и тосты поднимаются выше.
 */
export function StickyBuyBar({ target, card, variantLabel, price, onAdd }: Props) {
  const t = useTranslations('product')
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const btn = target.current
    if (!btn) return
    const mobile = window.matchMedia('(max-width: 767px)')
    const check = () => {
      const r = btn.getBoundingClientRect()
      const passed = r.bottom < 0 || (mobile.matches && window.scrollY > window.innerHeight * 0.9)
      // на мобайле видна всегда после первого экрана; на десктопе — пока кнопка за краем
      setVisible(mobile.matches ? window.scrollY > window.innerHeight * 0.9 : passed)
    }
    check()
    window.addEventListener('scroll', check, { passive: true })
    window.addEventListener('resize', check)
    return () => {
      window.removeEventListener('scroll', check)
      window.removeEventListener('resize', check)
    }
  }, [target])

  useLayoutEffect(() => {
    const el = ref.current
    const root = document.documentElement
    if (!el) return
    if (visible) root.style.setProperty('--sticky-bar-h', `${el.offsetHeight}px`)
    else root.style.removeProperty('--sticky-bar-h')
    if (!prefersReducedMotion()) gsap.to(el, { yPercent: visible ? 0 : 110, duration: 0.4, ease: 'soft' })
    else gsap.set(el, { yPercent: visible ? 0 : 110 })
    return () => {
      root.style.removeProperty('--sticky-bar-h')
    }
  }, [visible])

  const img = card.images[0]
  return (
    <div
      ref={ref}
      role="region"
      aria-label={t('stickyLabel')}
      aria-hidden={!visible}
      inert={!visible}
      className={cn('fixed inset-x-0 bottom-0 z-40 border-t border-line bg-paper/95 backdrop-blur-md')}
      style={{ paddingBottom: 'env(safe-area-inset-bottom)', transform: 'translateY(110%)' }}
    >
      <div className="container-site flex items-center gap-3 py-3">
        {img && (
          <div className="relative size-12 shrink-0 overflow-hidden rounded-[10px] bg-sand">
            <Image src={img.src} alt="" fill sizes="48px" className="object-cover" />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate text-[14px] font-semibold">{card.title}</p>
          <p className="truncate text-[13px] text-ink-soft">{variantLabel}</p>
        </div>
        <Price amount={price} size="md" className="hidden sm:inline-flex" />
        <Button onClick={onAdd} className="shrink-0">
          <span className="sm:hidden">
            <Price amount={price} size="sm" />
          </span>
          <span className="hidden sm:inline">{t('addToCart')}</span>
        </Button>
      </div>
    </div>
  )
}
