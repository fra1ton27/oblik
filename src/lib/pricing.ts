/**
 * Деньги — в целых центах. Все расчёты корзины и заказа — здесь, одинаково для страницы корзины,
 * оформления и Server Action placeOrder (сервер пересчитывает, цене с клиента не доверяем).
 */

export function percentOf(amount: number, percent: number): number {
  return Math.round((amount * percent) / 100)
}

/** Цена комплекта: сумма по отдельности, скидка комплекта, итог и экономия */
export function bundleTotals(prices: number[], discountPercent: number) {
  const full = prices.reduce((s, p) => s + p, 0)
  const savings = percentOf(full, discountPercent)
  return { full, savings, total: full - savings, discountPercent }
}

export type PricedLine = {
  key: string
  productId: number
  collectionId: number | null
  qty: number
  unitPrice: number
  available: boolean
}

export type BundleRule = { collectionId: number; productIds: number[]; discountPercent: number }

/**
 * Скидка комплекта: если в корзине есть все предметы комплекта, на один набор
 * (по одной штуке каждого) применяется скидка коллекции. Снятые с продажи не участвуют.
 */
export function bundleDiscount(lines: PricedLine[], bundles: BundleRule[]): { total: number; applied: Array<{ collectionId: number; sets: number; amount: number }> } {
  let total = 0
  const applied: Array<{ collectionId: number; sets: number; amount: number }> = []
  for (const b of bundles) {
    if (!b.productIds.length || b.discountPercent <= 0) continue
    const perProduct = b.productIds.map((id) => {
      const matching = lines.filter((l) => l.productId === id && l.available)
      const qty = matching.reduce((s, l) => s + l.qty, 0)
      const cheapest = matching.length ? Math.min(...matching.map((l) => l.unitPrice)) : 0
      return { qty, cheapest }
    })
    const sets = Math.min(...perProduct.map((p) => p.qty))
    if (sets <= 0) continue
    const setPrice = perProduct.reduce((s, p) => s + p.cheapest, 0)
    const amount = percentOf(setPrice, b.discountPercent) * sets
    total += amount
    applied.push({ collectionId: b.collectionId, sets, amount })
  }
  return { total, applied }
}

export type Promo = { code: string; kind: 'percent' | 'amount'; value: number; minTotal?: number | null }

export function promoDiscount(subtotalAfterBundles: number, promo: Promo | null): number {
  if (!promo) return 0
  if (promo.minTotal && subtotalAfterBundles < promo.minTotal) return 0
  const raw = promo.kind === 'percent' ? percentOf(subtotalAfterBundles, promo.value) : promo.value
  return Math.min(raw, subtotalAfterBundles)
}

export type DeliveryZone = { code: 'city' | 'country' | 'pickup'; price: number; freeFrom?: number | null }

export function deliveryCost(zone: DeliveryZone | null | undefined, subtotal: number): number {
  if (!zone || zone.code === 'pickup') return 0
  if (zone.freeFrom && subtotal >= zone.freeFrom) return 0
  return zone.price
}

export type ServiceRates = { liftPrice: number; liftPerFloor: number; assemblyPrice: number }

export function servicesCost(
  opts: { lift?: boolean; assembly?: boolean; floor?: number | null; elevator?: boolean | null; method?: string | null },
  rates: ServiceRates,
): number {
  if (opts.method === 'pickup') return 0
  let sum = 0
  if (opts.lift) sum += opts.elevator ? rates.liftPrice : rates.liftPerFloor * Math.max(1, opts.floor ?? 1)
  if (opts.assembly) sum += rates.assemblyPrice
  return sum
}

export function cartTotals(input: {
  lines: PricedLine[]
  bundles: BundleRule[]
  promo: Promo | null
  zone?: DeliveryZone | null
  services?: number
}) {
  const subtotal = input.lines.filter((l) => l.available).reduce((s, l) => s + l.unitPrice * l.qty, 0)
  const bundle = bundleDiscount(input.lines, input.bundles)
  const afterBundles = subtotal - bundle.total
  const promo = promoDiscount(afterBundles, input.promo)
  const delivery = deliveryCost(input.zone, afterBundles - promo)
  const services = input.services ?? 0
  return {
    subtotal,
    bundleDiscount: bundle.total,
    bundles: bundle.applied,
    promoDiscount: promo,
    delivery,
    services,
    total: Math.max(0, subtotal - bundle.total - promo + delivery + services),
  }
}
