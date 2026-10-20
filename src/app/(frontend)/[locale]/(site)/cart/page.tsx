import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Locale } from '@/i18n/routing'
import { getCatalogIndex } from '@/lib/data/catalog'
import { getContacts } from '@/lib/data/globals'
import { pageMetadata } from '@/lib/seo'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { SplitHeading } from '@/components/motion/SplitHeading'
import { CartView } from '@/components/cart/CartView'

type Props = { params: Promise<{ locale: Locale }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'cart' })
  return pageMetadata({ locale, route: '/cart', title: t('title'), noindex: true })
}

/** Корзина: состав и цены пересчитываются на сервере, сама корзина живёт в браузере (у вошедшего — и в БД) */
export default async function CartPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('cart')
  const tn = await getTranslations('nav')
  const [index, contacts] = await Promise.all([getCatalogIndex(locale), getContacts(locale)])
  const popular = [...index].sort((a, b) => b.popularity - a.popularity).slice(0, 8)
  return (
    <div className="container-site pt-6 pb-8 md:pt-10">
      <Breadcrumbs items={[{ label: tn('home'), href: '/' }, { label: t('title') }]} />
      <SplitHeading as="h1" by="chars" immediate className="t-h1 mt-4 mb-8">
        {t('title')}
      </SplitHeading>
      <CartView
        popular={popular}
        suggestions={index}
        displayCurrency={contacts.displayCurrency && contacts.displayCurrency !== contacts.currency ? { code: contacts.displayCurrency, rate: contacts.displayRate } : null}
      />
    </div>
  )
}
