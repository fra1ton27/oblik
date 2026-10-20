import 'server-only'
import { cookies } from 'next/headers'

export const UTM_COOKIE = 'oblik_utm'
export const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'] as const

/** UTM-метки первого визита (их пишет proxy.ts в куку) — сохраняются в заказе и заявке */
export async function getUtm(): Promise<Record<string, string> | undefined> {
  try {
    const raw = (await cookies()).get(UTM_COOKIE)?.value
    if (!raw) return undefined
    const parsed = JSON.parse(decodeURIComponent(raw)) as Record<string, string>
    return Object.fromEntries(Object.entries(parsed).filter(([k]) => (UTM_KEYS as readonly string[]).includes(k)))
  } catch {
    return undefined
  }
}
