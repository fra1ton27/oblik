import { describe, expect, it } from 'vitest'
import { bundleDiscount, bundleTotals, cartTotals, deliveryCost, promoDiscount, servicesCost, type PricedLine } from '@/lib/pricing'

const line = (productId: number, unitPrice: number, qty = 1, available = true): PricedLine => ({
  key: `${productId}`,
  productId,
  collectionId: 1,
  qty,
  unitPrice,
  available,
})

describe('цены: комплекты', () => {
  it('цена комплекта и экономия', () => {
    expect(bundleTotals([100000, 50000], 10)).toEqual({ full: 150000, savings: 15000, total: 135000, discountPercent: 10 })
  })

  it('скидка только если есть все предметы, на число полных наборов', () => {
    const rule = [{ collectionId: 1, productIds: [1, 2], discountPercent: 10 }]
    expect(bundleDiscount([line(1, 100000)], rule).total).toBe(0)
    expect(bundleDiscount([line(1, 100000), line(2, 50000)], rule).total).toBe(15000)
    expect(bundleDiscount([line(1, 100000, 2), line(2, 50000, 1)], rule).total).toBe(15000)
    expect(bundleDiscount([line(1, 100000, 2), line(2, 50000, 2)], rule).total).toBe(30000)
    // снятый с продажи товар не участвует
    expect(bundleDiscount([line(1, 100000), line(2, 50000, 1, false)], rule).total).toBe(0)
  })
})

describe('цены: промокод, доставка, услуги, итог', () => {
  it('промокод: процент, сумма, минимальная сумма', () => {
    expect(promoDiscount(200000, { code: 'A', kind: 'percent', value: 10 })).toBe(20000)
    expect(promoDiscount(200000, { code: 'B', kind: 'amount', value: 5000, minTotal: 100000 })).toBe(5000)
    expect(promoDiscount(50000, { code: 'B', kind: 'amount', value: 5000, minTotal: 100000 })).toBe(0)
    expect(promoDiscount(3000, { code: 'C', kind: 'amount', value: 5000 })).toBe(3000)
  })

  it('доставка бесплатна от порога, самовывоз бесплатно', () => {
    expect(deliveryCost({ code: 'city', price: 4000, freeFrom: 150000 }, 100000)).toBe(4000)
    expect(deliveryCost({ code: 'city', price: 4000, freeFrom: 150000 }, 150000)).toBe(0)
    expect(deliveryCost({ code: 'pickup', price: 0 }, 1)).toBe(0)
  })

  it('подъём: на лифте фикс, без лифта за этаж; сборка', () => {
    const rates = { liftPrice: 2000, liftPerFloor: 800, assemblyPrice: 4500 }
    expect(servicesCost({ lift: true, elevator: true, floor: 7 }, rates)).toBe(2000)
    expect(servicesCost({ lift: true, elevator: false, floor: 3, assembly: true }, rates)).toBe(800 * 3 + 4500)
    expect(servicesCost({ lift: true, assembly: true, method: 'pickup' }, rates)).toBe(0)
  })

  it('итог в целых центах', () => {
    const t = cartTotals({
      lines: [line(1, 129000), line(2, 89000)],
      bundles: [{ collectionId: 1, productIds: [1, 2], discountPercent: 10 }],
      promo: { code: 'OBLIK10', kind: 'percent', value: 10 },
      zone: { code: 'city', price: 4000, freeFrom: 150000 },
      services: 4500,
    })
    expect(t.subtotal).toBe(218000)
    expect(t.bundleDiscount).toBe(21800)
    expect(t.promoDiscount).toBe(19620)
    expect(t.delivery).toBe(0)
    expect(t.total).toBe(218000 - 21800 - 19620 + 4500)
    expect(Number.isInteger(t.total)).toBe(true)
  })
})
