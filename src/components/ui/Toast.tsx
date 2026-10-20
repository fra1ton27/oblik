'use client'

import { CheckCircle2, Info, TriangleAlert, X } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { create } from 'zustand'
import { gsap, prefersReducedMotion } from '@/components/motion/gsap'
import { cn } from '@/lib/cn'

type ToastTone = 'info' | 'success' | 'error'

export type ToastItem = {
  id: number
  message: string
  tone: ToastTone
  actionLabel?: string
  onAction?: () => void
  duration: number
}

type ToastState = {
  toasts: ToastItem[]
  push: (toast: Omit<ToastItem, 'id' | 'duration' | 'tone'> & { tone?: ToastTone; duration?: number }) => number
  dismiss: (id: number) => void
}

let nextId = 1

export const useToasts = create<ToastState>((set) => ({
  toasts: [],
  push: (toast) => {
    const id = nextId++
    set((s) => ({ toasts: [...s.toasts.slice(-2), { tone: 'info', duration: 5000, ...toast, id }] }))
    return id
  },
  dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}))

/** Короткий доступ: toast({ message, actionLabel, onAction }) */
export const toast = (t: Parameters<ToastState['push']>[0]) => useToasts.getState().push(t)

function ToastCard({ item }: { item: ToastItem }) {
  const t = useTranslations('common')
  const dismiss = useToasts((s) => s.dismiss)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (ref.current && !prefersReducedMotion()) {
      gsap.fromTo(ref.current, { y: 16, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.4, ease: 'soft' })
    }
    const timer = window.setTimeout(() => dismiss(item.id), item.duration)
    return () => window.clearTimeout(timer)
  }, [dismiss, item.id, item.duration])

  const Icon = item.tone === 'success' ? CheckCircle2 : item.tone === 'error' ? TriangleAlert : Info
  return (
    <div
      ref={ref}
      role={item.tone === 'error' ? 'alert' : 'status'}
      className="pointer-events-auto flex w-full items-center gap-3 rounded-card bg-ink py-2 pr-2 pl-4 text-milk shadow-float md:w-[400px]"
    >
      <Icon
        aria-hidden
        className={cn('size-5 shrink-0', item.tone === 'success' ? 'text-pistachio' : item.tone === 'error' ? 'text-blush' : 'text-lavender')}
        strokeWidth={1.5}
      />
      <p className="t-small flex-1 py-2">{item.message}</p>
      {item.actionLabel && (
        <button
          type="button"
          className="h-11 shrink-0 rounded-pill px-4 text-[14px] font-semibold text-lavender hover:bg-milk/10"
          onClick={() => {
            item.onAction?.()
            dismiss(item.id)
          }}
        >
          {item.actionLabel}
        </button>
      )}
      <button
        type="button"
        onClick={() => dismiss(item.id)}
        className="inline-flex size-11 shrink-0 items-center justify-center rounded-pill hover:bg-milk/10"
        aria-label={t('close')}
      >
        <X aria-hidden className="size-4" strokeWidth={1.5} />
      </button>
    </div>
  )
}

/** Регион тостов: над липкими плашками и cookie-баннером, с учётом safe area */
export function Toaster() {
  const toasts = useToasts((s) => s.toasts)
  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 z-[70] flex flex-col items-center gap-2 px-4 md:right-6 md:left-auto md:items-end"
      style={{ bottom: 'calc(16px + env(safe-area-inset-bottom) + var(--sticky-bar-h, 0px))' }}
    >
      {toasts.map((item) => (
        <ToastCard key={item.id} item={item} />
      ))}
    </div>
  )
}
