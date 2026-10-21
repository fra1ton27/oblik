'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { useState, useTransition } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { cancelEmailChange, changePassword, requestDeletion, requestEmailChange, updateProfile } from '@/lib/actions/account'
import { emailChangeSchema, passwordChangeSchema, profileSchema, type EmailChangeInput, type PasswordChangeInput, type ProfileInput } from '@/lib/schemas/auth'
import { localeLabels, routing } from '@/i18n/routing'
import { Field } from '@/components/ui/Field'
import { Input, PasswordInput, Select } from '@/components/ui/Input'
import { PhoneInput } from '@/components/ui/PhoneInput'
import { Checkbox } from '@/components/ui/Checkbox'
import { Button } from '@/components/ui/Button'
import { Dialog } from '@/components/ui/Dialog'
import { toast } from '@/components/ui/Toast'
import { useFormat } from '@/components/motion/useFormat'
import { useValidationMessage } from '@/components/forms/useValidation'
import { PasswordStrength } from './PasswordStrength'
import { useAccountAction } from './useAccountAction'

function Section({ id, title, text, children }: { id: string; title: React.ReactNode; text?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section aria-labelledby={id} className="rounded-card bg-paper p-5 sm:p-8">
      <h2 id={id} className="t-h3">
        {title}
      </h2>
      {text && <p className="t-small mt-2 font-normal text-ink-soft">{text}</p>}
      <div className="mt-6">{children}</div>
    </section>
  )
}

