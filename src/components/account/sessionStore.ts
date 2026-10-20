'use client'

import { create } from 'zustand'

export type ClientCustomer = { id: number | string; email: string; name?: string | null; phone?: string | null }

type SessionState = {
  customer: ClientCustomer | null
  status: 'idle' | 'loading' | 'ready'
  load: (force?: boolean) => Promise<ClientCustomer | null>
  set: (customer: ClientCustomer | null) => void
}

/**
 * Сессия покупателя на клиенте: страницы витрины статические, поэтому шапка узнаёт
 * о входе запросом к /api/customers/me (httpOnly-кука уходит автоматически).
 */
export const useSession = create<SessionState>((set, get) => ({
  customer: null,
  status: 'idle',
  load: async (force) => {
    if (!force && get().status !== 'idle') return get().customer
    set({ status: 'loading' })
    try {
      const res = await fetch('/api/customers/me', { credentials: 'include', cache: 'no-store' })
      const data = res.ok ? ((await res.json()) as { user?: ClientCustomer & { collection?: string } | null }) : null
      const customer = data?.user && (data.user.collection ?? 'customers') === 'customers' ? data.user : null
      set({ customer, status: 'ready' })
      return customer
    } catch {
      set({ customer: null, status: 'ready' })
      return null
    }
  },
  set: (customer) => set({ customer, status: 'ready' }),
}))
