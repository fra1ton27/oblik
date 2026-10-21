import Image from 'next/image'
import { useLocale, useTranslations } from 'next-intl'
import type { Locale } from '@/i18n/routing'
import type { CollectionDTO } from '@/lib/data/catalog'
import { formatMoney } from '@/lib/format'
import { Tag } from '@/components/ui/Chip'
import { TransitionLink } from '@/components/motion/TransitionLink'
import { TiltCard } from '@/components/motion/TiltCard'
import { Arch } from '@/components/shapes'

/** Карточка коллекции или комплекта: фото в арке на наклонённой карточке, тип, цена комплекта и экономия */
export function CollectionCard({ collection: c, tilt = 0, headingLevel = 'h2', sizes = '(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 92vw' }: { collection: CollectionDTO; tilt?: number; headingLevel?: 'h2' | 'h3'; sizes?: string }) {
  const t = useTranslations('catalog.collectionsPage')
  const locale = useLocale() as Locale
  const H = headingLevel
  return (
    <TransitionLink href={{ pathname: '/collections/[slug]', params: { slug: c.slug } }} className="group flex flex-col gap-4">
      <TiltCard tilt={tilt} mobileTilt={0}>
        <Arch aspect="4 / 5">
          {c.hero && (
            <Image
              src={c.hero.src}
              alt={c.hero.alt}
              fill
              sizes={sizes}
              placeholder="blur"
              blurDataURL={c.hero.blur}
              className="object-cover transition-transform duration-[700ms] ease-soft group-hover:scale-[1.03]"
            />
          )}
        </Arch>
      </TiltCard>
      <div className="flex flex-wrap items-center gap-2">
        <Tag tone={c.isBundle ? 'lavender' : 'paper'}>{c.isBundle ? t('bundle') : t('collection')}</Tag>
        {c.room && <Tag tone="paper">{c.room}</Tag>}
        <span className="t-small text-ink-soft">{t('pieces', { count: c.products.length })}</span>
      </div>
      <H className="t-serif">{c.title}</H>
      {c.tagline && <p className="text-ink-soft">{c.tagline}</p>}
      {c.isBundle && c.totals.savings > 0 && (
        <p className="flex flex-wrap items-baseline gap-x-3 text-[15px]">
          <span className="t-price text-[22px]">{formatMoney(c.totals.total, locale)}</span>
          <span className="text-success">{t('save', { amount: formatMoney(c.totals.savings, locale) })}</span>
        </p>
      )}
      <span className="text-[15px] font-semibold underline underline-offset-4">{t('open')}</span>
    </TransitionLink>
  )
}
