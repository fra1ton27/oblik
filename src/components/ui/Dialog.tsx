'use client'

import { X } from 'lucide-react'
import { useCallback, useEffect, useId, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { gsap, prefersReducedMotion } from '@/components/motion/gsap'
import { cn } from '@/lib/cn'

type Variant = 'drawer' | 'sheet' | 'modal' | 'fullscreen'

type Props = {
  open: boolean
  onClose: () => void
  title: React.ReactNode
  /** Скрыть заголовок визуально (остаётся для скринридера) */
  hideTitle?: boolean
  children: React.ReactNode
  footer?: React.ReactNode
  variant?: Variant
  /** На мобайле drawer превращается в нижний лист (по умолчанию да) */
  sheetOnMobile?: boolean
  className?: string
  bodyClassName?: string
  /** Ширина дроуэра, px */
  width?: number
  tone?: 'paper' | 'lavender' | 'milk'
  initialFocus?: string
}

/**
 * Дроуэр справа / нижний лист / модалка на нативном <dialog>:
 * фокус удерживается внутри, Esc закрывает, фокус возвращается на инициатор.
 * Нижний лист закрывается свайпом вниз.
 */
export function Dialog({
  open,
  onClose,
  title,
  hideTitle,
  children,
  footer,
  variant = 'drawer',
  sheetOnMobile,
  className,
  bodyClassName,
  width,
  tone = 'paper',
  initialFocus,
}: Props) {
  const t = useTranslations('common')
  const ref = useRef<HTMLDialogElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const titleId = useId()
  const opener = useRef<HTMLElement | null>(null)
  const closing = useRef(false)

  // дроуэр на мобайле по умолчанию становится нижним листом, модалка — только по запросу (sheetOnMobile)
  const mobileSheet = sheetOnMobile ?? variant === 'drawer'
  const isSheet = useCallback(
    () => variant === 'sheet' || ((variant === 'drawer' || variant === 'modal') && mobileSheet && window.matchMedia('(max-width: 767px)').matches),
    [variant, mobileSheet],
  )

  const animateClose = useCallback(() => {
    const dialog = ref.current
    const panel = panelRef.current
    if (!dialog || !panel || closing.current) return
    const finish = () => {
      closing.current = false
      dialog.close()
      document.documentElement.classList.remove('scroll-locked')
      gsap.set(panel, { clearProps: 'all' })
      opener.current?.focus?.()
    }
    if (prefersReducedMotion()) return finish()
    closing.current = true
    const to = isSheet() ? { yPercent: 100 } : variant === 'modal' ? { y: 24, opacity: 0 } : variant === 'fullscreen' ? { opacity: 0 } : { xPercent: 100 }
    gsap.to(panel, { ...to, duration: 0.3, ease: 'power3.in', onComplete: finish })
  }, [isSheet, variant])

  // открытие
  useEffect(() => {
    const dialog = ref.current
    const panel = panelRef.current
    if (!dialog || !panel) return
    if (open && !dialog.open) {
      opener.current = document.activeElement as HTMLElement | null
      dialog.showModal()
      document.documentElement.classList.add('scroll-locked')
      if (!prefersReducedMotion()) {
        // opacity, а не autoAlpha: элементы с visibility:hidden нельзя сфокусировать
        // анимируем только свою ось: общий сброс xPercent/yPercent ломал бы позиционирование панели
        const [from, to] = isSheet()
          ? [{ yPercent: 100 }, { yPercent: 0 }]
          : variant === 'modal'
            ? [{ y: 24, opacity: 0 }, { y: 0, opacity: 1 }]
            : variant === 'fullscreen'
              ? [{ opacity: 0 }, { opacity: 1 }]
              : [{ xPercent: 100 }, { xPercent: 0 }]
        gsap.fromTo(panel, from, { ...to, duration: 0.4, ease: 'soft' })
        gsap.fromTo(dialog, { '--backdrop': 0 }, { '--backdrop': 1, duration: 0.4 })
      }
      const target =
        (initialFocus && dialog.querySelector<HTMLElement>(initialFocus)) ||
        dialog.querySelector<HTMLElement>('[autofocus]') ||
        dialog.querySelector<HTMLElement>('[data-dialog-close]')
      target?.focus()
    }
    if (!open && dialog.open) animateClose()
    // eslint-disable-next-line react-hooks/exhaustive-deps -- реагируем только на смену open
  }, [open])

  // Esc и клик по подложке
  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    const onCancel = (e: Event) => {
      e.preventDefault()
      onClose()
    }
    const onClick = (e: MouseEvent) => {
      if (e.target === dialog) onClose()
    }
    dialog.addEventListener('cancel', onCancel)
    dialog.addEventListener('click', onClick)
    return () => {
      dialog.removeEventListener('cancel', onCancel)
      dialog.removeEventListener('click', onClick)
    }
  }, [onClose])

  useEffect(() => () => document.documentElement.classList.remove('scroll-locked'), [])

  // Свайп вниз для нижнего листа
  const drag = useRef<{ y: number; t: number } | null>(null)
  function onPointerDown(e: React.PointerEvent) {
    if (!isSheet()) return
    drag.current = { y: e.clientY, t: performance.now() }
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
  }
  function onPointerMove(e: React.PointerEvent) {
    if (!drag.current || !panelRef.current) return
    const dy = Math.max(0, e.clientY - drag.current.y)
    gsap.set(panelRef.current, { y: dy })
  }
  function onPointerUp(e: React.PointerEvent) {
    if (!drag.current || !panelRef.current) return
    const dy = e.clientY - drag.current.y
    const v = dy / Math.max(1, performance.now() - drag.current.t)
    drag.current = null
    if (dy > 120 || v > 0.6) onClose()
    else gsap.to(panelRef.current, { y: 0, duration: 0.3, ease: 'soft' })
  }

  const tones = { paper: 'bg-paper', lavender: 'bg-lavender', milk: 'bg-milk' }

  const layout = {
    drawer: cn(
      'fixed m-0 flex flex-col',
      mobileSheet
        ? 'inset-x-0 bottom-0 top-auto h-[90svh] max-h-[90svh] w-full max-w-none rounded-t-[24px] md:inset-y-0 md:right-0 md:left-auto md:h-dvh md:max-h-none md:w-[var(--drawer-w)] md:rounded-none md:rounded-l-[24px]'
        : 'inset-y-0 right-0 left-auto h-dvh max-h-none w-[min(var(--drawer-w),100vw)] max-w-none rounded-l-[24px]',
    ),
    sheet: 'fixed inset-x-0 bottom-0 top-auto m-0 flex max-h-[90svh] w-full max-w-none flex-col rounded-t-[24px]',
    // центр без transform (inset + margin auto + h-fit): transform занят анимацией GSAP
    modal: cn(
      'fixed inset-x-4 inset-y-0 m-auto flex h-fit max-h-[min(90svh,860px)] w-auto max-w-[var(--modal-w,640px)] flex-col rounded-[24px] md:inset-x-0',
      mobileSheet && 'max-md:inset-x-0 max-md:top-auto max-md:bottom-0 max-md:mb-0 max-md:max-h-[90svh] max-md:w-full max-md:max-w-none max-md:rounded-b-none',
    ),
    fullscreen: 'fixed inset-0 m-0 flex h-dvh max-h-none w-full max-w-none flex-col',
  }[variant]

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      className={cn(
        'overflow-visible bg-transparent p-0 text-ink backdrop:bg-ink/40 backdrop:opacity-[var(--backdrop,1)]',
        'open:block',
      )}
      style={{ ['--drawer-w' as string]: `${width ?? 440}px`, ...(width ? { ['--modal-w' as string]: `${width}px` } : {}) }}
    >
      <div
        ref={panelRef}
        className={cn(layout, tones[tone], 'shadow-float outline-none', className)}
        style={{ paddingBottom: variant === 'modal' && !mobileSheet ? undefined : 'env(safe-area-inset-bottom)' }}
      >
        {(variant === 'sheet' || ((variant === 'drawer' || variant === 'modal') && mobileSheet)) && (
          <div
            className={cn('flex touch-none justify-center pt-2.5 pb-1', variant !== 'sheet' && 'md:hidden')}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            aria-hidden
          >
            <span className="h-1.5 w-12 rounded-pill bg-ink/20" />
          </div>
        )}
        <header
          className={cn('flex shrink-0 items-center justify-between gap-4 px-5 pt-3 pb-3 md:px-7 md:pt-6', hideTitle && 'pb-0')}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
        >
          <h2 id={titleId} className={cn('t-h3', hideTitle && 'sr-only')}>
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            data-dialog-close
            className="ml-auto inline-flex size-11 shrink-0 items-center justify-center rounded-pill border border-line bg-paper hover:bg-sand"
            aria-label={t('close')}
          >
            <X aria-hidden className="size-5" strokeWidth={1.5} />
          </button>
        </header>
        <div className={cn('min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-5 md:px-7', bodyClassName)} data-lenis-prevent>
          {children}
        </div>
        {footer && <div className="shrink-0 border-t border-line px-5 py-4 md:px-7">{footer}</div>}
      </div>
    </dialog>
  )
}
