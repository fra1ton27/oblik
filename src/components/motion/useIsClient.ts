'use client'

import { useSyncExternalStore } from 'react'

const subscribe = () => () => {}

/** true только после гидрации: для значений, которые отличаются на сервере и в браузере (ICU, localStorage) */
export function useIsClient() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  )
}
