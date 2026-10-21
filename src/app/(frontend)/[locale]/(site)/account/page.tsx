import type { Metadata } from 'next'
import { ArrowRight, MapPin, MessageCircle, Ruler, UserRound } from 'lucide-react'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Locale, StaticPathname } from '@/i18n/routing'
import type { ProductCard as Card } from '@/lib/catalog'
import { getCustomerDoc, getCustomerInquiries, getCustomerOrders, requireCustomer } from '@/lib/data/account'
import { getCatalogIndex } from '@/lib/data/catalog'
import { formatDate } from '@/lib/format'
import { pageMetadata } from '@/lib/seo'
import { TransitionLink } from '@/components/motion/TransitionLink'
import { ProductCard } from '@/components/catalog/ProductCard'
import { buttonClasses } from '@/components/ui/Button'
import { InquiryStatusChip } from '@/components/account/StatusChip'
import { OrderRow } from '@/components/account/OrderRow'
import { AccountPageHead, AccountSectionHead } from '@/components/account/AccountSectionHead'

type Props = { params: Promise<{ locale: Locale }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'account' })
  return pageMetadata({ locale, route: '/account', title: t('metaTitle'), noindex: true })
}

/** Обзор: приветствие, последний заказ со статусом, 4 товара из избранного, активные заявки, быстрые ссылки */
export default async function AccountOverviewPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const session = await requireCustomer(locale)
  const t = await getTranslations('account')
  const [customer, orders, inquiries, index] = await Promise.all([
    getCustomerDoc(session.id),
    getCustomerOrders(session.id, 1),
    getCustomerInquiries(session.id),
    getCatalogIndex(locale),
  ])
  const byId = new Map(index.map((c) => [c.id, c]))
  const favorites = (customer.favorites ?? [])
    .map((f) => byId.get(typeof f === 'object' ? f.id : f))
    .filter((c): c is Card => Boolean(c))
    .reverse()
    .slice(0, 4)
  const active = inquiries.filter((i) => i.status !== 'closed').slice(0, 3)
  const last = orders[0]
  const links: Array<{ href: StaticPathname; label: string; icon: typeof Ruler }> = [
    { href: '/custom', label: t('linkCustom'), icon: Ruler },
    { href: '/contact', label: t('linkContacts'), icon: MessageCircle },
    { href: '/account/addresses', label: t('linkAddresses'), icon: MapPin },
    { href: '/account/profile', label: t('linkProfile'), icon: UserRound },
  ]

  return (
    <div className="flex flex-col gap-12">
      <AccountPageHead title={t('hello', { name: customer.name?.split(' ')[0] || customer.email })} lead={t('overviewLead')} />

      <section aria-labelledby="ov-order" className="-mt-4">
        <AccountSectionHead id="ov-order" title={t('lastOrder')} href="/account/orders" more={last ? t('allOrders') : undefined} />
        {last ? (
          <OrderRow order={last} />
        ) : (
          <div className="flex flex-col items-start gap-3 rounded-card bg-paper p-6">
            <p className="text-[16px] font-semibold">{t('noOrders')}</p>
            <p className="t-small font-normal text-ink-soft">{t('noOrdersText')}</p>
            <TransitionLink href="/catalog" className={buttonClasses({ size: 'sm', className: 'mt-1' })}>
              {t('toCatalog')}
            </TransitionLink>
          </div>
        )}
      </section>

      <section aria-labelledby="ov-fav">
        <AccountSectionHead id="ov-fav" title={t('favorites')} href="/account/wishlist" more={favorites.length ? t('allFavorites') : undefined} />
        {favorites.length ? (
          <ul className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4">
            {favorites.map((c) => (
              <li key={c.id}>
                <ProductCard product={c} compact headingLevel="h3" sizes="(min-width: 768px) 20vw, 50vw" />
              </li>
            ))}
          </ul>
        ) : (
          <p className="rounded-card bg-paper p-6 text-[15px] font-normal text-ink-soft">{t('noFavorites')}</p>
        )}
      </section>

      <section aria-labelledby="ov-inq">
        <AccountSectionHead id="ov-inq" title={t('activeInquiries')} href="/account/inquiries" more={inquiries.length ? t('allInquiries') : undefined} />
        {active.length ? (
          <ul className="flex flex-col gap-3">
            {active.map((i) => (
              <li key={i.id} className="flex flex-wrap items-center justify-between gap-3 rounded-card bg-paper p-5">
                <div className="min-w-0">
                  <p className="text-[15px] font-semibold">{t('inquiryLabel', { number: i.number })}</p>
                  <p className="t-small mt-0.5 font-normal text-ink-soft">{[t(`inquiryType.${i.type}`), formatDate(i.createdAt, locale)].join(' · ')}</p>
                </div>
                <InquiryStatusChip status={i.status} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="rounded-card bg-paper p-6 text-[15px] font-normal text-ink-soft">{t('noActiveInquiries')}</p>
        )}
      </section>

      <section aria-labelledby="ov-links">
        <AccountSectionHead id="ov-links" title={t('quickLinks')} />
        <ul className="grid gap-3 sm:grid-cols-2">
          {links.map((l) => (
            <li key={l.href}>
              <TransitionLink href={l.href} className="flex min-h-16 items-center gap-4 rounded-card bg-paper p-4 text-[15px] font-semibold transition-colors hover:bg-lavender">
                <l.icon aria-hidden className="size-5 shrink-0" strokeWidth={1.5} />
                {l.label}
                <ArrowRight aria-hidden className="ml-auto size-4 text-ink-soft" strokeWidth={1.5} />
              </TransitionLink>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
