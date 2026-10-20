'use client'

import Image from 'next/image'
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Hand, Star } from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import type { ImageDTO } from '@/lib/media'
import type { ReviewDTO } from '@/lib/data/globals'
import { gsap, loadDraggable, mq } from '@/components/motion/gsap'
import { SplitHeading } from '@/components/motion/SplitHeading'
import { TransitionLink } from '@/components/motion/TransitionLink'
import { Brackets } from '@/components/shapes'
import { cn } from '@/lib/cn'

export type CanvasTile = { kind: 'photo'; id: string; image: ImageDTO; caption: string } | { kind: 'review'; id: string; review: ReviewDTO }

const BOARD_W = 2400
const BOARD_H = 1500
const MINI_W = 176

/** Детерминированная «рассыпанная» раскладка плиток по сетке с отступами и наклоном −4…+6° */
function layout(tiles: CanvasTile[]) {
  const cols = 5
  const cellW = BOARD_W / cols
  const rows = Math.max(2, Math.ceil(tiles.length / cols))
  const cellH = BOARD_H / rows
  return tiles.map((tile, i) => {
    const col = i % cols
    const row = Math.floor(i / cols)
    const seed = (i * 9301 + 49297) % 233280
    const r = seed / 233280
    const w = tile.kind === 'photo' ? 360 + Math.round(r * 100) : 320
    const h = tile.kind === 'photo' ? Math.round(w * 0.75) : 230
    const x = col * cellW + (cellW - w) * (0.15 + r * 0.7) + (row % 2 ? cellW * 0.25 : 0)
    const y = row * cellH + (cellH - h) * (0.2 + ((r * 7) % 1) * 0.6)
    const tilt = -4 + Math.round(r * 10)
    return { tile, x: Math.min(x, BOARD_W - w - 40), y: Math.min(y, BOARD_H - h - 40), w, h, tilt }
  })
}

function Stars({ rating }: { rating: number }) {
  return (
    <span className="flex gap-0.5" aria-hidden>
      {Array.from({ length: 5 }, (_, s) => (
        <Star key={s} className={cn('size-3.5', s < rating ? 'fill-ink text-ink' : 'text-line')} strokeWidth={1.5} />
      ))}
    </span>
  )
}

function ReviewCard({ review, className }: { review: ReviewDTO; className?: string }) {
  const t = useTranslations('home')
  return (
    <figure className={cn('flex h-full flex-col gap-3 rounded-card bg-paper p-5 shadow-float', className)}>
      <span className="sr-only">{t('rating', { rating: review.rating })}</span>
      <Stars rating={review.rating} />
      <blockquote className="font-serif text-[19px] leading-snug italic">{review.text}</blockquote>
      <figcaption className="t-small mt-auto font-normal text-ink-soft">
        {review.author}
        {review.city && `, ${review.city}`}
        {review.productTitle && review.productSlug && (
          <>
            <br />
            <TransitionLink href={{ pathname: '/furniture/[slug]', params: { slug: review.productSlug } }} className="relative z-10 font-semibold text-ink underline underline-offset-4" aria-label={t('reviewAbout', { product: review.productTitle })}>
              {review.productTitle}
            </TransitionLink>
          </>
        )}
      </figcaption>
    </figure>
  )
}

/**
 * Полотно «перетаскивай»: большое поле фото интерьеров и отзывов тащится мышью с инерцией
 * (Draggable + Inertia). В углу миникарта с рамкой-уголками, кнопки-стрелки для клавиатуры.
 * На тач-устройствах и при reduced motion — горизонтальный свайп.
 */
