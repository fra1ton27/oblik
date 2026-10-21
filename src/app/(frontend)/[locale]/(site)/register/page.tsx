import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { redirect } from '@/i18n/navigation'
import type { Locale } from '@/i18n/routing'
import { getSessionCustomer } from '@/lib/auth'
import { pageMetadata } from '@/lib/seo'
import { AuthShell } from '@/components/account/AuthShell'
import { RegisterForm } from '@/components/account/RegisterForm'

type Props = { params: Promise<{ locale: Locale }>; searchParams: Promise<{ returnTo?: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'auth' })
  return pageMetadata({ locale, route: '/register', title: t('metaRegister'), noindex: true })
}

export default async function RegisterPage({ params, searchParams }: Props) {
  const { locale } = await params
  const { returnTo } = await searchParams
  setRequestLocale(locale)
  if (await getSessionCustomer()) redirect({ href: '/account', locale })
  const t = await getTranslations('auth')
  return (
    <AuthShell title={t('registerTitle')} lead={t('registerLead')}>
      <RegisterForm loginQuery={returnTo ? { returnTo } : undefined} />
    </AuthShell>
  )
}
