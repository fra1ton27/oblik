import 'server-only'
import { headers } from 'next/headers'
import { getPayload } from 'payload'
import config from '@payload-config'

export type SessionCustomer = {
  id: number | string
  email: string
  name?: string | null
  phone?: string | null
}

/**
 * Текущий покупатель по httpOnly-куке Payload. Сотрудники (users) покупателями не считаются.
 */
export async function getSessionCustomer(): Promise<SessionCustomer | null> {
  try {
    const payload = await getPayload({ config })
    const { user } = await payload.auth({ headers: await headers() })
    if (!user || (user as { collection?: string }).collection !== 'customers') return null
    const u = user as unknown as SessionCustomer
    return { id: u.id, email: u.email, name: u.name ?? null, phone: u.phone ?? null }
  } catch {
    return null
  }
}
