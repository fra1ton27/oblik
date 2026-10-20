import { getTranslations } from 'next-intl/server'
import type { BundleBuilderBlock } from '@/payload-types'
import type { BlockContext } from '../types'
import { getCatalogIndex, getCollections } from '@/lib/data/catalog'
import { BundleBuilder } from './BundleBuilder'

/** «Соберите комплект»: товары той же коллекции с чекбоксами, суммой и скидкой комплекта */
export async function BundleBuilderBlockView({ block, context }: { block: BundleBuilderBlock; context: BlockContext }) {
  const t = await getTranslations('product')
  const self = context.productCard
  const slug = self?.collection?.slug ?? context.collection?.slug
  if (!slug) return null
  const collection = (await getCollections(context.locale)).find((c) => c.slug === slug)
  if (!collection) return null
  const index = await getCatalogIndex(context.locale)
  const items = collection.products.length ? collection.products : index.filter((p) => p.collection?.slug === slug)
  if (items.length < 2) return null
  return (
    <BundleBuilder
      heading={block.heading || t('bundleHeading')}
      lead={block.lead || t('bundleLead', { collection: collection.title })}
      items={items}
      selfId={self?.id ?? null}
      discount={collection.isBundle ? collection.discount : 0}
      bundleIds={collection.isBundle ? collection.products.map((p) => p.id) : []}
    />
  )
}
