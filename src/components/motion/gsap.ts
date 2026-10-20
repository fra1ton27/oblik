'use client'

/**
 * Единая точка регистрации GSAP-плагинов (docs/SPEC.md, 5.5).
 * Лёгкие плагины регистрируются сразу, тяжёлые (Draggable, Inertia, MorphSVG, DrawSVG, Observer)
 * подгружаются динамически только там, где нужны, но регистрируются тоже здесь.
 */
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { Flip } from 'gsap/Flip'
import { CustomEase } from 'gsap/CustomEase'
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin'

let registered = false

function register() {
  if (registered || typeof window === 'undefined') return
  gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText, Flip, CustomEase, ScrambleTextPlugin)
  // 5.1 Токены движения
  CustomEase.create('soft', '0.22,1,0.36,1')
  gsap.defaults({ ease: 'soft', duration: 0.7 })
  ScrollTrigger.config({ ignoreMobileResize: true })
  registered = true
}

register()

export const motion = {
  fast: 0.2,
  base: 0.4,
  slow: 0.7,
  hero: 1.2,
  ease: { soft: 'soft', move: 'power3.inOut' },
  stagger: { letters: 0.03, cards: 0.06 },
} as const

/** Медиа-запросы для gsap.matchMedia() — вместо проверок window.innerWidth */
export const mq = {
  desktop: '(min-width: 1024px) and (prefers-reduced-motion: no-preference)',
  tablet: '(min-width: 768px) and (prefers-reduced-motion: no-preference)',
  mobile: '(max-width: 767px) and (prefers-reduced-motion: no-preference)',
  motion: '(prefers-reduced-motion: no-preference)',
  reduced: '(prefers-reduced-motion: reduce)',
  finePointer: '(hover: hover) and (pointer: fine)',
} as const

export function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia(mq.reduced).matches
}

export async function loadDraggable() {
  const [{ Draggable }, { InertiaPlugin }] = await Promise.all([
    import('gsap/Draggable'),
    import('gsap/InertiaPlugin'),
  ])
  gsap.registerPlugin(Draggable, InertiaPlugin)
  return { Draggable, InertiaPlugin }
}

export async function loadMorphSVG() {
  const { MorphSVGPlugin } = await import('gsap/MorphSVGPlugin')
  gsap.registerPlugin(MorphSVGPlugin)
  return MorphSVGPlugin
}

export async function loadDrawSVG() {
  const { DrawSVGPlugin } = await import('gsap/DrawSVGPlugin')
  gsap.registerPlugin(DrawSVGPlugin)
  return DrawSVGPlugin
}

export async function loadObserver() {
  const { Observer } = await import('gsap/Observer')
  gsap.registerPlugin(Observer)
  return Observer
}

export { gsap, useGSAP, ScrollTrigger, SplitText, Flip }
