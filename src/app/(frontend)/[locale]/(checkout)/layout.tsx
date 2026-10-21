import { isLocale, routing } from '@/i18n/routing'
import { SiteChrome } from '@/components/layout/SiteChrome'
import { MaintenanceGate } from '@/components/layout/MaintenanceGate'

type Props = { children: React.ReactNode; params: Promise<{ locale: string }> }

/** Оформление: шапка не прячется, подвал упрощённый (только нижняя полоса с копирайтом и @fra1ton27) */
export default async function CheckoutLayout({ children, params }: Props) {
  const raw = (await params).locale
  return (
    <MaintenanceGate locale={isLocale(raw) ? raw : routing.defaultLocale}>
      <SiteChrome variant="checkout">{children}</SiteChrome>
    </MaintenanceGate>
  )
}
