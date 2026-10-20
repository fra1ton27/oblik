'use client'

import { ArrowUpRight } from 'lucide-react'
import { useRef } from 'react'
import { gsap, mq, useGSAP } from '@/components/motion/gsap'
import { Marquee } from '@/components/ui/Marquee'

type Props = {
  words: string[]
  socials: Array<{ label: string; href: string }>
  socialLabel: string
}

/**
 * Верх подвала: бесконечная бегущая строка контурным Unbounded (lavender),
 * поверх — пилюли соцсетей, слегка плавающие за курсором (только десктоп с мышью).
 */
export function FooterMarquee({ words, socials, socialLabel }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const root = ref.current
      if (!root) return
      const mm = gsap.matchMedia()
      mm.add(`${mq.finePointer} and ${mq.desktop}`, () => {
        const pills = gsap.utils.toArray<HTMLElement>('[data-float-pill]', root)
        const movers = pills.map((p, i) => {
          const depth = 10 + (i % 3) * 6
          return {
            depth,
            x: gsap.quickTo(p, 'x', { duration: 0.9, ease: 'power3.out' }),
            y: gsap.quickTo(p, 'y', { duration: 0.9, ease: 'power3.out' }),
          }
        })
        const onMove = (e: PointerEvent) => {
          const r = root.getBoundingClientRect()
          const nx = (e.clientX - r.left) / r.width - 0.5
          const ny = (e.clientY - r.top) / r.height - 0.5
          movers.forEach((m) => {
            m.x(nx * m.depth * 2)
            m.y(ny * m.depth * 2)
          })
        }
        const onLeave = () => movers.forEach((m) => (m.x(0), m.y(0)))
        root.addEventListener('pointermove', onMove)
        root.addEventListener('pointerleave', onLeave)
        return () => {
          root.removeEventListener('pointermove', onMove)
          root.removeEventListener('pointerleave', onLeave)
        }
      })
      return () => mm.revert()
    },
    { scope: ref },
  )

  return (
    <div ref={ref} className="relative overflow-hidden py-10 md:py-16">
      <Marquee
        items={words}
        duration={45}
        className="text-lavender"
        itemClassName="font-display text-outline uppercase leading-none text-[clamp(56px,9vw,168px)] tracking-[-0.02em]"
        separator={<span className="font-display text-[clamp(40px,6vw,110px)] leading-none text-lavender">{'·'}</span>}
      />
      <ul
        aria-label={socialLabel}
        className="relative z-10 container-site mt-8 flex flex-wrap justify-center gap-2 md:absolute md:inset-0 md:mt-0 md:flex md:items-center md:justify-center md:gap-4"
      >
        {socials.map((s, i) => (
          <li
            key={s.href}
            className="md:motion-safe:animate-[float-y_6s_ease-in-out_infinite]"
            style={{ animationDelay: `${i * -1.3}s`, transform: `rotate(${[-4, 3, -2, 5, -3][i % 5]}deg)` }}
          >
            <a
              data-float-pill
              href={s.href}
              target="_blank"
              rel="noopener"
              className="inline-flex h-12 items-center gap-2 rounded-pill bg-lavender px-5 text-[15px] font-semibold text-ink shadow-float transition-colors duration-200 hover:bg-paper md:h-14 md:px-6 md:text-[16px]"
            >
              {s.label}
              <ArrowUpRight aria-hidden className="size-4" strokeWidth={1.5} />
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
