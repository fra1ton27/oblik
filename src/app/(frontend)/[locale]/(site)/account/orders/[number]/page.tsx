import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { ArrowLeft, Mail, Phone } from 'lucide-react'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Locale } from '@/i18n/routing'
import type { OrderStatus } from '@/collections/Orders'
import { getCustomerOrder, requireCustomer } from '@/lib/data/account'
import { getContacts } from '@/lib/data/globals'
import { formatDate, formatMoney } from '@/lib/format'
import { relativeUrl } from '@/lib/media'
import { pageMetadata } from '@/lib/seo'
import { TransitionLink } from '@/components/motion/TransitionLink'
import { OrderStatusChip } from '@/components/account/StatusChip'
import { OrderTimeline } from '@/components/account/OrderTimeline'
import { RepeatOrderButton } from '@/components/account/RepeatOrderButton'
import { buttonClasses } from '@/components/ui/Button'

type Props = { params: Promise<{ locale: Locale; number: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, number } = await params
  const t = await getTranslations({ locale, namespace: 'account' })
  const n = decodeURIComponent(number)
  return pageMetadata({ locale, route: '/account/orders/[number]', params: { ru: { number: n }, en: { number: n }, sr: { number: n } }, title: t('orderLabel', { number: n }), noindex: true })
}

/**
 * Заказ: таймлайн статусов, позиции, доставка, оплата, «Повторить заказ», связь с менеджером.
 * Чужой номер отдаёт 404, как и несуществующий.
 */
