import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Locale } from '@/i18n/routing'
import { parseFilters } from '@/lib/catalog'
import { pageMetadata } from '@/lib/seo'
import { site } from '@/config/site'
import { CatalogScreen } from '@/components/catalog/CatalogScreen'

type Props = {
  params: Promise<{ locale: Locale }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'catalog' })
  const { page } = parseFilters(await searchParams)
  // canonical — на страницу без фильтров; ?page=N индексируется
  return pageMetadata({ locale, route: '/catalog', title: t('title'), description: t('metaDescription', { brand: site.name }), page })
}

export default async function CatalogPage({ params, searchParams }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  return <CatalogScreen locale={locale} searchParams={await searchParams} />
}
