'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowRight, Check } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { useState, useTransition } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { newsletterSchema, type NewsletterInput } from '@/lib/schemas/forms'
import { subscribeNewsletter } from '@/lib/actions/newsletter'
import { Checkbox } from '@/components/ui/Checkbox'
import { toast } from '@/components/ui/Toast'
import { Honeypot } from './Honeypot'
import { useValidationMessage } from './useValidation'
import { useStartedAt } from './useStartedAt'
import { cn } from '@/lib/cn'

/** Подписка в подвале: email + согласие. Успех показывается на месте, без перехода. */
export function NewsletterForm({ tone = 'dark' }: { tone?: 'dark' | 'light' }) {
  const t = useTranslations('forms')
  const tv = useValidationMessage()
  const locale = useLocale()
  const [done, setDone] = useState(false)
  const [pending, startTransition] = useTransition()
  const startedAt = useStartedAt()

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setError,
  } = useForm<NewsletterInput>({
    resolver: zodResolver(newsletterSchema),
    mode: 'onTouched',
    defaultValues: { email: '', consent: false as unknown as true, website: '' },
  })

  const onValid = (values: NewsletterInput) => {
    startTransition(async () => {
      try {
        const res = await subscribeNewsletter({ ...values, startedAt: startedAt() }, locale, window.location.pathname)
        if (res.ok) setDone(true)
        else if (res.fieldErrors?.email) setError('email', { message: res.fieldErrors.email })
        else toast({ message: tv(res.error ?? 'generic'), tone: 'error' })
      } catch {
        toast({ message: tv('network'), tone: 'error', actionLabel: t('retry'), onAction: () => onValid(values) })
      }
    })
  }
  const submit = (e: React.FormEvent<HTMLFormElement>) => void handleSubmit(onValid)(e)

  if (done) {
    return (
      <p role="status" className={cn('flex items-center gap-2 rounded-card px-4 py-4 text-[15px] font-semibold', tone === 'dark' ? 'bg-milk/10 text-milk' : 'bg-pistachio text-ink')}>
        <Check aria-hidden className="size-5" strokeWidth={1.5} />
        {t('newsletterDone')}
      </p>
    )
  }

  const emailError = errors.email?.message
  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-3">
      <Honeypot register={register('website')} />
      <div className="relative">
        <label htmlFor="newsletter-email" className="sr-only">
          {t('email')}
        </label>
        <input
          id="newsletter-email"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder={t('emailPlaceholder')}
          aria-invalid={emailError ? true : undefined}
          aria-describedby={emailError ? 'newsletter-email-error' : undefined}
          className={cn(
            'h-12 w-full rounded-pill border bg-transparent pr-14 pl-5 outline-offset-2',
            tone === 'dark' ? 'border-milk/30 text-milk placeholder:text-milk/60 focus-visible:border-lavender' : 'border-line bg-paper text-ink',
            emailError && 'border-blush',
          )}
          {...register('email')}
        />
        <button
          type="submit"
          disabled={pending}
          aria-label={t('subscribe')}
          className={cn(
            'absolute top-1 right-1 inline-flex size-10 items-center justify-center rounded-pill transition-colors',
            tone === 'dark' ? 'bg-lavender text-ink hover:bg-milk' : 'bg-ink text-milk',
          )}
        >
          <ArrowRight aria-hidden className={cn('size-5', pending && 'animate-pulse')} strokeWidth={1.5} />
        </button>
      </div>
      {emailError && (
        <p id="newsletter-email-error" role="alert" className={cn('text-[13px] font-medium', tone === 'dark' ? 'text-blush' : 'text-error')}>
          {tv(emailError)}
        </p>
      )}
      <Controller
        control={control}
        name="consent"
        render={({ field, fieldState }) => (
          <div className={tone === 'dark' ? '[&_label_span]:text-milk/90 [&_p]:text-blush [&_input]:border-milk/50' : ''}>
            <Checkbox
              label={t('newsletterConsent')}
              checked={!!field.value}
              onChange={(e) => field.onChange(e.target.checked)}
              onBlur={field.onBlur}
              name={field.name}
              error={fieldState.error?.message ? tv(fieldState.error.message) : undefined}
            />
          </div>
        )}
      />
    </form>
  )
}
