import type { Metadata } from 'next'
import Image from 'next/image'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Locale } from '@/i18n/routing'
import { getCollections } from '@/lib/data/catalog'
import { pageMetadata } from '@/lib/seo'
import { formatMoney } from '@/lib/format'
import { site } from '@/config/site'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { Tag } from '@/components/ui/Chip'
import { SplitHeading } from '@/components/motion/SplitHeading'
import { TransitionLink } from '@/components/motion/TransitionLink'
import { TiltCard } from '@/components/motion/TiltCard'
import { Arch } from '@/components/shapes'

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
            <TransitionLink href={{ pathname: '/collections/[slug]', params: { slug: c.slug } }} className="group flex flex-col gap-4">
              <TiltCard tilt={[-2, 3, -3][i % 3]} mobileTilt={0}>
                <Arch aspect="4 / 5">
                  {c.hero && (
                    <Image
                      src={c.hero.src}
                      alt={c.hero.alt}
                      fill
                      sizes="(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 92vw"
                      placeholder="blur"
                      blurDataURL={c.hero.blur}
                      className="object-cover transition-transform duration-[700ms] ease-soft group-hover:scale-[1.03]"
                    />
                  )}
                </Arch>
              </TiltCard>
              <div className="flex flex-wrap items-center gap-2">
                <Tag tone={c.isBundle ? 'lavender' : 'paper'}>{c.isBundle ? t('bundle') : t('collection')}</Tag>
                {c.room && <Tag tone="paper">{c.room}</Tag>}
                <span className="t-small text-ink-soft">{t('pieces', { count: c.products.length })}</span>
              </div>
              <h2 className="t-serif">{c.title}</h2>
              {c.tagline && <p className="text-ink-soft">{c.tagline}</p>}
              {c.isBundle && c.totals.savings > 0 && (
                <p className="flex flex-wrap items-baseline gap-x-3 text-[15px]">
                  <span className="t-price text-[22px]">{formatMoney(c.totals.total, locale)}</span>
                  <span className="text-success">{t('save', { amount: formatMoney(c.totals.savings, locale) })}</span>
                </p>
              )}
              <span className="text-[15px] font-semibold underline underline-offset-4">{t('open')}</span>
            </TransitionLink>
          </li>
        ))}
      </ul>
    </div>
  )
}
