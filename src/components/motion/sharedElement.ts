'use client'

import { create } from 'zustand'

type Shared = { key: string; src: string; rect: { left: number; top: number; width: number; height: number }; at: number }

/**
 * Shared element переход «витрина → товар»: витрина запоминает прямоугольник и картинку,
 * главное фото на странице товара проигрывает FLIP из этого прямоугольника.
 */
export const useSharedElement = create<{ value: Shared | null; set: (v: Shared | null) => void }>((set) => ({
  value: null,
  set: (value) => set({ value }),
}))

export function rememberSharedElement(key: string, el: HTMLElement | null, src: string | undefined) {
  if (!el || !src) return
  const r = el.getBoundingClientRect()
  useSharedElement.getState().set({ key, src, rect: { left: r.left, top: r.top, width: r.width, height: r.height }, at: Date.now() })
}
