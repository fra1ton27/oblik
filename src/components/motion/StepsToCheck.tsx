'use client'

import { useRef } from 'react'
import { gsap, loadMorphSVG, mq, useGSAP } from './gsap'
import { checkPath, terracePath } from '@/components/shapes/geometry'
import { cn } from '@/lib/cn'

/**
 * Успешная отправка: ступенчатый шейп собирается по ступеням и морфится в галочку (MorphSVG, до 1.2 с).
 * Без JS и с reduced motion сразу видна галочка.
 */
export function StepsToCheck({ className, tone = 'ink' }: { className?: string; tone?: 'ink' | 'plum' }) {
  const ref = useRef<SVGSVGElement>(null)
  const size = 160
  const steps = terracePath(4, size * 0.76, size * 0.76, 6)
  const check = checkPath(size, 6)

  useGSAP(
    () => {
      const svg = ref.current
      if (!svg) return
      const mm = gsap.matchMedia()
      mm.add(mq.motion, () => {
        let cancelled = false
        const shape = svg.querySelector<SVGPathElement>('[data-shape]')
        const cols = svg.querySelectorAll('[data-col]')
        if (!shape) return
        gsap.set(shape, { attr: { d: steps }, x: size * 0.12, y: size * 0.12, opacity: 0 })
        const tl = gsap.timeline()
        tl.set(cols, { opacity: 1 }).fromTo(cols, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.35, stagger: 0.08, ease: 'soft' })
        loadMorphSVG().then(() => {
          if (cancelled) return
          tl.set(cols, { opacity: 0 })
            .set(shape, { opacity: 1 })
            .to(shape, { morphSVG: check, x: 0, y: 0, duration: 0.6, ease: 'power3.inOut' })
        })
        return () => {
          cancelled = true
          tl.kill()
        }
      })
      return () => mm.revert()
    },
    { scope: ref },
  )

  const w = (size * 0.76) / 4
  return (
    <svg ref={ref} viewBox={`0 0 ${size} ${size}`} className={cn('h-auto w-[160px]', className)} aria-hidden>
      <circle cx={size / 2} cy={size / 2} r={size / 2} fill="var(--color-paper)" opacity={0.6} />
      {Array.from({ length: 4 }, (_, i) => (
        <rect key={i} data-col x={size * 0.12 + i * w} y={size * 0.88 - (i + 1) * w} width={w + 0.5} height={(i + 1) * w} rx={5} fill={`var(--color-${tone})`} opacity={0} />
      ))}
      <path data-shape d={check} fill={`var(--color-${tone})`} />
    </svg>
  )
}
