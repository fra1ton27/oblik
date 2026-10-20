'use client'

import { useLocale, useTranslations } from 'next-intl'
import { useCallback, useEffect, useRef, useState, useTransition } from 'react'
import type { FieldValues, Path, UseFormSetError, UseFormSetFocus } from 'react-hook-form'
import { useRouter } from '@/i18n/navigation'
import { toast } from '@/components/ui/Toast'
import type { ActionResult } from '@/lib/actions/result'
import { useValidationMessage } from './useValidation'

type Options<T extends FieldValues> = {
  type: 'contact' | 'custom' | 'question'
  setError: UseFormSetError<T>
  setFocus: UseFormSetFocus<T>
  /** не переходить на «Спасибо», а вызвать колбэк (например, закрыть модалку) */
  onSuccess?: (number: string) => void
}

/**
 * Отправка формы в Server Action: блокировка повторной отправки, ошибки по полям с фокусом
 * на первом, при ошибке сети — тост «Повторить» (данные формы не теряются),
 * при успехе — /[locale]/spasibo?type=…&ref=…
 */
export function useFormAction<T extends FieldValues>({ type, setError, setFocus, onSuccess }: Options<T>) {
  const tv = useValidationMessage()
  const tc = useTranslations('common')
  const locale = useLocale()
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [turnstileToken, setTurnstileToken] = useState('')
  const lastCall = useRef<(() => Promise<ActionResult<{ number: string }>>) | null>(null)
  // «Повторить» из тоста вызывает актуальную версию run
  const runRef = useRef<(call: () => Promise<ActionResult<{ number: string }>>) => void>(() => {})

  const run = useCallback(
    (call: () => Promise<ActionResult<{ number: string }>>) => {
      lastCall.current = call
      startTransition(async () => {
        try {
          const res = await call()
          if (res.ok) {
            if (onSuccess) onSuccess(res.data.number)
            else router.push({ pathname: '/thank-you', query: { type, ...(res.data.number ? { ref: res.data.number } : {}) } })
            return
          }
          const fields = Object.entries(res.fieldErrors ?? {})
          fields.forEach(([name, key]) => setError(name as Path<T>, { message: key }))
          if (fields[0]) setFocus(fields[0][0] as Path<T>)
          if (!fields.length) toast({ message: tv(res.error ?? 'generic'), tone: 'error' })
        } catch {
          toast({
            message: tv('network'),
            tone: 'error',
            actionLabel: tc('retry'),
            onAction: () => lastCall.current && runRef.current(lastCall.current),
            duration: 10000,
          })
        }
      })
    },
    [onSuccess, router, setError, setFocus, tc, tv, type],
  )

  useEffect(() => {
    runRef.current = run
  }, [run])

  const meta = useCallback(() => ({ locale, sourcePage: window.location.pathname + window.location.search, turnstileToken }), [locale, turnstileToken])

  return { run, pending, meta, setTurnstileToken }
}
