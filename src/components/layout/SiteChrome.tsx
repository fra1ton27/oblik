import { getLocale, getTranslations } from 'next-intl/server'
import type { Locale } from '@/i18n/routing'
import { getLayoutData } from '@/lib/data/layout'
import { Header } from './Header'
import { Footer } from './Footer'

type Props = {
  children: React.ReactNode
  /** checkout: шапка не прячется, подвал упрощённый (без бегущей строки и колонок) */
  variant?: 'default' | 'checkout'
}

/** Общая обёртка страниц: ссылка «Перейти к содержанию», шапка, <main>, подвал с подписью @fra1ton27 */
export async function SiteChrome({ children, variant = 'default' }: Props) {
  const locale = (await getLocale()) as Locale
  const t = await getTranslations('common')
  const data = await getLayoutData(locale)

  return (
    <>
      <a
        href="#main"
        className="sr-only-focusable top-3 left-3 z-[95] rounded-pill bg-ink px-5 py-3 text-[15px] font-semibold text-milk"
      >
        {t('skipToContent')}
      </a>
      <Header brand={data.brand} items={data.nav} contacts={data.contacts} sticky={variant === 'checkout'} />
      <main id="main" tabIndex={-1} className="outline-none">
        {children}
      </main>
      <Footer
        brand={data.brand}
        columns={data.footerColumns}
        socials={data.socials}
        variant={variant === 'checkout' ? 'simple' : 'full'}
      />
    </>
  )
}
