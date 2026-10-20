'use client'

import Image from 'next/image'
import { Heart, ShieldCheck, Trash2 } from 'lucide-react'
import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import type { ProductCard as Card } from '@/lib/catalog'
import type { QuoteLine } from '@/lib/cart/quote'
import { useIsClient } from '@/components/motion/useIsClient'
import { useFormat } from '@/components/motion/useFormat'
import { TransitionLink } from '@/components/motion/TransitionLink'
import { QuantityStepper } from '@/components/ui/QuantityStepper'
import { Price } from '@/components/ui/Price'
import { Button, buttonClasses } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { toast } from '@/components/ui/Toast'
import { Skeleton } from '@/components/ui/Skeleton'
import { ProductCarousel } from '@/components/catalog/ProductCarousel'
import { useWishlist } from '@/components/account/wishlistStore'
import { cartCount, useCart, type CartLine } from './store'
import { useQuote } from './useQuote'
import { EmptyShelf } from './EmptyShelf'
import { cn } from '@/lib/cn'

type Props = { popular: Card[]; suggestions: Card[]; displayCurrency: { code: string; rate: number } | null }

const PROMO_KEY = 'oblik-promo'

export function CartView({ popular, suggestions, displayCurrency }: Props) {
  const t = useTranslations('cart')
  const tc = useTranslations('common')
  const f = useFormat()
  const isClient = useIsClient()
  const { lines, setQty, remove, restore } = useCart()
  const wish = useWishlist()
  const [promoInput, setPromoInput] = useState('')
  const [promo, setPromo] = useState<string | undefined>(() => {
    try {
      return sessionStorage.getItem(PROMO_KEY) ?? undefined
    } catch {
      return undefined
    }
  })
  const [promoOpen, setPromoOpen] = useState(false)
  const { quote, loading } = useQuote(lines, promo, undefined, isClient && lines.length > 0)
  const barRef = useRef<HTMLDivElement>(null)
  const byKey = useMemo(() => new Map((quote?.lines ?? []).map((l) => [l.key, l])), [quote])

  // липкая плашка «Оформить · сумма» на мобайле
  useLayoutEffect(() => {
    const el = barRef.current
    const root = document.documentElement
    if (!el) return
    root.style.setProperty('--sticky-bar-h', `${el.offsetHeight}px`)
    return () => {
      root.style.removeProperty('--sticky-bar-h')
    }
  }, [lines.length])

  if (!isClient) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-28" />
        <Skeleton className="h-28" />
      </div>
    )
  }

  if (!lines.length) {
    return (
      <div className="flex flex-col items-center pt-6 pb-4 text-center">
        <EmptyShelf className="w-[200px] md:w-[240px]" />
        <h2 className="t-h1 mt-8">{t('empty')}</h2>
        <p className="t-lead mt-4 max-w-xl text-ink-soft">{t('emptyText')}</p>
        <div className="mt-8 flex w-full flex-col items-center gap-3 sm:w-auto">
          <TransitionLink href="/catalog" className={buttonClasses({ size: 'lg', fullWidth: true, className: 'sm:w-auto' })}>
            {t('toCatalog')}
          </TransitionLink>
          {wish.ids.length > 0 && (
            <TransitionLink href="/wishlist" className="inline-flex min-h-11 items-center gap-2 text-[15px] font-semibold underline underline-offset-4">
              <Heart aria-hidden className="size-4" strokeWidth={1.5} />
              {t('toWishlist', { count: wish.ids.length })}
            </TransitionLink>
          )}
        </div>
        <div className="-mx-[var(--page-pad)] mt-16 w-[calc(100%+2*var(--page-pad))] min-w-0 text-left">
          <ProductCarousel heading={t('popular')} items={popular.slice(0, 4)} className="mt-0" headingLevel="h2" />
        </div>
      </div>
    )
  }

  function onRemove(line: CartLine) {
    const removed = remove(line.key)
    if (removed) toast({ message: t('removed', { title: line.snapshot.title }), actionLabel: tc('undo'), onAction: () => restore(removed.line, removed.index), duration: 5000 })
  }

  function toWishlist(line: CartLine) {
    if (!wish.has(line.productId)) wish.toggle(line.productId)
    remove(line.key)
    toast({ message: t('movedToWishlist', { title: line.snapshot.title }), tone: 'success' })
  }

  function applyPromo(code: string | undefined) {
    setPromo(code)
    try {
      if (code) sessionStorage.setItem(PROMO_KEY, code)
      else sessionStorage.removeItem(PROMO_KEY)
    } catch {}
  }

  const totals = quote?.totals
  const cartCollections = new Set(lines.map((l) => l.snapshot.collectionTitle).filter(Boolean))
  const complements = suggestions.filter((s) => s.collection && cartCollections.has(s.collection.title) && !lines.some((l) => String(l.productId) === String(s.id)))

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
      <section className="min-w-0 lg:col-span-8" aria-labelledby="cart-lines">
        <h2 id="cart-lines" className="sr-only">
          {t('items', { count: cartCount(lines) })}
        </h2>
        <p className="sr-only" aria-live="polite">
          {loading ? t('checking') : t('items', { count: quote?.count ?? cartCount(lines) })}
        </p>
        <ul className="flex flex-col divide-y divide-line border-y border-line">
          {lines.map((l) => (
            <CartRow key={l.key} line={l} q={byKey.get(l.key)} onQty={(q) => setQty(l.key, q)} onRemove={() => onRemove(l)} onWishlist={() => toWishlist(l)} />
          ))}
        </ul>
      </section>

      <aside className="min-w-0 lg:col-span-4" aria-label={t('total')}>
        <div className="flex flex-col gap-4 rounded-section bg-paper p-6 lg:sticky lg:top-[calc(var(--header-h)+24px)]">
          <dl className="flex flex-col gap-3 text-[15px]">
            <Row label={t('subtotal')} value={totals ? <Price amount={totals.subtotal} size="sm" rolling /> : <Skeleton className="h-5 w-20" rounded="pill" />} />
            {!!totals?.bundleDiscount && <Row label={t('bundleDiscount')} value={<span className="text-success">{f.money(-totals.bundleDiscount)}</span>} />}
            {!!totals?.promoDiscount && quote?.promo?.status === 'applied' && (
              <Row label={t('promoDiscount', { code: quote.promo.code })} value={<span className="text-success">{f.money(-totals.promoDiscount)}</span>} />
            )}
            <Row label={t('delivery')} value={<span className="text-ink-soft">{t('deliveryLater')}</span>} />
          </dl>

          <div>
            <button type="button" className={cn('min-h-11 text-[14px] font-semibold underline underline-offset-4', promoOpen && 'lg:hidden')} onClick={() => setPromoOpen((v) => !v)} aria-expanded={promoOpen}>
              {t('promoToggle')}
            </button>
            <form
              className={cn('mt-2 flex gap-2', !promoOpen && 'hidden')}
              onSubmit={(e) => {
                e.preventDefault()
                applyPromo(promoInput.trim() || undefined)
              }}
            >
              <label htmlFor="promo" className="sr-only">
                {t('promo')}
              </label>
              <Input id="promo" value={promoInput} onChange={(e) => setPromoInput(e.target.value)} placeholder={t('promo')} autoComplete="off" className="h-11 uppercase" />
              <Button type="submit" variant="secondary" size="sm" className="h-11">
                {t('promoApply')}
              </Button>
            </form>
            {quote?.promo && (
              <p role="status" className={cn('mt-2 flex items-center justify-between gap-2 text-[13px] font-medium', quote.promo.status === 'applied' ? 'text-success' : 'text-error')}>
                {quote.promo.status === 'applied'
                  ? t('promoApplied', { code: quote.promo.code })
                  : quote.promo.status === 'min'
                    ? t('promoMin', { amount: f.money(quote.promo.minTotal ?? 0) })
                    : t('promoInvalid')}
                <button type="button" className="underline" onClick={() => applyPromo(undefined)}>
                  {t('promoRemove')}
                </button>
              </p>
            )}
          </div>

          <div className="flex items-baseline justify-between border-t border-line pt-4">
            <span className="text-[17px] font-semibold">{t('total')}</span>
            {totals ? <Price amount={totals.total} size="xl" rolling /> : <Skeleton className="h-8 w-28" rounded="pill" />}
          </div>
          {totals && displayCurrency && (
            <p className="-mt-2 text-right text-[13px] text-ink-soft">
              {t('currencyNote', { amount: f.number(Math.round((totals.total / 100) * displayCurrency.rate), { style: 'currency', currency: displayCurrency.code, maximumFractionDigits: 0 }) })}
            </p>
          )}
          <TransitionLink href="/checkout" className={buttonClasses({ size: 'lg', fullWidth: true })}>
            {t('checkoutFull')}
          </TransitionLink>
          <p className="flex items-start gap-2 text-[13px] text-ink-soft">
            <ShieldCheck aria-hidden className="mt-0.5 size-4 shrink-0" strokeWidth={1.5} />
            {t('trust')}
          </p>
        </div>
      </aside>

      {complements.length > 0 && (
        // карусель со своим container-site: снимаем отступы страницы, чтобы не было двойных полей
        <div className="-mx-[var(--page-pad)] min-w-0 lg:col-span-12">
          <ProductCarousel heading={t('complete')} items={complements} className="mt-6" />
        </div>
      )}

      {/* мобайл: липкая плашка «Оформить · сумма» */}
      <div ref={barRef} className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-milk/95 px-4 pt-3 backdrop-blur lg:hidden" style={{ paddingBottom: 'calc(12px + env(safe-area-inset-bottom))' }}>
        <TransitionLink href="/checkout" className={buttonClasses({ size: 'lg', fullWidth: true })}>
          {t('stickyCheckout', { total: totals ? f.money(totals.total) : '…' })}
        </TransitionLink>
      </div>
    </div>
  )
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className="text-ink-soft">{label}</dt>
      <dd className="text-right font-semibold">{value}</dd>
    </div>
  )
}

