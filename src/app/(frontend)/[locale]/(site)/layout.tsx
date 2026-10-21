import { isLocale, routing } from '@/i18n/routing'
import { SiteChrome } from '@/components/layout/SiteChrome'
import { MaintenanceGate } from '@/components/layout/MaintenanceGate'

type Props = { children: React.ReactNode; params: Promise<{ locale: string }> }

export default async function SiteLayout({ children, params }: Props) {
  const raw = (await params).locale
  return (
    <MaintenanceGate locale={isLocale(raw) ? raw : routing.defaultLocale}>
      <SiteChrome>{children}</SiteChrome>
    </MaintenanceGate>
  )
}
