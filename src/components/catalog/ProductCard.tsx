'use client'

import Image from 'next/image'
import { ShoppingBag } from 'lucide-react'
import { useTranslations } from 'next-intl'
import type { ProductCard as Card } from '@/lib/catalog'
import { TransitionLink } from '@/components/motion/TransitionLink'
import { Brackets } from '@/components/shapes'
import { Badge } from '@/components/ui/Chip'
import { Price } from '@/components/ui/Price'
import { Swatch } from '@/components/ui/Swatch'
import { addCardToCart } from '@/components/cart/addToCart'
import { flyToCart } from '@/components/cart/flyToCart'
import { toast } from '@/components/ui/Toast'
import { WishlistButton } from './WishlistButton'
import { cn } from '@/lib/cn'

type Props = {
  product: Card
  /** компактная карточка для 2 колонок на мобайле: без свотчей */
  compact?: boolean
  priority?: boolean
  sizes?: string
  className?: string
  headingLevel?: 'h2' | 'h3'
}

/**
 * Карточка товара: фото 4:5 (второе фото на hover + уголки), чипы, сердечко, название,
 * коллекция, цена («от …»), до 5 свотчей. Вся карточка кликабельна (растянутая ссылка),
 * сердечко и «В корзину» — отдельные кнопки для клавиатуры.
 */
export function ProductCard({ product: p, compact, priority, sizes, className, headingLevel = 'h3' }: Props) {
  const t = useTranslations('catalog')
  const H = headingLevel
  const [main, second] = p.images
  const href = { pathname: '/furniture/[slug]' as const, params: { slug: p.slug } }

  return (
    <article className={cn('group relative flex flex-col', className)} data-product-card={p.id}>
      <div className="relative">
        <div className="relative aspect-[4/5] overflow-hidden rounded-card bg-sand" data-card-image>
          {main && (
            <Image
              src={main.src}
              alt={main.alt}
              fill
              sizes={sizes ?? '(min-width: 1280px) 30vw, (min-width: 768px) 33vw, 50vw'}
              placeholder="blur"
              blurDataURL={main.blur}
              priority={priority}
              className="object-cover transition-transform duration-[700ms] ease-soft group-hover:scale-[1.02]"
            />
          )}
          {second && (
            <Image
              src={second.src}
              alt=""
              aria-hidden
              fill
              sizes={sizes ?? '(min-width: 1280px) 30vw, (min-width: 768px) 33vw, 50vw'}
              className="object-cover opacity-0 transition-opacity duration-[400ms] ease-soft hover-device:group-hover:opacity-100"
            />
          )}
        </div>
        <Brackets inset={8} className="rounded-card" />
        <div className="pointer-events-none absolute top-3 left-3 z-10 flex max-w-[calc(100%-64px)] flex-wrap gap-1.5">
          {p.badges.map((b) => (
            <Badge key={b} tone={b === 'sale' ? 'blush' : b === 'new' ? 'lavender' : 'paper'}>
              {t(`badge.${b as 'new' | 'bestseller' | 'sale'}`)}
            </Badge>
          ))}
          {p.availability === 'in_stock' ? (
            <Badge tone="pistachio">{t('inStock')}</Badge>
          ) : (
            <Badge tone="paper">{t('madeToOrder', { min: p.leadTime[0], max: p.leadTime[1] })}</Badge>
          )}
        </div>
        <WishlistButton productId={p.id} title={p.title} className="absolute top-2 right-2" />
        {p.quickAdd && (
          <button
            type="button"
            onClick={(e) => {
              const img = e.currentTarget.closest('[data-product-card]')?.querySelector<HTMLElement>('[data-card-image]')
              flyToCart(img, p.images[0]?.src)
              addCardToCart(p)
              toast({ message: t('added', { title: p.title }), tone: 'success' })
            }}
            aria-label={t('quickAddLabel', { title: p.title })}
            className={cn(
              'absolute right-2 bottom-2 z-10 inline-flex h-11 items-center gap-2 rounded-pill bg-ink px-4 text-[14px] font-semibold text-milk',
              'transition-[opacity,transform] duration-200 ease-soft hover-device:translate-y-1 hover-device:opacity-0',
              'hover-device:group-hover:translate-y-0 hover-device:group-hover:opacity-100 focus-visible:translate-y-0 focus-visible:opacity-100',
            )}
          >
            <ShoppingBag aria-hidden className="size-4" strokeWidth={1.5} />
            <span className={compact ? 'sr-only sm:not-sr-only' : ''}>{t('quickAdd')}</span>
          </button>
        )}
      </div>

      <div className="mt-3 flex flex-col gap-1">
        <H className="text-[15px] leading-snug font-semibold md:text-[16px]">
          <TransitionLink href={href} className="after:absolute after:inset-0 after:rounded-card after:content-[''] focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-4 focus-visible:after:outline-lavender-600">
            {p.title}
          </TransitionLink>
        </H>
        {p.collection && !compact && <p className="t-small font-normal text-ink-soft">{t('collectionOf', { title: p.collection.title })}</p>}
        <Price amount={p.price} compareAt={p.compareAt} from={p.maxPrice > p.price} size="sm" />
        {!compact && p.swatches.length > 0 && (
          <div className="mt-1 flex items-center gap-1.5" aria-label={t('swatchesLabel')} role="list">
            {p.swatches.map((s) => (
              <span role="listitem" key={s.key}>
                <Swatch as="static" size="xs" label={s.title} color={s.color ?? undefined} image={s.image ?? undefined} />
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  )
}
