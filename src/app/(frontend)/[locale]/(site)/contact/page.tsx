import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Clock, Mail, MapPin, Phone } from 'lucide-react'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Locale } from '@/i18n/routing'
import { getPageByKey } from '@/lib/data/pages'
import { getContacts } from '@/lib/data/globals'
import { getLayoutData } from '@/lib/data/layout'
import { toImage } from '@/lib/media'
import { RenderBlocks } from '@/blocks/RenderBlocks'
import { PageHero } from '@/blocks/Hero/PageHero'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { TiltCard } from '@/components/motion/TiltCard'
import { ContactForm } from '@/components/forms/ContactForm'
import { MapFacade } from '@/components/layout/MapFacade'
import { contentPageMetadata } from '@/components/layout/LegalPage'

type Props = { params: Promise<{ locale: Locale }> }

export const generateMetadata = (props: Props): Promise<Metadata> => contentPageMetadata('contact', '/contact', props)

/** Контакты и шоурум: адрес, часы, телефон, мессенджеры, карта по клику, форма обратной связи (данные из siteSettings) */
export default async function ContactPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const [page, contacts, layout] = await Promise.all([getPageByKey('contact', locale), getContacts(locale), getLayoutData(locale)])
  if (!page) notFound()
  const t = await getTranslations('pages')
  const tn = await getTranslations('nav')
  const row = 'flex items-start gap-3'
  const icon = 'mt-0.5 size-5 shrink-0 text-ink-soft'

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

      <section className="container-site grid grid-cols-1 gap-10 lg:grid-cols-12">
        <div className="flex min-w-0 flex-col gap-6 lg:col-span-5">
          <div className="flex flex-col gap-5 rounded-card bg-paper p-5 sm:p-7">
            <h2 className="t-h3">{t('showroom')}</h2>
            {contacts.address && (
              <div className={row}>
                <MapPin aria-hidden className={icon} strokeWidth={1.5} />
                <address className="t-body not-italic">{contacts.address}</address>
              </div>
            )}
            {contacts.hours.length > 0 && (
              <div className={row}>
                <Clock aria-hidden className={icon} strokeWidth={1.5} />
                <div className="min-w-0 flex-1">
                  <p className="text-[15px] font-semibold">{t('hours')}</p>
                  <dl className="mt-1 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-[15px]">
                    {contacts.hours.map((h) => (
                      <div key={h.days} className="contents">
                        <dt className="text-ink-soft">{h.days}</dt>
                        <dd>{h.time}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
            )}
            <div className={row}>
              <Phone aria-hidden className={icon} strokeWidth={1.5} />
              <a href={`tel:${contacts.phone.replace(/[^\d+]/g, '')}`} className="text-[17px] font-semibold underline-offset-4 hover:underline">
                {contacts.phone}
              </a>
            </div>
            <div className={row}>
              <Mail aria-hidden className={icon} strokeWidth={1.5} />
              <a href={`mailto:${contacts.email}`} className="text-[17px] font-semibold break-all underline-offset-4 hover:underline">
                {contacts.email}
              </a>
            </div>
            {layout.contacts.messengers.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {layout.contacts.messengers.map((m) => (
                  <a key={m.label} href={m.href} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center rounded-pill border border-line px-4 text-[14px] font-semibold hover:bg-milk">
                    {m.label}
                  </a>
                ))}
              </div>
            )}
          </div>
          <MapFacade lat={contacts.map.lat} lng={contacts.map.lng} image={contacts.map.image} address={contacts.address} />
        </div>

        <div className="min-w-0 lg:col-span-6 lg:col-start-7">
          <TiltCard tilt={2} mobileTilt={0} className="rounded-card bg-paper p-5 shadow-float sm:p-8">
            <h2 className="t-h3 mb-2">{t('writeUs')}</h2>
            <p className="t-small mb-6 font-normal text-ink-soft">{t('writeUsLead', { time: contacts.responseTime || t('defaultResponseTime') })}</p>
            <ContactForm />
          </TiltCard>
        </div>
      </section>

      <RenderBlocks blocks={page.layout} context={{ locale, page: 'page' }} />
    </>
  )
}
