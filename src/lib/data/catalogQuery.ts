import 'server-only'
import type { Locale } from '@/i18n/routing'
import { site } from '@/config/site'
import { applyFilters, facetCounts, paginate, sortProducts, type Filters } from '@/lib/catalog'
import { getCatalogIndex } from './catalog'

/** Результат каталога для query: фильтрация, фасеты, сортировка, страница — всё на сервере */
export async function queryCatalog(locale: Locale, filters: Filters) {
  const index = await getCatalogIndex(locale)
  const facets = facetCounts(index, filters)
  const filtered = sortProducts(applyFilters(index, filters), filters.sort)
  const page = paginate(filtered, filters.page, site.itemsPerPage)
  return { ...page, facets, index }
}
