'use client'

import { useCallback, useTransition } from 'react'
import type { FieldValues, Path, UseFormSetError, UseFormSetFocus } from 'react-hook-form'
import { toast } from '@/components/ui/Toast'
import { useValidationMessage } from '@/components/forms/useValidation'

type Result = { ok: boolean; error?: string; fieldErrors?: Record<string, string> }

/**
 * Отправка форм входа и кабинета в Server Action: ошибки по полям с фокусом на первом,
 * общие ошибки — тостом (если форма не показала их сама через onError), сбой сети — тостом.
 */
export function useAccountAction<T extends FieldValues>({ setError, setFocus }: { setError: UseFormSetError<T>; setFocus: UseFormSetFocus<T> }) {
  const tv = useValidationMessage()
  const [pending, startTransition] = useTransition()

  const run = useCallback(
    <R extends Result>(call: () => Promise<R>, onSuccess: (res: Extract<R, { ok: true }>) => void, onError?: (error: string) => boolean) => {
      startTransition(async () => {
        try {
          const res = await call()
          if (res.ok) {
            onSuccess(res as Extract<R, { ok: true }>)
            return
          }
          const fields = Object.entries(res.fieldErrors ?? {})
          fields.forEach(([name, key]) => setError(name as Path<T>, { message: key }))
          if (fields[0]) {
            setFocus(fields[0][0] as Path<T>)
            return
          }
          const error = res.error ?? 'generic'
          if (onError?.(error)) return
          toast({ message: tv(error), tone: 'error' })
        } catch {
          toast({ message: tv('network'), tone: 'error' })
        }
      })
    },
    [setError, setFocus, tv],
  )

  return { run, pending }
}