export default async function AccountOrderPage({ params }: Props) {
  const { locale, number } = await params
  setRequestLocale(locale)
  const session = await requireCustomer(locale)
  const order = await getCustomerOrder(session.id, decodeURIComponent(number))
  if (!order) notFound()
  const t = await getTranslations('account')
  const tc = await getTranslations('checkout')
  const contacts = await getContacts(locale)
  const currency = order.totals?.currency ?? undefined
  const money = (v?: number | null) => formatMoney(v ?? 0, locale, currency)
  const d = order.delivery
  const status = (order.status ?? 'new') as OrderStatus
  const totals = order.totals
  const rows: Array<[string, string]> = [[t('subtotal'), money(totals?.subtotal)]]
  if (totals?.bundleDiscount) rows.push([t('bundleDiscount'), `−${money(totals.bundleDiscount)}`])
  if (totals?.promoDiscount) rows.push([order.promoCode ? t('promoNamed', { code: order.promoCode }) : t('promoDiscount'), `−${money(totals.promoDiscount)}`])
  rows.push([t('deliveryCost'), d?.method === 'pickup' || !totals?.delivery ? t('free') : money(totals.delivery)])
  if (totals?.services) rows.push([tc('servicesTotal'), money(totals.services)])
  const services = [d?.lift ? tc('lift') : null, d?.assembly ? tc('assembly') : null].filter(Boolean).join(', ')
  const subject = encodeURIComponent(t('orderLabel', { number: order.number ?? '' }))

  return (
    <div className="flex flex-col gap-8">
      <div>
        <TransitionLink href="/account/orders" className="inline-flex min-h-11 items-center gap-2 text-[14px] font-semibold text-ink-soft hover:text-ink">
          <ArrowLeft aria-hidden className="size-4" strokeWidth={1.5} />
          {t('backToOrders')}
        </TransitionLink>
        <header className="mt-2 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="t-h2">{t.rich('orderTitle', { number: order.number ?? '', nb: (chunks) => <span className="whitespace-nowrap">{chunks}</span> })}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <OrderStatusChip status={status} />
              <span className="t-small font-normal text-ink-soft">{t('orderedAt', { date: formatDate(order.createdAt, locale) })}</span>
            </div>
          </div>
          <RepeatOrderButton number={order.number ?? ''} />
        </header>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <div className="flex min-w-0 flex-col gap-6 xl:col-span-7">
          <section aria-labelledby="order-items" className="rounded-card bg-paper p-5 sm:p-6">
            <h2 id="order-items" className="t-h3 mb-4">
              {t('items')}
            </h2>
            <ul className="flex flex-col divide-y divide-line">
              {(order.items ?? []).map((i, idx) => (
                <li key={i.id ?? idx} className="flex items-center gap-4 py-3 first:pt-0 last:pb-0">
                  <span className="relative size-16 shrink-0 overflow-hidden rounded-[12px] bg-sand">{relativeUrl(i.image) && <Image src={relativeUrl(i.image) as string} alt="" fill sizes="64px" className="object-cover" />}</span>
                  <div className="min-w-0 flex-1 text-[15px]">
                    {i.slug ? (
                      <TransitionLink href={{ pathname: '/furniture/[slug]', params: { slug: i.slug } }} className="font-semibold underline-offset-4 hover:underline">
                        {i.title}
                      </TransitionLink>
                    ) : (
                      <p className="font-semibold">{i.title}</p>
                    )}
                    <p className="t-small font-normal text-ink-soft">{[i.variantLabel, t('qtyPrice', { qty: i.qty, price: money(i.unitPrice) })].filter(Boolean).join(' · ')}</p>
                  </div>
                  <span className="t-price text-[16px] whitespace-nowrap">{money(i.lineTotal)}</span>
                </li>
              ))}
            </ul>
            <dl className="mt-5 flex flex-col gap-2 border-t border-line pt-4 text-[15px]">
              {rows.map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4">
                  <dt className="text-ink-soft">{k}</dt>
                  <dd className="whitespace-nowrap">{v}</dd>
                </div>
              ))}
              <div className="mt-2 flex justify-between gap-4 border-t border-line pt-3 text-[18px] font-semibold">
                <dt>{t('total')}</dt>
                <dd className="t-price whitespace-nowrap">{money(totals?.total)}</dd>
              </div>
            </dl>
          </section>

          <div className="grid gap-6 md:grid-cols-2">
            <section aria-labelledby="order-delivery" className="rounded-card bg-paper p-5 sm:p-6">
              <h2 id="order-delivery" className="t-h3 mb-3">
                {t('delivery')}
              </h2>
              <p className="text-[15px] font-semibold">{tc(`methods.${d?.method ?? 'city'}`)}</p>
              {d?.method === 'pickup' ? (
                <p className="t-small mt-1 font-normal text-ink-soft">{contacts.address}</p>
              ) : (
                <p className="t-small mt-1 font-normal break-words text-ink-soft">{[d?.street, d?.apartment ? t('apartmentShort', { value: d.apartment }) : null, [d?.postalCode, d?.city].filter(Boolean).join(' ')].filter(Boolean).join(', ')}</p>
              )}
              {d?.floor != null && <p className="t-small mt-1 font-normal text-ink-soft">{t(d.elevator ? 'floorWithLift' : 'floorNoLift', { floor: d.floor })}</p>}
              {services && <p className="t-small mt-1 font-normal text-ink-soft">{services}</p>}
              {d?.date && <p className="t-small mt-1 font-normal text-ink-soft">{t('preferredDate', { date: formatDate(d.date, locale) })}</p>}
            </section>
            <section aria-labelledby="order-payment" className="rounded-card bg-paper p-5 sm:p-6">
              <h2 id="order-payment" className="t-h3 mb-3">
                {t('payment')}
              </h2>
              <p className="text-[15px] font-semibold">{t(`paymentMethod.${order.paymentMethod ?? 'manual'}`)}</p>
              <p className="t-small mt-1 font-normal text-ink-soft">{t(`paymentStatus.${order.paymentStatus ?? 'pending'}`)}</p>
            </section>
          </div>
          {order.comment && (
            <section aria-labelledby="order-comment" className="rounded-card bg-paper p-5 sm:p-6">
              <h2 id="order-comment" className="t-h3 mb-2">
                {t('comment')}
              </h2>
              <p className="t-body break-words whitespace-pre-line text-ink-soft">{order.comment}</p>
            </section>
          )}
        </div>

        <div className="flex min-w-0 flex-col gap-6 xl:col-span-5">
          <section aria-labelledby="order-timeline" className="rounded-card bg-paper p-5 sm:p-6">
            <h2 id="order-timeline" className="t-h3 mb-5">
              {t('timeline')}
            </h2>
            <OrderTimeline status={status} history={(order.statusHistory ?? []).map((h) => ({ status: (h.status ?? null) as OrderStatus | null, at: h.at ?? null }))} />
          </section>
          <section aria-labelledby="order-help" className="rounded-card bg-lavender p-5 sm:p-6">
            <h2 id="order-help" className="t-h3">
              {t('contactManager')}
            </h2>
            <p className="t-small mt-2 font-normal text-ink-soft">{t('contactText')}</p>
            <div className="mt-4 flex flex-wrap gap-3">
              {contacts.phone && (
                <a href={`tel:${contacts.phone.replace(/[^\d+]/g, '')}`} className={buttonClasses({ size: 'sm' })}>
                  <Phone aria-hidden className="size-4" strokeWidth={1.5} />
                  {contacts.phone}
                </a>
              )}
              {contacts.email && (
                <a href={`mailto:${contacts.email}?subject=${subject}`} className={buttonClasses({ variant: 'secondary', size: 'sm' })}>
                  <Mail aria-hidden className="size-4" strokeWidth={1.5} />
                  {t('writeEmail')}
                </a>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
