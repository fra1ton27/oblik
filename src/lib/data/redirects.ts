import 'server-only'
import { getPayloadClient } from '@/lib/payload'

/** 301 со старого слага: коллекция redirects (плагин). Возвращает новый путь или null. */
export async function findRedirect(from: string): Promise<string | null> {
  try {
    const payload = await getPayloadClient()
    const res = await payload.find({ collection: 'redirects', where: { from: { equals: from } }, limit: 1, depth: 0 })
    const doc = res.docs[0] as { to?: { type?: string; url?: string | null } } | undefined
    return doc?.to?.url ?? null
  } catch {
    return null
  }
}
