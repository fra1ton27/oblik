import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Locale } from '@/i18n/routing'
import { getCollections } from '@/lib/data/catalog'
import { pageMetadata } from '@/lib/seo'
import { site } from '@/config/site'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { SplitHeading } from '@/components/motion/SplitHeading'
import { CollectionCard } from '@/components/catalog/CollectionCard'

type Props = { params: Promise<{ locale: Locale }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'catalog.collectionsPage' })
  return pageMetadata({ locale, route: '/collections', title: t('title'), description: t('metaDescription', { brand: site.name }) })
}

/** Коллекции и комплекты: карточки комнат с ценой комплекта и экономией */
export default async function CollectionsPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('catalog.collectionsPage')
  const tn = await getTranslations('nav')
  const collections = await getCollections(locale)

  return (
    <div className="container-site pt-6 md:pt-10">
      <Breadcrumbs items={[{ label: tn('home'), href: '/' }, { label: t('title') }]} />
      <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <SplitHeading as="h1" by="chars" immediate className="t-h1">
          {t('title')}
        </SplitHeading>
        <p className="t-lead max-w-[40ch] text-ink-soft">{t('lead')}</p>
      </div>
      <ul className="mt-10 grid gap-10 md:grid-cols-2 lg:grid-cols-3">
        {collections.map((c, i) => (
          <li key={c.id}>
            <CollectionCard collection={c} tilt={[-2, 3, -3][i % 3]} />
          </li>
        ))}
      </ul>
    </div>
  )
}
