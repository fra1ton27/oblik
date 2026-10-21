'use client'

import { useLocale, useTranslations } from 'next-intl'
import { useEffect, useMemo, useState } from 'react'
import { getWishlistCards } from '@/lib/actions/account'
import type { ProductCard as Card } from '@/lib/catalog'
import { ProductCard } from '@/components/catalog/ProductCard'
import { ProductCardSkeleton } from '@/components/ui/Skeleton'
import { EmptyState } from '@/components/ui/EmptyState'
import { buttonClasses } from '@/components/ui/Button'
import { TransitionLink } from '@/components/motion/TransitionLink'
import { useIsClient } from '@/components/motion/useIsClient'
import { useWishlist } from './wishlistStore'
import { useSession } from './sessionStore'

/**
 * Избранное: у гостя из localStorage, у вошедшего то же хранилище синхронизировано с кабинетом.
 * Карточки догружаются только для новых id; удаление сердечком убирает карточку сразу.
 */
export function WishlistView({ guestNote = false, headingLevel = 'h2' }: { guestNote?: boolean; headingLevel?: 'h2' | 'h3' }) {
  const t = useTranslations('account')
  const locale = useLocale()
  const isClient = useIsClient()
  const ids = useWishlist((s) => s.ids)
  const customer = useSession((s) => s.customer)
  const [cards, setCards] = useState<Card[] | null>(null)
  const missing = useMemo(() => ids.filter((id) => !cards?.some((c) => String(c.id) === String(id))), [ids, cards])
  const needsLoad = isClient && (cards === null || missing.length > 0)
  const idsKey = ids.join(',')

  useEffect(() => {
    if (!needsLoad) return
    let cancelled = false
    getWishlistCards(idsKey ? idsKey.split(',') : [], locale)
      .then((res) => !cancelled && setCards(res))
      .catch(() => !cancelled && setCards((prev) => prev ?? []))
    return () => {
      cancelled = true
    }
  }, [needsLoad, idsKey, locale])

  const visible = (cards ?? []).filter((c) => ids.some((id) => String(id) === String(c.id)))

  if (!isClient || cards === null) {
    return (
      <ul className="grid grid-cols-2 gap-x-4 gap-y-10 md:gap-x-6 lg:grid-cols-3" aria-busy>
        {Array.from({ length: Math.min(6, Math.max(3, ids.length)) }, (_, i) => (
          <li key={i}>
            <ProductCardSkeleton />
          </li>
        ))}
      </ul>
    )
  }

  if (!visible.length) {
    return (
      <EmptyState
        headingLevel={headingLevel}
        title={t('wishlistEmpty')}
        text={t('wishlistEmptyText')}
        color="blush"
        actions={
          <TransitionLink href="/catalog" className={buttonClasses()}>
            {t('toCatalog')}
          </TransitionLink>
        }
      />
    )
  }

  return (
    <div className="flex flex-col gap-8">
      {guestNote && !customer && (
        <p className="flex flex-wrap items-center gap-x-3 gap-y-2 rounded-card bg-mist p-4 text-[14px] font-semibold">
          <span>{t('wishlistGuestNote')}</span>
          <TransitionLink href={{ pathname: '/login', query: { returnTo: '/wishlist' } }} className="underline underline-offset-4">
            {t('wishlistLogin')}
          </TransitionLink>
        </p>
      )}
      <ul className="grid grid-cols-2 gap-x-4 gap-y-10 md:gap-x-6 lg:grid-cols-3">
        {visible.map((c) => (
          <li key={c.id}>
            <ProductCard product={c} compact headingLevel="h3" sizes="(min-width: 1024px) 30vw, 50vw" />
          </li>
        ))}
      </ul>
    </div>
  )
}
