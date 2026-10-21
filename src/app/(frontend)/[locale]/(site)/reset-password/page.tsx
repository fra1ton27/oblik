import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Locale } from '@/i18n/routing'
import { localizedPath } from '@/lib/paths'
import { pageMetadata } from '@/lib/seo'
import { AuthShell } from '@/components/account/AuthShell'
import { ForgotForm, NewPasswordForm } from '@/components/account/ResetForms'

type Props = { params: Promise<{ locale: Locale }>; searchParams: Promise<{ token?: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'auth' })
  return pageMetadata({ locale, route: '/reset-password', title: t('metaReset'), noindex: true })
}

/** Восстановление пароля: без токена — шаг 1 (email), с ?token=… из письма — шаг 2 (новый пароль) */
export default async function ResetPasswordPage({ params, searchParams }: Props) {
  const { locale } = await params
  const { token } = await searchParams
  setRequestLocale(locale)
  const t = await getTranslations('auth')
  const step2 = typeof token === 'string' && token.length > 0
  return (
    <AuthShell title={step2 ? t('resetTitle') : t('forgotTitle')} lead={step2 ? t('resetLead') : t('forgotLead')}>
      {step2 ? <NewPasswordForm token={token} accountHref={localizedPath('/account', {}, locale)} /> : <ForgotForm />}
    </AuthShell>
  )
}
