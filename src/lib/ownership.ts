import type { Payload } from 'payload'
import type { Order } from '@/payload-types'

type FindPayload = Pick<Payload, 'find'>

/**
 * Заказ покупателя по номеру. Чужой или несуществующий номер — null (страница отдаёт 404),
 * поэтому по ответу нельзя понять, существует ли чужой заказ. Владелец проверяется дважды:
 * в запросе и по полученному документу.
 */
export async function findOwnedOrder(payload: FindPayload, customerId: number | string, number: string): Promise<Order | null> {
  const res = await payload.find({
    collection: 'orders',
    where: { and: [{ number: { equals: number } }, { customer: { equals: customerId } }] },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })
  const order = res.docs[0] as Order | undefined
  if (!order) return null
  const owner = typeof order.customer === 'object' ? order.customer?.id : order.customer
  return owner !== undefined && owner !== null && String(owner) === String(customerId) ? order : null
}
