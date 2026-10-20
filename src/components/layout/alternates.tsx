'use client'

import { useEffect } from 'react'
import { create } from 'zustand'
import type { Locale } from '@/i18n/routing'

type ParamsByLocale = Partial<Record<Locale, Record<string, string>>>

type AlternatesState = {
  params: ParamsByLocale | null
  set: (params: ParamsByLocale | null) => void
}

/**
 * Локализованные параметры текущей страницы (например, слаги товара на трёх языках),
 * чтобы переключатель языка вёл на ту же сущность: /ru/mebel/divan-oblako → /sr/namestaj/sofa-oblak.
 */
export const useAlternatesStore = create<AlternatesState>((set) => ({
  params: null,
  set: (params) => set({ params }),
}))

export function LocaleAlternates({ params }: { params: ParamsByLocale }) {
  const setParams = useAlternatesStore((s) => s.set)
  const key = JSON.stringify(params)
  useEffect(() => {
    setParams(JSON.parse(key) as ParamsByLocale)
    return () => setParams(null)
  }, [key, setParams])
  return null
}
