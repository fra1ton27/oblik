import { ImageResponse } from 'next/og'
import { getTranslations } from 'next-intl/server'
import { isLocale, routing } from '@/i18n/routing'
import { site } from '@/config/site'
import { getCollectionBySlug } from '@/lib/data/catalog'
import { formatMoney } from '@/lib/format'
import { palette, type PaletteColor } from '@/styles/palette'
import { OG_SIZE, OgCard, ogFonts, ogImage } from '@/lib/og'

export const size = OG_SIZE
export const contentType = 'image/png'
export const alt = site.name

/** OG коллекции или комплекта: вырезка на подиуме, название, слоган, цена комплекта */
export default async function Image({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale: raw, slug } = await params
  const locale = isLocale(raw) ? raw : routing.defaultLocale
  const collection = await getCollectionBySlug(decodeURIComponent(slug), locale)
  const fonts = await ogFonts()
  if (!collection) return new ImageResponse(<OgCard title={site.name} />, { ...OG_SIZE, fonts })
  const t = await getTranslations({ locale, namespace: 'catalog.collectionsPage' })
  const image = await ogImage(collection.cutout?.src ?? collection.hero?.src, 640)
  return new ImageResponse(
    <OgCard
      title={collection.title}
      subtitle={collection.tagline || null}
      chip={collection.isBundle ? t('bundle') : t('collection')}
      price={collection.isBundle && collection.totals.total ? formatMoney(collection.totals.total, locale) : null}
      image={image}
      imageKind={collection.cutout ? 'cutout' : 'photo'}
      podium={palette[collection.podiumColor as PaletteColor] ?? palette.lavender}
    />,
    { ...OG_SIZE, fonts },
  )
}
