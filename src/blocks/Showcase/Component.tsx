import type { ShowcaseBlock } from '@/payload-types'
import type { BlockContext } from '../types'
import { getCatalogIndex, getCollections } from '@/lib/data/catalog'
import { getReviews } from '@/lib/data/globals'
import { Showcase } from '@/components/catalog/showcase/Showcase'
import { bundleItems, productItems } from '@/components/catalog/showcase/items'
import type { ShowcaseItem } from '@/components/catalog/showcase/types'

/** Блок «Витрина»: комплекты на главной, товары коллекции на её посадочной, избранное каталога */
export async function ShowcaseBlockView({ block, context }: { block: ShowcaseBlock; context: BlockContext }) {
  const { locale } = context
  let items: ShowcaseItem[] = []
  if (block.source === 'bundles') {
    const bundles = (await getCollections(locale)).filter((c) => c.isBundle && c.products.length)
    items = await bundleItems(bundles, locale)
  } else if (block.source === 'collection') {
    const id = typeof block.collection === 'object' ? block.collection?.id : block.collection
    const collection = context.collection ?? (await getCollections(locale)).find((c) => c.id === id)
    items = await productItems(collection?.products ?? [], locale)
  } else {
    items = await productItems((await getCatalogIndex(locale)).filter((p) => p.featured), locale)
  }
  if (!items.length) return null
  const reviews = (await getReviews(locale)).slice(0, 2).map((r) => ({ text: r.text, author: `${r.author}, ${r.city}`, rating: r.rating }))
  return <Showcase heading={block.heading ?? ''} lead={block.lead ?? ''} items={items} quotes={reviews} className="mt-section" />
}
