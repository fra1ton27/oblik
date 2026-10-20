'use client'

import type { ProductCard } from '@/lib/catalog'
import { useCart } from './store'

type Options = {
  qty?: number
  variantSku?: string | null
  variantLabel?: string | null
  price?: number
  image?: string | null
  leadTime?: string | null
  inStock?: boolean
  /** не открывать мини-корзину (например, при добавлении комплекта по частям) */
  silent?: boolean
}

/** Добавление в корзину из карточки, витрины или посадочной: снимок для показа, цену пересчитает сервер */
export function addCardToCart(card: ProductCard, opts: Options = {}) {
  const variantSku = opts.variantSku !== undefined ? opts.variantSku : (card.quickAdd?.sku ?? null)
  useCart.getState().add({
    productId: card.id,
    variantSku,
    qty: opts.qty ?? 1,
    snapshot: {
      title: card.title,
      variantLabel: opts.variantLabel ?? card.quickAdd?.label ?? null,
      price: opts.price ?? card.quickAdd?.price ?? card.price,
      image: opts.image ?? card.images[0]?.src ?? card.cutout?.src ?? null,
      slug: card.slug,
      collectionTitle: card.collection?.title ?? null,
      leadTime: opts.leadTime ?? null,
      inStock: opts.inStock ?? card.availability === 'in_stock',
    },
  })
  if (!opts.silent) useCart.getState().openMiniCart()
}
