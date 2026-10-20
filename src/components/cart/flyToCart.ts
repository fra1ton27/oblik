'use client'

import { gsap, prefersReducedMotion } from '@/components/motion/gsap'

/**
 * «В корзину»: миниатюра товара летит к иконке корзины в шапке (FLIP: клон от исходного прямоугольника
 * к целевому, только transform и opacity). Счётчик в шапке перекатывает цифру сам (RollingNumber).
 */
export function flyToCart(source: HTMLElement | null | undefined, src?: string | null) {
  if (!source || !src || prefersReducedMotion()) return
  const target = document.querySelector<HTMLElement>('[data-cart-target]')
  if (!target) return
  const from = source.getBoundingClientRect()
  const to = target.getBoundingClientRect()
  const size = Math.min(from.width, from.height, 220)
  const clone = document.createElement('img')
  clone.src = src
  clone.alt = ''
  clone.setAttribute('aria-hidden', 'true')
  Object.assign(clone.style, {
    position: 'fixed',
    left: `${from.left + (from.width - size) / 2}px`,
    top: `${from.top + (from.height - size) / 2}px`,
    width: `${size}px`,
    height: `${size}px`,
    objectFit: 'cover',
    borderRadius: '16px',
    zIndex: '80',
    pointerEvents: 'none',
  } satisfies Partial<CSSStyleDeclaration>)
  document.body.appendChild(clone)
  const dx = to.left + to.width / 2 - (from.left + from.width / 2)
  const dy = to.top + to.height / 2 - (from.top + from.height / 2)
  gsap
    .timeline({ onComplete: () => clone.remove() })
    .to(clone, { x: dx, y: dy, scale: 24 / size, borderRadius: '999px', duration: 0.7, ease: 'power3.inOut' })
    .to(clone, { opacity: 0, duration: 0.15 }, '-=0.1')
    .fromTo(target, { scale: 1 }, { scale: 1.18, duration: 0.15, yoyo: true, repeat: 1, ease: 'power2.out' }, '-=0.15')
}
