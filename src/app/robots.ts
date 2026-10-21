import type { MetadataRoute } from 'next'
import { locales, type StaticPathname } from '@/i18n/routing'
import { absoluteUrl, localizedPath } from '@/lib/paths'
import { site } from '@/config/site'

// закрыто от индексации (раздел 13.1 ТЗ): админка, API, корзина, оформление, кабинет, страницы успеха
const PRIVATE: StaticPathname[] = ['/cart', '/checkout', '/account', '/thank-you', '/login', '/register', '/reset-password', '/wishlist', '/ui-kit']

export default function robots(): MetadataRoute.Robots {
  const isProd = process.env.NODE_ENV === 'production' && process.env.ROBOTS_DISALLOW_ALL !== '1'
  const localized = locales.flatMap((l) => [...PRIVATE.map((r) => localizedPath(r, {}, l)), localizedPath('/order-confirmed/[number]', { number: '' }, l)])
  return {
    rules: isProd
      ? [{ userAgent: '*', allow: '/', disallow: ['/admin', '/api', ...localized] }]
      : // стенды и dev не индексируются целиком
        [{ userAgent: '*', disallow: '/' }],
    sitemap: absoluteUrl('/sitemap.xml'),
    host: site.url,
  }
}
