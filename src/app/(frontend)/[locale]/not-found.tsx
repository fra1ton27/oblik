import { getTranslations } from 'next-intl/server'

export default async function LocaleNotFound() {
  const t = await getTranslations('errors')
  return (
    <main id="main" className="container-site section-y">
      <h1 className="t-h1">{t('notFoundTitle')}</h1>
    </main>
  )
}
