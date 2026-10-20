'use client'

import { Cookie } from 'lucide-react'
import Script from 'next/script'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import { create } from 'zustand'
import { Button } from '@/components/ui/Button'
import { Dialog } from '@/components/ui/Dialog'
import { TransitionLink } from '@/components/motion/TransitionLink'
import { gsap, prefersReducedMotion } from '@/components/motion/gsap'
import { useIsClient } from '@/components/motion/useIsClient'
import { cn } from '@/lib/cn'

export type Consent = { necessary: true; analytics: boolean; marketing: boolean; at: number }

const COOKIE = 'oblik_consent'

function readConsent(): Consent | null {
  try {
    const raw = localStorage.getItem(COOKIE)
    return raw ? (JSON.parse(raw) as Consent) : null
  } catch {
    return null
  }
}

type ConsentState = {
  consent: Consent | null
  settingsOpen: boolean
  hydrated: boolean
  hydrate: () => void
  save: (c: Omit<Consent, 'necessary' | 'at'>) => void
  openSettings: () => void
  closeSettings: () => void
}

export const useConsent = create<ConsentState>((set) => ({
  consent: null,
  settingsOpen: false,
  hydrated: false,
  hydrate: () => set({ consent: readConsent(), hydrated: true }),
  save: (c) => {
    const consent: Consent = { necessary: true, analytics: c.analytics, marketing: c.marketing, at: Date.now() }
    try {
      localStorage.setItem(COOKIE, JSON.stringify(consent))
    } catch {}
    // кука нужна серверу (например, чтобы не рендерить пиксели без согласия)
    document.cookie = `${COOKIE}=${c.analytics ? 'a' : ''}${c.marketing ? 'm' : ''}n; path=/; max-age=${60 * 60 * 24 * 180}; samesite=lax`
    set({ consent, settingsOpen: false })
  },
  openSettings: () => set({ settingsOpen: true }),
  closeSettings: () => set({ settingsOpen: false }),
}))

/** Кнопка «Настройки cookie» в подвале */
export function CookieSettingsButton({ className, children }: { className?: string; children: React.ReactNode }) {
  const open = useConsent((s) => s.openSettings)
  return (
    <button type="button" className={className} onClick={open}>
      {children}
    </button>
  )
}

/**
 * Cookie-баннер: карточка в правом нижнем углу (на мобайле снизу на всю ширину).
 * «Только необходимые», «Принять все», «Настроить». Аналитика грузится только после согласия.
 * Пока баннер виден, у страницы есть нижний резерв (--bottom-reserve), чтобы он не перекрывал
 * подпись @fra1ton27 в подвале; липкие плашки поднимают баннер выше (--sticky-bar-h).
 */
