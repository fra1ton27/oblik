import { setRequestLocale } from 'next-intl/server'
import { isLocale, routing } from '@/i18n/routing'
import { getCustomerDoc, requireCustomer } from '@/lib/data/account'
import { AccountNav } from '@/components/account/AccountNav'

// Динамический раздел: сессия покупателя из cookie. Явно, чтобы сборка без БД (src/lib/build.ts) не сочла его статическим
export const dynamic = 'force-dynamic'

type Props = { children: React.ReactNode; params: Promise<{ locale: string }> }

/**
 * Кабинет: все страницы динамические, сессия проверяется на сервере здесь и в каждой странице
 * (layout не перерисовывается при переходах между разделами). Без входа — на вход с returnTo.
 */
export default async function AccountLayout({ children, params }: Props) {
  const raw = (await params).locale
  // у layout Next типизирует params строками; локаль уже проверена корневым layout
  const locale = isLocale(raw) ? raw : routing.defaultLocale
  setRequestLocale(locale)
  const session = await requireCustomer(locale)
  const customer = await getCustomerDoc(session.id)
  return (
    <div className="container-site pt-6 pb-10 md:pt-10">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-10">
        <aside className="min-w-0 lg:col-span-3">
          <div className="lg:sticky lg:top-[calc(var(--header-h)+24px)]">
            <AccountNav name={customer.name ?? ''} email={customer.email} />
          </div>
        </aside>
        <div className="min-w-0 lg:col-span-9">{children}</div>
      </div>
    </div>
  )
}
