import type { Locale } from '@/i18n/routing'
import { LegalPage, contentPageMetadata } from '@/components/layout/LegalPage'

type Props = { params: Promise<{ locale: Locale }> }

export const generateMetadata = (props: Props) => contentPageMetadata('privacy', '/privacy', props)

export default function PrivacyPage(props: Props) {
  return <LegalPage pageKey="privacy" {...props} />
}