export function CookieConsent() {
  const t = useTranslations('common.cookies')
  const isClient = useIsClient()
  const { consent, hydrated, hydrate, save, settingsOpen, openSettings, closeSettings } = useConsent()
  const [analytics, setAnalytics] = useState(false)
  const [marketing, setMarketing] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    hydrate()
  }, [hydrate])

  const visible = isClient && hydrated && !consent

  useLayoutEffect(() => {
    const el = ref.current
    const root = document.documentElement
    if (!visible || !el) {
      root.style.removeProperty('--bottom-reserve')
      return
    }
    const ro = new ResizeObserver(() => root.style.setProperty('--bottom-reserve', `${el.offsetHeight + 24}px`))
    ro.observe(el)
    if (!prefersReducedMotion()) gsap.fromTo(el, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'soft', delay: 0.8 })
    return () => {
      ro.disconnect()
      root.style.removeProperty('--bottom-reserve')
    }
  }, [visible])

  useEffect(() => {
    if (settingsOpen && consent) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- синхронизация формы с сохранённым выбором
      setAnalytics(consent.analytics)
      setMarketing(consent.marketing)
    }
  }, [settingsOpen, consent])

  return (
    <>
      {visible && (
        <div
          ref={ref}
          role="region"
          aria-label={t('title')}
          className={cn(
            'fixed inset-x-0 z-[60] border-t border-line bg-paper p-4 shadow-float',
            'md:inset-x-auto md:right-6 md:w-[400px] md:rounded-card md:border md:p-5',
          )}
          style={{ bottom: 'calc(var(--sticky-bar-h, 0px) + env(safe-area-inset-bottom) + var(--cookie-offset, 0px))' }}
        >
          <div className="flex items-start gap-3">
            <Cookie aria-hidden className="mt-0.5 size-5 shrink-0 text-lavender-600" strokeWidth={1.5} />
            <div className="min-w-0">
              <p className="text-[15px] font-semibold">{t('title')}</p>
              <p className="t-small mt-1 font-normal text-ink-soft">
                {t('text')}{' '}
                <TransitionLink href="/privacy" className="font-semibold text-lavender-600 underline underline-offset-4">
                  {t('policyLink')}
                </TransitionLink>
              </p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <Button size="sm" variant="secondary" onClick={() => save({ analytics: false, marketing: false })}>
              {t('necessaryOnly')}
            </Button>
            <Button size="sm" onClick={() => save({ analytics: true, marketing: true })}>
              {t('acceptAll')}
            </Button>
            <Button size="sm" variant="ghost" className="col-span-2" onClick={openSettings}>
              {t('customize')}
            </Button>
          </div>
        </div>
      )}

      <Dialog
        open={settingsOpen}
        onClose={closeSettings}
        title={t('settingsTitle')}
        variant="modal"
        footer={
          <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
            <Button variant="secondary" onClick={() => save({ analytics: false, marketing: false })}>
              {t('necessaryOnly')}
            </Button>
            <Button onClick={() => save({ analytics, marketing })}>{t('save')}</Button>
          </div>
        }
      >
        <ul className="flex flex-col divide-y divide-line">
          <Toggle label={t('necessary')} text={t('necessaryText')} checked disabled note={t('alwaysOn')} />
          <Toggle label={t('analytics')} text={t('analyticsText')} checked={analytics} onChange={setAnalytics} />
          <Toggle label={t('marketing')} text={t('marketingText')} checked={marketing} onChange={setMarketing} />
        </ul>
      </Dialog>

      <AnalyticsLoader enabled={Boolean(consent?.analytics)} />
    </>
  )
}

function Toggle({
  label,
  text,
  checked,
  disabled,
  onChange,
  note,
}: {
  label: string
  text: string
  checked: boolean
  disabled?: boolean
  onChange?: (v: boolean) => void
  note?: string
}) {
  return (
    <li className="flex items-start justify-between gap-4 py-4">
      <div>
        <p className="text-[15px] font-semibold">{label}</p>
        <p className="t-small mt-1 font-normal text-ink-soft">{text}</p>
        {note && <p className="t-caption mt-2 text-pistachio-700">{note}</p>}
      </div>
      <label className={cn('relative inline-flex h-11 w-16 shrink-0 items-center', disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer')}>
        <input
          type="checkbox"
          role="switch"
          className="peer sr-only"
          checked={checked}
          disabled={disabled}
          onChange={(e) => onChange?.(e.target.checked)}
          aria-label={label}
        />
        <span className="absolute inset-x-1 inset-y-2 rounded-pill bg-line transition-colors duration-200 peer-checked:bg-ink peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-lavender-600" />
        <span className="absolute left-2 size-5 rounded-full bg-paper transition-transform duration-200 ease-soft peer-checked:translate-x-6" />
      </label>
    </li>
  )
}

/** Скрипт аналитики подключается только после согласия и только если задан в env */
function AnalyticsLoader({ enabled }: { enabled: boolean }) {
  const src = process.env.NEXT_PUBLIC_ANALYTICS_SRC
  if (!enabled || !src) return null
  return <Script src={src} strategy="afterInteractive" data-site-id={process.env.NEXT_PUBLIC_ANALYTICS_ID} />
}
