import type { Designer, Material, Media, Product } from '@/payload-types'
import type { Availability, CardSwatch, ProductCard } from './catalog'
import { toImage } from './media'

export type Variant = NonNullable<Product['variants']>[number]

const asMaterial = (v: unknown): Material | null => (v && typeof v === 'object' ? (v as Material) : null)

export function variantPrice(product: Pick<Product, 'price'>, v?: Variant | null): number {
  if (!v) return product.price
  if (typeof v.price === 'number') return v.price
  return product.price + (v.priceDelta ?? 0)
}

export function variantLabel(v?: Variant | null): string {
  if (!v) return ''
  return [v.size, asMaterial(v.fabric)?.title, asMaterial(v.finish)?.title].filter(Boolean).join(' · ')
}

export function variantInStock(product: Pick<Product, 'stock' | 'variants'>, v?: Variant | null): boolean {
  if (v) return (v.stock ?? 0) > 0
  if (product.variants?.length) return product.variants.some((x) => (x.stock ?? 0) > 0)
  return (product.stock ?? 0) > 0
}

export function leadTime(product: Pick<Product, 'leadTimeWeeks'>, v?: Variant | null): [number, number] {
  const min = v?.leadTimeMin ?? product.leadTimeWeeks?.min ?? 4
  const max = v?.leadTimeMax ?? product.leadTimeWeeks?.max ?? Math.max(min, 6)
  return [min, Math.max(min, max)]
}

/** Ключ материала для фильтра: породы дерева отдельно, остальное по типу */
export function materialFilterKey(m: Material): string {
  if (m.type === 'wood') return m.key ?? m.slug ?? String(m.id)
  if (m.type === 'metal') return 'metal'
  if (m.type === 'stone') return 'stone'
  if (m.type === 'fabric') return 'fabric'
  return 'other'
}

export function swatchesOf(product: Product, limit = 5): CardSwatch[] {
  const seen = new Map<number, CardSwatch>()
  for (const v of product.variants ?? []) {
    for (const ref of [v.fabric, v.finish]) {
      const m = asMaterial(ref)
      if (!m || seen.has(m.id)) continue
      const swatch = m.swatch && typeof m.swatch === 'object' ? (m.swatch as Media) : null
      seen.set(m.id, {
        key: m.key ?? String(m.id),
        title: m.title,
        color: m.swatchColor ?? null,
        image: toImage(swatch, 'thumb')?.src ?? null,
      })
    }
  }
  return [...seen.values()].slice(0, limit)
}

export function toCard(p: Product): ProductCard {
  const variants = p.variants ?? []
  const prices = variants.length ? variants.map((v) => variantPrice(p, v)) : [p.price]
  const price = Math.min(...prices)
  const maxPrice = Math.max(...prices)
  const category = p.category && typeof p.category === 'object' ? p.category : null
  const collection = p.collection && typeof p.collection === 'object' ? p.collection : null
  const designer = p.designer && typeof p.designer === 'object' ? (p.designer as Designer) : null
  const materials = (p.materials ?? []).map(asMaterial).filter((m): m is Material => Boolean(m))
  const variantMaterials = variants.flatMap((v) => [asMaterial(v.fabric), asMaterial(v.finish)]).filter((m): m is Material => Boolean(m))
  const allMaterials = [...materials, ...variantMaterials]
  const quickVariant = !p.variantRequired || variants.length <= 1 ? (variants[0] ?? null) : null
  const availability: Availability = variantInStock(p) ? 'in_stock' : 'made_to_order'
  const images = (p.images ?? [])
    .slice(0, 2)
    .map((row) => toImage(row.image, 'card', p.title))
    .filter((x): x is NonNullable<typeof x> => Boolean(x))

  return {
    id: p.id,
    slug: p.slug ?? String(p.id),
    title: p.title,
    collection: collection ? { title: collection.title, slug: collection.slug ?? String(collection.id) } : null,
    category: category ? { id: category.id, slug: category.slug ?? String(category.id), title: category.title } : null,
    designer: designer ? { key: designer.key ?? String(designer.id), name: designer.name } : null,
    price,
    maxPrice,
    compareAt: p.compareAtPrice ?? null,
    images,
    cutout: toImage(p.cutout, 'card', p.title),
    podiumColor: p.podiumColor ?? 'lavender',
    badges: p.badges ?? [],
    availability,
    leadTime: leadTime(p),
    materialKeys: [...new Set(allMaterials.map(materialFilterKey))],
    colors: p.colors ?? [],
    width: p.dimensions?.width ?? null,
    popularity: p.popularity ?? 0,
    createdAt: p.createdAt,
    featured: Boolean(p.featured),
    quickAdd:
      quickVariant || !variants.length
        ? { sku: quickVariant?.sku ?? null, label: variantLabel(quickVariant), price: variantPrice(p, quickVariant) }
        : null,
    swatches: swatchesOf(p),
    facts: {
      collection: collection?.title,
      designer: designer?.name,
      materials: [...new Set(allMaterials.map((m) => m.title))].slice(0, 3),
      dimensions: { width: p.dimensions?.width, depth: p.dimensions?.depth, height: p.dimensions?.height },
      leadTime: leadTime(p),
    },
  }
}
