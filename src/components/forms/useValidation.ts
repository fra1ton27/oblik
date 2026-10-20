'use client'

import { useTranslations } from 'next-intl'
import { useCallback } from 'react'

type Translator = ReturnType<typeof useTranslations<'validation'>>
type ValidationMessageKey = Parameters<Translator>[0]

/** Перевод ключа ошибки из zod (сообщение = ключ неймспейса validation) */
export function useValidationMessage() {
  const t = useTranslations('validation')
  return useCallback(
    (key: string) => (t.has(key as ValidationMessageKey) ? t(key as ValidationMessageKey) : t('generic')),
    [t],
  )
}
