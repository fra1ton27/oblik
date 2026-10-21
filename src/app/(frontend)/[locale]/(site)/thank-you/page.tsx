import type { Metadata } from 'next'
import { ClipboardCheck, MessageCircle, PencilRuler, PhoneCall, Search, Sofa } from 'lucide-react'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Locale } from '@/i18n/routing'
import { getContacts } from '@/lib/data/globals'
import { getLayoutData } from '@/lib/data/layout'
import { getCollections } from '@/lib/data/catalog'
import { pageMetadata } from '@/lib/seo'
import { TransitionLink } from '@/components/motion/TransitionLink'
import { buttonClasses } from '@/components/ui/Button'
import { CollectionCard } from '@/components/catalog/CollectionCard'
import { ThankYouHero } from '@/components/forms/ThankYouHero'

// Динамическая страница: номер заявки из query. Явно, чтобы сборка без БД (src/lib/build.ts) не сочла её статической
export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ locale: Locale }>; searchParams: Promise<{ type?: string; ref?: string }> }

const TYPES = ['contact', 'custom', 'question'] as const
type FormType = (typeof TYPES)[number] | 'general'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'thanks' })
  return pageMetadata({ locale, route: '/thank-you', title: t('metaTitle'), noindex: true })
}

/**
 * «Спасибо» после форм: /spasibo?type=custom&ref=Z-2026-00042. Без параметров — общий вариант
 * без номера. Номер принимается только в формате заявки, чтобы в чип не попадал произвольный текст.
 */
export default async function ThankYouPage({ params, searchParams }: Props) {
  const { locale } = await params
  const sp = await searchParams
  setRequestLocale(locale)
  const t = await getTranslations('thanks')
  const type: FormType = TYPES.find((x) => x === sp.type) ?? 'general'
  const reference = typeof sp.ref === 'string' && /^Z-\d{4}-\d{5,}$/.test(sp.ref) ? sp.ref : null
  const [contacts, layout, collections] = await Promise.all([getContacts(locale), getLayoutData(locale), getCollections(locale)])
  const responseTime = contacts.responseTime || t('defaultResponseTime')
  const text = type === 'custom' ? t('textCustom') : t('textReply', { time: responseTime })

  const steps =
    type === 'custom'
      ? [
          { icon: ClipboardCheck, title: t('custom1'), text: t('custom1Text') },
          { icon: PhoneCall, title: t('custom2'), text: t('custom2Text', { time: responseTime }) },
          { icon: PencilRuler, title: t('custom3'), text: t('custom3Text') },
        ]
      : [
          { icon: ClipboardCheck, title: t('reply1'), text: t('reply1Text') },
          { icon: MessageCircle, title: t('reply2'), text: t('reply2Text', { time: responseTime }) },
          { icon: Search, title: t('reply3'), text: t('reply3Text') },
        ]

  const messengers = layout.contacts.messengers
  const links = [...messengers, ...layout.socials.filter((s) => !messengers.some((m) => m.label === s.label))]

  return (
    <div className="container-site flex flex-col gap-14 pt-3 pb-10 md:gap-20 md:pt-5">
      <ThankYouHero text={text} reference={reference}>
        <TransitionLink href="/catalog" className={buttonClasses({ fullWidth: true, className: 'sm:w-auto' })}>
          {t('toCatalog')}
        </TransitionLink>
        <TransitionLink href="/" className={buttonClasses({ variant: 'secondary', fullWidth: true, className: 'sm:w-auto' })}>
          {t('toHome')}
        </TransitionLink>
      </ThankYouHero>

      <section aria-labelledby="thanks-next">
        <h2 id="thanks-next" className="t-h2 mb-6">
          {t('nextTitle')}
        </h2>
        <ol className="grid gap-4 md:grid-cols-3">
          {steps.map((s, i) => (
            <li key={s.title} className="flex flex-col gap-3 rounded-card bg-paper p-5">
              <span className="flex items-center gap-3">
                <span className="inline-flex size-10 items-center justify-center rounded-full bg-milk">
                  <s.icon aria-hidden className="size-5" strokeWidth={1.5} />
                </span>
                <span className="t-caption text-ink-soft">{t('step', { n: i + 1 })}</span>
              </span>
              <h3 className="text-[17px] font-semibold">{s.title}</h3>
              <p className="t-small font-normal text-ink-soft">{s.text}</p>
            </li>
          ))}
        </ol>
        {links.length > 0 && (
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <span className="t-small mr-2 font-normal text-ink-soft">{t('stayInTouch')}</span>
            {links.map((l) => (
              <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center rounded-pill border border-line bg-paper px-4 text-[14px] font-semibold hover:bg-milk">
                {l.label}
              </a>
            ))}
          </div>
        )}
      </section>

      {collections.length > 0 && (
        <section aria-labelledby="thanks-collections">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <h2 id="thanks-collections" className="t-h2 flex items-center gap-3">
              <Sofa aria-hidden className="size-7 shrink-0" strokeWidth={1.5} />
              {t('collectionsTitle')}
            </h2>
            <TransitionLink href="/collections" className="inline-flex min-h-11 items-center text-[15px] font-semibold underline underline-offset-4">
              {t('allCollections')}
            </TransitionLink>
          </div>
          <ul className="no-scrollbar -mx-[var(--page-pad)] flex snap-x snap-mandatory scroll-px-[var(--page-pad)] gap-6 overflow-x-auto px-[var(--page-pad)] pb-2">
            {collections.slice(0, 4).map((c, i) => (
              <li key={c.id} className="w-[78vw] max-w-[340px] shrink-0 snap-start md:w-[calc((100%-48px)/3)]">
                <CollectionCard collection={c} tilt={[-2, 3, -3, 2][i % 4]} headingLevel="h3" sizes="(min-width: 768px) 30vw, 78vw" />
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}
