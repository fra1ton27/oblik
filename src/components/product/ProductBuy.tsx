'use client'

import { MessageCircle, Package, Truck } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import type { ProductCard } from '@/lib/catalog'
import type { VariantDTO } from '@/lib/product'
import { Button } from '@/components/ui/Button'
import { Price } from '@/components/ui/Price'
import { QuantityStepper } from '@/components/ui/QuantityStepper'
import { Swatch } from '@/components/ui/Swatch'
import { Chip, Badge } from '@/components/ui/Chip'
import { Dialog } from '@/components/ui/Dialog'
import { toast } from '@/components/ui/Toast'
import { TransitionLink } from '@/components/motion/TransitionLink'
import { WishlistButton } from '@/components/catalog/WishlistButton'
import { addCardToCart } from '@/components/cart/addToCart'
import { flyToCart } from '@/components/cart/flyToCart'
import { DeferredCustomOrderForm, DeferredQuestionForm } from '@/components/forms/LazyForms'
import { StickyBuyBar } from './StickyBuyBar'
import { cn } from '@/lib/cn'

type Props = {
  card: ProductCard
  variants: VariantDTO[]
  basePrice: number
  compareAt: number | null
  shortDescription: string
  sku: string
  designer?: string | null
  collection?: { title: string; slug: string } | null
  breadcrumbs: React.ReactNode
  /** выбранный вариант меняет фото галереи */
  onVariantImage?: (sku: string | null) => void
}

type Axis = 'size' | 'fabric' | 'finish'

const keyOf = (v: VariantDTO, axis: Axis) => (axis === 'size' ? v.size : axis === 'fabric' ? v.fabric?.id : v.finish?.id) ?? null

/**
 * Липкая панель покупки: крошки, название, описание, цена, размер чипами, ткань/отделка свотчами
 * с названием, количество, «В корзину», сердечко, срок, «Нужен другой размер?».
 * Смена варианта меняет фото, цену, срок и ?variant= в URL.
 */
