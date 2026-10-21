import { getTranslations } from 'next-intl/server'
import { Mail, Phone } from 'lucide-react'
import type { Locale } from '@/i18n/routing'
import { getContacts } from '@/lib/data/globals'
import { site } from '@/config/site'
import { Terrace } from '@/components/shapes'
import { StepReveal } from '@/components/motion/StepReveal'
import { Logo } from './Logo'
import { DeveloperCredit } from './DeveloperCredit'

/**
 * Техработы (раздел 10.3 ТЗ): флаг maintenance в siteSettings закрывает витрину и покупку.
 * Админка (/admin) и API живут в другой группе маршрутов и остаются доступны.
 * Флаг читается из кэша siteSettings (сбрасывается хуком global), поэтому страницы остаются статическими.
 */
export async function MaintenanceGate({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  const contacts = await getContacts(locale)
  if (!contacts.maintenance) return children
  const t = await getTranslations({ locale, namespace: 'errors' })
  return (
    <div className="flex min-h-svh flex-col bg-milk">
      {/* метаданные страницы перекрывают layout, поэтому noindex ставим прямо здесь: React поднимет meta в head,
          а при двух robots поисковики берут более строгий */}
      <meta name="robots" content="noindex, nofollow" />
      <header className="container-site flex h-[var(--header-h)] items-center">
        <Logo name={contacts.brand || site.name} />
      </header>
      <main id="main" className="container-site flex flex-1 flex-col justify-center py-10">
        <section className="relative isolate overflow-hidden rounded-section bg-lavender px-5 py-14 md:px-12 md:py-20">
          <StepReveal immediate className="pointer-events-none absolute right-0 bottom-0 -z-10 w-[62%] max-w-[520px]">
            <Terrace color="lavender" tone steps={6} className="w-full" />
          </StepReveal>
          <p className="t-caption text-ink-soft">{t('maintenanceChip')}</p>
          <h1 className="t-display mt-4 max-w-[12ch] text-[clamp(44px,8vw,120px)]">{t('maintenanceTitle')}</h1>
          <p className="t-lead mt-6 max-w-[44ch] text-ink-soft">{contacts.maintenanceMessage || t('maintenanceText')}</p>
          <p className="t-small mt-8 font-normal text-ink-soft">{t('maintenanceContact')}</p>
          <div className="mt-3 flex flex-wrap gap-3">
            <a href={`tel:${contacts.phone.replace(/[^\d+]/g, '')}`} className="inline-flex min-h-11 items-center gap-2 rounded-pill bg-paper px-5 text-[15px] font-semibold">
              <Phone aria-hidden className="size-4" strokeWidth={1.5} />
              {contacts.phone}
            </a>
            <a href={`mailto:${contacts.email}`} className="inline-flex min-h-11 items-center gap-2 rounded-pill bg-paper px-5 text-[15px] font-semibold">
              <Mail aria-hidden className="size-4" strokeWidth={1.5} />
              {contacts.email}
            </a>
          </div>
        </section>
      </main>
      <footer className="container-site border-t border-line py-4">
        <DeveloperCredit tone="light" />
      </footer>
    </div>
  )
}
