import type { ComponentProps } from 'react'
import type { Link } from '@/i18n/navigation'
import type { ProductCard } from '@/lib/catalog'
import type { ImageDTO } from '@/lib/media'

export type ShowcaseItem = {
  id: string
  title: string
  href: ComponentProps<typeof Link>['href']
  image: ImageDTO | null
  podium: string
  facts: Array<{ label: string; value: string }>
  price: number
  compareAt?: number | null
  priceFrom?: boolean
  savings?: number | null
  kind: 'product' | 'bundle'
  cards: ProductCard[]
}

export type ShowcaseQuote = { text: string; author: string; rating?: number }
