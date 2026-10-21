import type { Metadata } from 'next'
import { notFound, permanentRedirect } from 'next/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Locale } from '@/i18n/routing'
import { parseFilters } from '@/lib/catalog'
import { pageMetadata } from '@/lib/seo'
import { findSlugInOtherLocales, getCategoryBySlug, getSlugsById } from '@/lib/data/catalog'
import { findRedirect } from '@/lib/data/redirects'
import { localizedPath } from '@/lib/paths'
import { CatalogScreen } from '@/components/catalog/CatalogScreen'
import { LocaleAlternates } from '@/components/layout/alternates'

type Props = {
  params: Promise<{ locale: Locale; category: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

async function load(locale: Locale, slug: string) {
  const category = await getCategoryBySlug(decodeURIComponent(slug), locale)
  if (!category) {
    const to = await findRedirect(localizedPath('/catalog/[category]', { category: slug }, locale))
    if (to) permanentRedirect(to)
    const other = await findSlugInOtherLocales('categories', decodeURIComponent(slug), locale)
    if (other) permanentRedirect(localizedPath('/catalog/[category]', { category: other }, locale))
    notFound()
  }
  const slugs = await getSlugsById('categories', category.id)
  return { category, slugs }
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { locale, category: slug } = await params
  const t = await getTranslations({ locale, namespace: 'catalog' })
  const { category, slugs } = await load(locale, slug)
  const { page } = parseFilters(await searchParams)
  return pageMetadata({
    locale,
    route: '/catalog/[category]',
    params: Object.fromEntries(Object.entries(slugs).map(([l, s]) => [l, { category: s }])),
    title: category.title,
    description: t('categoryMeta', { title: category.title, description: category.description }).slice(0, 160),
    image: category.image ? { url: category.image.src, width: category.image.width, height: category.image.height, alt: category.image.alt } : null,
    page,
  })
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { locale, category: slug } = await params
  setRequestLocale(locale)
  const { category, slugs } = await load(locale, slug)
  return (
    <>
      <LocaleAlternates params={Object.fromEntries(Object.entries(slugs).map(([l, s]) => [l, { category: s }]))} />
      <CatalogScreen locale={locale} searchParams={await searchParams} category={category} />
    </>
  )
}
