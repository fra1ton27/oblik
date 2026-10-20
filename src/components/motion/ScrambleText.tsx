'use client'

import { useLocale } from 'next-intl'
import { useRef } from 'react'
import { gsap, mq, useGSAP } from './gsap'

const alphabets: Record<string, string> = {
  ru: 'АБВГДЕЖЗИКЛМНОПРСТУФХЦЧШЭЮЯ0123456789',
  en: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
  sr: 'ABCČĆDĐEFGHIJKLMNOPRSŠTUVZŽ0123456789',
}

type Props = {
  children: string
  className?: string
  /** Повторять раз в N секунд (для меток вроде «Листайте») */
  repeatEvery?: number
}

/** Расшифровка мелких меток: символы из алфавита текущего языка */
export function ScrambleText({ children, className, repeatEvery }: Props) {
  const ref = useRef<HTMLSpanElement>(null)
  const locale = useLocale()

  useGSAP(
    () => {
      const el = ref.current
      if (!el) return
      const mm = gsap.matchMedia()
      mm.add(mq.motion, () => {
        const tl = gsap.timeline({ repeat: repeatEvery ? -1 : 0, repeatDelay: repeatEvery ?? 0 })
        tl.to(el, {
          duration: 1.1,
          scrambleText: { text: children, chars: alphabets[locale] ?? alphabets.en, speed: 0.6, revealDelay: 0.2 },
          ease: 'none',
        })
        return () => tl.kill()
      })
      return () => mm.revert()
    },
    { scope: ref, dependencies: [children, locale] },
  )

  return (
    <span ref={ref} className={className} aria-label={children}>
      <span aria-hidden>{children}</span>
    </span>
  )
}
