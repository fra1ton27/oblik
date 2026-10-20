import 'server-only'
import type { Collection, Product, PromoCode, SiteSetting } from '@/payload-types'
import type { Locale } from '@/i18n/routing'
import { getPayloadClient } from '@/lib/payload'
import { toImage, type ImageDTO } from '@/lib/media'
import { leadTime, variantLabel, variantPrice } from '@/lib/product'
import { cartTotals, servicesCost, type BundleRule, type DeliveryZone, type PricedLine, type Promo } from '@/lib/pricing'
import type { CartLineInput } from '@/lib/schemas/checkout'

export type LineNote = 'price' | 'madeToOrder' | 'unavailable' | 'variant'

export type QuoteLine = {
  key: string
  productId: number
  variantSku: string | null
  qty: number
  title: string
  variantLabel: string
  slug: string | null
  image: ImageDTO | null
  unitPrice: number
  lineTotal: number
  available: boolean
  inStock: boolean
  stock: number
  leadTime: [number, number]
  notes: LineNote[]
  oldPrice: number | null
  collectionId: number | null
}

export type PromoState = { code: string; status: 'applied' | 'invalid' | 'min'; minTotal?: number | null } | null

export type DeliveryOptions = { method?: 'city' | 'country' | 'pickup'; lift?: boolean; assembly?: boolean; floor?: number | null; elevator?: boolean | null }

export type Quote = {
  lines: QuoteLine[]
  totals: ReturnType<typeof cartTotals>
  promo: PromoState
  zones: Array<{ code: 'city' | 'country' | 'pickup'; price: number; freeFrom: number | null; label: string; description: string }>
  rates: { liftPrice: number; liftPerFloor: number; assemblyPrice: number }
  currency: string
  count: number
}

async function findPromo(code: string | undefined): Promise<(PromoCode & { kind: 'percent' | 'amount' }) | null> {
  if (!code?.trim()) return null
  const payload = await getPayloadClient()
  const res = await payload.find({ collection: 'promoCodes', where: { code: { equals: code.trim().toUpperCase() } }, limit: 1, overrideAccess: true })
  const p = res.docs[0]
  if (!p || !p.active) return null
  const now = Date.now()
  if (p.validFrom && new Date(p.validFrom).getTime() > now) return null
  if (p.validTo && new Date(p.validTo).getTime() < now) return null
  if (p.usageLimit && (p.usedCount ?? 0) >= p.usageLimit) return null
  return p as PromoCode & { kind: 'percent' | 'amount' }
}

/**
 * Пересчёт корзины на сервере: цены, наличие и переводы из БД, скидка комплекта, промокод,
 * доставка и услуги. Цене с клиента не доверяем; снимок нужен только для заметок «Цена обновилась».
 */
