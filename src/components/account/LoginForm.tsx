'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { login, resendVerification } from '@/lib/actions/auth'
import { loginSchema, type LoginInput } from '@/lib/schemas/auth'
import { Field } from '@/components/ui/Field'
import { Input, PasswordInput } from '@/components/ui/Input'
import { Checkbox } from '@/components/ui/Checkbox'
import { Button } from '@/components/ui/Button'
import { toast } from '@/components/ui/Toast'
import { TransitionLink } from '@/components/motion/TransitionLink'
import { useValidationMessage } from '@/components/forms/useValidation'
import { AuthNotice } from './AuthShell'
import { useAccountAction } from './useAccountAction'

type Problem = 'invalidCredentials' | 'locked' | 'unverified' | null

/**
 * Вход: email, пароль с показом, «Запомнить меня», ссылки на восстановление и регистрацию.
 * После входа — полная загрузка returnTo (только внутренние пути, проверены на сервере),
 * чтобы серверные страницы и шапка сразу увидели сессию.
 */
export function LoginForm({ returnTo, registerQuery }: { returnTo: string; registerQuery?: Record<string, string> }) {
  const t = useTranslations('auth')
  const tv = useValidationMessage()
  const [problem, setProblem] = useState<Problem>(null)
  const [resending, startResend] = useTransition()
  const {
    register,
    handleSubmit,
    setError,
    setFocus,
    getValues,
    formState: { errors },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema), mode: 'onTouched', defaultValues: { email: '', password: '', remember: true } })
  const { run, pending } = useAccountAction<LoginInput>({ setError, setFocus })
  const err = (k?: string) => (k ? tv(k) : undefined)

  const onValid = (values: LoginInput) => {
    setProblem(null)
    run(
      () => login(values),
      () => window.location.assign(returnTo),
      (error) => {
        if (error === 'invalidCredentials' || error === 'locked' || error === 'unverified') {
          setProblem(error)
          if (error === 'invalidCredentials') setFocus('password')
          return true
        }
        return false
      },
    )
  }

  const resend = () =>
    startResend(async () => {
      const res = await resendVerification({ email: getValues('email') }).catch(() => null)
      toast({ message: res?.ok ? t('resent') : tv(res?.error ?? 'network'), tone: res?.ok ? 'success' : 'error' })
    })

  return (
    <form noValidate onSubmit={(e) => void handleSubmit(onValid)(e)} className="flex flex-col gap-4">
      {problem && (
        <AuthNotice tone="error">
          {t(problem)}
          {problem === 'unverified' && (
            <button type="button" onClick={resend} disabled={resending} className="mt-2 block min-h-11 font-semibold text-ink underline underline-offset-4 disabled:opacity-50">
              {t('resend')}
            </button>
          )}
        </AuthNotice>
      )}
      <Field label={t('email')} required error={err(errors.email?.message)}>
        {(p) => <Input {...p} {...register('email')} type="email" autoComplete="username" inputMode="email" />}
      </Field>
      <Field label={t('password')} required error={err(errors.password?.message)}>
        {(p) => <PasswordInput {...p} {...register('password')} autoComplete="current-password" />}
      </Field>
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
        <Checkbox {...register('remember')} label={t('remember')} />
        <TransitionLink href="/reset-password" className="inline-flex min-h-11 items-center text-[14px] font-semibold underline underline-offset-4">
          {t('forgot')}
        </TransitionLink>
      </div>
      <Button type="submit" loading={pending} fullWidth>
        {t('submitLogin')}
      </Button>
      <p className="t-small flex flex-wrap justify-center gap-x-1.5 font-normal text-ink-soft">
        <span>{t('noAccount')}</span>
        <TransitionLink href={{ pathname: '/register', query: registerQuery }} className="font-semibold text-ink underline underline-offset-4">
          {t('registerLink')}
        </TransitionLink>
      </p>
    </form>
  )
}
