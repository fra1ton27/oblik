import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Locale } from '@/i18n/routing'
import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher'
import { DisplayHeading } from '@/components/ui/DisplayHeading'

type Props = { params: Promise<{ locale: Locale }> }

export default async function HomePage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('home')

  return (
    <div className="container-site section-y">
      <DisplayHeading lines={[t('heroLine1'), t('heroLine2')]} />
      <div className="mt-8">
        <LanguageSwitcher />
      </div>
    </div>
  )
}
