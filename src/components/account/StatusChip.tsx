import { useTranslations } from 'next-intl'
import { Tag } from '@/components/ui/Chip'
import type { OrderStatus } from '@/collections/Orders'

/** Цвета статусов из раздела 9.2 ТЗ: mist → lavender → blush → sand → pistachio, отмена — линия error */
const orderTones = {
  new: 'mist',
  confirmed: 'lavender',
  production: 'blush',
  ready: 'sand',
  delivered: 'pistachio',
  cancelled: 'error',
} as const satisfies Record<OrderStatus, string>

export function OrderStatusChip({ status, size }: { status: OrderStatus; size?: 'xs' | 'sm' }) {
  const t = useTranslations('account.status')
  return (
    <Tag tone={orderTones[status] ?? 'mist'} size={size}>
      {t(status)}
    </Tag>
  )
}

export type InquiryStatus = 'new' | 'in_progress' | 'offer_sent' | 'closed'

const inquiryTones = { new: 'mist', in_progress: 'lavender', offer_sent: 'pistachio', closed: 'line' } as const satisfies Record<InquiryStatus, string>

export function InquiryStatusChip({ status }: { status: InquiryStatus }) {
  const t = useTranslations('account.inquiryStatus')
  return <Tag tone={inquiryTones[status] ?? 'mist'}>{t(status)}</Tag>
}
