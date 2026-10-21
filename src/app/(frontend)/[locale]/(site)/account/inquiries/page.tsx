import type { Metadata } from 'next'
import { FileText } from 'lucide-react'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Locale } from '@/i18n/routing'
import { getCustomerInquiries, requireCustomer } from '@/lib/data/account'
import { formatDate, formatNumber } from '@/lib/format'
import { pageMetadata } from '@/lib/seo'
import { TransitionLink } from '@/components/motion/TransitionLink'
import { EmptyState } from '@/components/ui/EmptyState'
import { buttonClasses } from '@/components/ui/Button'
import { InquiryStatusChip } from '@/components/account/StatusChip'
import { AccountPageHead } from '@/components/account/AccountSectionHead'

type Props = { params: Promise<{ locale: Locale }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'account' })
  return pageMetadata({ locale, route: '/account/inquiries', title: t('nav.inquiries'), noindex: true })
}

/** Мои заявки: дата, тип, статус (новая → в работе → предложение отправлено → закрыта), файлы */
export default async function AccountInquiriesPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const session = await requireCustomer(locale)
  const t = await getTranslations('account')
  const inquiries = await getCustomerInquiries(session.id)
  const size = (bytes: number) => t('fileSize', { size: formatNumber(Math.max(0.1, bytes / 1024 / 1024), locale, { maximumFractionDigits: 1 }) })

  return (
    <div>
      <AccountPageHead title={t('nav.inquiries')}>
        {inquiries.length > 0 && (
          <TransitionLink href="/custom" className={buttonClasses({ variant: 'secondary', size: 'sm' })}>
            {t('newCustom')}
          </TransitionLink>
        )}
      </AccountPageHead>
      {inquiries.length ? (
        <ul className="flex flex-col gap-3">
          {inquiries.map((i) => (
            <li key={i.id} className="rounded-card bg-paper p-5 sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="text-[17px] font-semibold">{t('inquiryLabel', { number: i.number })}</h2>
                  <p className="t-small mt-1 font-normal text-ink-soft">{[t(`inquiryType.${i.type}`), formatDate(i.createdAt, locale)].join(' · ')}</p>
                </div>
                <InquiryStatusChip status={i.status} />
              </div>
              {i.summary && <p className="t-body mt-3 line-clamp-2 break-words text-ink-soft">{i.summary}</p>}
              {i.files.length > 0 && (
                <div className="mt-4">
                  <p className="t-caption text-ink-soft">{t('files')}</p>
                  <ul className="mt-2 flex flex-wrap gap-2">
                    {i.files.map((f, idx) => (
                      <li key={idx}>
                        {f.url ? (
                          <a href={f.url} target="_blank" rel="noopener" className="inline-flex min-h-11 max-w-full items-center gap-2 rounded-pill border border-line px-4 text-[14px] font-semibold hover:bg-milk">
                            <FileText aria-hidden className="size-4 shrink-0" strokeWidth={1.5} />
                            <span className="truncate">{f.name}</span>
                            {f.size ? <span className="font-normal text-ink-soft">{size(f.size)}</span> : null}
                          </a>
                        ) : (
                          <span className="inline-flex min-h-11 items-center gap-2 rounded-pill border border-line px-4 text-[14px] font-semibold">
                            <FileText aria-hidden className="size-4 shrink-0" strokeWidth={1.5} />
                            <span className="truncate">{f.name}</span>
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState
          title={t('noInquiries')}
          text={t('noInquiriesText')}
          color="pistachio"
          actions={
            <TransitionLink href="/custom" className={buttonClasses()}>
              {t('newCustom')}
            </TransitionLink>
          }
        />
      )}
    </div>
  )
}
