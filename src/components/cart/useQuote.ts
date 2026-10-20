'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useLocale } from 'next-intl'
import type { Quote, DeliveryOptions } from '@/lib/cart/quote'
import { quoteCartAction } from '@/lib/actions/cart'
import type { CartLine } from './store'

/** Пересчёт корзины на сервере при каждом изменении состава, промокода или доставки */
export function useQuote(lines: CartLine[], promoCode?: string, delivery?: DeliveryOptions, enabled = true) {
  const locale = useLocale()
  const [quote, setQuote] = useState<Quote | null>(null)
  const [loading, setLoading] = useState(false)
  const seq = useRef(0)
  const payload = useMemo(
    () => lines.map((l) => ({ key: l.key, productId: l.productId, variantSku: l.variantSku, qty: l.qty, snapshot: { price: l.snapshot.price, title: l.snapshot.title, inStock: l.snapshot.inStock } })),
    [lines],
  )
  const key = JSON.stringify([payload, promoCode, delivery])

  useEffect(() => {
    if (!enabled) return
    const id = ++seq.current
    // eslint-disable-next-line react-hooks/set-state-in-effect -- индикатор пересчёта
    setLoading(true)
    const timer = window.setTimeout(() => {
      quoteCartAction(payload, locale, promoCode, delivery)
        .then((q) => id === seq.current && setQuote(q))
        .catch(() => {})
        .finally(() => id === seq.current && setLoading(false))
    }, 250)
    return () => window.clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- key собран из всех входных данных
  }, [key, locale, enabled])

  return { quote, loading }
}