/** Строка корзины: фото 88 px, название-ссылка, вариант, срок, цена, степпер, сумма; на мобайле удаление свайпом влево */
function CartRow({ line, q, onQty, onRemove, onWishlist }: { line: CartLine; q?: QuoteLine; onQty: (n: number) => void; onRemove: () => void; onWishlist: () => void }) {
  const t = useTranslations('cart')
  const f = useFormat()
  const rowRef = useRef<HTMLDivElement>(null)
  const start = useRef<{ x: number; y: number } | null>(null)
  const [dx, setDx] = useState(0)
  const [dragging, setDragging] = useState(false)
  const unit = q?.unitPrice ?? line.snapshot.price
  const unavailable = q ? !q.available : false
  const image = q?.image?.src ?? line.snapshot.image

  return (
    <li className="relative overflow-hidden">
      <div aria-hidden className="absolute inset-y-0 right-0 flex w-24 items-center justify-center bg-error text-milk">
        <Trash2 className="size-5" strokeWidth={1.5} />
      </div>
      <div
        ref={rowRef}
        className={cn('relative flex gap-4 bg-milk py-5 transition-transform duration-200', unavailable && 'opacity-60')}
        style={{ transform: dx ? `translateX(${dx}px)` : undefined, transitionDuration: dragging ? '0ms' : undefined }}
        onTouchStart={(e) => {
          start.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
          setDragging(true)
        }}
        onTouchMove={(e) => {
          if (!start.current) return
          const ddx = e.touches[0].clientX - start.current.x
          const ddy = e.touches[0].clientY - start.current.y
          if (Math.abs(ddx) > Math.abs(ddy)) setDx(Math.min(0, Math.max(-120, ddx)))
        }}
        onTouchEnd={() => {
          start.current = null
          setDragging(false)
          if (dx < -90) onRemove()
          setDx(0)
        }}
      >
        <div className="relative size-[88px] shrink-0 overflow-hidden rounded-[12px] bg-sand md:size-28">
          {image && <Image src={image} alt="" fill sizes="112px" className="object-cover" />}
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              {line.snapshot.slug ? (
                <TransitionLink href={{ pathname: '/furniture/[slug]', params: { slug: q?.slug ?? line.snapshot.slug } }} className="text-[16px] leading-snug font-semibold hover:underline">
                  {q?.title || line.snapshot.title}
                </TransitionLink>
              ) : (
                <span className="text-[16px] font-semibold">{q?.title || line.snapshot.title}</span>
              )}
              {(q?.variantLabel || line.snapshot.variantLabel) && <p className="t-small font-normal text-ink-soft">{q?.variantLabel || line.snapshot.variantLabel}</p>}
              {q && q.available && <p className="text-[13px] text-ink-soft">{q.inStock ? t('inStock') : t('leadTime', { min: q.leadTime[0], max: q.leadTime[1] })}</p>}
            </div>
            <div className="hidden text-right md:block">
              <p className="text-[13px] text-ink-soft">{t('unitPrice')}</p>
              <Price amount={unit} size="sm" />
            </div>
          </div>
          {q?.notes.map((n) => (
            <p key={n} role="status" className={cn('text-[13px] font-semibold', n === 'unavailable' || n === 'variant' ? 'text-error' : 'text-warning')}>
              {n === 'price' ? t('notePrice', { old: f.money(q.oldPrice ?? 0) }) : n === 'madeToOrder' ? t('noteMadeToOrder') : n === 'variant' ? t('noteVariant') : t('noteUnavailable')}
            </p>
          ))}
          <div className="mt-1 flex flex-wrap items-center justify-between gap-3">
            <QuantityStepper value={line.qty} onChange={onQty} size="sm" label={t('quantityOf', { title: line.snapshot.title })} disabled={unavailable} />
            <Price amount={unit * line.qty} size="md" rolling className={unavailable ? 'line-through' : ''} />
          </div>
          <div className="flex gap-1">
            <button type="button" onClick={onRemove} className="inline-flex min-h-11 items-center gap-1.5 px-1 text-[13px] font-semibold text-ink-soft hover:text-ink" aria-label={t('removeItem', { title: line.snapshot.title })}>
              <Trash2 aria-hidden className="size-4" strokeWidth={1.5} />
              <span className="hidden sm:inline">{t('remove')}</span>
            </button>
            <button type="button" onClick={onWishlist} className="inline-flex min-h-11 items-center gap-1.5 px-1 text-[13px] font-semibold text-ink-soft hover:text-ink">
              <Heart aria-hidden className="size-4" strokeWidth={1.5} />
              {t('toWishlistItem')}
            </button>
          </div>
        </div>
      </div>
    </li>
  )
}
