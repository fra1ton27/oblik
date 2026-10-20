import 'server-only'
import { getTranslations } from 'next-intl/server'
import type { Locale } from '@/i18n/routing'
import { site } from '@/config/site'
import { mainNav, type NavItem } from '@/components/layout/nav'
import type { FooterColumn } from '@/components/layout/Footer'
import type { MenuContacts } from '@/components/layout/MobileMenu'

export type LayoutData = {
  brand: string
  nav: NavItem[]
  footerColumns: FooterColumn[]
  socials: Array<{ label: string; href: string }>
  contacts: MenuContacts
}

/**
 * Данные шапки и подвала. Значения по умолчанию из словарей и src/config/site.ts;
 * globals header / footer / siteSettings из Payload перекрывают их (этап 4).
 */
export async function getLayoutData(locale: Locale): Promise<LayoutData> {
  const t = await getTranslations({ locale, namespace: 'nav' })
  const tf = await getTranslations({ locale, namespace: 'footer' })

  const socials = [
    { label: 'Instagram', href: site.contacts.instagram },
    { label: 'Telegram', href: site.contacts.telegram },
    { label: 'WhatsApp', href: site.contacts.whatsapp },
    { label: 'Viber', href: site.contacts.viber },
    { label: 'Pinterest', href: site.contacts.pinterest },
  ]

  return {
    brand: site.name,
    nav: mainNav.map((item) => ({ key: item.key, href: item.href, label: t(item.labelKey) })),
    footerColumns: [
      {
        title: tf('colCatalog'),
        links: [
          { label: tf('allCatalog'), href: '/catalog' },
          { label: tf('collections'), href: '/collections' },
          { label: tf('custom'), href: '/custom' },
        ],
      },
      {
        title: tf('colCustomers'),
        links: [
          { label: tf('delivery'), href: '/delivery' },
          { label: tf('warranty'), href: { pathname: '/delivery', hash: 'warranty' } },
          { label: tf('care'), href: { pathname: '/delivery', hash: 'care' } },
          { label: tf('faq'), href: { pathname: '/delivery', hash: 'faq' } },
        ],
      },
      {
        title: tf('colCompany'),
        links: [
          { label: tf('about'), href: '/about' },
          { label: tf('production'), href: { pathname: '/about', hash: 'production' } },
          { label: tf('custom'), href: '/custom' },
          { label: tf('contact'), href: '/contact' },
        ],
      },
    ],
    socials,
    contacts: {
      phone: site.contacts.phone,
      messengers: socials.filter((s) => ['WhatsApp', 'Viber', 'Telegram'].includes(s.label)),
    },
  }
}
