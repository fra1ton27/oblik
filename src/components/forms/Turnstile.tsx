'use client'

import { useEffect, useRef } from 'react'
import { useLocale } from 'next-intl'

declare global {
  interface Window {
    turnstile?: { render: (el: HTMLElement, opts: Record<string, unknown>) => string; remove: (id: string) => void }
  }
}

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY

/** Cloudflare Turnstile — подключается, только если задан NEXT_PUBLIC_TURNSTILE_SITE_KEY */
export function Turnstile({ onToken }: { onToken: (token: string) => void }) {
  const ref = useRef<HTMLDivElement>(null)
  const locale = useLocale()
  useEffect(() => {
    if (!SITE_KEY || !ref.current) return
    let widget: string | null = null
    const mount = () => {
      if (!ref.current || !window.turnstile) return
      widget = window.turnstile.render(ref.current, { sitekey: SITE_KEY, language: locale === 'sr' ? 'sr-latn' : locale, callback: onToken, appearance: 'interaction-only' })
    }
    if (window.turnstile) mount()
    else {
      const s = document.createElement('script')
      s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
      s.async = true
      s.onload = mount
      document.head.appendChild(s)
    }
    return () => {
      if (widget && window.turnstile) window.turnstile.remove(widget)
    }
  }, [locale, onToken])
  if (!SITE_KEY) return null
  return <div ref={ref} />
}
