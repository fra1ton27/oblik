'use client'

import { ErrorView } from '@/components/layout/ErrorView'

/** Ошибка страницы внутри сайта: шапка и подвал остаются, вместо контента — 500 */
export default function SiteError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <ErrorView error={error} reset={reset} />
}
