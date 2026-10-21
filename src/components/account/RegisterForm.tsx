'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { MailCheck } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { useEffect, useRef, useState, useTransition } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { register as registerAction, resendVerification } from '@/lib/actions/auth'
import { registerSchema, type RegisterInput } from '@/lib/schemas/auth'
import { Field } from '@/components/ui/Field'
import { Input, PasswordInput } from '@/components/ui/Input'
import { PhoneInput } from '@/components/ui/PhoneInput'
import { Button, buttonClasses } from '@/components/ui/Button'
import { toast } from '@/components/ui/Toast'
import { TransitionLink } from '@/components/motion/TransitionLink'
import { ConsentField } from '@/components/forms/ConsentField'
import { Honeypot } from '@/components/forms/Honeypot'
import { useStartedAt } from '@/components/forms/useStartedAt'
import { useValidationMessage } from '@/components/forms/useValidation'
import { PasswordStrength } from './PasswordStrength'
import { useAccountAction } from './useAccountAction'

/**
 * Регистрация: имя, email, телефон (необязательно), пароль от 8 символов с индикатором надёжности,
 * согласие. Язык писем = текущая локаль. Войти можно после подтверждения email.
 */
export function RegisterForm({ loginQuery }: { loginQuery?: Record<string, string> }) {
  const t = useTranslations('auth')
  const tv = useValidationMessage()
  const locale = useLocale()
  const startedAt = useStartedAt()
  const [sentTo, setSentTo] = useState<string | null>(null)
  const [resending, startResend] = useTransition()
  const doneRef = useRef<HTMLHeadingElement>(null)
  const {
    register,
    control,
    handleSubmit,
    setError,
    setFocus,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    mode: 'onTouched',
    defaultValues: { name: '', email: '', phone: '', password: '', consent: false as unknown as true, website: '' },
  })
  const password = useWatch({ control, name: 'password' })
  const { run, pending } = useAccountAction<RegisterInput>({ setError, setFocus })
  const err = (k?: string) => (k ? tv(k) : undefined)

  useEffect(() => {
    if (sentTo) doneRef.current?.focus()
  }, [sentTo])

  const onValid = (values: RegisterInput) =>
    run(
      () => registerAction({ ...values, startedAt: startedAt() }, { locale }),
      (res) => setSentTo(res.data?.email ?? values.email),
    )

  const resend = () =>
    startResend(async () => {
      const res = await resendVerification({ email: sentTo ?? '' }).catch(() => null)
      toast({ message: res?.ok ? t('resent') : tv(res?.error ?? 'network'), tone: res?.ok ? 'success' : 'error' })
    })

  if (sentTo) {
    return (
      <div className="flex flex-col items-start gap-4">
        <span className="inline-flex size-14 items-center justify-center rounded-full bg-pistachio">
          <MailCheck aria-hidden className="size-7" strokeWidth={1.5} />
        </span>
        <h2 ref={doneRef} tabIndex={-1} className="t-h3 outline-none">
          {t('registeredTitle')}
        </h2>
        <p className="t-body text-ink-soft">{t('registeredText', { email: sentTo })}</p>
        <div className="flex flex-wrap gap-3">
          <TransitionLink href={{ pathname: '/login', query: loginQuery }} className={buttonClasses()}>
            {t('loginLink')}
          </TransitionLink>
          <Button variant="secondary" onClick={resend} loading={resending}>
            {t('resend')}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <form noValidate onSubmit={(e) => void handleSubmit(onValid)(e)} className="relative flex flex-col gap-4">
      <Honeypot register={register('website')} />
      <Field label={t('name')} required error={err(errors.name?.message)}>
        {(p) => <Input {...p} {...register('name')} autoComplete="name" />}
      </Field>
      <Field label={t('email')} required error={err(errors.email?.message)} hint={t('emailHint')}>
        {(p) => <Input {...p} {...register('email')} type="email" autoComplete="email" inputMode="email" />}
      </Field>
      <Field label={t('phone')} optional error={err(errors.phone?.message)}>
        {(p) => <Controller control={control} name="phone" render={({ field }) => <PhoneInput {...p} ref={field.ref} name={field.name} value={field.value ?? ''} onChange={field.onChange} onBlur={field.onBlur} />} />}
      </Field>
      <Field label={t('password')} required error={err(errors.password?.message)} hint={t('passwordHint')}>
        {(p) => <PasswordInput {...p} {...register('password')} autoComplete="new-password" />}
      </Field>
      <PasswordStrength value={password ?? ''} />
      <ConsentField control={control} />
      <Button type="submit" loading={pending} fullWidth>
        {t('submitRegister')}
      </Button>
      <p className="t-small flex flex-wrap justify-center gap-x-1.5 font-normal text-ink-soft">
        <span>{t('haveAccount')}</span>
        <TransitionLink href={{ pathname: '/login', query: loginQuery }} className="font-semibold text-ink underline underline-offset-4">
          {t('loginLink')}
        </TransitionLink>
      </p>
    </form>
  )
}
