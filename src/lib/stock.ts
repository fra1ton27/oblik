import type { Payload, PayloadRequest } from 'payload'

type OrderLike = {
  items?: Array<{ product?: number | string | { id: number | string } | null; variantSku?: string | null; reserved?: number | null }> | null
}

function productId(ref: unknown): number | string | null {
  if (!ref) return null
  return typeof ref === 'object' ? (ref as { id: number | string }).id : (ref as number | string)
}

/**
 * Изменение остатка варианта (или товара без вариантов) на delta.
 * Возвращает, сколько реально списано (не уходим ниже нуля).
 */
export async function adjustStock(
  payload: Payload,
  id: number | string,
  variantSku: string | null | undefined,
  delta: number,
  req?: Partial<PayloadRequest>,
): Promise<number> {
  const product = await payload.findByID({ collection: 'products', id, depth: 0, overrideAccess: true, req })
  if (!product) return 0
  if (variantSku && product.variants?.length) {
    let applied = 0
    const variants = product.variants.map((v) => {
      if (v.sku !== variantSku) return v
      const current = v.stock ?? 0
      const next = Math.max(0, current + delta)
      applied = next - current
      return { ...v, stock: next }
    })
    if (applied !== 0) {
      await payload.update({ collection: 'products', id, data: { variants }, depth: 0, overrideAccess: true, context: { skipTranslationCheck: true }, req })
    }
    return applied
  }
  const current = product.stock ?? 0
  const next = Math.max(0, current + delta)
  if (next !== current) {
    await payload.update({ collection: 'products', id, data: { stock: next }, depth: 0, overrideAccess: true, context: { skipTranslationCheck: true }, req })
  }
  return next - current
}

/** Отмена заказа возвращает то, что было списано со склада при оформлении */
export async function restockOrder(payload: Payload, order: OrderLike, req?: Partial<PayloadRequest>) {
  for (const item of order.items ?? []) {
    const id = productId(item.product)
    const reserved = item.reserved ?? 0
    if (id && reserved > 0) await adjustStock(payload, id, item.variantSku, reserved, req)
  }
}
