'use client'

import { createContext, useCallback, useContext, useMemo, useTransition } from 'react'
import { useRouter } from '@/i18n/navigation'
import { filtersToQuery, type Filters } from '@/lib/catalog'

type Ctx = {
  filters: Filters
  category?: string
  pending: boolean
  /** Новое состояние фильтров → URL (?material=oak&price=500-2000&sort=new); результаты рендерит сервер */
  navigate: (next: Partial<Filters>, opts?: { keepPage?: boolean }) => void
  query: Record<string, string>
}

const CatalogContext = createContext<Ctx | null>(null)

export function useCatalog() {
  const ctx = useContext(CatalogContext)
  if (!ctx) throw new Error('useCatalog вне CatalogProvider')
  return ctx
}

export function CatalogProvider({ filters, category, children }: { filters: Filters; category?: string; children: React.ReactNode }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  const navigate = useCallback(
    (next: Partial<Filters>, opts: { keepPage?: boolean } = {}) => {
      const merged: Filters = { ...filters, ...next, page: opts.keepPage ? (next.page ?? filters.page) : (next.page ?? 1) }
      const query = filtersToQuery(merged)
      startTransition(() => {
        if (category) router.replace({ pathname: '/catalog/[category]', params: { category }, query }, { scroll: false })
        else router.replace({ pathname: '/catalog', query }, { scroll: false })
      })
    },
    [filters, category, router],
  )

  const value = useMemo(() => ({ filters, category, pending, navigate, query: filtersToQuery(filters) }), [filters, category, pending, navigate])
  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>
}

/** Обёртка результатов: пока сервер пересчитывает выдачу — aria-busy и приглушение */
export function CatalogResults({ children }: { children: React.ReactNode }) {
  const { pending } = useCatalog()
  return (
    <div aria-busy={pending} className="transition-opacity duration-200" style={{ opacity: pending ? 0.55 : 1 }}>
      {children}
    </div>
  )
}
