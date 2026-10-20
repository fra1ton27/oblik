'use client'

import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'
import { useRef, type ComponentProps } from 'react'
import type { ImageDTO } from '@/lib/media'
import type { Link } from '@/i18n/navigation'
import { gsap, mq, ScrollTrigger, useGSAP } from '@/components/motion/gsap'
import { SplitHeading } from '@/components/motion/SplitHeading'
import { StepReveal } from '@/components/motion/StepReveal'
import { TransitionLink } from '@/components/motion/TransitionLink'
import { Terrace } from '@/components/shapes'
import type { ShapeColor } from '@/components/shapes/tokens'
import { Tag } from '@/components/ui/Chip'
import { cn } from '@/lib/cn'

export type StackCard = {
  id: string
  title: string
  text: string
  chips: string[]
  image: ImageDTO | null
  color: string
  href?: ComponentProps<typeof Link>['href']
  cta?: string
  meta?: string
}

const bg: Record<string, string> = {
  lavender: 'bg-lavender text-ink',
  pistachio: 'bg-pistachio text-ink',
  blush: 'bg-blush text-ink',
  mist: 'bg-mist text-ink',
  sand: 'bg-sand text-ink',
  plum: 'bg-plum text-milk',
}

/**
 * Стопка цветных карточек-секций (радиус 32 px): карточки залипают (position: sticky) и наезжают
 * друг на друга. На десктопе нижняя уходит в scale(0.94), верхняя въезжает с наклоном −2° → 0°.
 * На мобайле — только sticky, без скраба. На фоне каждой — терраса тон в тон.
 */
export function StackedCards({ heading, lead, cards, numbered }: { heading: string; lead?: string; cards: StackCard[]; numbered?: boolean }) {
  const ref = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(mq.desktop, () => {
        const els = gsap.utils.toArray<HTMLElement>('[data-stack-card]', ref.current)
        els.forEach((card, i) => {
          const inner = card.querySelector<HTMLElement>('[data-stack-inner]')
          if (!inner) return
          // наклон входящей карточки
          if (i > 0) {
            gsap.fromTo(inner, { rotate: -2 }, { rotate: 0, ease: 'none', scrollTrigger: { trigger: card, start: 'top bottom', end: 'top 30%', scrub: true } })
          }
          // уходящая карточка отъезжает вглубь, когда следующая наезжает
          const next = els[i + 1]
          if (next) {
            gsap.to(inner, {
              scale: 0.94,
              opacity: 0.85,
              ease: 'none',
              transformOrigin: '50% 0%',
              scrollTrigger: { trigger: next, start: 'top bottom', end: 'top 20%', scrub: true },
            })
          }
        })
        ScrollTrigger.refresh()
      })
      return () => mm.revert()
    },
    { scope: ref },
  )

  return (
    <section ref={ref} className="mt-section" aria-labelledby={`stack-${cards[0]?.id}`}>
      <div className="container-site">
        <div className="mb-8 flex flex-col gap-3 md:mb-12 md:flex-row md:items-end md:justify-between">
          <SplitHeading id={`stack-${cards[0]?.id}`} className="t-h1">
            {heading}
          </SplitHeading>
          {lead && <p className="t-lead max-w-[36ch] text-ink-soft">{lead}</p>}
        </div>
        <ol className="relative flex flex-col gap-4 md:gap-6">
          {cards.map((card, i) => (
            <li
              key={card.id}
              data-stack-card
              className="sticky"
              style={{ top: `calc(var(--header-h) + env(safe-area-inset-top) + 12px + ${Math.min(i, 5) * 12}px)` }}
            >
              <article
                data-stack-inner
                className={cn('relative isolate grid min-h-[min(78svh,720px)] overflow-hidden rounded-section p-6 will-change-transform md:grid-cols-12 md:gap-6 md:p-10 lg:p-12', bg[card.color] ?? bg.lavender)}
              >
                <StepReveal className="pointer-events-none absolute bottom-0 left-0 -z-10 w-[80%] max-w-[560px] md:w-[46%]">
                  <Terrace color={(card.color in bg ? card.color : 'lavender') as ShapeColor} tone steps={4 + (i % 3)} className="w-full" />
                </StepReveal>
                <div className="flex flex-col gap-5 md:col-span-6">
                  <span className="t-caption opacity-70">{card.meta ?? String(i + 1).padStart(2, '0')}</span>
                  <h3 className="t-h2">{card.title}</h3>
                  {card.chips.length > 0 && (
                    <ul className="flex flex-wrap gap-2">
                      {card.chips.map((chip) => (
                        <li key={chip}>
                          <Tag tone={card.color === 'plum' ? 'lavender' : 'paper'}>{chip}</Tag>
                        </li>
                      ))}
                    </ul>
                  )}
                  {card.text && <p className="t-lead max-w-[34ch] opacity-90">{card.text}</p>}
                  {card.href && card.cta && (
                    <div className="mt-auto pt-4">
                      <TransitionLink
                        href={card.href}
                        className={cn(
                          'inline-flex h-12 items-center gap-2 rounded-pill px-6 text-[15px] font-semibold transition-colors',
                          card.color === 'plum' ? 'bg-milk text-ink hover:bg-lavender' : 'bg-ink text-milk hover:bg-plum',
                        )}
                      >
                        {card.cta}
                        <ArrowUpRight aria-hidden className="size-4" strokeWidth={1.5} />
                      </TransitionLink>
                    </div>
                  )}
                </div>
                {card.image && (
                  <div className={cn('relative mt-8 md:col-span-5 md:col-start-8 md:mt-0', numbered && 'md:col-span-4 md:col-start-9')}>
                    <div className="tilt-card relative aspect-[4/5] overflow-hidden rounded-card bg-sand shadow-float" style={{ ['--tilt-sm' as string]: '2deg', ['--tilt-md' as string]: `${i % 2 ? -3 : 3}deg` }}>
                      <Image src={card.image.src} alt={card.image.alt} fill sizes="(min-width: 768px) 36vw, 88vw" placeholder="blur" blurDataURL={card.image.blur} className="object-cover" />
                    </div>
                  </div>
                )}
              </article>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
