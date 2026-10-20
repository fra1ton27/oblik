'use client'

import { usePathname, useRouter } from 'next/navigation'
import { createContext, useCallback, useContext, useEffect, useMemo, useRef } from 'react'
import { gsap, prefersReducedMotion } from './gsap'

type Ctx = { navigate: (href: string, color?: string) => void }

const PageTransitionContext = createContext<Ctx | null>(null)

export function usePageTransition() {
  return useContext(PageTransitionContext)
}

const STEPS = 6

/** Цвет шторки по разделу (цвет следующей страницы) */
function colorFor(path: string): string {
  const seg = path.split('/')[2] ?? ''
  if (/^(katalog|catalog|mebel|furniture|namestaj)/.test(seg)) return 'var(--color-pistachio)'
  if (/^(kollekcii|collections|kolekcije)/.test(seg)) return 'var(--color-blush)'
  if (/^(na-zakaz|custom|po-meri)/.test(seg)) return 'var(--color-pistachio)'
  if (/^(o-nas|about|o-nama|kontakty|contact|kontakt)/.test(seg)) return 'var(--color-mist)'
  if (/^(korzina|cart|korpa|oformlenie|checkout|porucivanje)/.test(seg)) return 'var(--color-sand)'
  if (seg === '') return 'var(--color-lavender)'
  return 'var(--color-lavender)'
}

/**
 * Переход между страницами: ступенчатая шторка цвета следующей страницы (500–700 ms).
 * Закрытие → router.push → открытие. Router из next/navigation, потому что href уже
 * локализован (его собрал next-intl Link). prefetch, «Назад» и новые вкладки не затрагиваются.
 */
export function PageTransitionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const overlayRef = useRef<HTMLDivElement>(null)
  const pending = useRef<{ href: string; timeout: number } | null>(null)
  const tl = useRef<gsap.core.Timeline | null>(null)

  const open = useCallback(() => {
    const overlay = overlayRef.current
    if (!overlay) return
    const cols = overlay.querySelectorAll('[data-col]')
    tl.current?.kill()
    tl.current = gsap
      .timeline({ onComplete: () => gsap.set(overlay, { autoAlpha: 0 }) })
      .to(cols, {
        clipPath: 'inset(0% 0% 100% 0%)',
        duration: 0.36,
        ease: 'power3.inOut',
        stagger: { each: 0.035, from: 'end' },
      })
  }, [])

  const navigate = useCallback(
    (href: string, color?: string) => {
      const overlay = overlayRef.current
      if (!overlay || prefersReducedMotion()) {
        router.push(href)
        return
      }
      // новый клик во время анимации ведёт сразу к результату
      if (pending.current) window.clearTimeout(pending.current.timeout)
      const cols = overlay.querySelectorAll<HTMLElement>('[data-col]')
      const fill = color ?? colorFor(href)
      cols.forEach((c) => (c.style.background = fill))
      tl.current?.kill()
      gsap.set(overlay, { autoAlpha: 1 })
      tl.current = gsap.timeline().fromTo(
        cols,
        { clipPath: 'inset(100% 0% 0% 0%)' },
        {
          clipPath: 'inset(0% 0% 0% 0%)',
          duration: 0.32,
          ease: 'power3.inOut',
          stagger: 0.035,
          onComplete: () => {
            router.push(href)
          },
        },
      )
      // страховка: если навигация зависла, открываем шторку
      pending.current = {
        href,
        timeout: window.setTimeout(() => {
          pending.current = null
          open()
        }, 4000),
      }
    },
    [router, open],
  )

  // Новая страница отрисована → открываем шторку и переводим фокус на основной контент
  useEffect(() => {
    if (!pending.current) return
    window.clearTimeout(pending.current.timeout)
    pending.current = null
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
    open()
    const main = document.getElementById('main')
    if (main && (document.activeElement === document.body || !document.activeElement?.isConnected)) {
      main.setAttribute('tabindex', '-1')
      main.focus({ preventScroll: true })
    }
  }, [pathname, open])

  const value = useMemo(() => ({ navigate }), [navigate])

  return (
    <PageTransitionContext.Provider value={value}>
      {children}
      <div
        ref={overlayRef}
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[90] invisible flex opacity-0"
      >
        {Array.from({ length: STEPS }, (_, i) => (
          <div
            key={i}
            data-col
            className="h-full flex-1"
            style={{
              clipPath: 'inset(100% 0% 0% 0%)',
              borderTopLeftRadius: i === 0 ? 0 : 8,
              marginLeft: i === 0 ? 0 : -1,
            }}
          />
        ))}
      </div>
    </PageTransitionContext.Provider>
  )
}
