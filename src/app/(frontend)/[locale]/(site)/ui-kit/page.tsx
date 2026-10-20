import { readFileSync } from 'node:fs'
import path from 'node:path'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Locale } from '@/i18n/routing'
import { contrast, parseColorTokens } from '@/lib/contrast'
import { formatNumber } from '@/lib/format'
import { Arch, Brackets, Disc, HandCircle, Terrace } from '@/components/shapes'
import { StepReveal } from '@/components/motion/StepReveal'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { Accordion } from '@/components/ui/Accordion'
import { Marquee } from '@/components/ui/Marquee'
import { ProductCardSkeleton, Skeleton } from '@/components/ui/Skeleton'
import { Stepper } from '@/components/ui/Stepper'
import { Badge, Tag } from '@/components/ui/Chip'
import { UiKitInteractive } from '@/components/ui/kit/UiKitInteractive'
import { EmptyState } from '@/components/ui/EmptyState'
import { buttonClasses } from '@/components/ui/Button'
import { TransitionLink } from '@/components/motion/TransitionLink'

type Props = { params: Promise<{ locale: Locale }> }

export const metadata: Metadata = { robots: { index: false, follow: false } }

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="border-t border-line py-12 md:py-16">
    <h2 className="t-h2 mb-8">{title}</h2>
    {children}
  </section>
)

