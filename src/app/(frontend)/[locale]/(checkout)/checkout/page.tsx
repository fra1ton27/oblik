import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Locale } from '@/i18n/routing'
import { getContacts } from '@/lib/data/globals'
import { pageMetadata } from '@/lib/seo'
import { CheckoutView } from '@/components/checkout/CheckoutView'

type Props = { params: Promise<{ locale: Locale }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'checkout' })
  return pageMetadata({ locale, route: '/checkout', title: t('metaTitle'), noindex: true })
}

export default async function CheckoutPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('checkout')
  const contacts = await getContacts(locale)
  return (
    <div className="container-site pt-6 pb-10 md:pt-10">
      <h1 className="t-h1 mb-8">{t('title')}</h1>
      <CheckoutView showroom={contacts.address} />
    </div>
  )
}
