'use client'

import { ArrowUpRight } from 'lucide-react'
import { useRef } from 'react'
import { useTranslations } from 'next-intl'
import type { StaticPathname } from '@/i18n/routing'
import { gsap, mq, useGSAP } from '@/components/motion/gsap'
import { useFormat } from '@/components/motion/useFormat'
import { SplitHeading } from '@/components/motion/SplitHeading'
import { TransitionLink } from '@/components/motion/TransitionLink'
import { StepReveal } from '@/components/motion/StepReveal'
import { Terrace } from '@/components/shapes'

type Props = {
  heading: string
  lead?: string
  items: Array<{ value: number; suffix: string; label: string }>
  link: { href: StaticPathname; label: string } | null
}

/** «Производство»: 3–4 факта с цифрами, счётчики докручиваются при появлении */
export function Stats({ heading, lead, items, link }: Props) {
  const t = useTranslations('home')
  const f = useFormat()
  const ref = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(mq.motion, () => {
        ref.current?.querySelectorAll<HTMLElement>('[data-count]').forEach((el) => {
          const target = Number(el.dataset.count)
          const state = { v: 0 }
          gsap.to(state, {
            v: target,
            duration: 1.6,
            ease: 'power2.out',
            scrollTrigger: { trigger: el, start: 'top 90%', once: true },
            onUpdate: () => {
              el.textContent = f.number(Math.round(state.v))
            },
          })
        })
      })
      return () => mm.revert()
    },
    { scope: ref },
  )

  return (
    <section ref={ref} className="mt-section" aria-label={t('statsLabel')}>
      <div className="container-site">
        <div className="relative isolate overflow-hidden rounded-section bg-mist p-6 md:p-12">
          <StepReveal className="pointer-events-none absolute right-0 bottom-0 -z-10 w-[70%] max-w-[520px]">
            <Terrace color="mist" tone steps={5} className="w-full" />
          </StepReveal>
          <SplitHeading className="t-h1 mb-6 md:mb-10">{heading}</SplitHeading>
          <div className="grid gap-8 md:grid-cols-12">
            <div className="flex flex-col gap-4 md:col-span-4">
              {lead && <p className="t-lead text-ink-soft">{lead}</p>}
              {link && (
                <TransitionLink href={link.href} className="mt-2 inline-flex items-center gap-2 self-start border-b border-ink pb-1 text-[15px] font-semibold">
                  {link.label}
                  <ArrowUpRight aria-hidden className="size-4" strokeWidth={1.5} />
                </TransitionLink>
              )}
            </div>
            <dl className="grid grid-cols-2 gap-x-6 gap-y-8 md:col-span-8 md:grid-cols-4 md:self-end">
              {items.map((item) => (
                <div key={item.label} className="flex flex-col gap-2 border-t border-ink/20 pt-4">
                  <dt className="t-small order-2 font-normal text-ink-soft">{item.label}</dt>
                  <dd className="order-1 font-display text-[clamp(36px,5vw,72px)] leading-none tracking-[-0.03em] tabular-nums">
                    <span data-count={item.value}>{f.number(item.value)}</span>
                    {item.suffix && <span className="ml-1 text-[0.45em] tracking-normal">{item.suffix}</span>}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  )
}
