'use client'

import { Check } from 'lucide-react'
import { useId } from 'react'
import { cn } from '@/lib/cn'

type Props = Omit<React.ComponentProps<'input'>, 'type'> & {
  label: React.ReactNode
  error?: string
  description?: React.ReactNode
}

export function Checkbox({ label, error, description, className, id: idProp, ...props }: Props) {
  const autoId = useId()
  const id = idProp ?? autoId
  const errorId = error ? `${id}-error` : undefined
  return (
    <div className={cn('flex flex-col gap-1', className)}>
      <label htmlFor={id} className="group flex min-h-11 cursor-pointer items-start gap-3 py-1.5">
        <span className="relative mt-0.5 inline-flex size-6 shrink-0">
          <input
            id={id}
            type="checkbox"
            className="peer absolute inset-0 m-0 size-full cursor-pointer appearance-none rounded-[6px] border border-ink-soft bg-paper transition-colors duration-200 checked:border-ink checked:bg-ink aria-invalid:border-error disabled:cursor-not-allowed disabled:opacity-50"
            aria-invalid={error ? true : undefined}
            aria-describedby={errorId}
            {...props}
          />
          <Check
            aria-hidden
            className="pointer-events-none absolute inset-0 m-auto size-4 scale-50 text-milk opacity-0 transition-[opacity,transform] duration-200 ease-soft peer-checked:scale-100 peer-checked:opacity-100"
            strokeWidth={2}
          />
        </span>
        <span className="t-small text-ink">
          {label}
          {description && <span className="mt-0.5 block font-normal text-ink-soft">{description}</span>}
        </span>
      </label>
      {error && (
        <p id={errorId} role="alert" className="pl-9 text-[13px] font-medium text-error">
          {error}
        </p>
      )}
    </div>
  )
}

type RadioProps = Omit<React.ComponentProps<'input'>, 'type'> & {
  label: React.ReactNode
  description?: React.ReactNode
  aside?: React.ReactNode
}

/** Radio-карточка: используется для способов доставки и оплаты */
export function Radio({ label, description, aside, className, id: idProp, disabled, ...props }: RadioProps) {
  const autoId = useId()
  const id = idProp ?? autoId
  return (
    <label
      htmlFor={id}
      className={cn(
        'group flex min-h-14 cursor-pointer items-start gap-3 rounded-card border border-line bg-paper p-4 transition-colors duration-200',
        'has-[:checked]:border-ink has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-lavender-600',
        disabled && 'cursor-not-allowed opacity-55',
        className,
      )}
    >
      <span className="relative mt-0.5 inline-flex size-6 shrink-0">
        <input
          id={id}
          type="radio"
          disabled={disabled}
          className="peer absolute inset-0 m-0 size-full cursor-pointer appearance-none rounded-full border border-ink-soft bg-paper checked:border-ink focus-visible:outline-none disabled:cursor-not-allowed"
          {...props}
        />
        <span className="pointer-events-none absolute inset-1.5 scale-0 rounded-full bg-ink transition-transform duration-200 ease-soft peer-checked:scale-100" />
      </span>
      <span className="flex-1">
        <span className="block text-[15px] font-semibold">{label}</span>
        {description && <span className="t-small mt-0.5 block font-normal text-ink-soft">{description}</span>}
      </span>
      {aside && <span className="t-small shrink-0 font-semibold">{aside}</span>}
    </label>
  )
}
