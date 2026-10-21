import type { Locale } from '@/i18n/routing'
import { LegalPage, contentPageMetadata } from '@/components/layout/LegalPage'

type Props = { params: Promise<{ locale: Locale }> }

export const generateMetadata = (props: Props) => contentPageMetadata('delivery', '/delivery', props)

export default function DeliveryPage(props: Props) {
  return <LegalPage pageKey="delivery" {...props} />
}
