/**
 * Фильтры, сортировка, фасеты и пагинация каталога — чистые функции (тестируются юнитами).
 * Состояние живёт в URL: ?material=oak&price=500-2000&sort=new&page=2
 */
import type { ImageDTO } from './media'

export type Availability = 'in_stock' | 'made_to_order'

export type CardSwatch = { key: string; title: string; color: string | null; image: string | null }

export type ProductCard = {
  id: number
  slug: string
  title: string
  collection: { title: string; slug: string } | null
  category: { id: number; slug: string; title: string } | null
  designer: { key: string; name: string } | null
  price: number
  maxPrice: number
  compareAt: number | null
  images: ImageDTO[]
  cutout: ImageDTO | null
  podiumColor: string
  badges: string[]
  availability: Availability
  leadTime: [number, number]
  materialKeys: string[]
  colors: string[]
  width: number | null
  popularity: number
  createdAt: string
  featured: boolean
  quickAdd: { sku: string | null; label: string; price: number } | null
  swatches: CardSwatch[]
  facts: { collection?: string; designer?: string; materials: string[]; dimensions: { width?: number | null; depth?: number | null; height?: number | null }; leadTime: [number, number] }
}

export const SORTS = ['popular', 'new', 'price_asc', 'price_desc'] as const
export type Sort = (typeof SORTS)[number]

export const MATERIAL_FILTERS = ['oak', 'walnut', 'ash', 'metal', 'stone', 'fabric'] as const
export const COLOR_FILTERS = ['milk', 'sand', 'oak', 'walnut', 'graphite', 'green', 'blue', 'terracotta', 'lavender'] as const

/** Цвета свотчей для фильтра цвета (данные о материалах, а не токены интерфейса) */
export const colorSwatches: Record<string, string> = {
  milk: '#F3EEE6',
  sand: '#E8DCC8',
  oak: '#C9A77C',
  walnut: '#6E4B3A',
  graphite: '#3B3740',
  green: '#9DAA8B',
  blue: '#AFC7D6',
  terracotta: '#C98A6B',
  lavender: '#D6CCF3',
}

export type Filters = {
  category?: string
  collection: string[]
  material: string[]
  color: string[]
  availability: Availability[]
  designer: string[]
  price?: [number, number]
  width?: [number, number]
  sort: Sort
  page: number
  view?: 'showcase' | 'grid'
  cols?: 1 | 2
}

type Params = Record<string, string | string[] | undefined>

function list(v: string | string[] | undefined): string[] {
  if (!v) return []
  return (Array.isArray(v) ? v : v.split(','))
    .flatMap((x) => x.split(','))
    .map((x) => x.trim())
    .filter(Boolean)
}

function range(v: string | string[] | undefined): [number, number] | undefined {
  const raw = Array.isArray(v) ? v[0] : v
  const m = /^(\d+)-(\d+)$/.exec(raw ?? '')
  if (!m) return undefined
  const a = Number(m[1])
  const b = Number(m[2])
  return a <= b ? [a, b] : [b, a]
}

export function parseFilters(params: Params): Filters {
  const sort = (Array.isArray(params.sort) ? params.sort[0] : params.sort) as Sort
  const page = Number(Array.isArray(params.page) ? params.page[0] : params.page)
  const view = Array.isArray(params.view) ? params.view[0] : params.view
  const cols = Number(Array.isArray(params.cols) ? params.cols[0] : params.cols)
  return {
    category: (Array.isArray(params.category) ? params.category[0] : params.category) || undefined,
    collection: list(params.collection),
    material: list(params.material).filter((m) => (MATERIAL_FILTERS as readonly string[]).includes(m)),
    color: list(params.color).filter((c) => (COLOR_FILTERS as readonly string[]).includes(c)),
    availability: list(params.availability).filter((a): a is Availability => a === 'in_stock' || a === 'made_to_order'),
    designer: list(params.designer),
    // цена в URL — в евро, в данных — в центах
    price: range(params.price),
    width: range(params.width),
    sort: (SORTS as readonly string[]).includes(sort) ? sort : 'popular',
    page: Number.isFinite(page) && page > 1 ? Math.floor(page) : 1,
    view: view === 'showcase' || view === 'grid' ? view : undefined,
    cols: cols === 1 ? 1 : cols === 2 ? 2 : undefined,
  }
}

/** Активен ли хоть один фильтр (тогда каталог по умолчанию — сетка, а canonical без query) */
export function hasActiveFilters(f: Filters): boolean {
  return Boolean(
    f.collection.length || f.material.length || f.color.length || f.availability.length || f.designer.length || f.price || f.width,
  )
}

export function activeFilterCount(f: Filters): number {
  return f.collection.length + f.material.length + f.color.length + f.availability.length + f.designer.length + (f.price ? 1 : 0) + (f.width ? 1 : 0)
}

