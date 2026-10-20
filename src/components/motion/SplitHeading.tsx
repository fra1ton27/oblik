'use client'

import { useRef, type ElementType } from 'react'
import { gsap, motion, mq, SplitText, useGSAP } from './gsap'
import { cn } from '@/lib/cn'

type Props = {
  as?: ElementType
  children: React.ReactNode
  className?: string
  /** Делить по строкам (заголовки секций) или по буквам (hero) */
  by?: 'lines' | 'chars'
  delay?: number
  /** Запуск сразу (hero), иначе при входе в вьюпорт */
  immediate?: boolean
  id?: string
  tabIndex?: number
}

/**
 * Большие заголовки: буквы/строки выезжают снизу из маски (SplitText, yPercent 100 → 0).
 * Текст остаётся в DOM целиком (aria), без JS заголовок виден сразу.
 */
export function SplitHeading({ as = 'h2', children, className, by = 'lines', delay = 0, immediate, id, tabIndex }: Props) {
  const Tag = as
  const ref = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const el = ref.current
      if (!el) return
      const mm = gsap.matchMedia()
      mm.add(mq.motion, () => {
        let split: SplitText | null = null
        let tween: gsap.core.Tween | null = null
        document.fonts.ready.then(() => {
          if (!el.isConnected) return
          split = SplitText.create(el, {
            type: by === 'chars' ? 'lines,chars' : 'lines',
            mask: 'lines',
            linesClass: 'split-line',
            aria: 'auto',
            autoSplit: true,
            onSplit(self) {
              tween?.kill()
              tween = gsap.from(by === 'chars' ? self.chars : self.lines, {
                yPercent: 100,
                duration: by === 'chars' ? motion.hero : motion.slow,
                ease: motion.ease.soft,
                stagger: by === 'chars' ? motion.stagger.letters : 0.08,
                delay,
                scrollTrigger: immediate ? undefined : { trigger: el, start: 'top 88%', once: true },
              })
              return tween
            },
          })
        })
        return () => {
          tween?.kill()
          split?.revert()
        }
      })
      return () => mm.revert()
    },
    { scope: ref },
  )

  return (
    <Tag ref={ref} id={id} tabIndex={tabIndex} className={cn(className)}>
      {children}
    </Tag>
  )
}
