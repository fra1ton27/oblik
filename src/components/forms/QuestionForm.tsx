'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { Controller, useForm } from 'react-hook-form'
import { questionSchema, type QuestionInput } from '@/lib/schemas/forms'
import { submitQuestion } from '@/lib/actions/forms'
import { Field } from '@/components/ui/Field'
import { Input, Textarea } from '@/components/ui/Input'
import { PhoneInput } from '@/components/ui/PhoneInput'
import { Button } from '@/components/ui/Button'
import { Tag } from '@/components/ui/Chip'
import { ConsentField } from './ConsentField'
import { Honeypot } from './Honeypot'
import { Turnstile } from './Turnstile'
import { useFormAction } from './useFormAction'
import { useStartedAt } from './useStartedAt'
import { useValidationMessage } from './useValidation'

/** Вопрос по товару (модалка на посадочной): товар и вариант подставляются скрыто */
export function QuestionForm({ product, variantSku, variantLabel }: { product: { id: number; title: string }; variantSku?: string | null; variantLabel?: string | null }) {
  const t = useTranslations('forms')
  const tv = useValidationMessage()
  const startedAt = useStartedAt()
  const {
    register,
    control,
    handleSubmit,
    setError,
    setFocus,
    formState: { errors },
  } = useForm<QuestionInput>({
    resolver: zodResolver(questionSchema),
    mode: 'onTouched',
    defaultValues: { name: '', phone: '', email: '', question: '', productId: product.id, variantSku: variantSku ?? undefined, consent: false as unknown as true, website: '' },
  })
  const { run, pending, meta, setTurnstileToken } = useFormAction<QuestionInput>({ type: 'question', setError, setFocus })
  const err = (k?: string) => (k ? tv(k) : undefined)

  return (
    <form noValidate onSubmit={(e) => void handleSubmit((v) => run(() => submitQuestion({ ...v, startedAt: startedAt() }, meta())))(e)} className="relative flex flex-col gap-4">
      <Honeypot register={register('website')} />
      <div className="flex flex-wrap gap-2">
        <Tag tone="lavender">{product.title}</Tag>
        {variantLabel && <Tag tone="paper">{variantLabel}</Tag>}
      </div>
      <Field label={t('name')} required error={err(errors.name?.message)}>
        {(p) => <Input {...p} {...register('name')} autoComplete="name" />}
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label={t('phone')} error={err(errors.phone?.message)} hint={t('emailOrPhoneHint')}>
          {(p) => <Controller control={control} name="phone" render={({ field }) => <PhoneInput {...p} ref={field.ref} name={field.name} value={field.value ?? ''} onChange={field.onChange} onBlur={field.onBlur} />} />}
        </Field>
        <Field label={t('email')} error={err(errors.email?.message)}>
          {(p) => <Input {...p} {...register('email')} type="email" inputMode="email" autoComplete="email" />}
        </Field>
      </div>
      <Field label={t('question')} required error={err(errors.question?.message)}>
        {(p) => <Textarea {...p} {...register('question')} rows={4} />}
      </Field>
      <ConsentField control={control} />
      <Turnstile onToken={setTurnstileToken} />
      <Button type="submit" loading={pending} loadingLabel={t('sending')} fullWidth>
        {t('questionSubmit')}
      </Button>
    </form>
  )
}
