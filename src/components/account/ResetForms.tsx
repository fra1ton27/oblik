'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { useEffect, useRef, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { forgotPassword, resetPassword } from '@/lib/actions/auth'
import { forgotSchema, resetSchema, type ForgotInput, type ResetInput } from '@/lib/schemas/auth'
import { Field } from '@/components/ui/Field'
import { Input, PasswordInput } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { TransitionLink } from '@/components/motion/TransitionLink'
import { useValidationMessage } from '@/components/forms/useValidation'
import { AuthNotice } from './AuthShell'
import { PasswordStrength } from './PasswordStrength'
import { useAccountAction } from './useAccountAction'

function BackToLogin() {
  const t = useTranslations('auth')
  return (
    <TransitionLink href="/login" className="inline-flex min-h-11 items-center self-center text-[14px] font-semibold underline underline-offset-4">
      {t('backToLogin')}
    </TransitionLink>
  )
}

/** Шаг 1: email. Ответ одинаковый, есть такой аккаунт или нет. */
export function ForgotForm() {
  const t = useTranslations('auth')
  const tv = useValidationMessage()
  const [sentTo, setSentTo] = useState<string | null>(null)
  const statusRef = useRef<HTMLParagraphElement>(null)
  const {
    register,
    handleSubmit,
    setError,
    setFocus,
    formState: { errors },
  } = useForm<ForgotInput>({ resolver: zodResolver(forgotSchema), mode: 'onTouched', defaultValues: { email: '' } })
  const { run, pending } = useAccountAction<ForgotInput>({ setError, setFocus })

  useEffect(() => {
    if (sentTo) statusRef.current?.focus()
  }, [sentTo])

  if (sentTo) {
    return (
      <div className="flex flex-col gap-4">
        <p ref={statusRef} tabIndex={-1} role="status" className="rounded-card bg-pistachio p-4 text-[15px] font-semibold outline-none">
          {t('forgotSent', { email: sentTo })}
        </p>
        <BackToLogin />
      </div>
    )
  }

  return (
    <form noValidate onSubmit={(e) => void handleSubmit((v) => run(() => forgotPassword(v), () => setSentTo(v.email)))(e)} className="flex flex-col gap-4">
      <Field label={t('email')} required error={errors.email?.message ? tv(errors.email.message) : undefined}>
        {(p) => <Input {...p} {...register('email')} type="email" autoComplete="email" inputMode="email" />}
      </Field>
      <Button type="submit" loading={pending} fullWidth>
        {t('submitForgot')}
      </Button>
      <BackToLogin />
    </form>
  )
}

/** Шаг 2: новый пароль по ссылке из письма (токен живёт 1 час), затем сразу вход в кабинет */
export function NewPasswordForm({ token, accountHref }: { token: string; accountHref: string }) {
  const t = useTranslations('auth')
  const tv = useValidationMessage()
  const [invalid, setInvalid] = useState(false)
  const {
    register,
    control,
    handleSubmit,
    setError,
    setFocus,
    formState: { errors },
  } = useForm<ResetInput>({ resolver: zodResolver(resetSchema), mode: 'onTouched', defaultValues: { token, password: '', confirm: '' } })
  const password = useWatch({ control, name: 'password' })
  const { run, pending } = useAccountAction<ResetInput>({ setError, setFocus })
  const err = (k?: string) => (k ? tv(k) : undefined)

  if (invalid) {
    return (
      <div className="flex flex-col gap-4">
        <AuthNotice tone="error">{t('tokenInvalid')}</AuthNotice>
        <TransitionLink href="/reset-password" className="inline-flex min-h-11 items-center self-center text-[14px] font-semibold underline underline-offset-4">
          {t('requestNew')}
        </TransitionLink>
      </div>
    )
  }

  return (
    <form
      noValidate
      onSubmit={(e) =>
        void handleSubmit((v) =>
          run(
            () => resetPassword(v),
            () => window.location.assign(accountHref),
            (error) => {
              if (error !== 'tokenInvalid') return false
              setInvalid(true)
              return true
            },
          ),
        )(e)
      }
      className="flex flex-col gap-4"
    >
      <input type="hidden" {...register('token')} />
      <Field label={t('newPassword')} required error={err(errors.password?.message)} hint={t('passwordHint')}>
        {(p) => <PasswordInput {...p} {...register('password')} autoComplete="new-password" />}
      </Field>
      <PasswordStrength value={password ?? ''} />
      <Field label={t('confirmPassword')} required error={err(errors.confirm?.message)}>
        {(p) => <PasswordInput {...p} {...register('confirm')} autoComplete="new-password" />}
      </Field>
      <Button type="submit" loading={pending} fullWidth>
        {t('submitReset')}
      </Button>
    </form>
  )
}
