'use client'

import { site } from '@/config/site'

/**
 * WebGL-витрина включается, только если есть WebGL, нет prefers-reduced-motion,
 * navigator.deviceMemory ≥ 4 и ширина ≥ 768 px. Иначе — CSS 3D-фолбэк.
 */
export function canUseWebGL(): boolean {
  if (!site.features.showcaseWebGL || typeof window === 'undefined') return false
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false
  if (window.innerWidth < 768) return false
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory
  if (typeof memory === 'number' && memory < 4) return false
  try {
    const canvas = document.createElement('canvas')
    return Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl'))
  } catch {
    return false
  }
}
