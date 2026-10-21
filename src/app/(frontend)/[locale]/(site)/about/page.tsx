import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Locale } from '@/i18n/routing'
import { getPageByKey } from '@/lib/data/pages'
import { getDesigners } from '@/lib/data/catalog'
import { toImage } from '@/lib/media'
import { RenderBlocks } from '@/blocks/RenderBlocks'
import { PageHero } from '@/blocks/Hero/PageHero'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { buttonClasses } from '@/components/ui/Button'
import { TransitionLink } from '@/components/motion/TransitionLink'
import { TiltCard } from '@/components/motion/TiltCard'
import { Arch } from '@/components/shapes'
import { contentPageMetadata } from '@/components/layout/LegalPage'

type Props = { params: Promise<{ locale: Locale }> }

export const generateMetadata = (props: Props): Promise<Metadata> => contentPageMetadata('about', '/about', props)

/** О компании и производство: история, этапы производства, цех в цифрах, фото цеха, материалы, команда */
export default async function AboutPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const [page, designers] = await Promise.all([getPageByKey('about', locale), getDesigners(locale)])
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
      <RenderBlocks blocks={page.layout} context={{ locale, page: 'page' }} />

      {designers.length > 0 && (
        <section aria-labelledby="about-team" className="container-site mt-section">
          <h2 id="about-team" className="t-h1 mb-10">
            {t('team')}
          </h2>
          <ul className="grid gap-10 md:grid-cols-3">
            {designers.map((d, i) => (
              <li key={d.id} className="flex flex-col gap-4">
                <TiltCard tilt={[-2, 2, -3][i % 3]} mobileTilt={0}>
                  <Arch aspect="4 / 5" className="bg-sand">
                    {d.photo && <Image src={d.photo.src} alt={d.photo.alt} fill sizes="(min-width: 768px) 30vw, 92vw" placeholder="blur" blurDataURL={d.photo.blur} className="object-cover" />}
                  </Arch>
                </TiltCard>
                <div>
                  <h3 className="t-serif">{d.name}</h3>
                  {d.role && <p className="t-small mt-1 text-ink-soft">{d.role}</p>}
                </div>
                {d.bio && <p className="t-body text-ink-soft">{d.bio}</p>}
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="container-site mt-section">
        <div className="flex flex-col items-start gap-6 rounded-section bg-mist px-5 py-10 md:px-12 md:py-14 lg:flex-row lg:items-center lg:justify-between">
          <h2 className="t-h2 max-w-[18ch]">{t('aboutCta')}</h2>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap">
            <TransitionLink href="/custom" className={buttonClasses({ fullWidth: true, className: 'sm:w-auto' })}>
              {t('aboutCtaCustom')}
            </TransitionLink>
            <TransitionLink href="/contact" className={buttonClasses({ variant: 'secondary', fullWidth: true, className: 'sm:w-auto' })}>
              {t('aboutCtaContact')}
            </TransitionLink>
          </div>
        </div>
      </section>
    </>
  )
}
