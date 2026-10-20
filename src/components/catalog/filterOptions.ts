import type { Availability } from '@/lib/catalog'

/** Значения фильтров для панели: подписи приходят с сервера уже переведёнными */
export type FilterOptions = {
  categories: Array<{ value: string; label: string }>
  collections: Array<{ value: string; label: string }>
  designers: Array<{ value: string; label: string }>
  materials: Array<{ value: string; label: string }>
  colors: Array<{ value: string; label: string; swatch: string }>
  availability: Array<{ value: Availability; label: string }>
}
