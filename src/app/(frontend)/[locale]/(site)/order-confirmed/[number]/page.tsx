import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Locale } from '@/i18n/routing'
import { getPayloadClient } from '@/lib/payload'
import { relativeUrl } from '@/lib/media'
import { getSessionCustomer } from '@/lib/auth'
import { pageMetadata } from '@/lib/seo'
import { EmptyState } from '@/components/ui/EmptyState'
import { buttonClasses } from '@/components/ui/Button'
import { TransitionLink } from '@/components/motion/TransitionLink'
import { OrderConfirmed } from '@/components/checkout/OrderConfirmed'

type Props = { params: Promise<{ locale: Locale; number: string }>; searchParams: Promise<{ token?: string }> }

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, number } = await params
  const t = await getTranslations({ locale, namespace: 'success' })
  return pageMetadata({ locale, route: '/order-confirmed/[number]', params: { ru: { number }, en: { number }, sr: { number } }, title: t('metaTitle'), noindex: true })
}

/**
 * «Заказ принят». Данные показываются только по одноразовому токену из ссылки или владельцу заказа:
 * чужой номер без токена ничего не раскрывает. Обновление страницы её не ломает (токен в адресе).
 */
export default async function OrderConfirmedPage({ params, searchParams }: Props) {
  const { locale, number } = await params
  const { token } = await searchParams
  setRequestLocale(locale)
  const t = await getTranslations('success')
  const tc = await getTranslations('checkout')
  const payload = await getPayloadClient()
  const res = await payload.find({ collection: 'orders', where: { number: { equals: decodeURIComponent(number) } }, limit: 1, depth: 0, overrideAccess: true })
  const order = res.docs[0]
  const customer = await getSessionCustomer()
  const ownerId = typeof order?.customer === 'object' ? order?.customer?.id : order?.customer
  const allowed = order && ((token && order.accessToken === token) || (customer && ownerId && String(ownerId) === String(customer.id)))

  if (!order || !allowed) {
    return (
      <div className="container-site py-16">
        <EmptyState
          headingLevel="h1"
          title={t('notFoundTitle')}
          text={t('notFoundText')}
          actions={
            <TransitionLink href="/login" className={buttonClasses()}>
              {tc('login')}
            </TransitionLink>
          }
        />
      </div>
    )
  }

  const d = order.delivery
  const delivery = d?.method === 'pickup' ? t('pickup') : t('deliveryTo', { address: [d?.city, d?.street, d?.apartment].filter(Boolean).join(', ') })

  return (
    <div className="container-site pt-6 pb-10 md:pt-10">
      <OrderConfirmed
        order={{
          number: order.number ?? '',
          token: token ?? '',
          email: order.contact.email,
          canCreateAccount: !customer && !ownerId && Boolean(token),
          items: (order.items ?? []).map((i) => ({ title: i.title, variantLabel: i.variantLabel, qty: i.qty, lineTotal: i.lineTotal, image: relativeUrl(i.image) })),
          total: order.totals?.total ?? 0,
          delivery,
        }}
      />
    </div>
  )
}
