import 'server-only'
import { unstable_cache } from 'next/cache'
import type { Footer, Header, Homepage, Review, SiteSetting } from '@/payload-types'
import type { Locale } from '@/i18n/routing'
import { getPayloadClient } from '@/lib/payload'
import { tags } from '@/lib/revalidate'
import { site } from '@/config/site'
import { toImage, type ImageDTO } from '@/lib/media'

export const getSiteSettings = (locale: Locale) =>
  unstable_cache(
    async (): Promise<SiteSetting> => {
      const payload = await getPayloadClient()
      return payload.findGlobal({ slug: 'siteSettings', locale, depth: 1 })
    },
    ['global', 'siteSettings', locale],
    { tags: [tags.global('siteSettings')] },
  )()

export const getHeaderGlobal = (locale: Locale) =>
  unstable_cache(
    async (): Promise<Header> => (await getPayloadClient()).findGlobal({ slug: 'header', locale, depth: 0 }),
    ['global', 'header', locale],
    { tags: [tags.global('header')] },
  )()

export const getFooterGlobal = (locale: Locale) =>
  unstable_cache(
    async (): Promise<Footer> => (await getPayloadClient()).findGlobal({ slug: 'footer', locale, depth: 1 }),
    ['global', 'footer', locale],
    { tags: [tags.global('footer'), tags.categories] },
  )()

export const getHomepage = (locale: Locale) =>
  unstable_cache(
    async (): Promise<Homepage> => (await getPayloadClient()).findGlobal({ slug: 'homepage', locale, depth: 2 }),
    ['global', 'homepage', locale],
    { tags: [tags.global('homepage'), tags.reviews] },
  )()

export type ReviewDTO = {
  id: number
  author: string
  city: string
  rating: number
  text: string
  productId: number | null
  productTitle: string | null
  productSlug: string | null
  photo: ImageDTO | null
}

export function toReview(r: Review): ReviewDTO {
  const product = r.product && typeof r.product === 'object' ? r.product : null
  return {
    id: r.id,
    author: r.author,
    city: r.city ?? '',
    rating: r.rating,
    text: r.text,
    productId: product?.id ?? (typeof r.product === 'number' ? r.product : null),
    productTitle: product?.title ?? null,
    productSlug: product?.slug ?? null,
    photo: toImage(r.photos?.[0], 'card', r.author),
  }
}

export const getReviews = (locale: Locale) =>
  unstable_cache(
    async (): Promise<ReviewDTO[]> => {
      const payload = await getPayloadClient()
      const res = await payload.find({ collection: 'reviews', where: { approved: { equals: true } }, locale, depth: 1, limit: 200, pagination: false, sort: '-createdAt' })
      return res.docs.map(toReview)
    },
    ['reviews', locale],
    { tags: [tags.reviews, tags.products] },
  )()

/** Контакты для шапки, меню, подвала и страницы контактов: CMS поверх значений по умолчанию */
export async function getContacts(locale: Locale) {
  let s: SiteSetting | null = null
  try {
    s = await getSiteSettings(locale)
  } catch {
    s = null
  }
  return {
    brand: s?.brandName || site.name,
    phone: s?.phone || site.contacts.phone,
    email: s?.email || site.contacts.email,
    whatsapp: s?.whatsapp || site.contacts.whatsapp,
    viber: s?.viber || site.contacts.viber,
    telegram: s?.telegram || site.contacts.telegram,
    address: s?.address ?? '',
    hours: (s?.hours ?? []).map((h) => ({ days: h.days, time: h.time })),
    map: { lat: s?.mapLat ?? site.contacts.showroom.lat, lng: s?.mapLng ?? site.contacts.showroom.lng, image: toImage(s?.mapImage, 'hero') },
    responseTime: s?.responseTime ?? '',
    openingHoursSpec: s?.openingHoursSpec ?? '',
    currency: s?.currency || site.currency,
    displayCurrency: s?.displayCurrency || site.displayCurrency,
    displayRate: s?.displayRate ?? site.displayRate,
    maintenance: Boolean(s?.maintenance),
    maintenanceMessage: s?.maintenanceMessage ?? '',
  }
}

export type Contacts = Awaited<ReturnType<typeof getContacts>>
