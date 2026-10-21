'use client'

import { useLocale } from 'next-intl'
import { useRef } from 'react'
import { gsap, loadScrambleText, mq, useGSAP } from './gsap'

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
        let tl: gsap.core.Timeline | null = null
        let cancelled = false
        // плагин грузится лениво: до его прихода метка просто видна как есть
        void loadScrambleText().then(() => {
          if (cancelled) return
          tl = gsap.timeline({ repeat: repeatEvery ? -1 : 0, repeatDelay: repeatEvery ?? 0 })
          tl.to(el, {
            duration: 1.1,
            scrambleText: { text: children, chars: alphabets[locale] ?? alphabets.en, speed: 0.6, revealDelay: 0.2 },
            ease: 'none',
          })
        })
        return () => {
          cancelled = true
          tl?.kill()
        }
      })
      return () => mm.revert()
    },
    { scope: ref, dependencies: [children, locale] },
  )

  return (
    // aria-label на span без роли запрещён (axe: aria-prohibited-attr): читаемый текст — в sr-only,
    // перебор символов идёт во вложенном aria-hidden
    <span className={className}>
      <span className="sr-only">{children}</span>
      <span ref={ref} aria-hidden>
        {children}
      </span>
    </span>
  )
}
