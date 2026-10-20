import { revalidateTag } from 'next/cache'

/** Теги кэша данных: страницы и запросы к БД помечаются ими, хуки Payload их сбрасывают */
export const tags = {
  products: 'products',
  product: (id: number | string) => `product:${id}`,
  categories: 'categories',
  collections: 'collections',
  materials: 'materials',
  designers: 'designers',
  reviews: 'reviews',
  pages: 'pages',
  global: (slug: string) => `global:${slug}`,
} as const

/**
 * Сброс кэша по тегам (stale-while-revalidate, Next 16: второй аргумент — профиль cacheLife).
 * Вне Next (seed, CLI Payload) кэша нет — ошибку молча игнорируем.
 */
export function revalidate(...list: string[]) {
  for (const tag of list) {
    try {
      revalidateTag(tag, 'max')
    } catch {
      // не в контексте Next.js
    }
  }
}
