'use server'

import { isLocale } from '@/i18n/routing'
import { applyFilters, paginate, parseFilters, sortProducts, type ProductCard } from '@/lib/catalog'
import { getCatalogIndex } from '@/lib/data/catalog'
import { site } from '@/config/site'

type Query = Record<string, string>

/** Живой счётчик в панели фильтров: сколько товаров покажет выбранный набор */
export async function countCatalog(locale: string, query: Query, category?: string): Promise<number> {
  const index = await getCatalogIndex(isLocale(locale) ? locale : 'ru')
  return applyFilters(index, { ...parseFilters(query), category }).length
}

/** «Показать ещё»: следующая страница результатов */
export async function loadCatalogPage(locale: string, query: Query, category: string | undefined, page: number): Promise<{ items: ProductCard[]; hasMore: boolean }> {
  const index = await getCatalogIndex(isLocale(locale) ? locale : 'ru')
  const f = { ...parseFilters(query), category }
  const res = paginate(sortProducts(applyFilters(index, f), f.sort), page, site.itemsPerPage)
  return { items: res.page === page ? res.items : [], hasMore: res.page < res.totalPages }
}
