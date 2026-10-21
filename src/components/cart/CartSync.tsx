'use client'

import { useEffect, useRef } from 'react'
import { useSession } from '@/components/account/sessionStore'
import { useWishlist } from '@/components/account/wishlistStore'
import { mergeCart, saveCart } from '@/lib/actions/cart'
import { mergeFavorites } from '@/lib/actions/account'
import { CART_HINT_COOKIE } from '@/config/cookies'
import { useCart, type CartLine } from './store'

/**
 * У вошедшего покупателя корзина дублируется в коллекцию carts, избранное — в customers.favorites.
 * При входе гостевые корзина и избранное один раз сливаются с серверными (owner в сторе корзины
 * помнит, для кого слияние уже сделано, — иначе каждая загрузка страницы сливала бы заново).
 */
export function CartSync() {
  const customer = useSession((s) => s.customer)
  const status = useSession((s) => s.status)
  const lines = useCart((s) => s.lines)
  const merged = useRef<string | number | null>(null)
  const timer = useRef<number | undefined>(undefined)

  // вход: слияние (один раз на покупателя); сессия кончилась — корзина снова гостевая
  useEffect(() => {
    if (!customer) {
      if (status === 'ready' && useCart.getState().owner) useCart.getState().setOwner(null)
      return
    }
    if (merged.current === customer.id) return
    merged.current = customer.id
    if (useCart.getState().owner === String(customer.id)) return
    const guest = useCart.getState().lines
    mergeCart(guest)
      .then((next) => {
        useCart.getState().replaceAll(next as CartLine[])
        useCart.getState().setOwner(customer.id)
      })
      .catch(() => {})
    mergeFavorites(useWishlist.getState().ids.map(Number))
      .then((ids) => ids && useWishlist.getState().replaceAll(ids))
      .catch(() => {})
  }, [customer, status])

  // кука-подсказка с числом позиций: страница корзины по ней рисует пустое состояние на сервере
  useEffect(() => {
    const count = lines.reduce((n, l) => n + l.qty, 0)
    document.cookie = `${CART_HINT_COOKIE}=${count}; path=/; max-age=${60 * 60 * 24 * 90}; samesite=lax`
  }, [lines])

  // изменения корзины → сервер (с задержкой)
  useEffect(() => {
    if (!customer || merged.current !== customer.id) return
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => void saveCart(lines).catch(() => {}), 800)
    return () => window.clearTimeout(timer.current)
  }, [lines, customer])

  return null
}
