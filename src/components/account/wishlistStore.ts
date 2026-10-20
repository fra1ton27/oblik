'use client'

import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

type WishlistState = {
  ids: Array<number | string>
  has: (id: number | string) => boolean
  toggle: (id: number | string) => boolean
  replaceAll: (ids: Array<number | string>) => void
  clear: () => void
}

/** Избранное: у гостя в localStorage, у вошедшего синхронизируется с customers.favorites */
export const useWishlist = create<WishlistState>()(
  persist(
    (set, get) => ({
      ids: [],
      has: (id) => get().ids.some((x) => String(x) === String(id)),
      toggle: (id) => {
        const on = !get().has(id)
        set((s) => ({ ids: on ? [...s.ids, id] : s.ids.filter((x) => String(x) !== String(id)) }))
        return on
      },
      replaceAll: (ids) => set({ ids }),
      clear: () => set({ ids: [] }),
    }),
    { name: 'oblik-wishlist-v1', version: 1, storage: createJSONStorage(() => localStorage) },
  ),
)
