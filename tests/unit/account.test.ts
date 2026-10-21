import { describe, expect, it } from 'vitest'
import type { PayloadRequest } from 'payload'
import { safeReturnTo } from '@/lib/paths'
import { passwordStrength } from '@/lib/schemas/auth'
import { findOwnedOrder } from '@/lib/ownership'
import { ownerOrManager, selfOrManager } from '@/lib/access'

const req = (user: Record<string, unknown> | null) => ({ req: { user } as unknown as PayloadRequest })
const customer = { id: 7, collection: 'customers' }
const manager = { id: 1, collection: 'users', role: 'manager' }

describe('returnTo после входа', () => {
  it('пропускает внутренние локализованные пути с query', () => {
    expect(safeReturnTo('/ru/kabinet/zakazy?page=2', 'ru')).toBe('/ru/kabinet/zakazy?page=2')
    expect(safeReturnTo('/en/account/orders/OB-2026-000001', 'en')).toBe('/en/account/orders/OB-2026-000001')
  })

  it('внутреннее имя маршрута без локали переводит в адрес текущего языка', () => {
    expect(safeReturnTo('/checkout', 'ru')).toBe('/ru/oformlenie')
    expect(safeReturnTo('/wishlist', 'sr')).toBe('/sr/omiljeno')
  })

  it('отбрасывает внешние адреса, протоколы и служебные разделы', () => {
    for (const bad of ['https://evil.example', '//evil.example/x', '/\\evil.example', 'javascript:alert(1)', '/api/customers', '/admin', '', 'kabinet', '/ru/ x', null, 42]) {
      expect(safeReturnTo(bad, 'ru')).toBe('/ru/kabinet')
    }
  })
})

describe('надёжность пароля', () => {
  it('короткий и очевидный пароль — слабый', () => {
    expect(passwordStrength('')).toBe(0)
    expect(passwordStrength('abc')).toBeLessThanOrEqual(1)
    expect(passwordStrength('12345678')).toBeLessThanOrEqual(1)
    expect(passwordStrength('aaaaaaaaaaaa')).toBeLessThanOrEqual(1)
  })

  it('длинный пароль из разных классов символов — надёжный', () => {
    expect(passwordStrength('Kresl0-oblako!')).toBe(4)
    expect(passwordStrength('dugačka lozinka 7')).toBeGreaterThanOrEqual(3)
  })
})

describe('доступ к заказам', () => {
  const orders = [
    { id: 1, number: 'OB-2026-000001', customer: 7 },
    { id: 2, number: 'OB-2026-000002', customer: 8 },
    { id: 3, number: 'OB-2026-000003', customer: null },
  ]
  // имитация Local API: фильтр по номеру и (если задан) по покупателю
  const fakePayload = (ignoreCustomerFilter = false) => ({
    find: async ({ where }: { where: { and: Array<Record<string, { equals: unknown }>> } }) => {
      const number = where.and.find((w) => 'number' in w)?.number.equals
      const owner = where.and.find((w) => 'customer' in w)?.customer.equals
      const docs = orders.filter((o) => o.number === number && (ignoreCustomerFilter || o.customer === owner))
      return { docs }
    },
  })

  it('свой заказ находится', async () => {
    const order = await findOwnedOrder(fakePayload() as never, 7, 'OB-2026-000001')
    expect(order?.id).toBe(1)
  })

  it('чужой и гостевой заказ — null (страница отдаёт 404)', async () => {
    expect(await findOwnedOrder(fakePayload() as never, 7, 'OB-2026-000002')).toBeNull()
    expect(await findOwnedOrder(fakePayload() as never, 7, 'OB-2026-000003')).toBeNull()
    expect(await findOwnedOrder(fakePayload() as never, 7, 'OB-2026-999999')).toBeNull()
  })

  it('владелец перепроверяется по документу, даже если фильтр запроса не сработал', async () => {
    expect(await findOwnedOrder(fakePayload(true) as never, 7, 'OB-2026-000002')).toBeNull()
  })

  it('REST: покупатель видит только свои заказы, гость — ничего', () => {
    const read = ownerOrManager('customer')
    expect(read(req(customer) as never)).toEqual({ customer: { equals: 7 } })
    expect(read(req(null) as never)).toBe(false)
    expect(read(req(manager) as never)).toBe(true)
  })

  it('REST: профиль покупателя читает только он сам', () => {
    expect(selfOrManager(req(customer) as never)).toEqual({ id: { equals: 7 } })
    expect(selfOrManager(req(null) as never)).toBe(false)
  })
})
