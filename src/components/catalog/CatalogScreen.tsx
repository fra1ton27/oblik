import { getTranslations } from 'next-intl/server'
import type { Locale } from '@/i18n/routing'
import { hasActiveFilters, parseFilters, MATERIAL_FILTERS, COLOR_FILTERS, colorSwatches } from '@/lib/catalog'
import { queryCatalog } from '@/lib/data/catalogQuery'
import { getCategories, getCollections, type CategoryDTO } from '@/lib/data/catalog'
import { getReviews } from '@/lib/data/globals'
import { absoluteUrl, localizedPath } from '@/lib/paths'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { TransitionLink } from '@/components/motion/TransitionLink'
import { SplitHeading } from '@/components/motion/SplitHeading'
import { JsonLd } from '@/components/seo/JsonLd'
import { Showcase } from './showcase/Showcase'
import { productItems } from './showcase/items'
import { CatalogProvider, CatalogResults } from './CatalogProvider'
import { CatalogToolbar } from './CatalogToolbar'
import { CatalogGrid } from './CatalogGrid'
import type { FilterOptions } from './filterOptions'
import { cn } from '@/lib/cn'

type Props = {
  locale: Locale
  searchParams: Record<string, string | string[] | undefined>
  category?: CategoryDTO | null
}

/**
 * Каталог в двух режимах: «Витрина» (по умолчанию на /katalog без фильтров, избранные товары)
 * и «Сетка» (на страницах категорий и при любом фильтре). Результаты рендерятся на сервере по query.
 */
export async function CatalogScreen({ locale, searchParams, category }: Props) {
  const t = await getTranslations('catalog')
  const tn = await getTranslations('nav')
  const filters = { ...parseFilters(searchParams), category: category?.slug }
  const filtered = hasActiveFilters(filters)
  const view: 'showcase' | 'grid' = category || filtered || filters.view === 'grid' ? (filters.view === 'showcase' && !filtered ? 'showcase' : 'grid') : 'showcase'

  const [result, categories, collections] = await Promise.all([queryCatalog(locale, filters), getCategories(locale), getCollections(locale)])

  const designers = new Map<string, string>()
  result.index.forEach((p) => p.designer && designers.set(p.designer.key, p.designer.name))
  const options: FilterOptions = {
    categories: categories.map((c) => ({ value: c.slug, label: c.title })),
    collections: collections.map((c) => ({ value: c.slug, label: c.title })),
    designers: [...designers].map(([value, label]) => ({ value, label })),
    materials: MATERIAL_FILTERS.map((m) => ({ value: m, label: t(`materials.${m}`) })),
    colors: COLOR_FILTERS.filter((c) => result.facets.color[c] !== undefined || filters.color.includes(c)).map((c) => ({ value: c, label: t(`colors.${c}`), swatch: colorSwatches[c] })),
    availability: (['in_stock', 'made_to_order'] as const).map((a) => ({ value: a, label: t(`availabilityOptions.${a}`) })),
  }

  const showcaseItems = view === 'showcase' ? await productItems(result.index.filter((p) => p.featured).sort((a, b) => b.popularity - a.popularity), locale) : []
  const quotes = view === 'showcase' ? (await getReviews(locale)).slice(0, 2).map((r) => ({ text: r.text, author: `${r.author}, ${r.city}`, rating: r.rating })) : undefined
  const title = category?.title ?? t('title')

  const crumbs = [
    { label: tn('home'), href: '/' as const },
    ...(category ? [{ label: t('title'), href: '/catalog' as const }, { label: category.title }] : [{ label: t('title') }]),
  ]

  return (
    <CatalogProvider filters={filters} category={category?.slug}>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: tn('home'), item: absoluteUrl(localizedPath('/', {}, locale)) },
            { '@type': 'ListItem', position: 2, name: t('title'), item: absoluteUrl(localizedPath('/catalog', {}, locale)) },
            ...(category ? [{ '@type': 'ListItem', position: 3, name: category.title, item: absoluteUrl(localizedPath('/catalog/[category]', { category: category.slug }, locale)) }] : []),
          ],
        }}
      />
      {view === 'grid' && (
        <JsonLd
          data={{
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: title,
            numberOfItems: result.total,
            itemListElement: result.items.map((p, i) => ({
              '@type': 'ListItem',
              position: (result.page - 1) * 24 + i + 1,
              url: absoluteUrl(localizedPath('/furniture/[slug]', { slug: p.slug }, locale)),
              name: p.title,
            })),
          }}
        />
      )}

      <div className={cn('container-site pt-6 md:pt-10', view === 'showcase' && 'pb-4')}>
        <Breadcrumbs items={crumbs} />
        <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <SplitHeading as="h1" by="chars" immediate className="t-h1">
            {title}
          </SplitHeading>
          {category?.description && <p className="t-lead max-w-[42ch] text-ink-soft">{category.description}</p>}
        </div>

        <nav aria-label={t('categoriesNav')} className="no-scrollbar -mx-[var(--page-pad)] mt-6 flex gap-2 overflow-x-auto px-[var(--page-pad)]">
          <TransitionLink
            href="/catalog"
            aria-current={!category ? 'page' : undefined}
            className={cn('inline-flex h-11 shrink-0 items-center gap-2 rounded-pill border px-4 text-[14px] font-semibold', !category ? 'border-ink bg-ink text-milk' : 'border-line bg-paper hover:border-ink')}
          >
            {t('allCategories')}
            <span className="text-[12px] opacity-70">{result.index.length}</span>
          </TransitionLink>
          {categories.map((c) => (
            <TransitionLink
              key={c.id}
              href={{ pathname: '/catalog/[category]', params: { category: c.slug } }}
              aria-current={category?.id === c.id ? 'page' : undefined}
              className={cn(
                'inline-flex h-11 shrink-0 items-center gap-2 rounded-pill border px-4 text-[14px] font-semibold whitespace-nowrap',
                category?.id === c.id ? 'border-ink bg-ink text-milk' : 'border-line bg-paper hover:border-ink',
              )}
            >
              {c.title}
              <span className="text-[12px] opacity-70">{c.count}</span>
            </TransitionLink>
          ))}
        </nav>

        <div className="mt-6">
          <CatalogToolbar view={view} total={result.total} facets={result.facets} options={options} showcaseAvailable={!category && !filtered} />
        </div>
      </div>

      {view === 'showcase' ? (
        <>
          <Showcase heading={t('viewShowcase')} lead={t('showcaseLead')} items={showcaseItems} quotes={quotes} />
          <div className="container-site mt-10 flex justify-center">
            <TransitionLink href={{ pathname: '/catalog', query: { view: 'grid' } }} className="inline-flex h-12 items-center rounded-pill border border-ink px-6 text-[15px] font-semibold hover:bg-ink hover:text-milk">
              {t('showAll')}
            </TransitionLink>
          </div>
        </>
      ) : (
        <div className="container-site mt-8">
          <CatalogResults>
            <CatalogGrid
              items={result.items}
              editorials={collections.map((c) => ({ slug: c.slug, title: c.title, image: c.hero }))}
              page={result.page}
              totalPages={result.totalPages}
              total={result.total}
            />
          </CatalogResults>
        </div>
      )}
    </CatalogProvider>
  )
}
