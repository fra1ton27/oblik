'use client'

import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { cn } from '@/lib/cn'
import { fieldClasses } from './Field'

export function Input({ className, ...props }: React.ComponentProps<'input'>) {
  return <input className={cn(fieldClasses, className)} {...props} />
}

export function Textarea({ className, rows = 5, ...props }: React.ComponentProps<'textarea'>) {
  return <textarea rows={rows} className={cn(fieldClasses, 'h-auto min-h-28 resize-y py-3 leading-relaxed', className)} {...props} />
}

export function Select({ className, children, ...props }: React.ComponentProps<'select'>) {
  return (
    <div className="relative">
      <select
        className={cn(
          fieldClasses,
          'cursor-pointer appearance-none pr-10',
          'bg-[image:linear-gradient(45deg,transparent_50%,var(--color-ink)_50%),linear-gradient(135deg,var(--color-ink)_50%,transparent_50%)]',
          'bg-[position:calc(100%-20px)_50%,calc(100%-15px)_50%] bg-[size:5px_5px,5px_5px] bg-no-repeat',
          className,
        )}
        {...props}
      >
        {children}
      </select>
    </div>
  )
}

/** Пароль с кнопкой показа */
export function PasswordInput({ className, ...props }: React.ComponentProps<'input'>) {
  const t = useTranslations('forms')
  const [visible, setVisible] = useState(false)
  return (
    <div className="relative">
      <Input {...props} type={visible ? 'text' : 'password'} className={cn('pr-12', className)} />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? t('hidePassword') : t('showPassword')}
        aria-pressed={visible}
        className="absolute top-1/2 right-1 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-pill text-ink-soft hover:text-ink"
      >
        {visible ? <EyeOff aria-hidden className="size-5" strokeWidth={1.5} /> : <Eye aria-hidden className="size-5" strokeWidth={1.5} />}
      </button>
    </div>
  )
}
