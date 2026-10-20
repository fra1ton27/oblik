import Image from 'next/image'
import { Star } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import type { ReviewsBlock } from '@/payload-types'
import type { BlockContext } from '../types'
import { getReviews } from '@/lib/data/globals'
import { SplitHeading } from '@/components/motion/SplitHeading'
import { TiltCard } from '@/components/motion/TiltCard'
import { cn } from '@/lib/cn'

/** Отзывы (если есть в CMS): наклонённые карточки с фото покупателей */
export async function ReviewsBlockView({ block, context }: { block: ReviewsBlock; context: BlockContext }) {
  const t = await getTranslations('product')
  const th = await getTranslations('home')
  const all = await getReviews(context.locale)
  const id = context.productCard?.id
  const reviews = (id ? all.filter((r) => r.productId === id) : all).slice(0, block.limit ?? 6)
  if (!reviews.length) return null
  const tilts = [-3, 4, -2, 5, -4, 2]
  return (
    <section className="mt-section" id="reviews">
      <div className="container-site">
        <div className="mb-8 flex items-end justify-between gap-4">
          <SplitHeading className="t-h1">{block.heading || t('reviewsHeading')}</SplitHeading>
          <span className="t-small text-ink-soft">{t('reviewsCount', { count: reviews.length })}</span>
        </div>
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((r, i) => (
            <li key={r.id}>
              <TiltCard tilt={tilts[i % tilts.length]} mobileTilt={tilts[i % tilts.length] / 2} className="flex h-full flex-col overflow-hidden rounded-card bg-paper shadow-float">
                {r.photo && (
                  <div className="relative aspect-[4/3] bg-sand">
                    <Image src={r.photo.src} alt={r.photo.alt} fill sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw" className="object-cover" />
                  </div>
                )}
                <figure className="flex flex-1 flex-col gap-3 p-5">
                  <span className="sr-only">{th('rating', { rating: r.rating })}</span>
                  <span className="flex gap-0.5" aria-hidden>
                    {Array.from({ length: 5 }, (_, s) => (
                      <Star key={s} className={cn('size-4', s < r.rating ? 'fill-ink text-ink' : 'text-line')} strokeWidth={1.5} />
                    ))}
                  </span>
                  <blockquote className="font-serif text-[20px] leading-snug italic">{r.text}</blockquote>
                  <figcaption className="t-small mt-auto font-normal text-ink-soft">{[r.author, r.city].filter(Boolean).join(', ')}</figcaption>
                </figure>
              </TiltCard>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
