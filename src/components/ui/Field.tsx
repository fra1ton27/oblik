'use client'

import { AlertCircle } from 'lucide-react'
import { useId } from 'react'
import { useTranslations } from 'next-intl'
import { cn } from '@/lib/cn'

export type FieldRenderProps = {
  id: string
  'aria-invalid'?: boolean
  'aria-describedby'?: string
  'aria-required'?: boolean
}

type FieldProps = {
  label: React.ReactNode
  hint?: React.ReactNode
  error?: string
  required?: boolean
  optional?: boolean
  className?: string
  hideLabel?: boolean
  children: (props: FieldRenderProps) => React.ReactNode
  id?: string
}

/**
 * Обёртка поля: подпись над полем, подсказка, ошибка через aria-describedby.
 * Ошибка показывается после ухода из поля и при отправке (это решает форма).
 */
export function Field({ label, hint, error, required, optional, className, hideLabel, children, id: idProp }: FieldProps) {
  const t = useTranslations('forms')
  const autoId = useId()
  const id = idProp ?? autoId
  const hintId = hint ? `${id}-hint` : undefined
  const errorId = error ? `${id}-error` : undefined
  const describedBy = [errorId, hintId].filter(Boolean).join(' ') || undefined

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label htmlFor={id} className={cn('t-small text-ink', hideLabel && 'sr-only')}>
        {label}
        {required && (
          <span className="text-error" aria-hidden>
            {' *'}
          </span>
        )}
        {optional && <span className="ml-1 text-ink-soft">{t('optional')}</span>}
      </label>
      {children({
        id,
        'aria-invalid': error ? true : undefined,
        'aria-describedby': describedBy,
        'aria-required': required || undefined,
      })}
      {hint && !error && (
        <p id={hintId} className="text-[13px] leading-snug text-ink-soft">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="flex items-start gap-1.5 text-[13px] leading-snug font-medium text-error" role="alert">
          <AlertCircle aria-hidden className="mt-px size-4 shrink-0" strokeWidth={1.5} />
          {error}
        </p>
      )}
    </div>
  )
}

export const fieldClasses = cn(
  'w-full rounded-field border border-line bg-paper px-4 text-ink placeholder:text-ink-soft/70',
  'h-12 transition-[border-color,box-shadow] duration-200 ease-soft',
  'hover-device:hover:border-ink-soft focus-visible:border-lavender-600 focus-visible:outline-2 focus-visible:outline-offset-0',
  'aria-invalid:border-error disabled:cursor-not-allowed disabled:bg-sand/50 disabled:text-ink-soft',
)