export function DragCanvas({ heading, lead, tiles }: { heading: string; lead?: string; tiles: CanvasTile[] }) {
  const t = useTranslations('home')
  const viewportRef = useRef<HTMLDivElement>(null)
  const boardRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef<HTMLDivElement>(null)
  const draggableRef = useRef<{ update: () => void; kill: () => void } | null>(null)
  const [enabled, setEnabled] = useState(false)
  const placed = useMemo(() => layout(tiles), [tiles])
  const scale = MINI_W / BOARD_W

  const updateMinimap = useCallback(() => {
    const board = boardRef.current
    const vp = viewportRef.current
    const frame = frameRef.current
    if (!board || !vp || !frame) return
    const x = Number(gsap.getProperty(board, 'x'))
    const y = Number(gsap.getProperty(board, 'y'))
    gsap.set(frame, { x: -x * scale, y: -y * scale, width: vp.clientWidth * scale, height: vp.clientHeight * scale })
  }, [scale])

  useEffect(() => {
    const mql = window.matchMedia(`${mq.finePointer} and (min-width: 1024px) and (prefers-reduced-motion: no-preference)`)
    const apply = () => setEnabled(mql.matches)
    apply()
    mql.addEventListener('change', apply)
    return () => mql.removeEventListener('change', apply)
  }, [])

  useEffect(() => {
    if (!enabled || !boardRef.current || !viewportRef.current) return
    let cancelled = false
    const board = boardRef.current
    const vp = viewportRef.current
    // стартуем из центра полотна
    gsap.set(board, { x: -(BOARD_W - vp.clientWidth) / 2, y: -(BOARD_H - vp.clientHeight) / 2 })
    updateMinimap()
    loadDraggable().then(({ Draggable }) => {
      if (cancelled) return
      const [d] = Draggable.create(board, {
        type: 'x,y',
        bounds: vp,
        inertia: true,
        edgeResistance: 0.85,
        dragClickables: false,
        cursor: 'grab',
        activeCursor: 'grabbing',
        onDrag: updateMinimap,
        onThrowUpdate: updateMinimap,
      })
      draggableRef.current = d
    })
    const onResize = () => {
      draggableRef.current?.update()
      updateMinimap()
    }
    window.addEventListener('resize', onResize)
    return () => {
      cancelled = true
      window.removeEventListener('resize', onResize)
      draggableRef.current?.kill()
      draggableRef.current = null
      gsap.set(board, { clearProps: 'transform' })
    }
  }, [enabled, updateMinimap])

  function nudge(dx: number, dy: number) {
    const board = boardRef.current
    const vp = viewportRef.current
    if (!board || !vp) return
    const minX = vp.clientWidth - BOARD_W
    const minY = vp.clientHeight - BOARD_H
    const x = Math.max(minX, Math.min(0, Number(gsap.getProperty(board, 'x')) + dx))
    const y = Math.max(minY, Math.min(0, Number(gsap.getProperty(board, 'y')) + dy))
    gsap.to(board, { x, y, duration: 0.6, ease: 'power3.out', onUpdate: updateMinimap, onComplete: () => draggableRef.current?.update() })
  }

  function jumpTo(e: React.MouseEvent<HTMLDivElement>) {
    const vp = viewportRef.current
    if (!vp) return
    const r = e.currentTarget.getBoundingClientRect()
    const bx = (e.clientX - r.left) / scale - vp.clientWidth / 2
    const by = (e.clientY - r.top) / scale - vp.clientHeight / 2
    const board = boardRef.current
    if (!board) return
    nudge(-bx - Number(gsap.getProperty(board, 'x')), -by - Number(gsap.getProperty(board, 'y')))
  }

  const step = 320

  return (
    <section className="mt-section" aria-label={t('canvasLabel')}>
      <div className="container-site">
        <div className="mb-6 flex flex-col gap-3 md:mb-10 md:flex-row md:items-end md:justify-between">
          <SplitHeading className="t-h1">{heading}</SplitHeading>
          {lead && <p className="t-lead max-w-[38ch] text-ink-soft">{lead}</p>}
        </div>

        {/* Десктоп: полотно с перетаскиванием */}
        <div className={cn('relative hidden', enabled && 'lg:block')}>
          <div ref={viewportRef} className="relative h-[min(78svh,760px)] overflow-hidden rounded-section bg-sand">
            <div ref={boardRef} className="absolute top-0 left-0 touch-none" style={{ width: BOARD_W, height: BOARD_H }}>
              {placed.map(({ tile, x, y, w, h, tilt }) => (
                <div key={tile.id} className="absolute" style={{ left: x, top: y, width: w, height: tile.kind === 'photo' ? h : undefined }}>
                  <div className="tilt-card h-full" style={{ ['--tilt-md' as string]: `${tilt}deg` }}>
                    {tile.kind === 'photo' ? (
                      <figure className="relative h-full overflow-hidden rounded-card bg-milk shadow-float">
                        <Image src={tile.image.src} alt={tile.image.alt} fill sizes="460px" draggable={false} placeholder="blur" blurDataURL={tile.image.blur} className="pointer-events-none object-cover" />
                      </figure>
                    ) : (
                      <ReviewCard review={tile.review} />
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="pointer-events-none absolute top-5 left-5 inline-flex items-center gap-2 rounded-pill bg-paper/90 px-4 py-2 text-[13px] font-semibold">
              <Hand aria-hidden className="size-4" strokeWidth={1.5} />
              {t('canvasHint')}
            </div>
            {/* миникарта */}
            <div
              role="img"
              aria-label={t('canvasMinimap')}
              onClick={jumpTo}
              className="absolute right-5 bottom-5 cursor-pointer rounded-[10px] bg-paper/90 p-2"
            >
              <div className="relative" style={{ width: MINI_W, height: BOARD_H * scale }}>
                {placed.map(({ tile, x, y, w, h }) => (
                  <span
                    key={tile.id}
                    className={cn('absolute rounded-[2px]', tile.kind === 'photo' ? 'bg-ink/25' : 'bg-lavender-600/40')}
                    style={{ left: x * scale, top: y * scale, width: w * scale, height: (tile.kind === 'photo' ? h : 230) * scale }}
                  />
                ))}
                <div ref={frameRef} className="absolute top-0 left-0">
                  <Brackets visible size={8} inset={0} />
                </div>
              </div>
            </div>
            {/* стрелки для клавиатуры */}
            <div className="absolute bottom-5 left-5 grid grid-cols-3 gap-1">
              <span />
              <ArrowButton label={t('canvasUp')} onClick={() => nudge(0, step)}>
                <ArrowUp aria-hidden className="size-4" strokeWidth={1.5} />
              </ArrowButton>
              <span />
              <ArrowButton label={t('canvasLeft')} onClick={() => nudge(step, 0)}>
                <ArrowLeft aria-hidden className="size-4" strokeWidth={1.5} />
              </ArrowButton>
              <ArrowButton label={t('canvasDown')} onClick={() => nudge(0, -step)}>
                <ArrowDown aria-hidden className="size-4" strokeWidth={1.5} />
              </ArrowButton>
              <ArrowButton label={t('canvasRight')} onClick={() => nudge(-step, 0)}>
                <ArrowRight aria-hidden className="size-4" strokeWidth={1.5} />
              </ArrowButton>
            </div>
          </div>
        </div>

        {/* Мобайл и тач: горизонтальный свайп */}
        <ul className={cn('no-scrollbar -mx-[var(--page-pad)] flex snap-x snap-mandatory gap-4 overflow-x-auto px-[var(--page-pad)] pt-2 pb-6', enabled && 'lg:hidden')} tabIndex={0} aria-label={t('canvasLabel')}>
          {tiles.map((tile, i) => (
            <li key={tile.id} className="w-[78vw] max-w-[340px] shrink-0 snap-center">
              <div className="tilt-card h-full" style={{ ['--tilt-sm' as string]: `${i % 2 ? -1.5 : 1.5}deg`, ['--tilt-md' as string]: `${i % 2 ? -3 : 3}deg` }}>
                {tile.kind === 'photo' ? (
                  <figure className="relative aspect-[4/3] overflow-hidden rounded-card bg-sand">
                    <Image src={tile.image.src} alt={tile.image.alt} fill sizes="78vw" placeholder="blur" blurDataURL={tile.image.blur} className="object-cover" />
                  </figure>
                ) : (
                  <ReviewCard review={tile.review} className="min-h-[240px] shadow-none" />
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function ArrowButton({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" aria-label={label} onClick={onClick} className="inline-flex size-11 items-center justify-center rounded-pill bg-paper/90 hover:bg-paper">
      {children}
    </button>
  )
}
