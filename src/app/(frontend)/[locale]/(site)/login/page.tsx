import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Locale } from '@/i18n/routing'
import { getSessionCustomer } from '@/lib/auth'
import { verifyEmailToken } from '@/lib/actions/auth'
import { safeReturnTo } from '@/lib/paths'
import { pageMetadata } from '@/lib/seo'
import { AuthNotice, AuthShell } from '@/components/account/AuthShell'
import { LoginForm } from '@/components/account/LoginForm'

// Динамическая страница: returnTo из query и проверка сессии. Явно, чтобы сборка без БД (src/lib/build.ts) не сочла её статической
export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ locale: Locale }>; searchParams: Promise<{ returnTo?: string; verify?: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'auth' })
  return pageMetadata({ locale, route: '/login', title: t('metaLogin'), noindex: true })
}

/** Вход. ?verify=… — ссылка из письма подтверждения; ?returnTo=… — куда вернуть после входа */
export default async function LoginPage({ params, searchParams }: Props) {
  const { locale } = await params
  const { returnTo, verify } = await searchParams
  setRequestLocale(locale)
  const t = await getTranslations('auth')
  const target = safeReturnTo(returnTo, locale)
  const verified = verify ? await verifyEmailToken(verify) : null
  // уже вошедшего сразу отправляем дальше (target — проверенный локализованный путь, поэтому next/navigation)
  if (!verify && (await getSessionCustomer())) redirect(target)

  return (
    <AuthShell
      title={t('loginTitle')}
      lead={t('loginLead')}
      notice={verified === true ? <AuthNotice>{t('verifiedOk')}</AuthNotice> : verified === false ? <AuthNotice tone="error">{t('verifiedFail')}</AuthNotice> : null}
    >
      <LoginForm returnTo={target} registerQuery={returnTo ? { returnTo } : undefined} />
    </AuthShell>
  )
}
