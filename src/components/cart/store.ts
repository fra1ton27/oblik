'use client'

import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

/** Снимок для показа: цену и название на сервере всё равно пересчитываем */
export type CartSnapshot = {
  title: string
  variantLabel?: string | null
  /** Цена за единицу в центах на момент добавления */
  price: number
  image?: string | null
  slug?: string | null
  collectionTitle?: string | null
  leadTime?: string | null
  /** был ли товар в наличии при добавлении — для заметки «Теперь только под заказ» */
  inStock?: boolean
}

export type CartLine = {
  key: string
  productId: number | string
  variantSku: string | null
  qty: number
  snapshot: CartSnapshot
  addedAt: number
}

export function lineKey(productId: number | string, variantSku: string | null) {
  return `${productId}:${variantSku ?? '-'}`
}

type CartState = {
  lines: CartLine[]
  /** id покупателя, с чьей серверной корзиной уже слились (null — гостевая корзина) */
  owner: string | null
  miniCartOpen: boolean
  /** Последнее добавленное — для анимации «летит в корзину» и подсветки в мини-корзине */
  lastAddedKey: string | null
  add: (input: Omit<CartLine, 'key' | 'addedAt' | 'qty'> & { qty?: number }) => void
  setQty: (key: string, qty: number) => void
  remove: (key: string) => { line: CartLine; index: number } | null
  restore: (line: CartLine, index: number) => void
  replaceAll: (lines: CartLine[]) => void
  setOwner: (owner: string | number | null) => void
  clear: () => void
  openMiniCart: () => void
  closeMiniCart: () => void
}

const MAX_QTY = 99

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],
      owner: null,
      miniCartOpen: false,
      lastAddedKey: null,
      add: ({ qty = 1, ...input }) => {
        const key = lineKey(input.productId, input.variantSku)
        const lines = [...get().lines]
        const existing = lines.findIndex((l) => l.key === key)
        if (existing >= 0) {
          lines[existing] = {
            ...lines[existing],
            qty: Math.min(MAX_QTY, lines[existing].qty + qty),
            snapshot: input.snapshot,
          }
        } else {
          lines.push({ ...input, key, qty: Math.min(MAX_QTY, qty), addedAt: Date.now() })
        }
        set({ lines, lastAddedKey: key })
      },
      setQty: (key, qty) =>
        set((s) => ({
          lines: s.lines.map((l) => (l.key === key ? { ...l, qty: Math.max(1, Math.min(MAX_QTY, qty)) } : l)),
        })),
      remove: (key) => {
        const index = get().lines.findIndex((l) => l.key === key)
        if (index < 0) return null
        const line = get().lines[index]
        set((s) => ({ lines: s.lines.filter((l) => l.key !== key) }))
        return { line, index }
      },
      restore: (line, index) =>
        set((s) => {
          if (s.lines.some((l) => l.key === line.key)) return s
          const lines = [...s.lines]
          lines.splice(Math.min(index, lines.length), 0, line)
          return { lines }
        }),
      replaceAll: (lines) => set({ lines }),
      setOwner: (owner) => set({ owner: owner === null ? null : String(owner) }),
      clear: () => set({ lines: [], lastAddedKey: null }),
      openMiniCart: () => set({ miniCartOpen: true }),
      closeMiniCart: () => set({ miniCartOpen: false }),
    }),
    {
      // ключ с версией схемы: при смене структуры меняем v1 → v2 и migrate
      name: 'oblik-cart-v1',
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ lines: s.lines, owner: s.owner }),
    },
  ),
)

export function cartCount(lines: CartLine[]) {
  return lines.reduce((sum, l) => sum + l.qty, 0)
}

export function cartSubtotal(lines: CartLine[]) {
  return lines.reduce((sum, l) => sum + l.qty * l.snapshot.price, 0)
}
