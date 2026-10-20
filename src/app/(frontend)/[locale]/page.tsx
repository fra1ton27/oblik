import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Locale } from '@/i18n/routing'
import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher'

type Props = { params: Promise<{ locale: Locale }> }

export default async function HomePage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('home')

  return (
    <main id="main" className="container-site section-y">
      <h1 className="t-display">
        {t('heroLine1')}
        <br />
        {t('heroLine2')}
      </h1>
      <div className="mt-8">
        <LanguageSwitcher />
      </div>
    </main>
  )
}