export function ProfileForm({ initial }: { initial: ProfileInput }) {
  const t = useTranslations('account')
  const tf = useTranslations('forms')
  const tv = useValidationMessage()
  const {
    register,
    control,
    handleSubmit,
    setError,
    setFocus,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfileInput>({ resolver: zodResolver(profileSchema), mode: 'onTouched', defaultValues: initial })
  const { run, pending } = useAccountAction<ProfileInput>({ setError, setFocus })
  const err = (k?: string) => (k ? tv(k) : undefined)

  return (
    <Section id="profile-personal" title={t('personal')}>
      <form
        noValidate
        onSubmit={(e) =>
          void handleSubmit((v) =>
            run(
              () => updateProfile(v),
              () => {
                reset(v)
                toast({ message: t('profileSaved'), tone: 'success' })
              },
            ),
          )(e)
        }
        className="flex flex-col gap-4"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <Field label={tf('name')} required error={err(errors.name?.message)}>
            {(p) => <Input {...p} {...register('name')} autoComplete="name" />}
          </Field>
          <Field label={tf('phone')} optional error={err(errors.phone?.message)}>
            {(p) => <Controller control={control} name="phone" render={({ field }) => <PhoneInput {...p} ref={field.ref} name={field.name} value={field.value ?? ''} onChange={field.onChange} onBlur={field.onBlur} />} />}
          </Field>
        </div>
        <Field label={t('emailLanguage')} hint={t('emailLanguageHint')} className="md:max-w-[50%] md:pr-2">
          {(p) => (
            <Select {...p} {...register('locale')}>
              {routing.locales.map((l) => (
                <option key={l} value={l}>
                  {localeLabels[l].name}
                </option>
              ))}
            </Select>
          )}
        </Field>
        <Checkbox {...register('newsletter')} label={t('newsletter')} />
        <div>
          <Button type="submit" loading={pending} disabled={!isDirty}>
            {t('saveProfile')}
          </Button>
        </div>
      </form>
    </Section>
  )
}

export function PasswordForm() {
  const t = useTranslations('account')
  const tv = useValidationMessage()
  const {
    register,
    control,
    handleSubmit,
    setError,
    setFocus,
    reset,
    formState: { errors },
  } = useForm<PasswordChangeInput>({ resolver: zodResolver(passwordChangeSchema), mode: 'onTouched', defaultValues: { current: '', next: '', confirm: '' } })
  const next = useWatch({ control, name: 'next' })
  const { run, pending } = useAccountAction<PasswordChangeInput>({ setError, setFocus })
  const err = (k?: string) => (k ? tv(k) : undefined)

  return (
    <Section id="profile-password" title={t('passwordSection')}>
      <form
        noValidate
        onSubmit={(e) =>
          void handleSubmit((v) =>
            run(
              () => changePassword(v),
              () => {
                reset()
                toast({ message: t('passwordSaved'), tone: 'success', duration: 8000 })
              },
            ),
          )(e)
        }
        className="flex flex-col gap-4"
      >
        <Field label={t('currentPassword')} required error={err(errors.current?.message)} className="md:max-w-[50%] md:pr-2">
          {(p) => <PasswordInput {...p} {...register('current')} autoComplete="current-password" />}
        </Field>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Field label={t('newPassword')} required error={err(errors.next?.message)}>
              {(p) => <PasswordInput {...p} {...register('next')} autoComplete="new-password" />}
            </Field>
            <PasswordStrength value={next ?? ''} />
          </div>
          <Field label={t('confirmPassword')} required error={err(errors.confirm?.message)}>
            {(p) => <PasswordInput {...p} {...register('confirm')} autoComplete="new-password" />}
          </Field>
        </div>
        <div>
          <Button type="submit" loading={pending}>
            {t('savePassword')}
          </Button>
        </div>
      </form>
    </Section>
  )
}

export function EmailForm({ email, pending: initialPending }: { email: string; pending: string | null }) {
  const t = useTranslations('account')
  const tc = useTranslations('common')
  const tv = useValidationMessage()
  const [waiting, setWaiting] = useState(initialPending)
  const [cancelling, startCancel] = useTransition()
  const {
    register,
    handleSubmit,
    setError,
    setFocus,
    reset,
    formState: { errors },
  } = useForm<EmailChangeInput>({ resolver: zodResolver(emailChangeSchema), mode: 'onTouched', defaultValues: { email: '', password: '' } })
  const { run, pending } = useAccountAction<EmailChangeInput>({ setError, setFocus })
  const err = (k?: string) => (k ? tv(k) : undefined)

  const cancel = () =>
    startCancel(async () => {
      const res = await cancelEmailChange().catch(() => null)
      if (res?.ok) setWaiting(null)
      else toast({ message: tv('network'), tone: 'error' })
    })

  return (
    <Section id="profile-email" title={t('emailSection')} text={t('currentEmail', { email })}>
      {waiting && (
        <div role="status" className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-card bg-mist p-4">
          <p className="text-[14px] font-semibold">{t('emailPending', { email: waiting })}</p>
          <Button variant="ghost" size="sm" onClick={cancel} loading={cancelling}>
            {tc('cancel')}
          </Button>
        </div>
      )}
      <form
        noValidate
        onSubmit={(e) =>
          void handleSubmit((v) =>
            run(
              () => requestEmailChange(v),
              (res) => {
                reset()
                setWaiting(res.data?.email ?? v.email)
                toast({ message: t('emailLinkSent', { email: res.data?.email ?? v.email }), tone: 'success', duration: 8000 })
              },
            ),
          )(e)
        }
        className="flex flex-col gap-4"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <Field label={t('newEmail')} required error={err(errors.email?.message)}>
            {(p) => <Input {...p} {...register('email')} type="email" autoComplete="email" inputMode="email" />}
          </Field>
          <Field label={t('emailPassword')} required error={err(errors.password?.message)}>
            {(p) => <PasswordInput {...p} {...register('password')} autoComplete="current-password" />}
          </Field>
        </div>
        <div>
          <Button type="submit" loading={pending}>
            {t('sendEmailLink')}
          </Button>
        </div>
      </form>
    </Section>
  )
}

export function DeletionRequest({ requestedAt }: { requestedAt: string | null }) {
  const t = useTranslations('account')
  const tc = useTranslations('common')
  const tv = useValidationMessage()
  const f = useFormat()
  const [at, setAt] = useState(requestedAt)
  const [open, setOpen] = useState(false)
  const [pending, startTransition] = useTransition()

  const confirm = () =>
    startTransition(async () => {
      try {
        const res = await requestDeletion()
        if (!res.ok) {
          toast({ message: tv(res.error ?? 'generic'), tone: 'error' })
          return
        }
        setAt(res.data.at)
        setOpen(false)
      } catch {
        toast({ message: tv('network'), tone: 'error' })
      }
    })

  return (
    <Section id="profile-delete" title={t('deleteSection')} text={t('deleteText')}>
      {at ? (
        <p role="status" className="rounded-card bg-blush p-4 text-[14px] font-semibold">
          {t('deletionRequested', { date: f.date(at) })}
        </p>
      ) : (
        <Button variant="secondary" onClick={() => setOpen(true)}>
          {t('deleteRequest')}
        </Button>
      )}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title={t('deleteConfirmTitle')}
        variant="modal"
        width={460}
        footer={
          <div className="flex flex-wrap justify-end gap-3">
            <Button variant="secondary" onClick={() => setOpen(false)}>
              {tc('cancel')}
            </Button>
            <Button onClick={confirm} loading={pending}>
              {t('deleteConfirmButton')}
            </Button>
          </div>
        }
      >
        <p className="t-body text-ink-soft">{t('deleteConfirmText')}</p>
      </Dialog>
    </Section>
  )
}
