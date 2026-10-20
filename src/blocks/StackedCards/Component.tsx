import { getTranslations } from 'next-intl/server'
import type { StackedCardsBlock } from '@/payload-types'
import type { BlockContext } from '../types'
import { getCategories } from '@/lib/data/catalog'
import { toImage } from '@/lib/media'
import { StackedCards, type StackCard } from './StackedCards'

/** Стопка цветных карточек: категории каталога на главной или этапы («О нас», «На заказ») */
export async function StackedCardsBlockView({ block, context }: { block: StackedCardsBlock; context: BlockContext }) {
  const t = await getTranslations('home')
  let cards: StackCard[] = []
  if (block.source === 'categories') {
    const categories = await getCategories(context.locale)
    cards = categories.map((c) => ({
      id: String(c.id),
      title: c.title,
      text: c.description,
      chips: c.chips,
      image: c.image,
      color: c.color,
      href: { pathname: '/catalog/[category]', params: { category: c.slug } },
      cta: t('categoryCta'),
      meta: t('categoryCount', { count: c.count }),
    }))
  } else {
    cards = (block.cards ?? []).map((c, i) => ({
      id: c.id ?? String(i),
      title: c.title,
      text: c.text ?? '',
      chips: (c.chips ?? []).map((x) => x.label ?? '').filter(Boolean),
      image: toImage(c.image, 'card', c.title),
      color: c.color ?? 'lavender',
      href: c.route ? (c.route as StackCard['href']) : undefined,
      cta: undefined,
      meta: String(i + 1).padStart(2, '0'),
    }))
  }
  if (!cards.length) return null
  return <StackedCards heading={block.heading ?? ''} lead={block.lead ?? ''} cards={cards} numbered={block.source !== 'categories'} />
}