export async function quoteCart(input: { lines: CartLineInput[]; locale: Locale; promoCode?: string; delivery?: DeliveryOptions }): Promise<Quote> {
  const payload = await getPayloadClient()
  const ids = [...new Set(input.lines.map((l) => Number(l.productId)).filter(Number.isFinite))]
  const [productsRes, collectionsRes, settings] = await Promise.all([
    ids.length
      ? payload.find({ collection: 'products', where: { id: { in: ids } }, locale: input.locale, depth: 1, limit: ids.length, pagination: false, overrideAccess: true })
      : Promise.resolve({ docs: [] as Product[] }),
    payload.find({ collection: 'collections', where: { isBundle: { equals: true } }, depth: 0, limit: 50, pagination: false, overrideAccess: true }),
    payload.findGlobal({ slug: 'siteSettings', locale: input.locale, depth: 0, overrideAccess: true }) as Promise<SiteSetting>,
  ])
  const byId = new Map((productsRes.docs as Product[]).map((p) => [p.id, p]))

  const lines: QuoteLine[] = input.lines.map((l) => {
    const p = byId.get(Number(l.productId))
    const base: QuoteLine = {
      key: l.key,
      productId: Number(l.productId),
      variantSku: l.variantSku,
      qty: l.qty,
      title: l.snapshot?.title ?? '',
      variantLabel: '',
      slug: null,
      image: null,
      unitPrice: l.snapshot?.price ?? 0,
      lineTotal: 0,
      available: false,
      inStock: false,
      stock: 0,
      leadTime: [4, 6],
      notes: ['unavailable'],
      oldPrice: null,
      collectionId: null,
    }
    if (!p || p.status !== 'published') return base
    const variants = p.variants ?? []
    const v = l.variantSku ? variants.find((x) => x.sku === l.variantSku) : null
    if (variants.length && l.variantSku && !v) return { ...base, title: p.title, slug: p.slug ?? null, notes: ['variant'] }
    const unitPrice = variantPrice(p, v)
    const stock = v ? (v.stock ?? 0) : (p.stock ?? 0)
    const inStock = stock >= l.qty
    const notes: LineNote[] = []
    if (typeof l.snapshot?.price === 'number' && l.snapshot.price !== unitPrice) notes.push('price')
    if (l.snapshot?.inStock && !inStock) notes.push('madeToOrder')
    return {
      ...base,
      title: p.title,
      variantLabel: variantLabel(v),
      slug: p.slug ?? null,
      image: toImage(v?.image ?? p.images?.[0]?.image, 'thumb', p.title),
      unitPrice,
      lineTotal: unitPrice * l.qty,
      available: true,
      inStock,
      stock,
      leadTime: leadTime(p, v),
      notes,
      oldPrice: notes.includes('price') ? (l.snapshot?.price ?? null) : null,
      collectionId: typeof p.collection === 'object' ? (p.collection?.id ?? null) : (p.collection ?? null),
    }
  })

  const bundles: BundleRule[] = (collectionsRes.docs as Collection[]).map((c) => ({
    collectionId: c.id,
    productIds: (c.products ?? []).map((x) => (typeof x === 'object' ? x.id : x)),
    discountPercent: c.bundleDiscount ?? 0,
  }))

  const priced: PricedLine[] = lines.map((l) => ({ key: l.key, productId: l.productId, collectionId: l.collectionId, qty: l.qty, unitPrice: l.unitPrice, available: l.available }))
  const rawPromo = await findPromo(input.promoCode)
  const promo: Promo | null = rawPromo ? { code: rawPromo.code, kind: rawPromo.kind, value: rawPromo.value, minTotal: rawPromo.minTotal } : null

  const zones = (settings.deliveryZones ?? []).map((z) => ({ code: z.code, price: z.price ?? 0, freeFrom: z.freeFrom ?? null, label: z.label ?? '', description: z.description ?? '' }))
  const rates = { liftPrice: settings.liftPrice ?? 0, liftPerFloor: settings.liftPerFloor ?? 0, assemblyPrice: settings.assemblyPrice ?? 0 }
  const zone: DeliveryZone | null = input.delivery?.method ? (zones.find((z) => z.code === input.delivery!.method) ?? null) : null
  const services = input.delivery?.method ? servicesCost({ ...input.delivery }, rates) : 0
  const totals = cartTotals({ lines: priced, bundles, promo, zone, services })

  let promoState: PromoState = null
  if (input.promoCode?.trim()) {
    if (!promo) promoState = { code: input.promoCode.trim().toUpperCase(), status: 'invalid' }
    else if (totals.promoDiscount === 0 && promo.minTotal) promoState = { code: promo.code, status: 'min', minTotal: promo.minTotal }
    else promoState = { code: promo.code, status: 'applied' }
  }

  return {
    lines,
    totals,
    promo: promoState,
    zones,
    rates,
    currency: settings.currency || 'EUR',
    count: lines.filter((l) => l.available).reduce((s, l) => s + l.qty, 0),
  }
}
