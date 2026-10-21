import type { Metadata } from 'next'
import { notFound, permanentRedirect } from 'next/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { locales, type Locale } from '@/i18n/routing'
import type { Designer } from '@/payload-types'
import { findSlugInOtherLocales, getAllProductSlugs, getProductBySlug, getSlugsById } from '@/lib/data/catalog'
import { getReviews } from '@/lib/data/globals'
import { findRedirect } from '@/lib/data/redirects'
import { toCard, toVariantDTOs } from '@/lib/product'
import { toImage } from '@/lib/media'
import { formatMoney } from '@/lib/format'
import { absoluteUrl, localizedPath } from '@/lib/paths'
import { pageMetadata } from '@/lib/seo'
import { site } from '@/config/site'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { LocaleAlternates } from '@/components/layout/alternates'
import { JsonLd } from '@/components/seo/JsonLd'
import { ProductHero } from '@/components/product/ProductHero'
import { RenderBlocks, type AnyBlock } from '@/blocks/RenderBlocks'

type Props = { params: Promise<{ locale: Locale; slug: string }> }

export async function generateStaticParams() {
  try {
    const all = await getAllProductSlugs()
    return all.flatMap((p) => locales.filter((l) => p.slug[l]).map((l) => ({ locale: l, slug: p.slug[l]! })))
  } catch {
    // без БД на этапе сборки страницы соберутся по первому запросу (ISR)
    return []
  }
}

async function load(locale: Locale, raw: string) {
  const slug = decodeURIComponent(raw)
  const product = await getProductBySlug(slug, locale)
  if (!product) {
    const to = await findRedirect(localizedPath('/furniture/[slug]', { slug }, locale))
    if (to) permanentRedirect(to)
    const other = await findSlugInOtherLocales('products', slug, locale)
    if (other) permanentRedirect(localizedPath('/furniture/[slug]', { slug: other }, locale))
    notFound()
  }
  const slugs = await getSlugsById('products', product.id)
  return { product, slugs }
}

const paramsBySlugs = (slugs: Partial<Record<Locale, string>>) => Object.fromEntries(Object.entries(slugs).map(([l, s]) => [l, { slug: s as string }]))

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  const t = await getTranslations({ locale, namespace: 'product' })
  const { product, slugs } = await load(locale, slug)
  const card = toCard(product)
  // своя OG-картинка — только если редактор задал её в SEO-полях; иначе работает opengraph-image.tsx (подиум, цена)
  const image = product.meta?.image ? toImage(product.meta.image, 'hero', product.title) : null
  const description =
    product.meta?.description ||
    t('metaFallback', { title: product.title, description: product.shortDescription ?? '', price: formatMoney(card.price, locale) }).slice(0, 160)
  return pageMetadata({
    defaultImage: false,
    locale,
    route: '/furniture/[slug]',
    params: paramsBySlugs(slugs),
    title: product.meta?.title ? { absolute: product.meta.title } : product.title,
    description,
    image: image ? { url: absoluteUrl(image.src), width: image.width, height: image.height, alt: image.alt } : null,
  })
}

export default async function ProductPage({ params }: Props) {
  const { locale, slug } = await params
  setRequestLocale(locale)
  const t = await getTranslations('product')
  const tn = await getTranslations('nav')
  const tc = await getTranslations('catalog')
  const { product, slugs } = await load(locale, slug)
  const card = toCard(product)
  const variants = toVariantDTOs(product)
  const designer = product.designer && typeof product.designer === 'object' ? (product.designer as Designer) : null
  const category = card.category
  const images = (product.images ?? [])
    .map((row) => ({ main: toImage(row.image, 'hero', product.title), full: toImage(row.image, 'full', product.title) }))
    .filter((x): x is { main: NonNullable<typeof x.main>; full: typeof x.full } => Boolean(x.main))

  const reviews = (await getReviews(locale)).filter((r) => r.productId === product.id)
  const rating = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : null

  const defaults = [
    { blockType: 'story', id: 'default-story' },
    { blockType: 'materials', id: 'default-materials' },
    { blockType: 'dimensions', id: 'default-dimensions' },
    { blockType: 'bundleBuilder', id: 'default-bundle' },
    { blockType: 'faq', id: 'default-faq', items: [] },
    { blockType: 'reviews', id: 'default-reviews', limit: 6 },
    { blockType: 'cta', id: 'default-cta', variant: 'blush', heading: t('ctaHeading'), text: t('ctaText'), buttonLabel: t('ctaButton'), action: 'customModal' },
    { blockType: 'productCarousel', id: 'default-similar', heading: t('similarHeading'), source: 'similar', showFilters: false, limit: 12 },
  ] as unknown as AnyBlock[]
  const blocks = (product.layout?.length ? product.layout : defaults) as AnyBlock[]

  const crumbs = [
    { label: tn('home'), href: '/' as const },
    { label: tc('title'), href: '/catalog' as const },
    ...(category ? [{ label: category.title, href: { pathname: '/catalog/[category]' as const, params: { category: category.slug } } }] : []),
    { label: product.title },
  ]
  const url = absoluteUrl(localizedPath('/furniture/[slug]', { slug: card.slug }, locale))

  return (
    <>
      <LocaleAlternates params={paramsBySlugs(slugs)} />
      <JsonLd
        data={[
          {
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: product.title,
            description: product.shortDescription ?? undefined,
            sku: product.sku,
            image: images.map((i) => absoluteUrl((i.full ?? i.main).src)),
            brand: { '@type': 'Brand', name: site.name },
            ...(designer ? { designer: { '@type': 'Person', name: designer.name } } : {}),
            category: category?.title,
            offers: {
              '@type': variants.length > 1 ? 'AggregateOffer' : 'Offer',
              priceCurrency: site.currency,
              ...(variants.length > 1 ? { lowPrice: card.price / 100, highPrice: card.maxPrice / 100, offerCount: variants.length } : { price: card.price / 100 }),
              availability: card.availability === 'in_stock' ? 'https://schema.org/InStock' : 'https://schema.org/PreOrder',
              url,
            },
            ...(rating ? { aggregateRating: { '@type': 'AggregateRating', ratingValue: rating.toFixed(1), reviewCount: reviews.length } } : {}),
          },
          {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: tn('home'), item: absoluteUrl(localizedPath('/', {}, locale)) },
              { '@type': 'ListItem', position: 2, name: tc('title'), item: absoluteUrl(localizedPath('/catalog', {}, locale)) },
              ...(category ? [{ '@type': 'ListItem', position: 3, name: category.title, item: absoluteUrl(localizedPath('/catalog/[category]', { category: category.slug }, locale)) }] : []),
              { '@type': 'ListItem', position: category ? 4 : 3, name: product.title, item: url },
            ],
          },
        ]}
      />
      <ProductHero
        card={card}
        images={images}
        variants={variants}
        basePrice={product.price}
        compareAt={product.compareAtPrice ?? null}
        shortDescription={product.shortDescription ?? ''}
        sku={product.sku}
        designer={designer?.name}
        collection={card.collection}
        breadcrumbs={<Breadcrumbs items={crumbs} />}
      />
      <RenderBlocks blocks={blocks} context={{ locale, page: 'product', product, productCard: card }} />
    </>
  )
}
