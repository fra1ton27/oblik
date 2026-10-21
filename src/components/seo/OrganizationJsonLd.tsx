import type { Locale } from '@/i18n/routing'
import { htmlLang } from '@/i18n/routing'
import { site } from '@/config/site'
import { absoluteUrl, localizedPath } from '@/lib/paths'
import { getContacts } from '@/lib/data/globals'
import { getLayoutData } from '@/lib/data/layout'
import { JsonLd } from './JsonLd'

/**
 * Organization + FurnitureStore (адрес шоурума, часы, координаты) + WebSite — раздел 13.1 ТЗ.
 * Данные из siteSettings, соцсети из подвала. Ставится на главную каждой локали.
 */
export async function OrganizationJsonLd({ locale }: { locale: Locale }) {
  const [contacts, layout] = await Promise.all([getContacts(locale), getLayoutData(locale)])
  const home = absoluteUrl(localizedPath('/', {}, locale))
  const org = `${site.url}/#organization`
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'Organization',
            '@id': org,
            name: contacts.brand,
            url: site.url,
            logo: absoluteUrl('/favicon.svg'),
            email: contacts.email,
            telephone: contacts.phone,
            sameAs: [...layout.socials.map((s) => s.href), ...layout.contacts.messengers.map((m) => m.href)].filter((h) => h.startsWith('http')),
            contactPoint: { '@type': 'ContactPoint', contactType: 'customer service', telephone: contacts.phone, email: contacts.email, availableLanguage: ['ru', 'en', 'sr'] },
          },
          {
            '@type': 'FurnitureStore',
            '@id': `${site.url}/#store`,
            name: contacts.brand,
            url: home,
            image: absoluteUrl(`/${locale}/og`),
            parentOrganization: { '@id': org },
            telephone: contacts.phone,
            email: contacts.email,
            priceRange: '€€',
            currenciesAccepted: contacts.currency,
            address: { '@type': 'PostalAddress', streetAddress: contacts.address, addressCountry: 'RS' },
            geo: { '@type': 'GeoCoordinates', latitude: contacts.map.lat, longitude: contacts.map.lng },
            ...(contacts.openingHoursSpec ? { openingHours: contacts.openingHoursSpec.split(/[,;]\s*/).filter(Boolean) } : {}),
          },
          {
            '@type': 'WebSite',
            '@id': `${site.url}/#website-${locale}`,
            url: home,
            name: contacts.brand,
            inLanguage: htmlLang[locale],
            publisher: { '@id': org },
          },
        ],
      }}
    />
  )
}
