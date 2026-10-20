'use client'

import Image from 'next/image'
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react'
import { useState, useTransition } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import type { ProductCard as Card } from '@/lib/catalog'
import type { ImageDTO } from '@/lib/media'
import { loadCatalogPage } from '@/lib/actions/catalog'
import { TransitionLink } from '@/components/motion/TransitionLink'
import { Button, buttonClasses } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { ProductCard } from './ProductCard'
import { useCatalog } from './CatalogProvider'
import { cn } from '@/lib/cn'

export type Editorial = { slug: string; title: string; image: ImageDTO | null }

type Props = { items: Card[]; editorials: Editorial[]; page: number; totalPages: number; total: number }

/**
 * Сетка: 3 колонки ≥ 1280 и на планшете в альбомной, 2 на мобайле (переключатель 1/2),
 * каждая 7-я ячейка — редакционная карточка на 2 колонки со ссылкой на коллекцию.
 * Пагинация: «Показать ещё» + номера страниц ссылками для поисковиков.
 */
export function CatalogGrid({ items, editorials, page, totalPages, total }: Props) {
  const t = useTranslations('catalog')
  const locale = useLocale()
  const { filters, category, query, navigate } = useCatalog()
  const [extra, setExtra] = useState<Card[]>([])
  const [loaded, setLoaded] = useState(page)
  const [loading, startLoading] = useTransition()
  const [prevKey, setPrevKey] = useState(JSON.stringify(query))

  // сброс догруженного при смене фильтров (паттерн «состояние от пропсов»)
  const key = JSON.stringify(query)
  if (key !== prevKey) {
    setPrevKey(key)
    setExtra([])
    setLoaded(page)
  }

  const all = [...items, ...extra]
  const cols = filters.cols ?? 2

  if (!total) {
    return (
      <EmptyState
        title={t('emptyTitle')}
        text={t('emptyText')}
        color="pistachio"
        actions={
          <>
            <Button variant="secondary" onClick={() => navigate({ collection: [], material: [], color: [], availability: [], designer: [], price: undefined, width: undefined })}>
              {t('resetAll')}
            </Button>
            <TransitionLink href="/custom" className={buttonClasses()}>
              {t('emptyCustom')}
            </TransitionLink>
          </>
        }
      />
    )
  }

  // каждая 7-я позиция — редакционная карточка
  const cells: Array<{ kind: 'product'; card: Card } | { kind: 'editorial'; ed: Editorial }> = []
  let ed = 0
  all.forEach((card, i) => {
    if (i > 0 && i % 6 === 0 && editorials.length) {
      cells.push({ kind: 'editorial', ed: editorials[ed % editorials.length] })
      ed++
    }
    cells.push({ kind: 'product', card })
  })

  const hrefFor = (p: number) => {
    const q = { ...query, ...(p > 1 ? { page: String(p) } : {}) }
    if (p <= 1) delete q.page
    return category ? { pathname: '/catalog/[category]' as const, params: { category }, query: q } : { pathname: '/catalog' as const, query: q }
  }

  return (
    <div>
      <ul className={cn('grid gap-x-4 gap-y-10 md:gap-x-6 lg:grid-cols-3', cols === 1 ? 'grid-cols-1' : 'grid-cols-2')}>
        {cells.map((cell, i) =>
          cell.kind === 'product' ? (
            <li key={`p-${cell.card.id}`}>
              <ProductCard product={cell.card} compact={cols === 2} priority={i < 2} sizes="(min-width: 1024px) 30vw, (min-width: 768px) 46vw, 50vw" headingLevel="h2" />
            </li>
          ) : (
            <li key={`e-${i}`} className="col-span-full lg:col-span-2">
              <TransitionLink href={{ pathname: '/collections/[slug]', params: { slug: cell.ed.slug } }} className="group relative block h-full min-h-[280px] overflow-hidden rounded-card bg-blush">
                {cell.ed.image && <Image src={cell.ed.image.src} alt={cell.ed.image.alt} fill sizes="(min-width: 1024px) 60vw, 92vw" className="object-cover transition-transform duration-[700ms] ease-soft group-hover:scale-[1.02]" />}
                <span className="absolute inset-x-4 bottom-4 flex items-center justify-between gap-3 rounded-card bg-paper/95 p-4">
                  <span className="t-h3">{t('editorial', { title: cell.ed.title })}</span>
                  <span className="inline-flex shrink-0 items-center gap-1 text-[14px] font-semibold">
                    {t('editorialCta')}
                    <ArrowUpRight aria-hidden className="size-4" strokeWidth={1.5} />
                  </span>
                </span>
              </TransitionLink>
            </li>
          ),
        )}
      </ul>

      {totalPages > 1 && (
        <div className="mt-12 flex flex-col items-center gap-6">
          {loaded < totalPages && (
            <Button
              variant="secondary"
              loading={loading}
              loadingLabel={t('loading')}
              onClick={() =>
                startLoading(async () => {
                  const next = loaded + 1
                  const res = await loadCatalogPage(locale, query, category, next)
                  setExtra((e) => [...e, ...res.items])
                  setLoaded(next)
                })
              }
            >
              {t('loadMore')}
            </Button>
          )}
          <nav aria-label={t('pagination')}>
            <ol className="flex flex-wrap items-center justify-center gap-1">
              {page > 1 && (
                <li>
                  <TransitionLink href={hrefFor(page - 1)} className="inline-flex size-11 items-center justify-center rounded-pill hover:bg-sand" aria-label={t('prevPage')}>
                    <ArrowLeft aria-hidden className="size-4" strokeWidth={1.5} />
                  </TransitionLink>
                </li>
              )}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <li key={p}>
                  <TransitionLink
                    href={hrefFor(p)}
                    aria-label={t('page', { page: p })}
                    aria-current={p === page ? 'page' : undefined}
                    className={cn('inline-flex size-11 items-center justify-center rounded-pill text-[15px] font-semibold tabular-nums', p === page ? 'bg-ink text-milk' : 'hover:bg-sand')}
                  >
                    {p}
                  </TransitionLink>
                </li>
              ))}
              {page < totalPages && (
                <li>
                  <TransitionLink href={hrefFor(page + 1)} className="inline-flex size-11 items-center justify-center rounded-pill hover:bg-sand" aria-label={t('nextPage')}>
                    <ArrowRight aria-hidden className="size-4" strokeWidth={1.5} />
                  </TransitionLink>
                </li>
              )}
            </ol>
          </nav>
        </div>
      )}
    </div>
  )
}
