import 'server-only'
import { getTranslations } from 'next-intl/server'
import type { Category } from '@/payload-types'
import type { Locale, StaticPathname } from '@/i18n/routing'
import { routing } from '@/i18n/routing'
import { site } from '@/config/site'
import { mainNav, type NavItem } from '@/components/layout/nav'
import type { FooterColumn } from '@/components/layout/Footer'
import type { MenuContacts } from '@/components/layout/MobileMenu'
import { getContacts, getFooterGlobal, getHeaderGlobal } from './globals'

export type LayoutData = {
  brand: string
  nav: NavItem[]
  footerColumns: FooterColumn[]
  socials: Array<{ label: string; href: string }>
  contacts: MenuContacts
}

const isStatic = (r: unknown): r is StaticPathname => typeof r === 'string' && r in routing.pathnames && !r.includes('[')

/**
 * Данные шапки и подвала: globals header / footer / siteSettings из Payload,
 * а если CMS недоступна или пуста — значения из словарей и src/config/site.ts.
 */
export async function getLayoutData(locale: Locale): Promise<LayoutData> {
  const t = await getTranslations({ locale, namespace: 'nav' })
  const tf = await getTranslations({ locale, namespace: 'footer' })
  const [header, footer, contacts] = await Promise.all([
    getHeaderGlobal(locale).catch(() => null),
    getFooterGlobal(locale).catch(() => null),
    getContacts(locale),
  ])

  const nav: NavItem[] = header?.items?.length
    ? header.items.filter((i) => isStatic(i.route)).map((i, idx) => ({ key: mainNav.find((n) => n.href === i.route)?.key ?? `item-${idx}`, href: i.route as StaticPathname, label: i.label }))
    : mainNav.map((item) => ({ key: item.key, href: item.href, label: t(item.labelKey) }))

  const fallbackSocials = [
    { label: 'Instagram', href: site.contacts.instagram },
    { label: 'Telegram', href: contacts.telegram },
    { label: 'WhatsApp', href: contacts.whatsapp },
    { label: 'Viber', href: contacts.viber },
    { label: 'Pinterest', href: site.contacts.pinterest },
  ]
  const socials = footer?.socials?.length ? footer.socials.map((s) => ({ label: s.label, href: s.url })) : fallbackSocials

  const footerColumns: FooterColumn[] = footer?.columns?.length
    ? footer.columns.map((col) => ({
        title: col.title,
        links: (col.links ?? [])
          .map((link) => {
            const category = link.category && typeof link.category === 'object' ? (link.category as Category) : null
            if (category?.slug) return { label: link.label, href: { pathname: '/catalog/[category]' as const, params: { category: category.slug } } }
            if (isStatic(link.route)) return { label: link.label, href: link.hash ? { pathname: link.route, hash: link.hash } : link.route }
            return null
          })
          .filter((l): l is NonNullable<typeof l> => Boolean(l)),
      }))
    : [
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
      ]

  return {
    brand: contacts.brand,
    nav,
    footerColumns,
    socials,
    contacts: {
      phone: contacts.phone,
      messengers: [
        { label: 'WhatsApp', href: contacts.whatsapp },
        { label: 'Viber', href: contacts.viber },
        { label: 'Telegram', href: contacts.telegram },
      ].filter((m) => m.href),
    },
  }
}
