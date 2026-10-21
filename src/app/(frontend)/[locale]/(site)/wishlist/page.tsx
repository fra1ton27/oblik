import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Locale } from '@/i18n/routing'
import { pageMetadata } from '@/lib/seo'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { SplitHeading } from '@/components/motion/SplitHeading'
import { WishlistView } from '@/components/account/WishlistView'

type Props = { params: Promise<{ locale: Locale }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'account' })
  return pageMetadata({ locale, route: '/wishlist', title: t('nav.wishlist'), noindex: true })
}

/** Избранное и для гостей: хранится в браузере, при входе переносится в кабинет */
export default async function WishlistPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('account')
  const tn = await getTranslations('nav')
  return (
    <div className="container-site pt-6 pb-10 md:pt-10">
      <Breadcrumbs items={[{ label: tn('home'), href: '/' }, { label: t('nav.wishlist') }]} />
      <SplitHeading as="h1" by="chars" immediate className="t-h1 mt-4 mb-8">
        {t('nav.wishlist')}
      </SplitHeading>
      <WishlistView guestNote />
    </div>
  )
}
