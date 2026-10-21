import 'server-only'
import type { Payload } from 'payload'

/**
 * Гостевые заказы на email покупателя появляются в его кабинете после входа.
 * Вход возможен только с подтверждённым email, так что чужие заказы сюда не попадут.
 * Не Server Action: вызывается из login на сервере.
 */
export async function claimGuestOrders(payload: Payload, customer: { id: number | string; email: string }) {
  const res = await payload.find({
    collection: 'orders',
    where: { and: [{ 'contact.email': { equals: customer.email.toLowerCase() } }, { customer: { exists: false } }] },
    limit: 100,
    depth: 0,
    overrideAccess: true,
  })
  for (const order of res.docs) {
    await payload.update({ collection: 'orders', id: order.id, data: { customer: customer.id as number }, overrideAccess: true, context: { skipEmail: true } })
  }
  return res.docs.length
}
