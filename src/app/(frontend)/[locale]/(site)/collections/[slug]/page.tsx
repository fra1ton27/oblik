import type { Metadata } from 'next'
import { notFound, permanentRedirect } from 'next/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Locale } from '@/i18n/routing'
import { getCollectionBySlug, getSlugsById } from '@/lib/data/catalog'
import { findRedirect } from '@/lib/data/redirects'
import { absoluteUrl, localizedPath } from '@/lib/paths'
import { pageMetadata } from '@/lib/seo'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { LocaleAlternates } from '@/components/layout/alternates'
import { JsonLd } from '@/components/seo/JsonLd'
import { PageHero } from '@/blocks/Hero/PageHero'
import { Showcase } from '@/components/catalog/showcase/Showcase'
import { productItems } from '@/components/catalog/showcase/items'
import { CollectionBundle } from '@/components/product/CollectionBundle'
import { RenderBlocks, type AnyBlock } from '@/blocks/RenderBlocks'
import { SplitHeading } from '@/components/motion/SplitHeading'

type Props = { params: Promise<{ locale: Locale; slug: string }> }

async function load(locale: Locale, raw: string) {
  const slug = decodeURIComponent(raw)
  const collection = await getCollectionBySlug(slug, locale)
  if (!collection) {
    const to = await findRedirect(localizedPath('/collections/[slug]', { slug }, locale))
    if (to) permanentRedirect(to)
    notFound()
  }
  const slugs = await getSlugsById('collections', collection.id)
  return { collection, slugs }
}

const byLocale = (slugs: Partial<Record<Locale, string>>) => Object.fromEntries(Object.entries(slugs).map(([l, s]) => [l, { slug: s as string }]))

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  const { collection, slugs } = await load(locale, slug)
  return pageMetadata({
    locale,
    route: '/collections/[slug]',
    params: byLocale(slugs),
    title: collection.meta?.title ? { absolute: collection.meta.title } : collection.title,
    description: collection.meta?.description || collection.story.slice(0, 160),
    image: collection.hero ? { url: absoluteUrl(collection.hero.src), width: collection.hero.width, height: collection.hero.height, alt: collection.hero.alt } : null,
  })
}

/** Посадочная коллекции / комплекта: hero с аркой, история, витрина предметов, комплект, галерея, CTA */
export default async function CollectionPage({ params }: Props) {
  const { locale, slug } = await params
  setRequestLocale(locale)
  const t = await getTranslations('catalog.collectionsPage')
  const tn = await getTranslations('nav')
  const { collection, slugs } = await load(locale, slug)
  const items = await productItems(collection.products, locale)
  const ctx = { locale, page: 'collection' as const, collection }
  const chip = [collection.isBundle ? t('bundle') : null, collection.room].filter(Boolean).join(' · ')

  const defaults = [
    { blockType: 'gallery', id: 'default-gallery', images: [] },
    { blockType: 'cta', id: 'default-cta', variant: 'pistachio', heading: t('customHeading'), text: t('customText'), buttonLabel: t('customButton'), action: 'customModal' },
  ] as unknown as AnyBlock[]

  return (
    <>
      <LocaleAlternates params={byLocale(slugs)} />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          name: collection.title,
          itemListElement: collection.products.map((p, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: p.title,
            url: absoluteUrl(localizedPath('/furniture/[slug]', { slug: p.slug }, locale)),
          })),
        }}
      />
      <PageHero
        variant="collection"
        lines={[collection.title]}
        chip={chip}
        lead={collection.tagline}
        image={collection.heroLarge ?? collection.hero}
        priority
        breadcrumbs={<Breadcrumbs items={[{ label: tn('home'), href: '/' }, { label: t('title'), href: '/collections' }, { label: collection.title }]} />}
      />
      {collection.story && (
        <section className="mt-section">
          <div className="container-site grid gap-6 md:grid-cols-12">
            <SplitHeading className="t-h2 md:col-span-4">{t('storyHeading')}</SplitHeading>
            <p className="t-lead text-ink-soft md:col-span-7 md:col-start-6">{collection.story}</p>
          </div>
        </section>
      )}
      {items.length > 0 && <Showcase heading={t('showcaseHeading')} items={items} className="mt-section" />}
      {collection.products.length > 1 && <CollectionBundle collection={collection} />}
      <RenderBlocks blocks={(collection.layout?.length ? collection.layout : defaults) as AnyBlock[]} context={ctx} />
    </>
  )
}
