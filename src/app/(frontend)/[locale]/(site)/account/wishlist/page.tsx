import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Locale } from '@/i18n/routing'
import { requireCustomer } from '@/lib/data/account'
import { pageMetadata } from '@/lib/seo'
import { WishlistView } from '@/components/account/WishlistView'
import { AccountPageHead } from '@/components/account/AccountSectionHead'

type Props = { params: Promise<{ locale: Locale }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'account' })
  return pageMetadata({ locale, route: '/account/wishlist', title: t('nav.wishlist'), noindex: true })
}

/** Избранное в кабинете: то же хранилище, что у гостя, синхронизировано с customers.favorites */
export default async function AccountWishlistPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  await requireCustomer(locale)
  const t = await getTranslations('account')
  return (
    <div>
      <AccountPageHead title={t('nav.wishlist')} />
      <WishlistView />
    </div>
  )
}
