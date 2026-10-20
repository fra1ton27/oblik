'use client'

import { useEffect } from 'react'
import { site } from '@/config/site'

declare global {
  interface Window {
    __oblikHydrated?: boolean
    __oblikCredit?: boolean
  }
}

/**
 * Отметка «гидрация прошла» (иначе страховка снимет .js-ready и анимации не скроют контент)
 * и одна стилизованная строка в консоли с подписью разработчика — только в production.
 */
export function ClientBoot() {
  useEffect(() => {
    window.__oblikHydrated = true
    document.documentElement.classList.add('js-ready')
    if (process.env.NODE_ENV === 'production' && !window.__oblikCredit) {
      window.__oblikCredit = true
      const css = getComputedStyle(document.documentElement)
      const token = (name: string) => css.getPropertyValue(`--color-${name}`).trim()
      console.log(
        `%c${site.name}%c  ${site.developer.handle} → ${site.developer.url}`,
        `font: 600 14px/1.6 sans-serif; background:${token('plum')}; color:${token('lavender')}; padding:4px 10px; border-radius:999px`,
        `font: 500 12px/1.6 sans-serif; color:${token('ink-soft')}`,
      )
    }
  }, [])
  return null
}
