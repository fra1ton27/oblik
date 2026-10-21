'use client'

import { useTranslations } from 'next-intl'
import { passwordStrength } from '@/lib/schemas/auth'
import { cn } from '@/lib/cn'

const tones = ['bg-line', 'bg-error', 'bg-blush', 'bg-lavender-600', 'bg-ink'] as const

/** Индикатор надёжности пароля: 4 ступени, подпись для скринридера через aria-live */
export function PasswordStrength({ value, id }: { value: string; id?: string }) {
  const t = useTranslations('auth')
  const score = passwordStrength(value)
  return (
    <div id={id} className="flex items-center gap-3" aria-live="polite">
      <div className="flex flex-1 items-end gap-1" aria-hidden>
        {[1, 2, 3, 4].map((i) => (
          <span key={i} className={cn('rounded-[3px] transition-colors duration-200', score >= i ? tones[score] : 'bg-line')} style={{ height: 4 + i * 2, flex: 1 }} />
        ))}
      </div>
      <span className="t-caption min-w-[9ch] text-right text-ink-soft">{value ? t(`strength.${score}`) : t('strengthEmpty')}</span>
    </div>
  )
}
