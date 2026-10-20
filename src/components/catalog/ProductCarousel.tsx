'use client'

import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import type { ProductCard as Card } from '@/lib/catalog'
import { SplitHeading } from '@/components/motion/SplitHeading'
import { Button } from '@/components/ui/Button'
import { Chip } from '@/components/ui/Chip'
import { DotsPagination } from '@/components/ui/DotsPagination'
import { ProductCard } from './ProductCard'
import { cn } from '@/lib/cn'

type Filter = 'all' | 'new' | 'in_stock'

type Props = { heading: string; items: Card[]; showFilters?: boolean; className?: string; headingLevel?: 'h2' | 'h3' }

/**
 * Карусель товаров: фильтр-чипы «Все / Новинки / В наличии», скролл со snap (на мобайле видно
 * 1.2 карточки), стрелки, точки в пилюле и управление стрелками клавиатуры.
 */
export function ProductCarousel({ heading, items, showFilters, className, headingLevel = 'h2' }: Props) {
  const t = useTranslations('home')
  const id = useId()
  const trackRef = useRef<HTMLUListElement>(null)
  const [filter, setFilter] = useState<Filter>('all')
  const [page, setPage] = useState(0)
  const [pages, setPages] = useState(1)
  const [edges, setEdges] = useState({ start: true, end: false })

  const visible = useMemo(() => {
    if (filter === 'new') return items.filter((p) => p.badges.includes('new'))
    if (filter === 'in_stock') return items.filter((p) => p.availability === 'in_stock')
    return items
  }, [items, filter])

  const measure = useCallback(() => {
    const el = trackRef.current
    if (!el) return
    const per = Math.max(1, el.clientWidth)
    setPages(Math.max(1, Math.ceil((el.scrollWidth - 4) / per)))
    setPage(Math.round(el.scrollLeft / per))
    setEdges({ start: el.scrollLeft < 8, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 8 })
  }, [])

  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    el.scrollTo({ left: 0 })
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [visible, measure])

  function scrollByPage(dir: 1 | -1) {
    const el = trackRef.current
    if (!el) return
    const card = el.querySelector('li')
    const step = card ? card.getBoundingClientRect().width + 16 : el.clientWidth * 0.8
    el.scrollBy({ left: dir * step * Math.max(1, Math.floor(el.clientWidth / step)), behavior: 'smooth' })
  }

  const H = headingLevel
  return (
    <section className={cn('mt-section', className)} aria-labelledby={`${id}-h`}>
      <div className="container-site">
        <div className="mb-6 flex flex-col gap-4 md:mb-8 md:flex-row md:items-end md:justify-between">
          <SplitHeading as={H} id={`${id}-h`} className="t-h1">
            {heading}
          </SplitHeading>
          <div className="flex items-center gap-2">
            <Button variant="icon" onClick={() => scrollByPage(-1)} disabled={edges.start} aria-label={t('carouselPrev')} aria-controls={`${id}-track`}>
              <ArrowLeft aria-hidden className="size-5" strokeWidth={1.5} />
            </Button>
            <Button variant="icon" onClick={() => scrollByPage(1)} disabled={edges.end} aria-label={t('carouselNext')} aria-controls={`${id}-track`}>
              <ArrowRight aria-hidden className="size-5" strokeWidth={1.5} />
            </Button>
          </div>
        </div>
        {showFilters && (
          <div role="group" aria-label={t('carouselFilter')} className="no-scrollbar -mx-[var(--page-pad)] mb-6 flex gap-2 overflow-x-auto px-[var(--page-pad)]">
            {(
              [
                ['all', t('carouselAll'), items.length],
                ['new', t('carouselNew'), items.filter((p) => p.badges.includes('new')).length],
                ['in_stock', t('carouselInStock'), items.filter((p) => p.availability === 'in_stock').length],
              ] as Array<[Filter, string, number]>
            ).map(([key, label, count]) => (
              <Chip key={key} selected={filter === key} count={count} onClick={() => setFilter(key)} disabled={count === 0}>
                {label}
              </Chip>
            ))}
          </div>
        )}
      </div>
      <div className="container-site">
        <ul
          ref={trackRef}
          id={`${id}-track`}
          tabIndex={0}
          aria-label={heading}
          onScroll={measure}
          onKeyDown={(e) => {
            if (e.key === 'ArrowRight') {
              e.preventDefault()
              scrollByPage(1)
            } else if (e.key === 'ArrowLeft') {
              e.preventDefault()
              scrollByPage(-1)
            }
          }}
          className="no-scrollbar -mx-[var(--page-pad)] flex snap-x snap-mandatory scroll-px-[var(--page-pad)] gap-4 overflow-x-auto px-[var(--page-pad)] pb-2 outline-none focus-visible:outline-2 md:gap-6"
        >
          {visible.map((p) => (
            <li key={p.id} className="w-[80vw] max-w-[360px] shrink-0 snap-start sm:w-[44vw] md:w-[calc((100%-48px)/3)] xl:w-[calc((100%-72px)/4)]">
              <ProductCard product={p} sizes="(min-width: 1280px) 22vw, (min-width: 768px) 31vw, 80vw" />
            </li>
          ))}
        </ul>
        {visible.length === 0 && <p className="t-small py-10 text-center text-ink-soft">{t('carouselEmpty')}</p>}
        <div className="mt-6 flex justify-center">
          <DotsPagination
            count={pages}
            active={page}
            onSelect={(i) => trackRef.current?.scrollTo({ left: i * (trackRef.current?.clientWidth ?? 0), behavior: 'smooth' })}
          />
        </div>
      </div>
    </section>
  )
}
