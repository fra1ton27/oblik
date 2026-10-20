'use client'

import Image from 'next/image'
import { ArrowDown, ArrowRight } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import type { ImageDTO } from '@/lib/media'
import type { StaticPathname } from '@/i18n/routing'
import { gsap, mq, motion, useGSAP } from '@/components/motion/gsap'
import { SplitHeading } from '@/components/motion/SplitHeading'
import { ScrambleText } from '@/components/motion/ScrambleText'
import { Magnetic } from '@/components/motion/Magnetic'
import { TransitionLink } from '@/components/motion/TransitionLink'
import { buttonClasses } from '@/components/ui/Button'
import { Tag } from '@/components/ui/Chip'
import { Terrace } from '@/components/shapes'
import { StepReveal } from '@/components/motion/StepReveal'

type Props = {
  lines: string[]
  chip: string
  lead: string
  image: ImageDTO | null
  video: string | null
  ctaLabel: string
  ctaRoute: string
  priority: boolean
}

export function HomeHero({ lines, chip, lead, image, video, ctaLabel, ctaRoute, priority }: Props) {
  const t = useTranslations('common')
  const th = useTranslations('home')
  const ref = useRef<HTMLElement>(null)
  const [playVideo, setPlayVideo] = useState(false)
  const longest = Math.max(4, ...lines.flatMap((l) => l.split(/\s+/)).map((w) => w.length))

  // Видео только на нормальной сети: при saveData остаётся постер
  useEffect(() => {
    if (!video) return
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
    const reduced = window.matchMedia(mq.reduced).matches
    // eslint-disable-next-line react-hooks/set-state-in-effect -- решение зависит от браузерных API
    if (!conn?.saveData && !reduced) setPlayVideo(true)
  }, [video])

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add({ desktop: mq.desktop, mobile: mq.mobile }, (ctx) => {
        const desktop = Boolean(ctx.conditions?.desktop)
        gsap.from('[data-hero-card]', { y: 60, rotate: 9, opacity: 0, duration: motion.hero, ease: 'soft', delay: 0.25 })
        gsap.from('[data-hero-fade]', { y: 24, opacity: 0, duration: motion.slow, ease: 'soft', stagger: 0.08, delay: 0.5 })
        // лёгкий параллакс карточки; на мобайле ослаблен вдвое
        gsap.to('[data-hero-card]', {
          yPercent: desktop ? -14 : -7,
          ease: 'none',
          scrollTrigger: { trigger: ref.current, start: 'top top', end: 'bottom top', scrub: true },
        })
      })
      return () => mm.revert()
    },
    { scope: ref },
  )

  return (
    <section ref={ref} className="relative isolate overflow-hidden" aria-labelledby="hero-title">
      <StepReveal immediate delay={0.4} className="pointer-events-none absolute right-0 bottom-0 -z-10 w-[70vw] max-w-[760px] opacity-80 md:w-[48vw]">
        <Terrace color="lavender" steps={6} className="w-full" />
      </StepReveal>
      <div className="container-site grid min-h-[calc(100svh-var(--header-h))] grid-cols-1 content-end gap-8 pt-6 pb-10 md:pb-14 lg:grid-cols-12 lg:gap-x-6">
        {/* Огромное слово */}
        <div className="order-1 lg:order-2 lg:col-span-12" style={{ containerType: 'inline-size' }}>
          <SplitHeading
            as="h1"
            id="hero-title"
            by="chars"
            immediate
            delay={0.1}
            className="t-display"
          >
            <span style={{ fontSize: `min(clamp(44px, 2.667px + 13.704vw, 200px), calc(100cqi / ${longest} / 0.94), 19svh)` }} className="block">
              {lines.map((line, i) => (
                <span key={i} className="block">
                  {line}
                </span>
              ))}
            </span>
          </SplitHeading>
        </div>

        {/* Лид, чип, CTA */}
        <div className="order-3 flex flex-col gap-5 lg:order-1 lg:col-span-5 lg:col-start-1 lg:row-start-1 lg:self-start lg:pt-10">
          {chip && (
            <div data-hero-fade>
              <Tag tone="lavender">{chip}</Tag>
            </div>
          )}
          {lead && (
            <p data-hero-fade className="t-lead max-w-[30ch] text-ink">
              {lead}
            </p>
          )}
          <div data-hero-fade className="flex flex-wrap items-center gap-4">
            <Magnetic>
              <TransitionLink href={ctaRoute as StaticPathname} className={buttonClasses({ size: 'lg' })}>
                {ctaLabel}
                <ArrowRight aria-hidden className="size-4 transition-transform duration-200 group-hover/btn:translate-x-1" strokeWidth={1.5} />
              </TransitionLink>
            </Magnetic>
          </div>
        </div>

        {/* Наклонённая карточка с фото или видео */}
        {image && (
          <div data-hero-card className="order-2 flex justify-center lg:order-1 lg:col-span-4 lg:col-start-9 lg:row-start-1 lg:justify-end lg:self-start">
            <figure
              className="tilt-card relative w-[min(78vw,420px)] overflow-hidden rounded-[24px] bg-sand shadow-float lg:w-full lg:max-w-[min(360px,40svh)]"
              style={{ ['--tilt-sm' as string]: '3deg', ['--tilt-md' as string]: '4deg' }}
            >
              <div className="relative aspect-[4/5]">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  priority={priority}
                  fetchPriority={priority ? 'high' : undefined}
                  sizes="(min-width: 1024px) 360px, 78vw"
                  placeholder="blur"
                  blurDataURL={image.blur}
                  className="object-cover"
                />
                {video && playVideo && (
                  <video
                    className="absolute inset-0 size-full object-cover"
                    src={video}
                    poster={image.src}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="none"
                    aria-label={th('heroVideoLabel')}
                  />
                )}
              </div>
            </figure>
          </div>
        )}

        <div data-hero-fade className="order-4 hidden items-center justify-end gap-2 lg:col-span-12 lg:flex">
          <span className="t-caption text-ink-soft">
            <ScrambleText repeatEvery={6}>{t('scroll')}</ScrambleText>
          </span>
          <ArrowDown aria-hidden className="size-4 text-ink-soft motion-safe:animate-[float-y_2.4s_ease-in-out_infinite]" strokeWidth={1.5} />
        </div>
      </div>
    </section>
  )
}
