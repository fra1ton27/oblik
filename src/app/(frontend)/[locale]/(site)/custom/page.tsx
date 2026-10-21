import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ArrowDown } from 'lucide-react'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Locale } from '@/i18n/routing'
import { getPageByKey } from '@/lib/data/pages'
import { getContacts } from '@/lib/data/globals'
import { toImage } from '@/lib/media'
import { fitToLongestWord } from '@/lib/typography'
import { RenderBlocks } from '@/blocks/RenderBlocks'
import { PageHero } from '@/blocks/Hero/PageHero'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { buttonClasses } from '@/components/ui/Button'
import { TiltCard } from '@/components/motion/TiltCard'
import { Terrace } from '@/components/shapes'
import { LazyCustomOrderForm } from '@/components/forms/LazyForms'
import { contentPageMetadata } from '@/components/layout/LegalPage'

type Props = { params: Promise<{ locale: Locale }> }

export const generateMetadata = (props: Props): Promise<Metadata> => contentPageMetadata('custom', '/custom', props)

/** Мебель на заказ: как проходит работа, примеры, FAQ и форма заявки с файлами (раздел 10.1 ТЗ) */
export default async function CustomPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const [page, contacts] = await Promise.all([getPageByKey('custom', locale), getContacts(locale)])
  if (!page) notFound()
  const t = await getTranslations('pages')
  const tn = await getTranslations('nav')

  return (
    <>
      <PageHero
        lines={[page.title]}
        lead={page.intro ?? undefined}
        image={toImage(page.heroImage, 'hero', page.title)}
        variant="page"
        priority
        breadcrumbs={<Breadcrumbs items={[{ label: tn('home'), href: '/' }, { label: page.title }]} />}
      />
      <div className="container-site -mt-4 mb-4">
        <a href="#custom-form" className={buttonClasses()}>
          <ArrowDown aria-hidden className="size-5" strokeWidth={1.5} />
          {t('customCta')}
        </a>
      </div>

      <RenderBlocks blocks={page.layout} context={{ locale, page: 'page' }} />

      <section id="custom-form" aria-labelledby="custom-form-title" className="container-site mt-section scroll-mt-[calc(var(--header-h)+16px)]">
        <div className="relative isolate grid gap-8 overflow-hidden rounded-section bg-pistachio px-3 py-10 sm:px-6 md:px-10 md:py-16 lg:grid-cols-12">
          <Terrace color="pistachio" tone steps={5} unit={8} flip className="absolute bottom-0 left-0 -z-10 hidden h-[45%] w-auto md:block" />
          <div className="px-2 sm:px-0 lg:col-span-4" style={{ containerType: 'inline-size' }}>
            <h2 id="custom-form-title" className="t-h1" style={fitToLongestWord(t('customFormTitle'), 'clamp(32px, 16px + 5.556vw, 96px)')}>
              {t('customFormTitle')}
            </h2>
            <p className="t-lead mt-4 text-ink-soft">{t('customFormLead', { time: contacts.responseTime || t('defaultResponseTime') })}</p>
          </div>
          <div className="min-w-0 lg:col-span-7 lg:col-start-6">
            <TiltCard tilt={-2} mobileTilt={0} className="rounded-card bg-paper p-5 shadow-float sm:p-8">
              <LazyCustomOrderForm />
            </TiltCard>
          </div>
        </div>
      </section>
    </>
  )
}
