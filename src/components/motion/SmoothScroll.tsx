'use client'

import Lenis from 'lenis'
import { usePathname } from 'next/navigation'
import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { gsap, ScrollTrigger } from './gsap'

const LenisContext = createContext<Lenis | null>(null)

export function useLenis() {
  return useContext(LenisContext)
}

/**
 * Плавный скролл Lenis, синхронизированный со ScrollTrigger.
 * На тач-устройствах и при prefers-reduced-motion выключен — нативный скролл.
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null)
  const pathname = usePathname()
  const first = useRef(true)

  useEffect(() => {
    const touch = window.matchMedia('(hover: none), (pointer: coarse)').matches
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (touch || reduced) return

    const instance = new Lenis({ lerp: 0.1, wheelMultiplier: 1, smoothWheel: true, autoRaf: false })
    instance.on('scroll', ScrollTrigger.update)
    const raf = (time: number) => instance.raf(time * 1000)
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)
    // для отладки и e2e в dev: window.__lenis.scrollTo(…)
    if (process.env.NODE_ENV !== 'production') (window as unknown as { __lenis?: Lenis }).__lenis = instance
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Lenis живёт только в браузере
    setLenis(instance)

    return () => {
      gsap.ticker.remove(raf)
      instance.destroy()
      setLenis(null)
    }
  }, [])

  // После загрузки шрифтов и картинок пересчитываем триггеры
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh()
    document.fonts?.ready.then(refresh)
    window.addEventListener('load', refresh)
    return () => window.removeEventListener('load', refresh)
  }, [])

  // Смена страницы: наверх без анимации, пересчёт триггеров
  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    if (!window.location.hash) lenis?.scrollTo(0, { immediate: true, force: true })
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 120)
    return () => window.clearTimeout(id)
  }, [pathname, lenis])

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>
}
