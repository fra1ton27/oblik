import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Locale } from '@/i18n/routing'
import { getCustomerOrders, requireCustomer } from '@/lib/data/account'
import { pageMetadata } from '@/lib/seo'
import { TransitionLink } from '@/components/motion/TransitionLink'
import { EmptyState } from '@/components/ui/EmptyState'
import { buttonClasses } from '@/components/ui/Button'
import { OrderRow } from '@/components/account/OrderRow'
import { AccountPageHead } from '@/components/account/AccountSectionHead'

type Props = { params: Promise<{ locale: Locale }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'account' })
  return pageMetadata({ locale, route: '/account/orders', title: t('nav.orders'), noindex: true })
}

/** Заказы: номер, дата, сумма, статус-чип, миниатюры — только свои */
export default async function AccountOrdersPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const session = await requireCustomer(locale)
  const t = await getTranslations('account')
  const orders = await getCustomerOrders(session.id)

  return (
    <div>
      <AccountPageHead title={t('nav.orders')} />
      {orders.length ? (
        <ul className="flex flex-col gap-3">
          {orders.map((o) => (
            <li key={o.id}>
              <OrderRow order={o} />
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState
          title={t('noOrders')}
          text={t('noOrdersText')}
          color="mist"
          actions={
            <TransitionLink href="/catalog" className={buttonClasses()}>
              {t('toCatalog')}
            </TransitionLink>
          }
        />
      )}
    </div>
  )
}
