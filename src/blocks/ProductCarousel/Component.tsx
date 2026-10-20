import type { ProductCarouselBlock } from '@/payload-types'
import type { BlockContext } from '../types'
import { getCatalogIndex } from '@/lib/data/catalog'
import { ProductCarousel } from '@/components/catalog/ProductCarousel'

/** Карусель товаров: «Хиты и новинки» на главной, «Похожие товары» и «Дополните интерьер» на других */
export async function ProductCarouselBlockView({ block, context }: { block: ProductCarouselBlock; context: BlockContext }) {
  const index = await getCatalogIndex(context.locale)
  const self = context.productCard
  const limit = block.limit ?? 12
  let items = index
  switch (block.source) {
    case 'similar':
      items = index.filter((p) => p.id !== self?.id && p.category?.id === self?.category?.id)
      if (items.length < 4) items = [...items, ...index.filter((p) => p.id !== self?.id && !items.includes(p))]
      break
    case 'sameCollection':
      items = index.filter((p) => p.id !== self?.id && p.collection && p.collection.slug === (self?.collection?.slug ?? context.collection?.slug))
      break
    case 'category': {
      const id = typeof block.category === 'object' ? block.category?.id : block.category
      items = index.filter((p) => p.category?.id === id)
      break
    }
    case 'popular':
      items = [...index].sort((a, b) => b.popularity - a.popularity)
      break
    default:
      items = [...index].filter((p) => p.featured || p.badges.includes('new') || p.badges.includes('bestseller')).sort((a, b) => b.popularity - a.popularity)
  }
  items = items.slice(0, limit)
  if (!items.length) return null
  return <ProductCarousel heading={block.heading ?? ''} items={items} showFilters={Boolean(block.showFilters)} />
}
