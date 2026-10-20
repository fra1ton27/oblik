'use client'

import { useCallback, useEffect, useRef } from 'react'

/** Время начала заполнения формы — для антиспама «не быстрее 3 секунд» */
export function useStartedAt() {
  const ref = useRef(0)
  useEffect(() => {
    ref.current = Date.now()
  }, [])
  return useCallback(() => ref.current || Date.now(), [])
}