/** Обратно в query (стабильный порядок ключей — чтобы ссылкой можно было поделиться) */
export function filtersToQuery(f: Partial<Filters>, extra: Record<string, string | undefined> = {}): Record<string, string> {
  const q: Record<string, string> = {}
  if (f.collection?.length) q.collection = f.collection.join(',')
  if (f.material?.length) q.material = f.material.join(',')
  if (f.color?.length) q.color = f.color.join(',')
  if (f.availability?.length) q.availability = f.availability.join(',')
  if (f.designer?.length) q.designer = f.designer.join(',')
  if (f.price) q.price = `${f.price[0]}-${f.price[1]}`
  if (f.width) q.width = `${f.width[0]}-${f.width[1]}`
  if (f.sort && f.sort !== 'popular') q.sort = f.sort
  if (f.view) q.view = f.view
  if (f.cols) q.cols = String(f.cols)
  if (f.page && f.page > 1) q.page = String(f.page)
  for (const [k, v] of Object.entries(extra)) if (v) q[k] = v
  return q
}

type Facet = 'category' | 'collection' | 'material' | 'color' | 'availability' | 'designer' | 'price' | 'width'

function matches(p: ProductCard, f: Filters, skip?: Facet): boolean {
  if (skip !== 'category' && f.category && p.category?.slug !== f.category) return false
  if (skip !== 'collection' && f.collection.length && !f.collection.includes(p.collection?.slug ?? '')) return false
  if (skip !== 'material' && f.material.length && !f.material.some((m) => p.materialKeys.includes(m))) return false
  if (skip !== 'color' && f.color.length && !f.color.some((c) => p.colors.includes(c))) return false
  if (skip !== 'availability' && f.availability.length && !f.availability.includes(p.availability)) return false
  if (skip !== 'designer' && f.designer.length && !f.designer.includes(p.designer?.key ?? '')) return false
  if (skip !== 'price' && f.price) {
    const lo = f.price[0] * 100
    const hi = f.price[1] * 100
    if (p.maxPrice < lo || p.price > hi) return false
  }
  if (skip !== 'width' && f.width && p.width !== null && (p.width < f.width[0] || p.width > f.width[1])) return false
  return true
}

export function applyFilters(items: ProductCard[], f: Filters): ProductCard[] {
  return items.filter((p) => matches(p, f))
}

export function sortProducts(items: ProductCard[], sort: Sort): ProductCard[] {
  const arr = [...items]
  switch (sort) {
    case 'new':
      return arr.sort((a, b) => b.createdAt.localeCompare(a.createdAt) || b.popularity - a.popularity)
    case 'price_asc':
      return arr.sort((a, b) => a.price - b.price)
    case 'price_desc':
      return arr.sort((a, b) => b.price - a.price)
    default:
      return arr.sort((a, b) => b.popularity - a.popularity)
  }
}

export type FacetCounts = {
  category: Record<string, number>
  collection: Record<string, number>
  material: Record<string, number>
  color: Record<string, number>
  availability: Record<string, number>
  designer: Record<string, number>
  priceBounds: [number, number]
  widthBounds: [number, number]
}

/**
 * Счётчики для каждого значения фильтра: считаются с учётом всех ОСТАЛЬНЫХ активных фильтров,
 * поэтому нулевые значения можно сделать неактивными.
 */
export function facetCounts(items: ProductCard[], f: Filters): FacetCounts {
  const count = (facet: Facet, keys: (p: ProductCard) => string[]) => {
    const out: Record<string, number> = {}
    for (const p of items) {
      if (!matches(p, f, facet)) continue
      for (const k of new Set(keys(p))) out[k] = (out[k] ?? 0) + 1
    }
    return out
  }
  const prices = items.flatMap((p) => [p.price, p.maxPrice])
  const widths = items.map((p) => p.width).filter((w): w is number => typeof w === 'number')
  return {
    category: count('category', (p) => (p.category ? [p.category.slug] : [])),
    collection: count('collection', (p) => (p.collection ? [p.collection.slug] : [])),
    material: count('material', (p) => p.materialKeys),
    color: count('color', (p) => p.colors),
    availability: count('availability', (p) => [p.availability]),
    designer: count('designer', (p) => (p.designer ? [p.designer.key] : [])),
    priceBounds: prices.length ? [Math.floor(Math.min(...prices) / 100), Math.ceil(Math.max(...prices) / 100)] : [0, 0],
    widthBounds: widths.length ? [Math.min(...widths), Math.max(...widths)] : [0, 0],
  }
}

export function paginate<T>(items: T[], page: number, perPage: number) {
  const totalPages = Math.max(1, Math.ceil(items.length / perPage))
  const current = Math.min(Math.max(1, page), totalPages)
  return { items: items.slice((current - 1) * perPage, current * perPage), page: current, totalPages, total: items.length }
}
