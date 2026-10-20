import 'server-only'
import { unstable_cache } from 'next/cache'
import type { Category, Collection, Product } from '@/payload-types'
import type { Locale } from '@/i18n/routing'
import { getPayloadClient } from '@/lib/payload'
import { tags } from '@/lib/revalidate'
import { toCard } from '@/lib/product'
import { toImage, type ImageDTO } from '@/lib/media'
import type { ProductCard } from '@/lib/catalog'
import { bundleTotals } from '@/lib/pricing'

const catalogTags = [tags.products, tags.categories, tags.collections, tags.materials, tags.designers]

/**
 * Индекс каталога: лёгкие карточки всех опубликованных товаров. Фильтры, фасеты и сортировка
 * считаются на сервере по этому индексу; кэш сбрасывается хуками Payload (revalidateTag).
 * TODO(spec): при тысячах товаров перенести фильтрацию в SQL-запросы Payload.
 */
export const getCatalogIndex = (locale: Locale) =>
  unstable_cache(
    async (): Promise<ProductCard[]> => {
      const payload = await getPayloadClient()
      const res = await payload.find({
        collection: 'products',
        where: { status: { equals: 'published' } },
        locale,
        depth: 2,
        limit: 1000,
        pagination: false,
        overrideAccess: false,
      })
      return (res.docs as Product[]).map(toCard)
    },
    ['catalog-index', locale],
    { tags: catalogTags },
  )()

export type CategoryDTO = {
  id: number
  slug: string
  title: string
  description: string
  chips: string[]
  image: ImageDTO | null
  color: string
  count: number
}

export const getCategories = (locale: Locale) =>
  unstable_cache(
    async (): Promise<CategoryDTO[]> => {
      const payload = await getPayloadClient()
      const [res, index] = await Promise.all([
        payload.find({ collection: 'categories', locale, depth: 1, limit: 100, sort: 'order', pagination: false }),
        getCatalogIndex(locale),
      ])
      return (res.docs as Category[]).map((c) => ({
        id: c.id,
        slug: c.slug ?? String(c.id),
        title: c.title,
        description: c.description ?? '',
        chips: (c.chips ?? []).map((x) => x.label ?? '').filter(Boolean),
        image: toImage(c.image, 'card', c.title),
        color: c.color ?? 'lavender',
        count: index.filter((p) => p.category?.id === c.id).length,
      }))
    },
    ['categories', locale],
    { tags: catalogTags },
  )()

export type CollectionDTO = {
  id: number
  slug: string
  title: string
  tagline: string
  room: string
  story: string
  hero: ImageDTO | null
  heroLarge: ImageDTO | null
  cutout: ImageDTO | null
  gallery: ImageDTO[]
  podiumColor: string
  isBundle: boolean
  discount: number
  products: ProductCard[]
  totals: ReturnType<typeof bundleTotals>
  layout: Collection['layout']
  meta: Collection['meta']
}

function toCollection(c: Collection, index: ProductCard[]): CollectionDTO {
  const ids = (c.products ?? []).map((p) => (typeof p === 'object' ? p.id : p))
  const products = ids.map((id) => index.find((p) => p.id === id)).filter((p): p is ProductCard => Boolean(p))
  const discount = c.isBundle ? (c.bundleDiscount ?? 0) : 0
  return {
    id: c.id,
    slug: c.slug ?? String(c.id),
    title: c.title,
    tagline: c.tagline ?? '',
    room: c.room ?? '',
    story: c.story ?? '',
    hero: toImage(c.hero, 'hero', c.title),
    heroLarge: toImage(c.hero, 'full', c.title),
    cutout: toImage(c.cutout, 'card', c.title),
    gallery: (c.gallery ?? []).map((m) => toImage(m, 'hero')).filter((x): x is ImageDTO => Boolean(x)),
    podiumColor: c.podiumColor ?? 'blush',
    isBundle: Boolean(c.isBundle),
    discount,
    products,
    totals: bundleTotals(products.map((p) => p.price), discount),
    layout: c.layout,
    meta: c.meta,
  }
}

export const getCollections = (locale: Locale) =>
  unstable_cache(
    async (): Promise<CollectionDTO[]> => {
      const payload = await getPayloadClient()
      const [res, index] = await Promise.all([
        payload.find({ collection: 'collections', where: { status: { equals: 'published' } }, locale, depth: 1, limit: 100, sort: 'order', pagination: false }),
        getCatalogIndex(locale),
      ])
      return (res.docs as Collection[]).map((c) => toCollection(c, index))
    },
    ['collections', locale],
    { tags: catalogTags },
  )()

export async function getCollectionBySlug(slug: string, locale: Locale) {
  return (await getCollections(locale)).find((c) => c.slug === slug) ?? null
}

export async function getCategoryBySlug(slug: string, locale: Locale) {
  return (await getCategories(locale)).find((c) => c.slug === slug) ?? null
}

/** Слаги одной сущности на всех языках — для переключателя языка и hreflang */
export const getSlugsById = (collection: 'products' | 'categories' | 'collections', id: number) =>
  unstable_cache(
    async (): Promise<Partial<Record<Locale, string>>> => {
      const payload = await getPayloadClient()
      const doc = (await payload.findByID({ collection, id, locale: 'all', depth: 0, select: { slug: true } as never })) as unknown as {
        slug?: Partial<Record<Locale, string>>
      }
      return doc.slug ?? {}
    },
    ['slugs', collection, String(id)],
    { tags: catalogTags },
  )()
