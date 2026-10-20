'use client'

import { Check, Plus } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { filtersToQuery, type Facet, type FacetCounts, type Filters } from '@/lib/catalog'
import { countCatalog } from '@/lib/actions/catalog'
import { Dialog } from '@/components/ui/Dialog'
import { Button } from '@/components/ui/Button'
import { Chip } from '@/components/ui/Chip'
import { RangeSlider } from '@/components/ui/RangeSlider'
import { useFormat } from '@/components/motion/useFormat'
import { useCatalog } from './CatalogProvider'
import type { FilterOptions } from './filterOptions'
import { cn } from '@/lib/cn'

type Props = { open: boolean; onClose: () => void; options: FilterOptions; facets: FacetCounts }

type ListKey = 'collection' | 'material' | 'color' | 'availability' | 'designer'

/**
 * Все фильтры: дроуэр справа (на мобайле — полноэкранный нижний лист), группы аккордеоном,
 * внизу липкая кнопка «Показать N товаров» с живым счётчиком и «Сбросить».
 */
export function FiltersPanel({ open, onClose, options, facets }: Props) {
  const t = useTranslations('catalog')
  const locale = useLocale()
  const f = useFormat()
  const { filters, navigate, category } = useCatalog()
  const [draft, setDraft] = useState<Filters>(filters)
  const [count, setCount] = useState<number | null>(null)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- при открытии черновик = текущие фильтры
    if (open) setDraft(filters)
  }, [open, filters])

  const query = useMemo(() => filtersToQuery({ ...draft, page: 1 }), [draft])

  // живой счётчик: сервер считает по тем же правилам, что и выдачу
  useEffect(() => {
    if (!open) return
    let alive = true
    const id = window.setTimeout(() => {
      countCatalog(locale, query, category)
        .then((n) => alive && setCount(n))
        .catch(() => {})
    }, 220)
    return () => {
      alive = false
      window.clearTimeout(id)
    }
  }, [open, query, locale, category])

  function toggle(key: ListKey, value: string) {
    setDraft((d) => {
      const list = d[key] as string[]
      const next = list.includes(value) ? list.filter((v) => v !== value) : [...list, value]
      return { ...d, [key]: next } as Filters
    })
  }

  const facetOf = (key: Facet) => (facets as unknown as Record<string, Record<string, number>>)[key] ?? {}
  const [pmin, pmax] = facets.priceBounds
  const [wmin, wmax] = facets.widthBounds

  const group = (key: ListKey, title: string, items: Array<{ value: string; label: string; swatch?: string }>) => (
    <details className="group/fg border-b border-line" open>
      <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between text-[16px] font-semibold [&::-webkit-details-marker]:hidden">
        {title}
        <Plus aria-hidden className="size-5 transition-transform duration-[400ms] ease-soft group-open/fg:rotate-45" strokeWidth={1.5} />
      </summary>
      <div className="flex flex-wrap gap-2 pb-5">
        {items.map((item) => {
          const n = facetOf(key)[item.value] ?? 0
          const on = (draft[key] as string[]).includes(item.value)
          if (item.swatch) {
            return (
              <button
                key={item.value}
                type="button"
                aria-pressed={on}
                disabled={!n && !on}
                onClick={() => toggle(key, item.value)}
                className={cn(
                  'inline-flex h-11 items-center gap-2 rounded-pill border px-3 text-[14px] font-semibold transition-colors disabled:opacity-40',
                  on ? 'border-ink bg-milk' : 'border-line bg-paper hover:border-ink',
                )}
              >
                <span className="relative inline-flex size-6 items-center justify-center rounded-full border border-ink/15" style={{ backgroundColor: item.swatch }}>
                  {on && <Check aria-hidden className="size-3.5 text-paper mix-blend-difference" strokeWidth={2.5} />}
                </span>
                {item.label}
                <span className="text-[12px] text-ink-soft tabular-nums">{n}</span>
              </button>
            )
          }
          return (
            <Chip key={item.value} selected={on} count={n} disabled={!n && !on} onClick={() => toggle(key, item.value)}>
              {item.label}
            </Chip>
          )
        })}
      </div>
    </details>
  )

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={t('filters')}
      width={480}
      footer={
        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => setDraft({ ...filters, collection: [], material: [], color: [], availability: [], designer: [], price: undefined, width: undefined })}>
            {t('reset')}
          </Button>
          <Button
            fullWidth
            onClick={() => {
              navigate({ ...draft, page: 1 })
              onClose()
            }}
            disabled={count === 0}
          >
            <span aria-live="polite">{count === null ? t('filters') : t('showResults', { count })}</span>
          </Button>
        </div>
      }
    >
      <div className="flex flex-col">
        {!category && options.categories.length > 0 && (
          <details className="group/fg border-b border-line" open>
            <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between text-[16px] font-semibold [&::-webkit-details-marker]:hidden">
              {t('groups.category')}
              <Plus aria-hidden className="size-5 transition-transform duration-[400ms] ease-soft group-open/fg:rotate-45" strokeWidth={1.5} />
            </summary>
            <div className="flex flex-wrap gap-2 pb-5">
              {options.categories.map((c) => (
                <Chip key={c.value} selected={draft.category === c.value} count={facets.category[c.value] ?? 0} onClick={() => setDraft((d) => ({ ...d, category: d.category === c.value ? undefined : c.value }))}>
                  {c.label}
                </Chip>
              ))}
            </div>
          </details>
        )}
        {options.collections.length > 0 && group('collection', t('groups.collection'), options.collections)}
        {pmax > pmin && (
          <details className="group/fg border-b border-line" open>
            <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between text-[16px] font-semibold [&::-webkit-details-marker]:hidden">
              {t('groups.price')}
              <Plus aria-hidden className="size-5 transition-transform duration-[400ms] ease-soft group-open/fg:rotate-45" strokeWidth={1.5} />
            </summary>
            <div className="pb-5">
              <RangeSlider
                min={pmin}
                max={pmax}
                step={10}
                value={draft.price ?? [pmin, pmax]}
                onChange={(v) => setDraft((d) => ({ ...d, price: v[0] <= pmin && v[1] >= pmax ? undefined : v }))}
                labels={{ min: t('priceMin'), max: t('priceMax') }}
                format={(v) => f.money(v * 100)}
              />
            </div>
          </details>
        )}
        {group('material', t('groups.material'), options.materials)}
        {group('color', t('groups.color'), options.colors)}
        {wmax > wmin && (
          <details className="group/fg border-b border-line">
            <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between text-[16px] font-semibold [&::-webkit-details-marker]:hidden">
              {t('groups.width')}
              <Plus aria-hidden className="size-5 transition-transform duration-[400ms] ease-soft group-open/fg:rotate-45" strokeWidth={1.5} />
            </summary>
            <div className="pb-5">
              <RangeSlider
                min={wmin}
                max={wmax}
                step={5}
                value={draft.width ?? [wmin, wmax]}
                onChange={(v) => setDraft((d) => ({ ...d, width: v[0] <= wmin && v[1] >= wmax ? undefined : v }))}
                labels={{ min: t('widthMin'), max: t('widthMax') }}
                format={(v) => f.length(v)}
              />
            </div>
          </details>
        )}
        {group('availability', t('groups.availability'), options.availability)}
        {options.designers.length > 0 && group('designer', t('groups.designer'), options.designers)}
      </div>
    </Dialog>
  )
}
