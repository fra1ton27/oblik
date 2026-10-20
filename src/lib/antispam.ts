import 'server-only'
import { headers } from 'next/headers'

/**
 * Антиспам для форм (раздел 10.1 ТЗ): скрытое поле-ловушка, минимальное время заполнения 3 с,
 * лимит 5 отправок с IP за 10 минут, Cloudflare Turnstile — если задан ключ в env.
 *
 * TODO(spec): лимиты хранятся в памяти процесса — при нескольких инстансах нужен общий стор (Redis/Postgres).
 */

const WINDOW_MS = 10 * 60 * 1000
const buckets = new Map<string, number[]>()

export async function clientIp(): Promise<string> {
  const h = await headers()
  return (
    h.get('cf-connecting-ip') ||
    h.get('x-real-ip') ||
    h.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    '0.0.0.0'
  )
}

/** true — лимит не превышен (и попытка засчитана) */
export function takeRateLimit(key: string, limit = 5, windowMs = WINDOW_MS): boolean {
  const now = Date.now()
  const list = (buckets.get(key) ?? []).filter((ts) => now - ts < windowMs)
  if (list.length >= limit) {
    buckets.set(key, list)
    return false
  }
  list.push(now)
  buckets.set(key, list)
  // не даём карте расти бесконечно
  if (buckets.size > 5000) {
    for (const [k, v] of buckets) if (!v.some((ts) => now - ts < windowMs)) buckets.delete(k)
  }
  return true
}

export type SpamVerdict = { ok: true } | { ok: false; reason: 'honeypot' | 'tooFast' | 'rateLimited' | 'captcha' }

export async function checkSpam(
  input: { website?: string | null; startedAt?: number | null; turnstileToken?: string | null },
  scope: string,
): Promise<SpamVerdict> {
  if (input.website) return { ok: false, reason: 'honeypot' }
  if (!input.startedAt || Date.now() - Number(input.startedAt) < 3000) return { ok: false, reason: 'tooFast' }
  const ip = await clientIp()
  if (!takeRateLimit(`${scope}:${ip}`)) return { ok: false, reason: 'rateLimited' }
  if (process.env.TURNSTILE_SECRET_KEY) {
    const ok = await verifyTurnstile(input.turnstileToken ?? '', ip)
    if (!ok) return { ok: false, reason: 'captcha' }
  }
  return { ok: true }
}

async function verifyTurnstile(token: string, ip: string): Promise<boolean> {
  if (!token) return false
  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: new URLSearchParams({ secret: process.env.TURNSTILE_SECRET_KEY ?? '', response: token, remoteip: ip }),
    })
    const data = (await res.json()) as { success?: boolean }
    return Boolean(data.success)
  } catch {
    return false
  }
}
