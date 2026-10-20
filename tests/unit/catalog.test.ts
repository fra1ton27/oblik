import { describe, expect, it } from 'vitest'
import { applyFilters, facetCounts, filtersToQuery, hasActiveFilters, paginate, parseFilters, sortProducts, type ProductCard } from '@/lib/catalog'

function card(partial: Partial<ProductCard> & { id: number }): ProductCard {
  return {
    slug: `p-${partial.id}`,
    title: `P${partial.id}`,
    collection: null,
    category: { id: 1, slug: 'sofas', title: 'Sofas' },
    designer: null,
    price: 100000,
    maxPrice: 100000,
    compareAt: null,
    images: [],
    cutout: null,
    podiumColor: 'lavender',
    badges: [],
    availability: 'made_to_order',
    leadTime: [4, 6],
    materialKeys: [],
    colors: [],
    width: 200,
    popularity: 0,
    createdAt: '2026-01-01T00:00:00Z',
    featured: false,
    quickAdd: null,
    swatches: [],
    facts: { materials: [], dimensions: {}, leadTime: [4, 6] },
    ...partial,
  }
}

const items = [
  card({ id: 1, price: 50000, maxPrice: 60000, materialKeys: ['oak'], availability: 'in_stock', popularity: 5, createdAt: '2026-03-01T00:00:00Z' }),
  card({ id: 2, price: 150000, maxPrice: 200000, materialKeys: ['walnut', 'fabric'], popularity: 9, category: { id: 2, slug: 'tables', title: 'Tables' } }),
  card({ id: 3, price: 250000, maxPrice: 250000, materialKeys: ['oak', 'stone'], availability: 'in_stock', popularity: 1, width: 90 }),
]

describe('каталог: URL ⇄ фильтры', () => {
  it('разбирает query и отбрасывает мусор', () => {
    const f = parseFilters({ material: 'oak,plastic', price: '500-2000', sort: 'new', page: '2', availability: 'in_stock' })
    expect(f.material).toEqual(['oak'])
    expect(f.price).toEqual([500, 2000])
    expect(f.sort).toBe('new')
    expect(f.page).toBe(2)
    expect(hasActiveFilters(f)).toBe(true)
    expect(parseFilters({ sort: 'bogus' }).sort).toBe('popular')
  })

  it('собирает query обратно в стабильном порядке', () => {
    const f = parseFilters({ material: 'oak', price: '500-2000', sort: 'new', page: '2' })
    expect(filtersToQuery(f)).toEqual({ material: 'oak', price: '500-2000', sort: 'new', page: '2' })
  })
})

describe('каталог: фильтрация, фасеты, сортировка', () => {
  it('фильтрует по материалу, цене и наличию', () => {
    expect(applyFilters(items, parseFilters({ material: 'oak' })).map((p) => p.id)).toEqual([1, 3])
    expect(applyFilters(items, parseFilters({ price: '0-1000' })).map((p) => p.id)).toEqual([1])
    expect(applyFilters(items, parseFilters({ availability: 'in_stock', material: 'stone' })).map((p) => p.id)).toEqual([3])
  })

  it('фасет считает с учётом остальных фильтров, но не своего', () => {
    const f = parseFilters({ material: 'oak', availability: 'in_stock' })
    const counts = facetCounts(items, f)
    expect(counts.material).toEqual({ oak: 2, stone: 1 })
    expect(counts.availability).toEqual({ in_stock: 2 })
    expect(counts.priceBounds).toEqual([500, 2500])
  })

  it('сортирует по популярности, новизне и цене', () => {
    expect(sortProducts(items, 'popular').map((p) => p.id)).toEqual([2, 1, 3])
    expect(sortProducts(items, 'new')[0].id).toBe(1)
    expect(sortProducts(items, 'price_desc').map((p) => p.id)).toEqual([3, 2, 1])
  })

  it('пагинирует и не выходит за границы', () => {
    const r = paginate([1, 2, 3, 4, 5], 9, 2)
    expect(r).toMatchObject({ page: 3, totalPages: 3, total: 5, items: [5] })
  })
})
