import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Locale } from '@/i18n/routing'
import { getCustomerDoc, requireCustomer } from '@/lib/data/account'
import { pageMetadata } from '@/lib/seo'
import { AddressesView } from '@/components/account/AddressesView'
import { AccountPageHead } from '@/components/account/AccountSectionHead'

type Props = { params: Promise<{ locale: Locale }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'account' })
  return pageMetadata({ locale, route: '/account/addresses', title: t('nav.addresses'), noindex: true })
}

export default async function AccountAddressesPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const session = await requireCustomer(locale)
  const t = await getTranslations('account')
  const customer = await getCustomerDoc(session.id)
  const addresses = (customer.addresses ?? []).map((a) => ({
    id: a.id ?? '',
    label: a.label ?? null,
    city: a.city,
    postalCode: a.postalCode ?? null,
    street: a.street,
    apartment: a.apartment ?? null,
    floor: a.floor ?? null,
    elevator: Boolean(a.elevator),
    isDefault: Boolean(a.isDefault),
  }))
  return (
    <div>
      <AccountPageHead title={t('nav.addresses')} lead={t('addressesLead')} />
      <AddressesView initial={addresses} />
    </div>
  )
}
