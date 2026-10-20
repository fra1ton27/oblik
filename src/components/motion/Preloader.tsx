'use client'

import { useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { Terrace } from '@/components/shapes'
import { gsap } from './gsap'
import { site } from '@/config/site'
import { pad } from '@/lib/format'

export const PRELOADER_KEY = 'oblik-preloaded'

/**
 * Прелоадер: счётчик 0 → 100 шрифтом Unbounded, рядом по ступенькам собирается «терраса».
 * Не дольше 1.6 с, только при первом визите в сессии (sessionStorage), без reduced motion.
 * Контент рендерится под ним — прелоадер снимается визуально и не задерживает LCP.
 * Показ решает инлайн-скрипт в <head> (класс show-preloader), поэтому нет мигания.
 */
export function Preloader() {
  const t = useTranslations('common')
  const ref = useRef<HTMLDivElement>(null)
  const counterRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const root = document.documentElement
    const el = ref.current
    if (!el || !root.classList.contains('show-preloader')) return
    try {
      sessionStorage.setItem(PRELOADER_KEY, '1')
    } catch {}
    const counter = { value: 0 }
    const steps = el.querySelectorAll('[data-step]')
    const tl = gsap.timeline({
      onComplete: () => {
        root.classList.remove('show-preloader')
        gsap.set(el, { clearProps: 'all' })
      },
    })
    tl.to(counter, {
      value: 100,
      duration: 1.15,
      ease: 'power2.inOut',
      onUpdate: () => {
        if (counterRef.current) counterRef.current.textContent = String(Math.round(counter.value)).padStart(3, '0')
      },
    })
      .fromTo(steps, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.35, stagger: 0.18, ease: 'soft' }, 0.05)
      .to(el, { clipPath: 'inset(0% 0% 100% 0%)', duration: 0.42, ease: 'power3.inOut' }, 1.15)
    // клик или клавиша сразу снимают прелоадер — анимации не блокируют ввод
    const skip = () => tl.progress(1)
    window.addEventListener('pointerdown', skip, { once: true })
    window.addEventListener('keydown', skip, { once: true })
    return () => {
      tl.kill()
      window.removeEventListener('pointerdown', skip)
      window.removeEventListener('keydown', skip)
      root.classList.remove('show-preloader')
    }
  }, [])

  return (
    <div
      ref={ref}
      aria-hidden
      className="preloader fixed inset-0 z-[100] hidden flex-col justify-between bg-milk p-[var(--page-pad)]"
      style={{ paddingTop: 'calc(var(--page-pad) + env(safe-area-inset-top))' }}
    >
      <span className="t-caption text-ink-soft">{t('preloaderLabel', { brand: site.name })}</span>
      <div className="flex items-end justify-between gap-6">
        <span ref={counterRef} className="font-display text-[clamp(72px,18vw,240px)] leading-[0.85] tracking-[-0.04em] tabular-nums">
          {pad(0, 3)}
        </span>
        <Terrace steps={5} color="lavender" className="w-[min(40vw,320px)]" />
      </div>
    </div>
  )
}
