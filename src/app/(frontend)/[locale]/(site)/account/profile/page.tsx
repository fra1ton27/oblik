import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { redirect } from '@/i18n/navigation'
import { isLocale, type Locale } from '@/i18n/routing'
import { confirmEmailChange } from '@/lib/actions/account'
import { getCustomerDoc, requireCustomer } from '@/lib/data/account'
import { pageMetadata } from '@/lib/seo'
import { AccountPageHead } from '@/components/account/AccountSectionHead'
import { DeletionRequest, EmailForm, PasswordForm, ProfileForm } from '@/components/account/ProfileForms'

type Props = { params: Promise<{ locale: Locale }>; searchParams: Promise<{ confirmEmail?: string; email?: string }> }

const outcomes = ['ok', 'invalid', 'taken'] as const

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'account' })
  return pageMetadata({ locale, route: '/account/profile', title: t('nav.profile'), noindex: true })
}

/**
 * Профиль: имя, телефон, язык писем, рассылка, пароль, email (с подтверждением), удаление.
 * ?confirmEmail=… — ссылка из письма на новый адрес: подтверждаем и уходим редиректом на ?email=итог,
 * чтобы меню кабинета перерисовалось с новым адресом, а токен не остался в адресной строке.
 */
export default async function AccountProfilePage({ params, searchParams }: Props) {
  const { locale } = await params
  const { confirmEmail, email } = await searchParams
  setRequestLocale(locale)
  const session = await requireCustomer(locale)
  if (confirmEmail) redirect({ href: { pathname: '/account/profile', query: { email: await confirmEmailChange(confirmEmail) } }, locale })
  const t = await getTranslations('account')
  const confirmed = outcomes.find((o) => o === email) ?? null
  const customer = await getCustomerDoc(session.id)

  return (
    <div className="flex flex-col gap-6">
      <AccountPageHead title={t('nav.profile')} />
      {confirmed && (
        <p role={confirmed === 'ok' ? 'status' : 'alert'} className={confirmed === 'ok' ? 'rounded-card bg-pistachio p-4 text-[15px] font-semibold' : 'rounded-card border border-error bg-paper p-4 text-[15px] font-semibold text-error'}>
          {confirmed === 'ok' ? t('emailChanged', { email: customer.email }) : confirmed === 'taken' ? t('emailTakenNotice') : t('emailLinkInvalid')}
        </p>
      )}
      <ProfileForm
        initial={{
          name: customer.name ?? '',
          phone: customer.phone ?? '',
          locale: isLocale(customer.locale) ? customer.locale : locale,
          newsletter: Boolean(customer.newsletter),
        }}
      />
      <PasswordForm />
      <EmailForm email={customer.email} pending={customer.pendingEmail ?? null} />
      <DeletionRequest requestedAt={customer.deletionRequestedAt ?? null} />
    </div>
  )
}
