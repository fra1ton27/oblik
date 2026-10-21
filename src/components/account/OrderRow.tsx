import Image from 'next/image'
import { ChevronRight } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import type { Locale } from '@/i18n/routing'
import type { Order } from '@/payload-types'
import type { OrderStatus } from '@/collections/Orders'
import { formatDate, formatMoney } from '@/lib/format'
import { relativeUrl } from '@/lib/media'
import { TransitionLink } from '@/components/motion/TransitionLink'
import { OrderStatusChip } from './StatusChip'

/** Строка списка заказов: номер, дата, сумма, статус-чип, миниатюры. Вся карточка — ссылка. */
export function OrderRow({ order }: { order: Order }) {
  const t = useTranslations('account')
  const tc = useTranslations('common')
  const locale = useLocale() as Locale
  const items = order.items ?? []
  const count = items.reduce((n, i) => n + i.qty, 0)
  const thumbs = items.map((i) => relativeUrl(i.image)).filter((src): src is string => Boolean(src)).slice(0, 4)
  const extra = items.length - thumbs.length

  return (
    <article className="relative flex flex-col gap-4 rounded-card bg-paper p-5 transition-shadow hover:shadow-float sm:flex-row sm:items-center">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <h3 className="text-[17px] font-semibold">
            <TransitionLink href={{ pathname: '/account/orders/[number]', params: { number: order.number ?? '' } }} className="after:absolute after:inset-0 after:rounded-card focus-visible:outline-none">
              {t('orderLabel', { number: order.number ?? '' })}
            </TransitionLink>
          </h3>
          <OrderStatusChip status={(order.status ?? 'new') as OrderStatus} size="xs" />
        </div>
        <p className="t-small mt-1 font-normal text-ink-soft">
          {[formatDate(order.createdAt, locale), tc('items', { count }), formatMoney(order.totals?.total ?? 0, locale, order.totals?.currency ?? undefined)].join(' · ')}
        </p>
      </div>
      <div className="flex items-center gap-2" aria-hidden>
        {thumbs.map((src, idx) => (
          <span key={idx} className="relative size-14 overflow-hidden rounded-[10px] bg-sand">
            <Image src={src} alt="" fill sizes="56px" className="object-cover" />
          </span>
        ))}
        {extra > 0 && <span className="inline-flex size-14 items-center justify-center rounded-[10px] bg-milk text-[14px] font-semibold">{t('moreItems', { count: extra })}</span>}
        <ChevronRight className="ml-1 hidden size-5 text-ink-soft sm:block" strokeWidth={1.5} />
      </div>
    </article>
  )
}
