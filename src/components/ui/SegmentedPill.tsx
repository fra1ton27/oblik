'use client'

import { Fragment, useLayoutEffect, useRef, type ReactNode } from 'react'
import { Flip, gsap, motion, prefersReducedMotion } from '@/components/motion/gsap'
import { cn } from '@/lib/cn'

export type SegmentItemProps = {
  className: string
  'data-key': string
  'data-active': boolean
  children?: ReactNode
}

export type SegmentItem = {
  key: string
  render: (props: SegmentItemProps & { children?: ReactNode }) => ReactNode
  /** Содержимое внутри элемента поверх плашки */
}

type Props = {
  items: SegmentItem[]
  activeKey: string | null
  tone?: 'light' | 'dark' | 'soft'
  size?: 'sm' | 'md'
  className?: string
  fullWidth?: boolean
}

function place(indicator: HTMLElement, active: HTMLElement) {
  gsap.set(indicator, {
    x: active.offsetLeft,
    y: active.offsetTop,
    width: active.offsetWidth,
    height: active.offsetHeight,
    scaleX: 1,
    scaleY: 1,
    opacity: 1,
  })
}

/**
 * Сегментированная навигация-пилюля: активный пункт подсвечен плашкой,
 * которая переезжает под другой пункт (GSAP Flip). Сами элементы рендерит вызывающий
 * (ссылка, кнопка или radio), чтобы сохранить правильную семантику.
 */
export function SegmentedPill({ items, activeKey, tone = 'light', size = 'sm', className, fullWidth }: Props) {
  const rootRef = useRef<HTMLDivElement>(null)
  const indicatorRef = useRef<HTMLSpanElement>(null)
  const stateRef = useRef<Flip.FlipState | null>(null)
  const prevKey = useRef<string | null>(activeKey)

  // Запоминаем положение плашки прямо перед сменой (pointerdown/keydown), чтобы Flip знал, откуда ехать
  function capture() {
    if (indicatorRef.current) stateRef.current = Flip.getState(indicatorRef.current)
  }

  useLayoutEffect(() => {
    const root = rootRef.current
    const indicator = indicatorRef.current
    if (!root || !indicator) return
    const active = root.querySelector<HTMLElement>(`[data-key="${CSS.escape(activeKey ?? '')}"]`)
    if (!active) {
      indicator.style.opacity = '0'
      return
    }
    const changed = prevKey.current !== activeKey
    const state = changed ? (stateRef.current ?? Flip.getState(indicator)) : null
    place(indicator, active)
    if (state && !prefersReducedMotion() && indicator.dataset.placed === 'true') {
      Flip.from(state, { duration: motion.base, ease: motion.ease.move, scale: true })
    }
    indicator.dataset.placed = 'true'
    stateRef.current = null
    prevKey.current = activeKey
  }, [activeKey, items.length])

  // Пересчёт при ресайзе (шрифты, перенос строк)
  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root || typeof ResizeObserver === 'undefined') return
    const ro = new ResizeObserver(() => {
      const indicator = indicatorRef.current
      const active = root.querySelector<HTMLElement>(`[data-key="${CSS.escape(prevKey.current ?? '')}"]`)
      if (indicator && active) place(indicator, active)
    })
    ro.observe(root)
    return () => ro.disconnect()
  }, [])

  const toneRoot = {
    light: 'bg-paper/80 border border-line text-ink',
    dark: 'bg-plum border border-milk/20 text-milk',
    soft: 'bg-lavender/60 text-ink',
  }[tone]
  const toneIndicator = { light: 'bg-ink', dark: 'bg-lavender', soft: 'bg-paper' }[tone]
  const toneActive = { light: 'text-milk', dark: 'text-ink', soft: 'text-ink' }[tone]
  const sizeItem = size === 'sm' ? 'h-9 px-3.5 t-small min-w-11' : 'h-11 px-5 text-[15px] font-semibold min-w-11'

  return (
    <div
      ref={rootRef}
      onPointerDownCapture={capture}
      onKeyDownCapture={capture}
      className={cn(
        'relative isolate inline-flex max-w-full items-center gap-0.5 rounded-pill p-1',
        fullWidth && 'flex w-full',
        toneRoot,
        className,
      )}
    >
      <span
        ref={indicatorRef}
        aria-hidden
        className={cn('pointer-events-none absolute top-0 left-0 -z-10 rounded-pill opacity-0', toneIndicator)}
      />
      {items.map((item) => {
        const active = item.key === activeKey
        return (
          <Fragment key={item.key}>
            {item.render({
          'data-key': item.key,
          'data-active': active,
          className: cn(
            'relative inline-flex shrink-0 select-none items-center justify-center whitespace-nowrap rounded-pill',
            'transition-colors duration-200 ease-soft',
            fullWidth && 'flex-1',
            sizeItem,
            active ? toneActive : 'hover:bg-ink/5',
            tone === 'dark' && !active && 'hover:bg-milk/10',
          ),
            })}
          </Fragment>
        )
      })}
    </div>
  )
}
