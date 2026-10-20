'use client'

import Image from 'next/image'
import { Expand } from 'lucide-react'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import type { ImageDTO } from '@/lib/media'
import { Arch } from '@/components/shapes'
import { Dialog } from '@/components/ui/Dialog'
import { DotsPagination } from '@/components/ui/DotsPagination'
import { gsap, prefersReducedMotion } from '@/components/motion/gsap'
import { useSharedElement } from '@/components/motion/sharedElement'
import { cn } from '@/lib/cn'

export type GalleryImage = { main: ImageDTO; full: ImageDTO | null }

type Props = { images: GalleryImage[]; title: string; sharedKey: string; className?: string }

/**
 * Галерея посадочной: на десктопе фото скроллом (первое — в маске-арке), на мобайле — свайп на всю
 * ширину с точками в пилюле. Тап/клик открывает полноэкранный просмотр (pinch-zoom нативный).
 * Если пришли из витрины, главное фото «переезжает» из её прямоугольника (FLIP).
 */
export function Gallery({ images, title, sharedKey, className }: Props) {
  const t = useTranslations('product')
  const [active, setActive] = useState(0)
  const [zoom, setZoom] = useState<number | null>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const firstRef = useRef<HTMLDivElement>(null)

  // shared element: из витрины в товар
  useLayoutEffect(() => {
    const shared = useSharedElement.getState().value
    const el = firstRef.current
    if (!shared || !el || shared.key !== sharedKey || Date.now() - shared.at > 4000 || prefersReducedMotion()) return
    useSharedElement.getState().set(null)
    const to = el.getBoundingClientRect()
    if (!to.width) return
    const dx = shared.rect.left + shared.rect.width / 2 - (to.left + to.width / 2)
    const dy = shared.rect.top + shared.rect.height / 2 - (to.top + to.height / 2)
    const s = Math.min(shared.rect.width / to.width, shared.rect.height / to.height)
    gsap.fromTo(el, { x: dx, y: dy, scale: s, transformOrigin: '50% 50%' }, { x: 0, y: 0, scale: 1, duration: 0.8, ease: 'power3.inOut', clearProps: 'transform' })
  }, [sharedKey])

  // точки на мобайле следуют за прокруткой
  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    const onScroll = () => setActive(Math.round(el.scrollLeft / Math.max(1, el.clientWidth)))
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [])

  if (!images.length) return null

  return (
    <div className={className} aria-label={t('galleryLabel')} role="region">
      {/* мобайл */}
      <div className="relative md:hidden">
        <div ref={trackRef} className="no-scrollbar -mx-[var(--page-pad)] flex snap-x snap-mandatory overflow-x-auto">
          {images.map((img, i) => (
            <button
              key={img.main.src + i}
              type="button"
              onClick={() => setZoom(i)}
              aria-label={t('openZoom', { index: i + 1 })}
              className="relative w-full shrink-0 snap-center px-[var(--page-pad)]"
            >
              <div ref={i === 0 ? firstRef : undefined} className={cn('relative aspect-[4/5] overflow-hidden bg-sand', i === 0 ? 'rounded-t-[999px] rounded-b-card' : 'rounded-card')}>
                <Image src={img.main.src} alt={img.main.alt} fill priority={i === 0} sizes="100vw" placeholder="blur" blurDataURL={img.main.blur} className="object-cover" />
              </div>
            </button>
          ))}
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-3 flex justify-center">
          <div className="pointer-events-auto">
            <DotsPagination count={images.length} active={active} onSelect={(i) => trackRef.current?.scrollTo({ left: i * (trackRef.current?.clientWidth ?? 0), behavior: 'smooth' })} />
          </div>
        </div>
      </div>

      {/* десктоп: фото скроллом */}
      <div className="hidden flex-col gap-6 md:flex">
        {images.map((img, i) => (
          <button
            key={img.main.src + i}
            type="button"
            onClick={() => setZoom(i)}
            aria-label={t('openZoom', { index: i + 1 })}
            className="group relative block w-full cursor-zoom-in text-left"
          >
            {i === 0 ? (
              <div ref={firstRef}>
                <Arch aspect="4 / 5">
                  <Image src={img.main.src} alt={img.main.alt} fill priority sizes="(min-width: 1280px) 50vw, 55vw" placeholder="blur" blurDataURL={img.main.blur} className="object-cover" />
                </Arch>
              </div>
            ) : (
              <div className="relative aspect-[4/5] overflow-hidden rounded-card bg-sand">
                <Image src={img.main.src} alt={img.main.alt} fill sizes="(min-width: 1280px) 50vw, 55vw" placeholder="blur" blurDataURL={img.main.blur} className="object-cover" />
              </div>
            )}
            <span aria-hidden className="absolute right-4 bottom-4 inline-flex size-11 items-center justify-center rounded-pill bg-paper/90 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
              <Expand className="size-4" strokeWidth={1.5} />
            </span>
          </button>
        ))}
      </div>

      <Dialog open={zoom !== null} onClose={() => setZoom(null)} title={t('zoomTitle', { title })} hideTitle variant="fullscreen" tone="milk" bodyClassName="px-0 md:px-0">
        <div className="flex flex-col items-center gap-4 pb-8">
          {images.map((img, i) => (
            <figure key={img.main.src + i} ref={(el) => void (i === zoom && el?.scrollIntoView({ block: 'start' }))} className="relative w-full max-w-[1200px]" style={{ touchAction: 'pinch-zoom' }}>
              <Image
                src={(img.full ?? img.main).src}
                alt={img.main.alt}
                width={(img.full ?? img.main).width}
                height={(img.full ?? img.main).height}
                sizes="100vw"
                className="h-auto w-full"
              />
              <figcaption className="sr-only">{t('photoOf', { index: i + 1, total: images.length })}</figcaption>
            </figure>
          ))}
        </div>
      </Dialog>
    </div>
  )
}
