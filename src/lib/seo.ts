import type { Metadata } from 'next'
import { locales, routing, type Locale, type Pathname } from '@/i18n/routing'
import { site } from '@/config/site'
import { absoluteUrl, localizedPath } from './paths'

type Args = {
  locale: Locale
  route: Pathname
  /** параметры маршрута по локалям (локализованные слаги) */
  params?: Partial<Record<Locale, Record<string, string>>>
  title?: Metadata['title']
  description?: string
  noindex?: boolean
  image?: { url: string; width?: number; height?: number; alt?: string } | null
  /** query для canonical не используется (фильтры), кроме ?page=N */
  page?: number
}

/**
 * Metadata API для каждой страницы и локали: title по шаблону «{страница} — Oblik», description,
 * canonical, alternates.languages с hreflang ru, en, sr и x-default, OG и robots.
 */
export function pageMetadata({ locale, route, params, title, description, noindex, image, page }: Args): Metadata {
  const pathFor = (l: Locale) => {
    const p = params?.[l] ?? params?.[locale] ?? {}
    const base = localizedPath(route, p, l)
    return page && page > 1 ? `${base}?page=${page}` : base
  }
  const languages: Record<string, string> = {}
  for (const l of locales) if (!params || params[l]) languages[l] = absoluteUrl(pathFor(l))
  languages['x-default'] = absoluteUrl(pathFor(routing.defaultLocale))
  const ogLocale = { ru: 'ru_RU', en: 'en_GB', sr: 'sr_RS' }[locale]
  return {
    title,
    description,
    alternates: { canonical: absoluteUrl(pathFor(locale)), languages },
    robots: noindex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      type: 'website',
      siteName: site.name,
      locale: ogLocale,
      url: absoluteUrl(pathFor(locale)),
      title: typeof title === 'string' ? title : undefined,
      description,
      ...(image ? { images: [{ url: image.url, width: image.width, height: image.height, alt: image.alt }] } : {}),
    },
    twitter: { card: 'summary_large_image' },
  }
}
