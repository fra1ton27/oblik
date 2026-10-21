'use client'

import { ErrorView } from '@/components/layout/ErrorView'

/** Ошибка вне группы (site) — в layout группы, оформлении заказа: 500 со своим логотипом и подписью */
export default function LocaleError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <ErrorView error={error} reset={reset} standalone />
}
