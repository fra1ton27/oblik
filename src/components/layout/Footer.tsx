import { Plus } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import type { ComponentProps } from 'react'
import { TransitionLink } from '@/components/motion/TransitionLink'
import type { Link } from '@/i18n/navigation'
import { DeveloperCredit } from './DeveloperCredit'
import { FooterMarquee } from './FooterMarquee'
import { LanguageSwitcher } from './LanguageSwitcher'
import { CookieSettingsButton } from './CookieConsent'
import { LazyNewsletterForm } from '@/components/forms/LazyForms'
import { Logo } from './Logo'
import { cn } from '@/lib/cn'

type Href = ComponentProps<typeof Link>['href']

export type FooterColumn = { title: string; links: Array<{ label: string; href: Href }> }

type Props = {
  brand: string
  columns: FooterColumn[]
  socials: Array<{ label: string; href: string }>
  /** Упрощённый подвал на оформлении: только нижняя полоса с копирайтом и подписью */
  variant?: 'full' | 'simple'
}

/** Подвал (раздел 14 ТЗ): бегущая строка на plum, колонки ссылок, подписка, нижняя полоса с копирайтом и @fra1ton27 */
export async function Footer({ brand, columns, socials, variant = 'full' }: Props) {
  const t = await getTranslations('footer')
  const year = new Date().getFullYear()

  const bottom = (
    <div
      className={cn(
        'container-site flex flex-col gap-3 py-6 md:flex-row md:flex-wrap md:items-center md:justify-between md:gap-x-8',
        variant === 'full' && 'border-t border-milk/15',
      )}
      style={{ paddingBottom: 'calc(24px + env(safe-area-inset-bottom) + var(--bottom-reserve, 0px) + var(--sticky-bar-h, 0px))' }}
    >
      <p className="text-[13px] text-milk/85">{t('copyright', { year, brand })}</p>
      <nav aria-label={t('legalLabel')} className="flex flex-wrap items-center gap-x-1 gap-y-2 text-[13px]">
        <TransitionLink href="/privacy" className="inline-flex min-h-11 items-center px-1 text-milk/85 underline-offset-4 hover:text-milk hover:underline">
          {t('privacy')}
        </TransitionLink>
        <span aria-hidden className="text-milk/40">
          {'·'}
        </span>
        <TransitionLink href="/terms" className="inline-flex min-h-11 items-center px-1 text-milk/85 underline-offset-4 hover:text-milk hover:underline">
          {t('terms')}
        </TransitionLink>
        <span aria-hidden className="text-milk/40">
          {'·'}
        </span>
        <CookieSettingsButton className="inline-flex min-h-11 items-center px-1 text-milk/85 underline-offset-4 hover:text-milk hover:underline">
          {t('cookieSettings')}
        </CookieSettingsButton>
        <LanguageSwitcher tone="dark" className="ml-1" />
      </nav>
      <DeveloperCredit />
    </div>
  )

  if (variant === 'simple') {
    return <footer className="mt-section bg-plum text-milk">{bottom}</footer>
  }

  return (
    <footer className="mt-section overflow-hidden rounded-t-[var(--radius-section-sm)] bg-plum text-milk md:rounded-t-[var(--radius-section)]">
      <FooterMarquee words={[brand, ...t('values').split(' · ')]} socials={socials} socialLabel={t('socialLabel')} />

      <div className="container-site border-t border-milk/15 pt-10 pb-8 md:pt-14">
        <div className="mb-8 md:hidden">
          <Logo name={brand} tone="milk" />
        </div>
        {/* Десктоп: колонки */}
        <div className="hidden gap-8 md:grid md:grid-cols-2 lg:grid-cols-4">
          {columns.map((col) => (
            <div key={col.title}>
              <h2 className="t-caption mb-4 text-lavender">{col.title}</h2>
              <ul className="flex flex-col gap-1">
                {col.links.map((link, i) => (
                  <li key={i}>
                    <TransitionLink href={link.href} className="inline-flex min-h-9 items-center text-[15px] text-milk/90 underline-offset-4 hover:text-milk hover:underline">
                      {link.label}
                    </TransitionLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div>
            <h2 className="t-caption mb-4 text-lavender">{t('colSubscribe')}</h2>
            <p className="t-small mb-4 text-milk/85">{t('subscribeText')}</p>
            <LazyNewsletterForm />
          </div>
        </div>
        {/* Мобайл: колонки аккордеоном, подписка на всю ширину */}
        <div className="flex flex-col md:hidden">
          {columns.map((col) => (
            <details key={col.title} className="group/f border-b border-milk/15">
              <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between text-[16px] font-semibold [&::-webkit-details-marker]:hidden">
                {col.title}
                <Plus aria-hidden className="size-5 transition-transform duration-[400ms] ease-soft group-open/f:rotate-45" strokeWidth={1.5} />
              </summary>
              <ul className="flex flex-col pb-4">
                {col.links.map((link, i) => (
                  <li key={i}>
                    <TransitionLink href={link.href} className="flex min-h-11 items-center text-[15px] text-milk/90">
                      {link.label}
                    </TransitionLink>
                  </li>
                ))}
              </ul>
            </details>
          ))}
          <div className="pt-8">
            <h2 className="t-caption mb-3 text-lavender">{t('colSubscribe')}</h2>
            <p className="t-small mb-4 text-milk/85">{t('subscribeText')}</p>
            <LazyNewsletterForm />
          </div>
        </div>
      </div>
      {bottom}
    </footer>
  )
}
