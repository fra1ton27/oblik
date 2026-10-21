import { ImageResponse } from 'next/og'
import { getTranslations } from 'next-intl/server'
import { isLocale, routing } from '@/i18n/routing'
import { site } from '@/config/site'
import { getProductBySlug } from '@/lib/data/catalog'
import { toCard } from '@/lib/product'
import { formatMoney } from '@/lib/format'
import { palette, type PaletteColor } from '@/styles/palette'
import { OG_SIZE, OgCard, ogFonts, ogImage } from '@/lib/og'

export const size = OG_SIZE
export const contentType = 'image/png'
export const alt = site.name

/** OG товара: вырезка на подиуме цвета товара, название, коллекция, цена («от …» при вариантах) */
export default async function Image({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale: raw, slug } = await params
  const locale = isLocale(raw) ? raw : routing.defaultLocale
  const product = await getProductBySlug(decodeURIComponent(slug), locale)
  const fonts = await ogFonts()
  if (!product) return new ImageResponse(<OgCard title={site.name} />, { ...OG_SIZE, fonts })
  const card = toCard(product)
  const t = await getTranslations({ locale, namespace: 'common' })
  const amount = formatMoney(card.price, locale)
  const price = card.maxPrice > card.price ? `${t('priceFrom')} ${amount}` : amount
  const cutout = card.cutout?.src ?? null
  const image = await ogImage(cutout ?? card.images[0]?.src, 640)
  return new ImageResponse(
    <OgCard
      title={card.title}
      subtitle={card.collection?.title ?? card.category?.title ?? null}
      price={price}
      image={image}
      imageKind={cutout ? 'cutout' : 'photo'}
      podium={palette[card.podiumColor as PaletteColor] ?? palette.lavender}
    />,
    { ...OG_SIZE, fonts },
  )
}
