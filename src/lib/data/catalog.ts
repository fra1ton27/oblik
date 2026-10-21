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

/** Полный товар для посадочной (варианты с материалами, дизайнер, коллекция, фото) */
export const getProductBySlug = (slug: string, locale: Locale) =>
  unstable_cache(
    async (): Promise<Product | null> => {
      const payload = await getPayloadClient()
      const res = await payload.find({
        collection: 'products',
        where: { and: [{ slug: { equals: slug } }, { status: { equals: 'published' } }] },
        locale,
        depth: 2,
        limit: 1,
        overrideAccess: false,
      })
      return (res.docs[0] as Product | undefined) ?? null
    },
    ['product', locale, slug],
    { tags: catalogTags },
  )()

/** Все локализованные слаги опубликованных товаров — для generateStaticParams и sitemap */
export const getAllProductSlugs = () =>
  unstable_cache(
    async (): Promise<Array<{ id: number; slug: Partial<Record<Locale, string>>; updatedAt: string }>> => {
      const payload = await getPayloadClient()
      const res = await payload.find({
        collection: 'products',
        where: { status: { equals: 'published' } },
        locale: 'all',
        depth: 0,
        limit: 1000,
        pagination: false,
        select: { slug: true, updatedAt: true } as never,
      })
      return (res.docs as unknown as Array<{ id: number; slug: Partial<Record<Locale, string>>; updatedAt: string }>).map((d) => ({ id: d.id, slug: d.slug ?? {}, updatedAt: d.updatedAt }))
    },
    ['product-slugs'],
    { tags: catalogTags },
  )()

export type DesignerDTO = { id: number; name: string; role: string; bio: string; photo: ImageDTO | null }

/** Дизайнеры для страницы «О нас» (раздел 6.2 ТЗ: команда) */
export const getDesigners = (locale: Locale) =>
  unstable_cache(
    async (): Promise<DesignerDTO[]> => {
      const payload = await getPayloadClient()
      const res = await payload.find({ collection: 'designers', locale, depth: 1, limit: 50, sort: 'createdAt', overrideAccess: false })
      return res.docs.map((d) => ({ id: d.id, name: d.name, role: d.role ?? '', bio: d.bio ?? '', photo: toImage(d.photo, 'card', d.name) }))
    },
    ['designers', locale],
    { tags: [tags.designers] },
  )()

/** Локализованные слаги категорий или коллекций — для sitemap */
export const getLocalizedSlugs = (collection: 'categories' | 'collections') =>
  unstable_cache(
    async (): Promise<Array<{ id: number; slug: Partial<Record<Locale, string>>; updatedAt: string }>> => {
      const payload = await getPayloadClient()
      const res = await payload.find({
        collection,
        // у коллекций есть статус: черновики в sitemap не попадают
        ...(collection === 'collections' ? { where: { status: { equals: 'published' } } } : {}),
        locale: 'all',
        depth: 0,
        limit: 1000,
        pagination: false,
        select: { slug: true, updatedAt: true } as never,
      })
      return (res.docs as unknown as Array<{ id: number; slug: Partial<Record<Locale, string>>; updatedAt: string }>).map((d) => ({ id: d.id, slug: d.slug ?? {}, updatedAt: d.updatedAt }))
    },
    ['localized-slugs', collection],
    { tags: catalogTags },
  )()

/**
 * Слаг из другого языка (ссылка переключателя до гидратации, чужая ссылка из мессенджера):
 * ищем запись по слагу в остальных локалях и возвращаем её слаг на нужном языке.
 */
export const findSlugInOtherLocales = (collection: 'products' | 'categories' | 'collections', slug: string, target: Locale) =>
  unstable_cache(
    async (): Promise<string | null> => {
      const payload = await getPayloadClient()
      for (const l of ['ru', 'en', 'sr'] as const) {
        if (l === target) continue
        const res = await payload.find({ collection, where: { slug: { equals: slug } }, locale: l, depth: 0, limit: 1, select: { slug: true } as never })
        const doc = res.docs[0] as { id: number } | undefined
        if (doc) return (await getSlugsById(collection, doc.id))[target] ?? null
      }
      return null
    },
    ['slug-other-locale', collection, slug, target],
    { tags: catalogTags },
  )()