export function ProductBuy({ card, variants, basePrice, compareAt, shortDescription, sku, designer, collection, breadcrumbs, onVariantImage }: Props) {
  const t = useTranslations('product')
  const [selected, setSelected] = useState<VariantDTO | null>(variants[0] ?? null)
  const [qty, setQty] = useState(1)
  const [modal, setModal] = useState<null | 'custom' | 'question'>(null)
  const addRef = useRef<HTMLButtonElement>(null)

  const axes = useMemo(() => (['size', 'fabric', 'finish'] as Axis[]).filter((a) => variants.some((v) => keyOf(v, a) !== null)), [variants])

  // ?variant= из URL после гидрации (страница статическая)
  useEffect(() => {
    const sp = new URLSearchParams(window.location.search).get('variant')
    const found = sp ? variants.find((v) => v.sku === sp) : null
    // eslint-disable-next-line react-hooks/set-state-in-effect -- начальный вариант из адреса
    if (found) setSelected(found)
  }, [variants])

  function choose(axis: Axis, value: string | number) {
    if (!selected) return
    // ищем вариант с выбранным значением и теми же остальными опциями, иначе — первый с этим значением
    const exact = variants.find((v) => keyOf(v, axis) === value && axes.every((a) => a === axis || keyOf(v, a) === keyOf(selected, a)))
    const next = exact ?? variants.find((v) => keyOf(v, axis) === value) ?? selected
    setSelected(next)
    onVariantImage?.(next.image ? next.sku : null)
    const url = new URL(window.location.href)
    url.searchParams.set('variant', next.sku)
    window.history.replaceState(window.history.state, '', url)
  }

  const price = selected?.price ?? basePrice
  const inStock = selected ? selected.inStock : card.availability === 'in_stock'
  const lead = selected?.leadTime ?? card.leadTime

  function add() {
    const img = document.querySelector<HTMLElement>('[data-product-main-image]')
    flyToCart(img, card.images[0]?.src)
    addCardToCart(card, {
      qty,
      variantSku: selected?.sku ?? null,
      variantLabel: selected?.label ?? null,
      price,
      leadTime: inStock ? null : t('leadTimeLabel', { min: lead[0], max: lead[1] }),
    })
    toast({ message: t('added', { title: card.title }), tone: 'success' })
  }

  return (
    <div className="flex flex-col gap-6">
      {breadcrumbs}
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap gap-1.5">
          {card.badges.map((b) => (
            <Badge key={b} tone={b === 'sale' ? 'blush' : 'lavender'}>
              <BadgeLabel kind={b as 'new' | 'bestseller' | 'sale'} />
            </Badge>
          ))}
        </div>
        <h1 className="t-h2">{card.title}</h1>
        {shortDescription && <p className="t-lead text-ink-soft">{shortDescription}</p>}
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-[14px] text-ink-soft">
          {collection && (
            <TransitionLink href={{ pathname: '/collections/[slug]', params: { slug: collection.slug } }} className="underline underline-offset-4 hover:text-ink">
              {t('collectionLink', { title: collection.title })}
            </TransitionLink>
          )}
          {designer && <span>{t('designerBy', { name: designer })}</span>}
        </div>
      </div>

      <div aria-live="polite">
        <Price amount={price} compareAt={compareAt && compareAt > price ? compareAt : null} size="xl" rolling />
      </div>

      {axes.map((axis) => {
        const values = [...new Map(variants.map((v) => [keyOf(v, axis), v])).entries()].filter(([k]) => k !== null)
        const current = selected ? keyOf(selected, axis) : null
        const currentLabel = selected ? (axis === 'size' ? selected.size : axis === 'fabric' ? selected.fabric?.title : selected.finish?.title) : null
        return (
          <fieldset key={axis} className="flex flex-col gap-3">
            <legend className="t-small mb-3 flex gap-2">
              <span className="font-semibold">{t(axis)}</span>
              {currentLabel && <span className="font-normal text-ink-soft">{currentLabel}</span>}
            </legend>
            {axis === 'size' ? (
              <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={t(axis)}>
                {values.map(([k, v]) => (
                  <Chip key={String(k)} role="radio" aria-checked={current === k} selected={current === k} onClick={() => choose(axis, k!)}>
                    {v.size}
                  </Chip>
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap gap-1" role="radiogroup" aria-label={t(axis)}>
                {values.map(([k, v]) => {
                  const m = axis === 'fabric' ? v.fabric! : v.finish!
                  return <Swatch key={String(k)} name={`${card.id}-${axis}`} value={String(k)} label={m.title} color={m.color ?? undefined} image={m.image ?? undefined} selected={current === k} onSelect={() => choose(axis, k!)} />
                })}
              </div>
            )}
          </fieldset>
        )
      })}

      <div className="flex flex-wrap items-center gap-3">
        <QuantityStepper value={qty} onChange={setQty} label={t('quantity')} />
        <Button ref={addRef} size="lg" className="min-w-[200px] flex-1" onClick={add} data-add-to-cart>
          {t('addToCart')}
        </Button>
        <WishlistButton productId={card.id} title={card.title} size="md" tone="line" />
      </div>

      <ul className="flex flex-col gap-2 border-t border-line pt-4 text-[14px]">
        <li className={cn('flex items-center gap-2', inStock ? 'text-pistachio-700' : 'text-warning')}>
          <Package aria-hidden className="size-4 shrink-0" strokeWidth={1.5} />
          {inStock ? t('inStockNow') : t('leadTimeLabel', { min: lead[0], max: lead[1] })}
        </li>
        <li className="flex items-center gap-2 text-ink-soft">
          <Truck aria-hidden className="size-4 shrink-0" strokeWidth={1.5} />
          {t('deliveryNote')}
        </li>
        <li className="flex gap-2 text-ink-soft">
          <span>{t('sku')}</span>
          <span className="font-mono text-[13px]">{selected?.sku ?? sku}</span>
        </li>
      </ul>

      <div className="flex flex-wrap gap-x-6 gap-y-2">
        <button type="button" onClick={() => setModal('custom')} className="inline-flex min-h-11 items-center text-[15px] font-semibold text-lavender-600 underline underline-offset-4">
          {t('otherSize')}
        </button>
        <button type="button" onClick={() => setModal('question')} className="inline-flex min-h-11 items-center gap-2 text-[15px] font-semibold underline underline-offset-4">
          <MessageCircle aria-hidden className="size-4" strokeWidth={1.5} />
          {t('askQuestion')}
        </button>
      </div>

      <StickyBuyBar target={addRef} card={card} variantLabel={selected?.label ?? ''} price={price} onAdd={add} />

      <Dialog open={modal === 'custom'} onClose={() => setModal(null)} title={t('otherSize')} width={560}>
        <DeferredCustomOrderForm open={modal === 'custom'} product={{ id: card.id, title: card.title }} />
      </Dialog>
      <Dialog open={modal === 'question'} onClose={() => setModal(null)} title={t('askQuestion')} variant="modal">
        <DeferredQuestionForm open={modal === 'question'} product={{ id: card.id, title: card.title }} variantSku={selected?.sku} variantLabel={selected?.label} />
      </Dialog>
    </div>
  )
}

function BadgeLabel({ kind }: { kind: 'new' | 'bestseller' | 'sale' }) {
  const t = useTranslations('catalog')
  return <>{t(`badge.${kind}`)}</>
}
