'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { Controller, useForm } from 'react-hook-form'
import { contactSchema, contactTopics, type ContactInput } from '@/lib/schemas/forms'
import { submitContact } from '@/lib/actions/forms'
import { Field } from '@/components/ui/Field'
import { Input, Select, Textarea } from '@/components/ui/Input'
import { PhoneInput } from '@/components/ui/PhoneInput'
import { Button } from '@/components/ui/Button'
import { ConsentField } from './ConsentField'
import { Honeypot } from './Honeypot'
import { Turnstile } from './Turnstile'
import { useFormAction } from './useFormAction'
import { useStartedAt } from './useStartedAt'
import { useValidationMessage } from './useValidation'

/** Форма обратной связи (Контакты, конец главной): имя*, телефон или email*, тема, сообщение*, согласие* */
export function ContactForm({ defaultTopic = 'other' }: { defaultTopic?: (typeof contactTopics)[number] }) {
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
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    mode: 'onTouched',
    defaultValues: { name: '', phone: '', email: '', topic: defaultTopic, message: '', consent: false as unknown as true, website: '' },
  })
  const { run, pending, meta, setTurnstileToken } = useFormAction<ContactInput>({ type: 'contact', setError, setFocus })
  const err = (k?: string) => (k ? tv(k) : undefined)

  const onValid = (values: ContactInput) => run(() => submitContact({ ...values, startedAt: startedAt() }, meta()))

  return (
    <form noValidate onSubmit={(e) => void handleSubmit(onValid)(e)} className="relative flex flex-col gap-4">
      <Honeypot register={register('website')} />
      <Field label={t('name')} required error={err(errors.name?.message)}>
        {(p) => <Input {...p} {...register('name')} autoComplete="name" placeholder={t('namePlaceholder')} />}
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label={t('phone')} error={err(errors.phone?.message)} hint={t('emailOrPhoneHint')}>
          {(p) => (
            <Controller control={control} name="phone" render={({ field }) => <PhoneInput {...p} name={field.name} value={field.value ?? ''} onChange={field.onChange} onBlur={field.onBlur} />} />
          )}
        </Field>
        <Field label={t('email')} error={err(errors.email?.message)}>
          {(p) => <Input {...p} {...register('email')} type="email" inputMode="email" autoComplete="email" />}
        </Field>
      </div>
      <Field label={t('topic')} error={err(errors.topic?.message)}>
        {(p) => (
          <Select {...p} {...register('topic')}>
            {contactTopics.map((topic) => (
              <option key={topic} value={topic}>
                {t(`topics.${topic}`)}
              </option>
            ))}
          </Select>
        )}
      </Field>
      <Field label={t('message')} required error={err(errors.message?.message)}>
        {(p) => <Textarea {...p} {...register('message')} rows={4} placeholder={t('messagePlaceholder')} />}
      </Field>
      <ConsentField control={control} />
      <Turnstile onToken={setTurnstileToken} />
      <Button type="submit" size="lg" loading={pending} loadingLabel={t('sending')} fullWidth>
        {t('contactSubmit')}
      </Button>
    </form>
  )
}
