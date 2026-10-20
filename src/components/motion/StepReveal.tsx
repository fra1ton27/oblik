'use client'

import { useRef } from 'react'
import { gsap, motion, mq, useGSAP } from './gsap'

type Props = {
  children: React.ReactNode
  className?: string
  /** Задержка перед стартом, с */
  delay?: number
  /** Начинать при входе в вьюпорт (по умолчанию) или сразу */
  immediate?: boolean
}

/**
 * Ступенчатые фоновые формы: каждая ступень ([data-step]) проявляется снизу
 * через clip-path со stagger при входе в вьюпорт. Без JS и с reduced motion форма видна сразу.
 */
export function StepReveal({ children, className, delay = 0, immediate = false }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(mq.motion, () => {
        const steps = ref.current?.querySelectorAll('[data-step]')
        if (!steps?.length) return
        gsap.fromTo(
          steps,
          { clipPath: 'inset(100% 0% 0% 0%)' },
          {
            clipPath: 'inset(0% 0% 0% 0%)',
            duration: motion.slow,
            ease: motion.ease.soft,
            stagger: 0.08,
            delay,
            scrollTrigger: immediate ? undefined : { trigger: ref.current, start: 'top 85%', once: true },
          },
        )
      })
      return () => mm.revert()
    },
    { scope: ref },
  )

  return (
    <div ref={ref} className={className} aria-hidden>
      {children}
    </div>
  )
}
