import type { Locale } from '@/i18n/routing'
import { LegalPage, contentPageMetadata } from '@/components/layout/LegalPage'

type Props = { params: Promise<{ locale: Locale }> }

export const generateMetadata = (props: Props) => contentPageMetadata('terms', '/terms', props)

export default function TermsPage(props: Props) {
  return <LegalPage pageKey="terms" {...props} />
}
