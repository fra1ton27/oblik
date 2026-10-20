'use client'

import { useMemo, useState } from 'react'
import type { ProductCard } from '@/lib/catalog'
import type { VariantDTO } from '@/lib/product'
import { Gallery, type GalleryImage } from './Gallery'
import { ProductBuy } from './ProductBuy'

type Props = {
  card: ProductCard
  images: GalleryImage[]
  variants: VariantDTO[]
  basePrice: number
  compareAt: number | null
  shortDescription: string
  sku: string
  designer?: string | null
  collection?: { title: string; slug: string } | null
  breadcrumbs: React.ReactNode
}

/**
 * Блок «Покупка» (фиксированный): десктоп — галерея скроллом слева, липкая панель справа;
 * мобайл — галерея на всю ширину со свайпом, под ней название, цена и варианты.
 */
export function ProductHero({ card, images, variants, ...rest }: Props) {
  const [variantSku, setVariantSku] = useState<string | null>(null)
  const gallery = useMemo(() => {
    const v = variants.find((x) => x.sku === variantSku)
    return v?.image ? [{ main: v.image, full: v.image }, ...images] : images
  }, [variantSku, variants, images])

  return (
    <section className="container-site grid gap-8 pt-4 md:grid-cols-12 md:gap-10 md:pt-8">
      <div className="md:col-span-7 xl:col-span-7" data-product-main-image>
        <Gallery images={gallery} title={card.title} sharedKey={`p-${card.id}`} />
      </div>
      <div className="md:col-span-5 xl:col-span-5">
        <div className="md:sticky md:top-[calc(var(--header-h)+24px)]">
          <ProductBuy card={card} variants={variants} onVariantImage={setVariantSku} {...rest} />
        </div>
      </div>
    </section>
  )
}
