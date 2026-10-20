'use client'

import { ArrowUpDown, Columns2, Rows3, SlidersHorizontal } from 'lucide-react'
import { useLayoutEffect, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import { activeFilterCount, SORTS, type FacetCounts, type Sort } from '@/lib/catalog'
import { useFormat } from '@/components/motion/useFormat'
import { SegmentedPill } from '@/components/ui/SegmentedPill'
import { Chip } from '@/components/ui/Chip'
import { Button } from '@/components/ui/Button'
import { Dialog } from '@/components/ui/Dialog'
import { Radio } from '@/components/ui/Checkbox'
import { Select } from '@/components/ui/Input'
import { useCatalog } from './CatalogProvider'
import { FiltersPanel } from './FiltersPanel'
import type { FilterOptions } from './filterOptions'
import { cn } from '@/lib/cn'

type Props = {
  view: 'showcase' | 'grid'
  total: number
  facets: FacetCounts
  options: FilterOptions
  /** витрина доступна только на /katalog без фильтров */
  showcaseAvailable: boolean
}

/**
 * Панель каталога: «Витрина / Сетка», строка быстрых чипов (как «Filter by»), «Все фильтры»,
 * сортировка, активные фильтры чипами с крестиком и «Сбросить». На мобайле — липкая плашка
 * «Фильтры (3)» и «Сортировка», нижние листы.
 */
export function CatalogToolbar({ view, total, facets, options, showcaseAvailable }: Props) {
  const t = useTranslations('catalog')
  const f = useFormat()
  const { filters, navigate, pending } = useCatalog()
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [sortOpen, setSortOpen] = useState(false)
  const barRef = useRef<HTMLDivElement>(null)
  const active = activeFilterCount(filters)

  // липкая плашка на мобайле: страница получает нижний отступ, баннеры поднимаются выше
  useLayoutEffect(() => {
    const el = barRef.current
    const root = document.documentElement
    if (!el) return
    const mql = window.matchMedia('(max-width: 767px)')
    const apply = () => (mql.matches ? root.style.setProperty('--sticky-bar-h', `${el.offsetHeight}px`) : root.style.removeProperty('--sticky-bar-h'))
    apply()
    mql.addEventListener('change', apply)
    return () => {
      mql.removeEventListener('change', apply)
      root.style.removeProperty('--sticky-bar-h')
    }
  }, [])

  const labelOf = (list: Array<{ value: string; label: string }>, v: string) => list.find((x) => x.value === v)?.label ?? v
  const chips: Array<{ key: string; label: string; remove: () => void }> = [
    ...filters.collection.map((v) => ({ key: `c-${v}`, label: labelOf(options.collections, v), remove: () => navigate({ collection: filters.collection.filter((x) => x !== v) }) })),
    ...filters.material.map((v) => ({ key: `m-${v}`, label: labelOf(options.materials, v), remove: () => navigate({ material: filters.material.filter((x) => x !== v) }) })),
    ...filters.color.map((v) => ({ key: `co-${v}`, label: labelOf(options.colors, v), remove: () => navigate({ color: filters.color.filter((x) => x !== v) }) })),
    ...filters.availability.map((v) => ({ key: `a-${v}`, label: labelOf(options.availability, v), remove: () => navigate({ availability: filters.availability.filter((x) => x !== v) }) })),
    ...filters.designer.map((v) => ({ key: `d-${v}`, label: labelOf(options.designers, v), remove: () => navigate({ designer: filters.designer.filter((x) => x !== v) }) })),
    ...(filters.price ? [{ key: 'price', label: `${f.money(filters.price[0] * 100)} – ${f.money(filters.price[1] * 100)}`, remove: () => navigate({ price: undefined }) }] : []),
    ...(filters.width ? [{ key: 'width', label: `${f.length(filters.width[0])} – ${f.length(filters.width[1])}`, remove: () => navigate({ width: undefined }) }] : []),
  ]
  const reset = () => navigate({ collection: [], material: [], color: [], availability: [], designer: [], price: undefined, width: undefined })

  const quick = [
    ...options.availability.filter((a) => a.value === 'in_stock').map((a) => ({ key: 'availability' as const, ...a })),
    ...options.materials.map((m) => ({ key: 'material' as const, ...m })),
  ]

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {showcaseAvailable && (
            <div role="radiogroup" aria-label={t('viewLabel')}>
              <SegmentedPill
                activeKey={view}
                items={(['showcase', 'grid'] as const).map((key) => ({
                  key,
                  render: (props) => (
                    <button {...props} type="button" role="radio" aria-checked={view === key} onClick={() => navigate({ view: key === 'grid' ? 'grid' : undefined })}>
                      {key === 'showcase' ? t('viewShowcase') : t('viewGrid')}
                    </button>
                  ),
                }))}
              />
            </div>
          )}
          <p className="t-small font-normal text-ink-soft" aria-live="polite">
            {t('results', { count: total })}
          </p>
        </div>
        {view === 'grid' && (
          <div className="hidden items-center gap-3 md:flex">
            <Button variant="secondary" size="sm" onClick={() => setFiltersOpen(true)} iconLeft={<SlidersHorizontal aria-hidden className="size-4" strokeWidth={1.5} />}>
              {active ? t('filtersCount', { count: active }) : t('allFilters')}
            </Button>
            <label className="flex items-center gap-2">
              <span className="sr-only">{t('sort')}</span>
              <Select value={filters.sort} onChange={(e) => navigate({ sort: e.target.value as Sort })} className="h-10 w-auto min-w-[200px] text-[14px]">
                {SORTS.map((s) => (
                  <option key={s} value={s}>
                    {t(`sorts.${s}`)}
                  </option>
                ))}
              </Select>
            </label>
          </div>
        )}
      </div>

      {view === 'grid' && (
        <>
          <div role="group" aria-label={t('quickFilters')} className="no-scrollbar -mx-[var(--page-pad)] hidden gap-2 overflow-x-auto px-[var(--page-pad)] md:flex">
            {quick.map((q) => {
              const list = filters[q.key] as string[]
              const on = list.includes(q.value)
              const n = (facets[q.key] as Record<string, number>)[q.value] ?? 0
              return (
                <Chip key={`${q.key}-${q.value}`} selected={on} count={n} disabled={!n && !on} onClick={() => navigate({ [q.key]: on ? list.filter((x) => x !== q.value) : [...list, q.value] })}>
                  {q.label}
                </Chip>
              )
            })}
          </div>

          {chips.length > 0 && (
            <div className="flex flex-wrap items-center gap-2" role="group" aria-label={t('activeFilters')}>
              {chips.map((c) => (
                <Chip key={c.key} removable removeLabel={t('removeFilter', { label: c.label })} onClick={c.remove}>
                  {c.label}
                </Chip>
              ))}
              <button type="button" onClick={reset} className="inline-flex h-11 items-center px-3 text-[14px] font-semibold underline underline-offset-4">
                {t('resetAll')}
              </button>
            </div>
          )}

          {/* мобайл: липкая плашка «Фильтры (3)» + «Сортировка» */}
          <div
            ref={barRef}
            className="fixed inset-x-0 bottom-0 z-40 flex gap-2 border-t border-line bg-milk/95 px-4 pt-3 backdrop-blur md:hidden"
            style={{ paddingBottom: 'calc(12px + env(safe-area-inset-bottom))' }}
          >
            <Button variant="primary" className="min-w-0 flex-1 shrink px-3" onClick={() => setFiltersOpen(true)} iconLeft={<SlidersHorizontal aria-hidden className="size-4" strokeWidth={1.5} />}>
              {active ? t('filtersCount', { count: active }) : t('filters')}
            </Button>
            <Button variant="secondary" className="min-w-0 flex-1 shrink px-3" onClick={() => setSortOpen(true)} iconLeft={<ArrowUpDown aria-hidden className="size-4" strokeWidth={1.5} />}>
              {t('sort')}
            </Button>
            <div role="radiogroup" aria-label={t('columns')} className="flex shrink-0 rounded-pill border border-line bg-paper">
              {([1, 2] as const).map((c) => (
                <button
                  key={c}
                  type="button"
                  role="radio"
                  aria-checked={(filters.cols ?? 2) === c}
                  aria-label={c === 1 ? t('oneColumn') : t('twoColumns')}
                  onClick={() => navigate({ cols: c === 2 ? undefined : 1 }, { keepPage: true })}
                  className={cn('inline-flex size-11 items-center justify-center rounded-pill', (filters.cols ?? 2) === c && 'bg-ink text-milk')}
                >
                  {c === 1 ? <Rows3 aria-hidden className="size-4" strokeWidth={1.5} /> : <Columns2 aria-hidden className="size-4" strokeWidth={1.5} />}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      <FiltersPanel open={filtersOpen} onClose={() => setFiltersOpen(false)} options={options} facets={facets} />

      <Dialog open={sortOpen} onClose={() => setSortOpen(false)} title={t('sort')} variant="sheet">
        <div role="radiogroup" aria-label={t('sort')} className="flex flex-col gap-2 pb-4">
          {SORTS.map((s) => (
            <Radio
              key={s}
              name="catalog-sort"
              label={t(`sorts.${s}`)}
              checked={filters.sort === s}
              onChange={() => {
                navigate({ sort: s })
                setSortOpen(false)
              }}
            />
          ))}
        </div>
      </Dialog>
      {pending && <span className="sr-only">{t('loading')}</span>}
    </div>
  )
}
