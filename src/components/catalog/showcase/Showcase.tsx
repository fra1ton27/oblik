'use client'

import dynamic from 'next/dynamic'
import Image from 'next/image'
import { ArrowLeft, ArrowRight, List, Star } from 'lucide-react'
import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import { gsap, mq, ScrollTrigger, useGSAP } from '@/components/motion/gsap'
import { useLenis } from '@/components/motion/SmoothScroll'
import { TransitionLink } from '@/components/motion/TransitionLink'
import { usePageTransition } from '@/components/motion/PageTransition'
import { rememberSharedElement } from '@/components/motion/sharedElement'
import { useIsClient } from '@/components/motion/useIsClient'
import { Disc, HandCircle } from '@/components/shapes'
import type { ShapeColor } from '@/components/shapes/tokens'
import { Button, buttonClasses } from '@/components/ui/Button'
import { Dialog } from '@/components/ui/Dialog'
import { Price } from '@/components/ui/Price'
import { toast } from '@/components/ui/Toast'
import { addCardToCart } from '@/components/cart/addToCart'
import { useCart } from '@/components/cart/store'
import { pad } from '@/lib/format'
import { cn } from '@/lib/cn'
import type { ShowcaseItem, ShowcaseQuote } from './types'
import { canUseWebGL } from './webgl-support'

const WebGLStage = dynamic(() => import('./WebGLStage'), { ssr: false })

type Props = {
  heading: string
  lead?: string
  items: ShowcaseItem[]
  quotes?: ShowcaseQuote[]
  /** pinned: вертикальный скролл крутит дугу (десктоп); на мобайле и с reduced motion — свайп */
  allowPin?: boolean
  headingLevel?: 'h1' | 'h2'
  className?: string
}

const SCROLL_PER_ITEM_VH = 60

/**
 * Витрина по мотивам A24: позиции на дуге, активная в центре (scale 1), соседние 0.7 и ±25° по Y.
 * Управление: вертикальный скролл (секция закреплена, высота = позиции × 60vh), перетаскивание, свайп,
 * стрелки ← →, клик по соседней. После остановки — доводка до ближайшей позиции.
 * Это CSS 3D-вариант; WebGL-сцена (R3F) подменяет только картинку сцены и грузится лениво.
 * Для скринридеров и SEO в DOM всегда есть обычный список ссылок.
 */
