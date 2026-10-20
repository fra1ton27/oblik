import type { Locale } from '@/i18n/routing'
import type { ProductCard } from '@/lib/catalog'
import type { CollectionDTO } from '@/lib/data/catalog'
import type { Product } from '@/payload-types'

/** Контекст, в котором рендерится блок: главная, посадочная товара, коллекции или страница */
export type BlockContext = {
  locale: Locale
  page: 'home' | 'product' | 'collection' | 'page'
  product?: Product
  productCard?: ProductCard
  collection?: CollectionDTO
  /** первый блок страницы получает LCP-картинку с priority */
  first?: boolean
  index?: number
}