export default async function UiKitPage({ params }: Props) {
  if (process.env.NODE_ENV === 'production') notFound()
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('uiKit')
  const tNav = await getTranslations('nav')

  const tokens = parseColorTokens(readFileSync(path.join(process.cwd(), 'src/styles/tokens.css'), 'utf8'))

  return (
    <div className="container-site pt-12 pb-24">
      <Breadcrumbs items={[{ label: tNav('home'), href: '/' }, { label: t('title') }]} />
      <h1 className="t-h1 mt-6">{t('title')}</h1>
      <p className="t-lead mt-4 max-w-2xl text-ink-soft">{t('lead')}</p>

      <Section title={t('colors')}>
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {Object.entries(tokens).map(([name, hex]) => {
            const onMilk = contrast(hex, tokens.milk)
            const text = contrast(tokens.ink, hex) >= 4.5 ? 'text-ink' : 'text-milk'
            return (
              <li key={name} className="overflow-hidden rounded-card border border-line bg-paper">
                <div className={`flex h-24 items-end p-3 ${text}`} style={{ background: `var(--color-${name})` }}>
                  <span className="t-caption">{name}</span>
                </div>
                <div className="t-small flex flex-col p-3">
                  <span className="font-mono uppercase">{hex}</span>
                  <span className="text-ink-soft">
                    {t('contrast', { value: formatNumber(onMilk, locale, { maximumFractionDigits: 1 }) })}
                  </span>
                </div>
              </li>
            )
          })}
        </ul>
      </Section>

      <Section title={t('typography')}>
        <div className="flex flex-col gap-8">
          <p className="t-display">{t('sampleDisplay')}</p>
          <p className="t-h1">{t('sampleHeading')}</p>
          <p className="t-h2">{t('sampleHeading')}</p>
          <p className="t-h3">{t('sampleHeading')}</p>
          <p className="t-lead max-w-3xl">{t('sampleLead')}</p>
          <p className="t-body max-w-3xl">{t('sampleBody')}</p>
          <p className="t-small max-w-3xl">{t('sampleBody')}</p>
          <p className="t-caption">{t('sampleCaption')}</p>
          <p className="t-serif">{t('sampleSerif')}</p>
          <div className="rounded-card bg-paper p-6">
            <p className="t-caption mb-3 text-ink-soft">{t('diacritics')}</p>
            {/* Проверка сербской диакритики во всех трёх шрифтах */}
            <p className="font-display text-[32px]" lang="sr-Latn">{t('diacriticsLetters')}</p>
            <p className="font-sans text-[24px]" lang="sr-Latn">{t('diacriticsSample')}</p>
            <p className="font-serif text-[28px] italic" lang="sr-Latn">{t('diacriticsSample')}</p>
          </div>
        </div>
      </Section>

      <Section title={t('shapes')}>
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4 xl:grid-cols-5">
          {[3, 4, 5, 6, 7].map((steps, i) => (
            <figure key={steps} className="flex flex-col gap-3">
              <div className="flex aspect-square items-end rounded-card bg-paper p-4">
                <StepReveal className="w-full">
                  <Terrace steps={steps} color={(['lavender', 'pistachio', 'blush', 'mist', 'plum'] as const)[i]} className="w-full" />
                </StepReveal>
              </div>
              <figcaption className="t-small">{t('terrace', { steps })}</figcaption>
            </figure>
          ))}
          <figure className="flex flex-col gap-3">
            <Arch aspect="4 / 5">
              <div className="absolute inset-0 bg-blush" />
            </Arch>
            <figcaption className="t-small">{t('arch')}</figcaption>
          </figure>
          <figure className="flex flex-col gap-3">
            <div className="flex aspect-square items-center rounded-card bg-paper p-4">
              <Disc color="pistachio" />
            </div>
            <figcaption className="t-small">{t('disc')}</figcaption>
          </figure>
          <figure className="flex flex-col gap-3">
            <button type="button" className="group relative aspect-square rounded-card bg-mist">
              <Brackets inset={-12} />
              <span className="t-small">{t('hoverMe')}</span>
            </button>
            <figcaption className="t-small">{t('brackets')}</figcaption>
          </figure>
          <figure className="flex flex-col gap-3">
            <button type="button" className="group relative flex aspect-square items-center justify-center rounded-card bg-paper">
              <span className="relative px-6 py-4">
                <HandCircle className="inset-0 size-full" color="lavender-600" />
                <span className="t-small">{t('hoverMe')}</span>
              </span>
            </button>
            <figcaption className="t-small">{t('handCircle')}</figcaption>
          </figure>
        </div>
      </Section>

      <UiKitInteractive />

      <Section title={t('navigation')}>
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="flex flex-col gap-6">
            <Breadcrumbs items={[{ label: tNav('home'), href: '/' }, { label: tNav('catalog'), href: '/catalog' }, { label: t('chipOak') }]} />
            <Accordion
              exclusive
              items={[
                { id: 'a', title: t('faq1'), content: <p className="text-ink-soft">{t('faq1Answer')}</p> },
                { id: 'b', title: t('faq2'), content: <p className="text-ink-soft">{t('faq2Answer')}</p> },
              ]}
            />
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap gap-2">
              <Tag tone="lavender">{t('sampleCaption')}</Tag>
              <Badge tone="pistachio">{t('chipOak')}</Badge>
              <Badge tone="blush">{t('chipWalnut')}</Badge>
              <Badge tone="mist">{t('chipAsh')}</Badge>
              <Tag tone="error">{t('disabled')}</Tag>
            </div>
            <TransitionLink href="/catalog" className={buttonClasses({ variant: 'secondary' })}>
              {tNav('catalog')}
            </TransitionLink>
          </div>
        </div>
      </Section>

      <Section title={t('feedback')}>
        <div className="grid gap-10 lg:grid-cols-3">
          <div className="grid grid-cols-2 gap-4">
            <ProductCardSkeleton />
            <div className="flex flex-col gap-3">
              <Skeleton className="h-24" />
              <Skeleton className="h-10" rounded="pill" />
              <Skeleton className="h-12" rounded="field" />
            </div>
          </div>
          <div className="rounded-section bg-paper">
            <EmptyState title={t('emptyTitle')} text={t('emptyText')} headingLevel="h3" actions={<span className={buttonClasses()}>{t('emptyAction')}</span>} />
          </div>
          <div className="flex flex-col gap-8">
            <Stepper label={t('stepLabel')} steps={[t('stepContacts'), t('stepDelivery'), t('stepPayment')]} current={1} />
          </div>
        </div>
      </Section>

      <Section title={t('marquee')}>
        <div className="rounded-section bg-plum py-8 text-lavender">
          <Marquee items={t('marqueeWords').split(' · ')} itemClassName="font-display text-outline text-[clamp(48px,8vw,120px)] uppercase" duration={30} />
        </div>
      </Section>
    </div>
  )
}
