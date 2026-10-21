import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Locale } from '@/i18n/routing'
import { getHomepage } from '@/lib/data/globals'
import { RenderBlocks } from '@/blocks/RenderBlocks'
import { OrganizationJsonLd } from '@/components/seo/OrganizationJsonLd'
import { pageMetadata } from '@/lib/seo'
import { site } from '@/config/site'

type Props = { params: Promise<{ locale: Locale }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'seo' })
  const home = await getHomepage(locale).catch(() => null)
  return pageMetadata({
    locale,
    route: '/',
    title: { absolute: home?.meta?.title || t('defaultTitle', { brand: site.name }) },
    description: home?.meta?.description || t('defaultDescription'),
  })
}

/** Главная: секции собираются из блоков global homepage, порядок меняется в админке */
export default async function HomePage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const home = await getHomepage(locale)
  return (
    <>
      <OrganizationJsonLd locale={locale} />
      <RenderBlocks blocks={home.layout} context={{ locale, page: 'home' }} />
    </>
  )
}
