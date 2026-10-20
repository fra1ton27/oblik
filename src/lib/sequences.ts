import { sql } from '@payloadcms/db-postgres'
import type { Payload } from 'payload'
import { site } from '@/config/site'

/**
 * Номера заказов (OB-2026-000123) и заявок (Z-2026-00042) из последовательностей Postgres:
 * nextval атомарен и вне транзакций, поэтому одновременные запросы не получат один номер.
 */
const SEQUENCES = { order: 'oblik_order_number_seq', inquiry: 'oblik_inquiry_number_seq' } as const
const TABLES = { order: 'orders', inquiry: 'inquiries' } as const

type Kind = keyof typeof SEQUENCES
type Drizzle = { execute: (query: unknown) => Promise<{ rows: Array<Record<string, unknown>> }> }

function drizzle(payload: Payload): Drizzle {
  return (payload.db as unknown as { drizzle: Drizzle }).drizzle
}

async function query(payload: Payload, text: string) {
  return (await drizzle(payload).execute(sql.raw(text))).rows
}

/**
 * Создаёт последовательность и подтягивает её к уже выданным номерам. В dev схему синхронизирует
 * drizzle push, и он удаляет последовательности, которых нет в схеме Payload, — без «догонялки»
 * после перезапуска номера начинались бы с 1 и упирались в уникальность.
 */
async function ensureSequence(payload: Payload, kind: Kind) {
  const name = SEQUENCES[kind]
  const table = TABLES[kind]
  await query(payload, `CREATE SEQUENCE IF NOT EXISTS ${name} START 1`)
  const [exists] = await query(payload, `SELECT to_regclass('public.${table}') IS NOT NULL AS ok`)
  if (!exists?.ok) return
  const [used] = await query(payload, `SELECT COALESCE(MAX(NULLIF(substring(number from '([0-9]+)$'), '')::bigint), 0) AS n FROM ${table}`)
  const [seq] = await query(payload, `SELECT last_value, is_called FROM ${name}`)
  const max = Number(used?.n ?? 0)
  const current = seq?.is_called ? Number(seq.last_value) : Number(seq?.last_value ?? 1) - 1
  if (max > current) await query(payload, `SELECT setval('${name}', ${max}, true)`)
}

export async function ensureSequences(payload: Payload) {
  for (const kind of Object.keys(SEQUENCES) as Kind[]) await ensureSequence(payload, kind)
}

export async function nextNumber(payload: Payload, kind: Kind): Promise<string> {
  let rows: Array<Record<string, unknown>>
  try {
    rows = await query(payload, `SELECT nextval('${SEQUENCES[kind]}') AS n`)
  } catch {
    // последовательность удалили на ходу (dev push после правки конфига) — пересоздаём и повторяем
    await ensureSequence(payload, kind)
    rows = await query(payload, `SELECT nextval('${SEQUENCES[kind]}') AS n`)
  }
  const n = Number(rows[0]?.n ?? 0)
  const year = new Date().getFullYear()
  return kind === 'order'
    ? `${site.orderPrefix}-${year}-${String(n).padStart(6, '0')}`
    : `${site.inquiryPrefix}-${year}-${String(n).padStart(5, '0')}`
}
