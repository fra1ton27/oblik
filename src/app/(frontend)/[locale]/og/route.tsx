import { ImageResponse } from 'next/og'
import { getTranslations } from 'next-intl/server'
import { isLocale, routing } from '@/i18n/routing'
import { getHomepage } from '@/lib/data/globals'
import { OG_SIZE, OgCard, ogFonts, ogImage } from '@/lib/og'

export const revalidate = 86400

/**
 * OG по умолчанию со стабильным адресом /{locale}/og: pageMetadata подставляет его всем страницам
 * без своей картинки. Файловый opengraph-image в [locale] не подошёл — его адрес с хешем,
 * а openGraph страницы целиком заменяет родительский и картинка терялась.
 */
export async function GET(_req: Request, { params }: { params: Promise<{ locale: string }> }) {
  const raw = (await params).locale
  const locale = isLocale(raw) ? raw : routing.defaultLocale
  const t = await getTranslations({ locale, namespace: 'common' })
  const ts = await getTranslations({ locale, namespace: 'seo' })
  const home = await getHomepage(locale).catch(() => null)
  const hero = home?.layout?.find((b) => b.blockType === 'hero') as { media?: { sizes?: { card?: { url?: string | null } }; url?: string | null } | number | null } | undefined
  const media = typeof hero?.media === 'object' ? hero.media : null
  const image = await ogImage(media?.sizes?.card?.url ?? media?.url, 520)
  return new ImageResponse(<OgCard title={t('brandTagline')} subtitle={ts('defaultDescription').split('. ')[0]} image={image} imageKind="photo" />, {
    ...OG_SIZE,
    fonts: await ogFonts(),
  })
}
