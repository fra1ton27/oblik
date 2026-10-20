import { SiteChrome } from '@/components/layout/SiteChrome'
import { NotFoundView } from '@/components/layout/NotFoundView'

// notFound() вне группы (site): оборачиваем в шапку и подвал вручную
export default function LocaleNotFound() {
  return (
    <SiteChrome>
      <NotFoundView />
    </SiteChrome>
  )
}