export function Showcase({ heading, lead, items, quotes, allowPin = true, headingLevel = 'h2', className }: Props) {
  const t = useTranslations('showcase')
  const tc = useTranslations('catalog')
  const id = useId()
  const sectionRef = useRef<HTMLElement>(null)
  const pinRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const cursorRef = useRef<HTMLDivElement>(null)
  const progress = useRef(0)
  const activeRef = useRef(0)
  const stRef = useRef<ScrollTrigger | null>(null)
  const tweenRef = useRef<gsap.core.Tween | null>(null)
  const [active, setActive] = useState(0)
  const [indexOpen, setIndexOpen] = useState(false)
  const [hovering, setHovering] = useState(false)
  const [webgl, setWebgl] = useState(false)
  const lenis = useLenis()
  const transition = usePageTransition()
  const isClient = useIsClient()
  const n = items.length
  const H = headingLevel

  // ── отрисовка дуги ──
  const render = useCallback(() => {
    const stage = stageRef.current
    if (!stage) return
    const w = stage.clientWidth
    const desktop = w >= 768
    const spacing = w * (desktop ? 0.23 : 0.64)
    const els = stage.querySelectorAll<HTMLElement>('[data-item]')
    els.forEach((el, i) => {
      const o = i - progress.current
      const abs = Math.abs(o)
      const sign = Math.sign(o)
      const near = Math.min(abs, 1)
      const far = Math.max(0, Math.min(abs, 3) - 1)
      gsap.set(el, {
        x: o * spacing * (1 - Math.min(abs, 3) * 0.05),
        y: near * 18 + far * 26,
        z: -near * 140 - far * 120,
        rotationY: -sign * (near * 25 + far * 10),
        scale: abs <= 1 ? 1 - near * 0.3 : Math.max(0.42, 0.7 - far * 0.12),
        opacity: abs > 2.7 ? 0 : abs > 1.7 ? 1 - (abs - 1.7) : 1,
        zIndex: 100 - Math.round(abs * 10),
        pointerEvents: abs > 2.5 ? 'none' : 'auto',
      })
    })
    const a = Math.max(0, Math.min(n - 1, Math.round(progress.current)))
    if (a !== activeRef.current) {
      activeRef.current = a
      setActive(a)
    }
  }, [n])

  // ── ScrollTrigger (pinned) или свободный режим ──
  useGSAP(
    () => {
      render()
      if (n < 2) return
      const mm = gsap.matchMedia()
      if (allowPin) {
        mm.add(mq.desktop, () => {
          const st = ScrollTrigger.create({
            trigger: sectionRef.current,
            pin: pinRef.current,
            start: 'top top',
            end: () => `+=${(window.innerHeight * SCROLL_PER_ITEM_VH * (n - 1)) / 100}`,
            scrub: 0.6,
            snap: { snapTo: 1 / (n - 1), duration: { min: 0.2, max: 0.6 }, ease: 'power2.inOut', delay: 0.08 },
            onUpdate: (self) => {
              progress.current = self.progress * (n - 1)
              render()
            },
            invalidateOnRefresh: true,
          })
          stRef.current = st
          return () => {
            st.kill()
            stRef.current = null
          }
        })
      }
      const onResize = () => render()
      window.addEventListener('resize', onResize)
      return () => {
        window.removeEventListener('resize', onResize)
        mm.revert()
      }
    },
    { scope: sectionRef, dependencies: [n, allowPin] },
  )

  // WebGL — только если есть WebGL, нет reduced motion, памяти ≥ 4 ГБ и ширина ≥ 768 px
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- определяется по возможностям браузера
    setWebgl(canUseWebGL())
  }, [])

  // ── переход к позиции ──
  const go = useCallback(
    (index: number, opts: { immediate?: boolean } = {}) => {
      const target = Math.max(0, Math.min(n - 1, index))
      const st = stRef.current
      if (st) {
        const y = st.start + (target / Math.max(1, n - 1)) * (st.end - st.start) + 1
        if (lenis) lenis.scrollTo(y, { immediate: opts.immediate, duration: 0.9 })
        else window.scrollTo({ top: y, behavior: opts.immediate ? 'instant' : 'smooth' })
        return
      }
      tweenRef.current?.kill()
      if (opts.immediate || window.matchMedia(mq.reduced).matches) {
        progress.current = target
        render()
        return
      }
      tweenRef.current = gsap.to(progress, { current: target, duration: 0.7, ease: 'power3.out', onUpdate: render })
    },
    [n, lenis, render],
  )

  // ── перетаскивание и свайп ──
  const drag = useRef<{ x: number; start: number; moved: boolean; t: number; lastX: number } | null>(null)
  function spacingPx() {
    const w = stageRef.current?.clientWidth ?? 1000
    return w * (w >= 768 ? 0.23 : 0.64)
  }
  function onPointerDown(e: React.PointerEvent) {
    if (e.button !== 0 || n < 2) return
    drag.current = { x: e.clientX, start: progress.current, moved: false, t: performance.now(), lastX: e.clientX }
    tweenRef.current?.kill()
  }
  function onPointerMove(e: React.PointerEvent) {
    // курсор-пилюля «Смотреть»
    if (cursorRef.current && hovering) gsap.to(cursorRef.current, { x: e.clientX, y: e.clientY, duration: 0.25, ease: 'power3.out' })
    const d = drag.current
    if (!d) return
    const dx = e.clientX - d.x
    if (Math.abs(dx) > 6 && !d.moved) {
      d.moved = true
      ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
    }
    if (!d.moved) return
    const next = Math.max(-0.4, Math.min(n - 0.6, d.start - dx / spacingPx()))
    d.lastX = e.clientX
    const st = stRef.current
    if (st) {
      const y = st.start + (Math.max(0, Math.min(n - 1, next)) / (n - 1)) * (st.end - st.start)
      if (lenis) lenis.scrollTo(y, { immediate: true })
      else window.scrollTo({ top: y })
    } else {
      progress.current = next
      render()
    }
  }
  function onPointerUp(e: React.PointerEvent) {
    const d = drag.current
    drag.current = null
    if (!d?.moved) return
    const dt = Math.max(1, performance.now() - d.t)
    const velocity = (e.clientX - d.x) / dt
    const flick = Math.abs(velocity) > 0.5 ? -Math.sign(velocity) : 0
    go(Math.round(progress.current) + (Math.abs(progress.current - Math.round(progress.current)) < 0.2 ? flick : 0))
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowRight') {
      e.preventDefault()
      go(activeRef.current + 1)
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      go(activeRef.current - 1)
    } else if (e.key === 'Home') {
      e.preventDefault()
      go(0)
    } else if (e.key === 'End') {
      e.preventDefault()
      go(n - 1)
    }
  }

  function openItem(i: number, el: HTMLElement | null) {
    if (drag.current?.moved) return
    if (i !== activeRef.current) return go(i)
    const item = items[i]
    rememberSharedElement(item.id, el?.querySelector('[data-cutout]') ?? el, item.image?.src)
    const href = el?.closest('[data-showcase]')?.querySelector<HTMLAnchorElement>(`[data-item-link="${item.id}"]`)?.href
    if (href) transition?.navigate(new URL(href).pathname)
  }

  // ── инфо-панель: строки приходят снизу ──
  useLayoutEffect(() => {
    const panel = panelRef.current
    if (!panel || window.matchMedia(mq.reduced).matches) return
    gsap.fromTo(panel.querySelectorAll('[data-line]'), { yPercent: 100, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.5, ease: 'soft', stagger: 0.04, overwrite: true })
  }, [active])

  const current = items[active]

  function addCurrent() {
    if (!current) return
    if (current.kind === 'bundle') {
      current.cards.forEach((card) => addCardToCart(card, { silent: true }))
      useCart.getState().openMiniCart()
      toast({ message: t('bundleAdded', { title: current.title }), tone: 'success' })
    } else if (current.cards[0]) {
      addCardToCart(current.cards[0])
      toast({ message: tc('added', { title: current.title }), tone: 'success' })
    }
  }

  if (!n) return null

  return (
    <section
      ref={sectionRef}
      data-showcase
      className={cn('relative', className)}
      aria-roledescription="carousel"
      aria-labelledby={`${id}-title`}
    >
      <div ref={pinRef} className="relative flex min-h-[100svh] flex-col overflow-hidden bg-milk pt-[calc(var(--header-h)+12px)] md:pt-[calc(var(--header-h)+20px)]">
        {/* верх: заголовок и Индекс */}
        <div className="container-site relative z-20 flex items-start justify-between gap-4">
          <div>
            <H id={`${id}-title`} className="t-h2">
              {heading}
            </H>
            {lead && <p className="t-small mt-2 max-w-[44ch] font-normal text-ink-soft">{lead}</p>}
          </div>
          <button
            type="button"
            onClick={() => setIndexOpen(true)}
            className="inline-flex h-11 shrink-0 items-center gap-2 rounded-pill border border-ink bg-paper px-4 text-[14px] font-semibold tabular-nums hover:bg-ink hover:text-milk"
            aria-haspopup="dialog"
          >
            <List aria-hidden className="size-4" strokeWidth={1.5} />
            {t('index')}
            <span aria-hidden>{t('counter', { current: pad(active + 1), total: pad(n) })}</span>
          </button>
        </div>

        <div className="relative flex flex-1 flex-col md:block">
          {/* инфо-панель слева сверху (на мобайле — под подиумом) */}
          <div
            ref={panelRef}
            aria-live="polite"
            className="container-site relative z-20 order-2 mt-4 md:absolute md:top-6 md:left-0 md:mt-0 md:w-[min(420px,34vw)] md:pr-0"
          >
            {current && (
              <div className="flex flex-col gap-3">
                <div className="overflow-hidden">
                  <h3 data-line className="t-serif">
                    {current.title}
                  </h3>
                </div>
                <dl className="border-t border-line">
                  {current.facts.slice(0, 5).map((f, i) => (
                    // dt и dd — прямые дети div внутри dl (иначе axe: dlitem); маска на div, анимируются сами dt/dd
                    <div key={f.label} className={cn('flex justify-between gap-4 overflow-hidden border-b border-line py-2 text-[14px]', i > 2 && 'hidden md:flex')}>
                      <dt data-line className="text-ink-soft">
                        {f.label}
                      </dt>
                      <dd data-line className="text-right font-semibold">
                        {f.value}
                      </dd>
                    </div>
                  ))}
                </dl>
                <div className="overflow-hidden">
                  <div data-line className="flex flex-wrap items-baseline gap-x-3">
                    <Price amount={current.price} compareAt={current.compareAt} from={current.priceFrom} size="lg" rolling />
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <TransitionLink href={current.href} className={buttonClasses({ variant: 'secondary', size: 'sm' })}>
                    {t('details')}
                  </TransitionLink>
                  <Button size="sm" onClick={addCurrent}>
                    {current.kind === 'bundle' ? t('addBundle') : t('addToCart')}
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* сцена */}
          <div
            className="relative order-1 mx-auto h-[min(58svh,560px)] w-full touch-pan-y select-none md:absolute md:inset-x-0 md:top-[8%] md:h-[min(64svh,700px)]"
            style={{ perspective: '1600px' }}
          >
            {webgl && isClient && <WebGLStage items={items} progress={progress} />}
            <div
              ref={stageRef}
              tabIndex={0}
              role="group"
              aria-label={t('label')}
              aria-describedby={`${id}-hint`}
              onKeyDown={onKeyDown}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
              data-webgl={webgl ? 'true' : undefined}
              className={cn(
                'absolute inset-0 cursor-grab outline-none active:cursor-grabbing focus-visible:outline-2 focus-visible:-outline-offset-2',
                hovering && 'cursor-none',
                // с WebGL картинки рисует canvas; DOM-сцена остаётся для событий, фокуса и рукописного круга
                webgl && '[&_[data-disc]]:opacity-0 [&_[data-cutout]]:opacity-0',
              )}
              style={{ transformStyle: 'preserve-3d' }}
            >
              <span id={`${id}-hint`} className="sr-only">
                {t('keyboardHint')}
              </span>
              {items.map((item, i) => {
                const isActive = i === active
                return (
                  <div
                    key={item.id}
                    data-item
                    role="group"
                    aria-roledescription="slide"
                    aria-label={t('position', { current: i + 1, total: n, title: item.title })}
                    // до раскладки GSAP виден только первый подиум и он сверху: иначе его перекрывают остальные
                    // и LCP витрины откладывается до гидратации (inline-стили GSAP потом перекрывают класс)
                    className={cn('absolute top-1/2 left-1/2 w-[min(62vw,300px)] -translate-x-1/2 -translate-y-1/2 md:w-[min(26vw,380px)]', i > 0 && 'js:opacity-0')}
                    style={{ transformStyle: 'preserve-3d', zIndex: i === 0 ? 100 : undefined }}
                    onClick={(e) => openItem(i, e.currentTarget)}
                    onPointerEnter={() => isActive && setHovering(true)}
                    onPointerLeave={() => setHovering(false)}
                  >
                    <div className="group relative" data-active={isActive}>
                      <HandCircle className="-inset-x-[8%] top-[52%] h-[46%] w-[116%]" color="ink" active={isActive && hovering} ratio={3.2} seed={i + 2} />
                      <div className="relative z-10 mx-auto w-[86%]" style={{ perspective: '800px' }}>
                        <div className={cn(isActive && 'motion-safe:animate-[sway_7s_ease-in-out_infinite]')} style={{ transformStyle: 'preserve-3d' }}>
                          <div className="motion-safe:animate-[hover-float_5s_ease-in-out_infinite]">
                            {item.image && (
                              <Image
                                data-cutout
                                src={item.image.src}
                                alt=""
                                width={item.image.width}
                                height={item.image.height}
                                sizes="(min-width: 768px) 26vw, 62vw"
                                // первый подиум — LCP витрины: грузим сразу и с высоким приоритетом
                                priority={i === 0}
                                draggable={false}
                                className="pointer-events-none mx-auto h-auto w-full object-contain"
                              />
                            )}
                          </div>
                        </div>
                      </div>
                      <div data-disc className="relative -mt-[16%] w-full">
                        <span aria-hidden className="absolute inset-x-[18%] top-[18%] h-[22%] rounded-[50%] bg-ink/15 blur-md" />
                        <Disc color={(item.podium as ShapeColor) ?? 'lavender'} />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* низ: цитаты, счётчик, стрелки */}
        <div className="container-site relative z-20 mt-auto flex flex-col gap-4 pt-6 pb-6 md:flex-row md:items-end md:justify-between md:pb-8">
          <div className="hidden gap-6 md:grid md:max-w-[640px] md:grid-cols-2">
            {(quotes?.length ? quotes.slice(0, 2) : [{ text: t('advantage1'), author: '' }, { text: t('advantage2'), author: '' }]).map((q, i) => (
              <figure key={i} className="t-small border-t border-line pt-3 font-normal">
                {typeof q.rating === 'number' && (
                  <span className="mb-1 flex gap-0.5" aria-hidden>
                    {Array.from({ length: 5 }, (_, s) => (
                      <Star key={s} className={cn('size-3.5', s < (q.rating ?? 0) ? 'fill-ink text-ink' : 'text-line')} strokeWidth={1.5} />
                    ))}
                  </span>
                )}
                <blockquote className="font-serif text-[18px] leading-snug italic">{q.text}</blockquote>
                {q.author && <figcaption className="mt-1 text-ink-soft">{q.author}</figcaption>}
              </figure>
            ))}
          </div>
          <div className="flex items-center justify-between gap-4 md:justify-end">
            <span className="font-display text-[clamp(28px,4vw,48px)] leading-none tabular-nums" aria-hidden>
              {t('counter', { current: pad(active + 1), total: pad(n) })}
            </span>
            <div className="flex gap-2">
              <Button variant="icon" onClick={() => go(active - 1)} disabled={active === 0} aria-label={t('prev')}>
                <ArrowLeft aria-hidden className="size-5" strokeWidth={1.5} />
              </Button>
              <Button variant="icon" onClick={() => go(active + 1)} disabled={active === n - 1} aria-label={t('next')}>
                <ArrowRight aria-hidden className="size-5" strokeWidth={1.5} />
              </Button>
            </div>
          </div>
        </div>

        {/* курсор-пилюля «Смотреть» */}
        <div
          ref={cursorRef}
          aria-hidden
          className={cn(
            'pointer-events-none fixed top-0 left-0 z-[60] -translate-x-1/2 -translate-y-1/2 rounded-pill bg-ink px-4 py-2 text-[13px] font-semibold text-milk transition-opacity duration-200',
            hovering ? 'opacity-100' : 'opacity-0',
          )}
        >
          {t('view')}
        </div>
      </div>

      {/* для скринридеров и поисковиков — обычный список ссылок */}
      <ul className="sr-only">
        {items.map((item) => (
          <li key={item.id}>
            <TransitionLink href={item.href} data-item-link={item.id} tabIndex={-1}>
              {item.title}
            </TransitionLink>
          </li>
        ))}
      </ul>

      <Dialog open={indexOpen} onClose={() => setIndexOpen(false)} title={t('indexTitle')} width={420}>
        <ol className="flex flex-col gap-1 pb-2">
          {items.map((item, i) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => {
                  setIndexOpen(false)
                  window.setTimeout(() => go(i), 320)
                }}
                aria-current={i === active ? 'true' : undefined}
                className={cn(
                  'flex min-h-12 w-full items-center gap-4 rounded-field px-3 text-left text-[15px] transition-colors',
                  i === active ? 'bg-ink text-milk' : 'hover:bg-sand',
                )}
              >
                <span className="w-7 shrink-0 font-display text-[13px] tabular-nums opacity-70">{pad(i + 1)}</span>
                <span className="flex-1 font-semibold">{item.title}</span>
              </button>
            </li>
          ))}
        </ol>
      </Dialog>
    </section>
  )
}
