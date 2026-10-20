import { sql } from '@payloadcms/db-postgres'
import type { Payload } from 'payload'
import { site } from '@/config/site'

/**
 * Номера заказов (OB-2026-000123) и заявок (Z-2026-00042) из последовательностей Postgres:
 * nextval атомарен и вне транзакций, поэтому одновременные запросы не получат один номер.
 */
const SEQUENCES = { order: 'oblik_order_number_seq', inquiry: 'oblik_inquiry_number_seq' } as const

type Drizzle = { execute: (query: unknown) => Promise<{ rows: Array<Record<string, unknown>> }> }

function drizzle(payload: Payload): Drizzle {
  return (payload.db as unknown as { drizzle: Drizzle }).drizzle
}

export async function ensureSequences(payload: Payload) {
  for (const name of Object.values(SEQUENCES)) {
    await drizzle(payload).execute(sql.raw(`CREATE SEQUENCE IF NOT EXISTS ${name} START 1`))
  }
}

export async function nextNumber(payload: Payload, kind: keyof typeof SEQUENCES): Promise<string> {
  const res = await drizzle(payload).execute(sql.raw(`SELECT nextval('${SEQUENCES[kind]}') AS n`))
  const n = Number(res.rows[0]?.n ?? 0)
  const year = new Date().getFullYear()
  return kind === 'order'
    ? `${site.orderPrefix}-${year}-${String(n).padStart(6, '0')}`
    : `${site.inquiryPrefix}-${year}-${String(n).padStart(5, '0')}`
}
