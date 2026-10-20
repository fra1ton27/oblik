import '@/styles/globals.css'
import type { Metadata, Viewport } from 'next'
import { notFound } from 'next/navigation'
import { hasLocale, NextIntlClientProvider } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { htmlLang, routing } from '@/i18n/routing'
import { site } from '@/config/site'
import { fontVariables } from '../fonts'
import { PageTransitionProvider } from '@/components/motion/PageTransition'
import { Toaster } from '@/components/ui/Toast'
import { ClientBoot } from '@/components/layout/ClientBoot'
import { SmoothScroll } from '@/components/motion/SmoothScroll'
import { Preloader } from '@/components/motion/Preloader'
import { CookieConsent } from '@/components/layout/CookieConsent'
import { MiniCart } from '@/components/cart/MiniCart'
import { CartSync } from '@/components/cart/CartSync'

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
// Там же решается, показывать ли прелоадер (первый визит в сессии, без reduced motion).
const bootScript = `(function(){var d=document.documentElement;d.classList.add('js-ready');try{if(!sessionStorage.getItem('oblik-preloaded')&&!matchMedia('(prefers-reduced-motion: reduce)').matches){d.classList.add('show-preloader')}}catch(e){}setTimeout(function(){if(!window.__oblikHydrated){d.classList.remove('js-ready');d.classList.remove('show-preloader')}},4000)})();`

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  setRequestLocale(locale)

  return (
    <html lang={htmlLang[locale]} className={fontVariables} suppressHydrationWarning>
      <head>
        {/* Выполняется до первой отрисовки: next/script beforeInteractive ставится в очередь бандла и опоздал бы */}
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body>
        <NextIntlClientProvider>
          <SmoothScroll>
            <PageTransitionProvider>
              {children}
              <MiniCart />
              <CartSync />
              <Toaster />
              <CookieConsent />
              <Preloader />
              <ClientBoot />
            </PageTransitionProvider>
          </SmoothScroll>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
