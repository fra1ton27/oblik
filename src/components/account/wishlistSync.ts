'use client'

import { useSession } from './sessionStore'
import { toggleFavorite } from '@/lib/actions/account'

/** У вошедшего покупателя избранное дублируется в customers.favorites */
export async function syncWishlistToggle(productId: number, on: boolean) {
  if (!useSession.getState().customer) return
  try {
    await toggleFavorite(productId, on)
  } catch {
    // локальное избранное сохранено; синхронизируется при следующем входе
  }
}
