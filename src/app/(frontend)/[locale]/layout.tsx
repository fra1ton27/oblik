import '@/styles/globals.css'
import type { Metadata, Viewport } from 'next'
import { notFound } from 'next/navigation'
import Script from 'next/script'
import { hasLocale, NextIntlClientProvider } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { htmlLang, routing } from '@/i18n/routing'
import { site } from '@/config/site'
import { fontVariables } from '../fonts'

type Props = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale: hasLocale(routing.locales, locale) ? locale : 'ru', namespace: 'seo' })
  return {
    metadataBase: new URL(site.url),
    title: {
      default: t('defaultTitle', { brand: site.name }),
      template: t('titleTemplate', { brand: site.name }),
    },
    description: t('defaultDescription'),
    applicationName: site.name,
    authors: [{ name: site.developer.handle, url: site.developer.url }],
    icons: { icon: '/favicon.svg' },
  }
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#F7F3EE',
}

// Стартовые состояния анимаций ставятся только когда JS жив; страховка снимает их через 4 с.
const jsReadyScript = `(function(){var d=document.documentElement;d.classList.add('js-ready');setTimeout(function(){if(!window.__oblikHydrated)d.classList.remove('js-ready')},4000)})();`

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  setRequestLocale(locale)

  return (
    <html lang={htmlLang[locale]} className={fontVariables} suppressHydrationWarning>
      <body>
        <Script id="js-ready" strategy="beforeInteractive">
          {jsReadyScript}
        </Script>
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  )
}
