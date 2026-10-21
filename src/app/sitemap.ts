import type { MetadataRoute } from 'next'
import { locales, routing, type Locale, type Pathname } from '@/i18n/routing'
import { absoluteUrl, localizedPath } from '@/lib/paths'
import { getAllProductSlugs, getLocalizedSlugs } from '@/lib/data/catalog'

// индексируемые статические страницы (раздел 6 ТЗ); корзина, кабинет, оформление и страницы успеха — нет
const STATIC: Array<{ route: Pathname; priority: number; changeFrequency: 'daily' | 'weekly' | 'monthly' | 'yearly' }> = [
  { route: '/', priority: 1, changeFrequency: 'daily' },
  { route: '/catalog', priority: 0.9, changeFrequency: 'daily' },
  { route: '/collections', priority: 0.8, changeFrequency: 'weekly' },
  { route: '/custom', priority: 0.7, changeFrequency: 'monthly' },
  { route: '/about', priority: 0.5, changeFrequency: 'monthly' },
  { route: '/contact', priority: 0.6, changeFrequency: 'monthly' },
  { route: '/delivery', priority: 0.5, changeFrequency: 'monthly' },
  { route: '/privacy', priority: 0.2, changeFrequency: 'yearly' },
  { route: '/terms', priority: 0.2, changeFrequency: 'yearly' },
]

type Entry = MetadataRoute.Sitemap[number]

/** Одна запись на локаль; в alternates — все языки и x-default (раздел 13.1 ТЗ) */
function entries(route: Pathname, params: Partial<Record<Locale, Record<string, string>>> | null, extra: Omit<Entry, 'url' | 'alternates'>): Entry[] {
  const available = locales.filter((l) => !params || params[l])
  if (!available.length) return []
  const url = (l: Locale) => absoluteUrl(localizedPath(route, params?.[l] ?? {}, l))
  const languages: Record<string, string> = Object.fromEntries(available.map((l) => [l, url(l)]))
  if (available.includes(routing.defaultLocale)) languages['x-default'] = url(routing.defaultLocale)
  return available.map((l) => ({ url: url(l), alternates: { languages }, ...extra }))
}

const slugParams = (slug: Partial<Record<Locale, string>>, key: string) =>
  Object.fromEntries(Object.entries(slug).filter(([, v]) => Boolean(v)).map(([l, v]) => [l, { [key]: v as string }])) as Partial<Record<Locale, Record<string, string>>>

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, categories, collections] = await Promise.all([getAllProductSlugs(), getLocalizedSlugs('categories'), getLocalizedSlugs('collections')])
  return [
    ...STATIC.flatMap((s) => entries(s.route, null, { changeFrequency: s.changeFrequency, priority: s.priority })),
    ...categories.flatMap((c) => entries('/catalog/[category]', slugParams(c.slug, 'category'), { lastModified: c.updatedAt, changeFrequency: 'weekly', priority: 0.8 })),
    ...collections.flatMap((c) => entries('/collections/[slug]', slugParams(c.slug, 'slug'), { lastModified: c.updatedAt, changeFrequency: 'weekly', priority: 0.7 })),
    ...products.flatMap((p) => entries('/furniture/[slug]', slugParams(p.slug, 'slug'), { lastModified: p.updatedAt, changeFrequency: 'weekly', priority: 0.8 })),
  ]
}
