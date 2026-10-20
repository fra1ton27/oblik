'use client'

import Image from 'next/image'
import { Trash2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { usePathname } from '@/i18n/navigation'
import { useEffect, useRef } from 'react'
import { Dialog } from '@/components/ui/Dialog'
import { QuantityStepper } from '@/components/ui/QuantityStepper'
import { Price } from '@/components/ui/Price'
import { buttonClasses } from '@/components/ui/Button'
import { toast } from '@/components/ui/Toast'
import { EmptyState } from '@/components/ui/EmptyState'
import { TransitionLink } from '@/components/motion/TransitionLink'
import { useIsClient } from '@/components/motion/useIsClient'
import { gsap, prefersReducedMotion } from '@/components/motion/gsap'
import { cartCount, cartSubtotal, useCart } from './store'
import { cn } from '@/lib/cn'

/**
 * Мини-корзина: открывается после добавления и по иконке в шапке. Десктоп — дроуэр справа 440 px,
 * мобайл — нижний лист на 90 % высоты, закрывается свайпом вниз. Фокус внутри, Esc закрывает,
 * изменения объявляются через aria-live. Суммы — по снимку; точный пересчёт — в корзине.
 */
export function MiniCart() {
  const t = useTranslations('cart')
  const tc = useTranslations('common')
  const isClient = useIsClient()
  const { lines, miniCartOpen, closeMiniCart, setQty, remove, restore, lastAddedKey } = useCart()
  const pathname = usePathname()
  const listRef = useRef<HTMLUListElement>(null)

  // переход на другую страницу закрывает мини-корзину
  useEffect(() => {
    closeMiniCart()
  }, [pathname, closeMiniCart])

  // подсветка только что добавленной позиции
  useEffect(() => {
    if (!miniCartOpen || !lastAddedKey || prefersReducedMotion()) return
    const el = listRef.current?.querySelector(`[data-line="${CSS.escape(lastAddedKey)}"]`)
    if (el) gsap.fromTo(el, { backgroundColor: 'var(--color-lavender)' }, { backgroundColor: 'transparent', duration: 1.2, delay: 0.3, clearProps: 'backgroundColor' })
  }, [miniCartOpen, lastAddedKey])

  const count = isClient ? cartCount(lines) : 0
  const subtotal = isClient ? cartSubtotal(lines) : 0

  // удаление отменяется из тоста в течение 5 секунд
  function onRemove(key: string, title: string) {
    const removed = remove(key)
    if (removed) toast({ message: t('removed', { title }), actionLabel: tc('undo'), onAction: () => restore(removed.line, removed.index), duration: 5000 })
  }

  return (
    <Dialog
      open={miniCartOpen && isClient}
      onClose={closeMiniCart}
      title={t('miniTitle')}
      width={440}
      footer={
        lines.length > 0 ? (
          <div className="flex flex-col gap-3">
            <div className="flex items-baseline justify-between">
              <span className="text-[15px] font-semibold">{t('subtotal')}</span>
              <Price amount={subtotal} size="lg" rolling />
            </div>
            <p className="t-small font-normal text-ink-soft">{t('deliveryLater')}</p>
            <div className="grid grid-cols-2 gap-2">
              <TransitionLink href="/cart" className={buttonClasses({ variant: 'secondary', fullWidth: true })}>
                {t('goToCart')}
              </TransitionLink>
              <TransitionLink href="/checkout" className={buttonClasses({ fullWidth: true })}>
                {t('checkout')}
              </TransitionLink>
            </div>
          </div>
        ) : undefined
      }
    >
      <p className="sr-only" aria-live="polite">
        {t('items', { count })}
      </p>
      {lines.length === 0 ? (
        <EmptyState
          title={t('empty')}
          text={t('emptyText')}
          headingLevel="h3"
          className="py-6"
          actions={
            <TransitionLink href="/catalog" className={buttonClasses()}>
              {t('toCatalog')}
            </TransitionLink>
          }
        />
      ) : (
        <ul ref={listRef} className="flex flex-col divide-y divide-line">
          {lines.map((l) => (
            <li key={l.key} data-line={l.key} className="flex gap-3 rounded-[12px] py-4">
              <div className="relative size-20 shrink-0 overflow-hidden rounded-[12px] bg-sand">
                {l.snapshot.image && <Image src={l.snapshot.image} alt="" fill sizes="80px" className="object-cover" />}
              </div>
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                {l.snapshot.slug ? (
                  <TransitionLink href={{ pathname: '/furniture/[slug]', params: { slug: l.snapshot.slug } }} className="text-[15px] leading-snug font-semibold hover:underline">
                    {l.snapshot.title}
                  </TransitionLink>
                ) : (
                  <span className="text-[15px] font-semibold">{l.snapshot.title}</span>
                )}
                {l.snapshot.variantLabel && <span className="t-small font-normal text-ink-soft">{l.snapshot.variantLabel}</span>}
                <div className="mt-2 flex items-center justify-between gap-2">
                  <QuantityStepper value={l.qty} onChange={(q) => setQty(l.key, q)} size="sm" label={t('quantityOf', { title: l.snapshot.title })} />
                  <Price amount={l.snapshot.price * l.qty} size="sm" rolling />
                </div>
              </div>
              <button
                type="button"
                onClick={() => onRemove(l.key, l.snapshot.title)}
                aria-label={t('removeItem', { title: l.snapshot.title })}
                className={cn('inline-flex size-11 shrink-0 items-center justify-center self-start rounded-pill text-ink-soft hover:bg-sand hover:text-ink')}
              >
                <Trash2 aria-hidden className="size-4" strokeWidth={1.5} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </Dialog>
  )
}
