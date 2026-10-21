import { Check, X } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import type { Locale } from '@/i18n/routing'
import type { OrderStatus } from '@/collections/Orders'
import { formatDate } from '@/lib/format'
import { cn } from '@/lib/cn'

const FLOW: OrderStatus[] = ['new', 'confirmed', 'production', 'ready', 'delivered']

type HistoryItem = { status?: OrderStatus | null; at?: string | null }

/**
 * Таймлайн статусов заказа: весь путь new → delivered, пройденные шаги с датой из statusHistory.
 * Отменённый заказ показывает шаги до отмены и отдельный шаг «Отменён».
 */
export function OrderTimeline({ status, history }: { status: OrderStatus; history: HistoryItem[] }) {
  const t = useTranslations('account.status')
  const locale = useLocale() as Locale
  const reachedAt = new Map<OrderStatus, string>()
  for (const h of history) if (h.status && h.at) reachedAt.set(h.status, h.at)
  const cancelled = status === 'cancelled'
  const currentIndex = cancelled ? Math.max(-1, ...FLOW.map((s, i) => (reachedAt.has(s) ? i : -1))) : FLOW.indexOf(status)
  const steps = cancelled ? [...FLOW.slice(0, currentIndex + 1), 'cancelled' as const] : FLOW

  return (
    <ol className="flex flex-col">
      {steps.map((s, i) => {
        const done = cancelled ? true : i <= currentIndex
        const current = cancelled ? s === 'cancelled' : i === currentIndex
        const at = reachedAt.get(s)
        const last = i === steps.length - 1
        return (
          <li key={s} className="relative flex gap-4 pb-6 last:pb-0" aria-current={current ? 'step' : undefined}>
            {!last && <span aria-hidden className={cn('absolute top-9 bottom-0 left-[17px] w-0.5 rounded-full', done && i < currentIndex + (cancelled ? 1 : 0) ? 'bg-ink' : 'bg-line')} />}
            <span
              className={cn(
                'relative z-10 inline-flex size-9 shrink-0 items-center justify-center rounded-full',
                s === 'cancelled' ? 'border border-error bg-paper text-error' : done ? 'bg-ink text-milk' : 'border border-line bg-paper text-ink-soft',
              )}
            >
              {s === 'cancelled' ? <X aria-hidden className="size-4" strokeWidth={2} /> : done ? <Check aria-hidden className="size-4" strokeWidth={2} /> : <span className="size-2 rounded-full bg-line" />}
            </span>
            <div className="pt-1.5">
              <p className={cn('text-[15px] font-semibold', !done && 'text-ink-soft')}>{t(s)}</p>
              {at && <p className="t-small mt-0.5 font-normal text-ink-soft">{formatDate(at, locale, 'dateTime')}</p>}
            </div>
          </li>
        )
      })}
    </ol>
  )
}
