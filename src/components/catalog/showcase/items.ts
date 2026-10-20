import 'server-only'
import { getTranslations } from 'next-intl/server'
import type { Locale } from '@/i18n/routing'
import type { ProductCard } from '@/lib/catalog'
import type { CollectionDTO } from '@/lib/data/catalog'
import { formatMoney } from '@/lib/format'
import type { ShowcaseItem } from './types'

/** Позиции витрины из карточек товаров: факты для инфо-панели собраны на сервере */
export async function productItems(cards: ProductCard[], locale: Locale): Promise<ShowcaseItem[]> {
  const t = await getTranslations({ locale, namespace: 'showcase' })
  const tc = await getTranslations({ locale, namespace: 'catalog' })
  return cards.map((p) => {
    const d = p.facts.dimensions
    const facts = [
      p.facts.collection && { label: t('facts.collection'), value: p.facts.collection },
      p.facts.designer && { label: t('facts.designer'), value: p.facts.designer },
      p.facts.materials.length && { label: t('facts.materials'), value: p.facts.materials.join(', ') },
      d.width && d.depth && d.height && { label: t('facts.dimensions'), value: t('dims', { width: d.width, depth: d.depth, height: d.height }) },
      { label: t('facts.leadTime'), value: p.availability === 'in_stock' ? tc('inStock') : tc('leadTime', { min: p.leadTime[0], max: p.leadTime[1] }) },
    ].filter(Boolean) as ShowcaseItem['facts']
    return {
      id: `p-${p.id}`,
      title: p.title,
      href: { pathname: '/furniture/[slug]', params: { slug: p.slug } },
      image: p.cutout ?? p.images[0] ?? null,
      podium: p.podiumColor,
      facts,
      price: p.price,
      compareAt: p.compareAt,
      priceFrom: p.maxPrice > p.price,
      kind: 'product',
      cards: [p],
    }
  })
}

/** Позиции витрины из комплектов: состав, цена по отдельности, цена комплекта и экономия */
export async function bundleItems(bundles: CollectionDTO[], locale: Locale): Promise<ShowcaseItem[]> {
  const t = await getTranslations({ locale, namespace: 'showcase' })
  return bundles.map((b) => ({
    id: `c-${b.id}`,
    title: b.title,
    href: { pathname: '/collections/[slug]', params: { slug: b.slug } },
    image: b.cutout ?? b.hero,
    podium: b.podiumColor,
    facts: [
      b.room && { label: t('facts.room'), value: b.room },
      { label: t('facts.composition'), value: b.products.map((p) => p.title).join(', ') },
      { label: t('facts.separately'), value: formatMoney(b.totals.full, locale) },
      { label: t('facts.savings'), value: `${formatMoney(b.totals.savings, locale)} · ${b.discount}%` },
    ].filter(Boolean) as ShowcaseItem['facts'],
    price: b.totals.total,
    compareAt: b.totals.full,
    savings: b.totals.savings,
    kind: 'bundle',
    cards: b.products,
  }))
}
