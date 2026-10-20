'use client'

import { useRef, type ElementType } from 'react'
import { gsap, motion, mq, useGSAP } from './gsap'
import { cn } from '@/lib/cn'

type Props<T extends ElementType> = {
  as?: T
  children: React.ReactNode
  className?: string
  /** Каскад для прямых потомков [data-reveal-item] */
  stagger?: number
  delay?: number
  y?: number
} & Omit<React.ComponentPropsWithoutRef<T>, 'as' | 'children' | 'className'>

/** Спокойное появление снизу при входе в вьюпорт. С reduced motion — только короткий fade. */
export function Reveal<T extends ElementType = 'div'>({
  as,
  children,
  className,
  stagger = motion.stagger.cards,
  delay = 0,
  y = 24,
  ...rest
}: Props<T>) {
  const Tag = (as ?? 'div') as ElementType
  const ref = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const el = ref.current
      if (!el) return
      const items = el.querySelectorAll<HTMLElement>('[data-reveal-item]')
      const targets = items.length ? Array.from(items) : [el]
      const mm = gsap.matchMedia()
      mm.add({ motion: mq.motion, reduced: mq.reduced }, (ctx) => {
        const reduced = ctx.conditions?.reduced
        gsap.fromTo(
          targets,
          { autoAlpha: 0, y: reduced ? 0 : y },
          {
            autoAlpha: 1,
            y: 0,
            duration: reduced ? motion.fast : motion.slow,
            ease: motion.ease.soft,
            stagger: reduced ? 0 : stagger,
            delay,
            scrollTrigger: { trigger: el, start: 'top 88%', once: true },
            onComplete: () => el.setAttribute('data-revealed', ''),
          },
        )
      })
      return () => mm.revert()
    },
    { scope: ref },
  )

  return (
    <Tag ref={ref} className={cn(className)} {...rest}>
      {children}
    </Tag>
  )
}
