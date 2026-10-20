'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Controller, useForm } from 'react-hook-form'
import { budgetRanges, channels, customSchema, furnitureTypes, timeframes, type CustomInput } from '@/lib/schemas/forms'
import { submitCustom } from '@/lib/actions/forms'
import { Field } from '@/components/ui/Field'
import { Input, Select, Textarea } from '@/components/ui/Input'
import { PhoneInput } from '@/components/ui/PhoneInput'
import { FileDrop } from '@/components/ui/FileDrop'
import { Button } from '@/components/ui/Button'
import { Chip, Tag } from '@/components/ui/Chip'
import { ConsentField } from './ConsentField'
import { Honeypot } from './Honeypot'
import { Turnstile } from './Turnstile'
import { useFormAction } from './useFormAction'
import { useStartedAt } from './useStartedAt'
import { useValidationMessage } from './useValidation'
import { cn } from '@/lib/cn'

type Props = {
  /** short — короткая форма для блока на главной */
  variant?: 'full' | 'short'
  product?: { id: number; title: string } | null
  tone?: 'paper' | 'pistachio'
  onSuccess?: (number: string) => void
}

/**
 * Заявка на индивидуальный заказ: тип мебели*, размеры Ш×Г×В, материал, бюджет, срок, до 5 файлов,
 * описание, имя*, телефон*, email, удобный канал, согласие*. С товара модель подставляется.
 */
export function CustomOrderForm({ variant = 'full', product, tone = 'paper', onSuccess }: Props) {
  const t = useTranslations('forms')
  const tv = useValidationMessage()
  const startedAt = useStartedAt()
  const [files, setFiles] = useState<File[]>([])
  const short = variant === 'short'
  const {
    register,
    control,
    handleSubmit,
    setError,
    setFocus,
    formState: { errors },
  } = useForm<CustomInput>({
    resolver: zodResolver(customSchema),
    mode: 'onTouched',
    defaultValues: {
      furnitureType: 'sofa',
      width: '',
      depth: '',
      height: '',
      material: '',
      budget: '',
      timeframe: '',
      description: '',
      name: '',
      phone: '',
      email: '',
      channel: 'phone',
      productId: product?.id,
      consent: false as unknown as true,
      website: '',
    },
  })
  const { run, pending, meta, setTurnstileToken } = useFormAction<CustomInput>({ type: 'custom', setError, setFocus, onSuccess })
  const err = (k?: string) => (k ? tv(k) : undefined)

  const onValid = (values: CustomInput) =>
    run(() => {
      const fd = new FormData()
      fd.set('data', JSON.stringify({ ...values, startedAt: startedAt() }))
      fd.set('meta', JSON.stringify(meta()))
      files.forEach((f) => fd.append('files', f))
      return submitCustom(fd)
    })

  return (
    <form noValidate onSubmit={(e) => void handleSubmit(onValid)(e)} className="relative flex flex-col gap-5">
      <Honeypot register={register('website')} />
      {product && (
        <div>
          <Tag tone={tone === 'pistachio' ? 'paper' : 'lavender'}>{t('forProduct', { title: product.title })}</Tag>
        </div>
      )}
      <fieldset className="flex flex-col gap-2">
        <legend className="t-small mb-2">
          {t('furnitureType')}
          <span className="text-error" aria-hidden>
            {' *'}
          </span>
        </legend>
        <Controller
          control={control}
          name="furnitureType"
          render={({ field }) => (
            <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={t('furnitureType')}>
              {(short ? furnitureTypes.filter((f) => f !== 'kitchen') : furnitureTypes).map((f) => (
                <Chip key={f} role="radio" aria-checked={field.value === f} selected={field.value === f} onClick={() => field.onChange(f)} className={cn(tone === 'pistachio' && field.value !== f && 'bg-paper/70')}>
                  {t(`furniture.${f}`)}
                </Chip>
              ))}
            </div>
          )}
        />
        {errors.furnitureType && <p className="text-[13px] font-medium text-error">{err(errors.furnitureType.message)}</p>}
      </fieldset>

      {!short && (
        <fieldset>
          <legend className="t-small mb-2">{t('dimensions')}</legend>
          <div className="grid grid-cols-3 gap-3">
            {(['width', 'depth', 'height'] as const).map((k) => (
              <Field key={k} label={t(k)} error={err(errors[k]?.message)}>
                {(p) => <Input {...p} {...register(k)} inputMode="numeric" pattern="[0-9]*" />}
              </Field>
            ))}
          </div>
        </fieldset>
      )}

      {!short && (
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label={t('material')} className="sm:col-span-3">
            {(p) => <Input {...p} {...register('material')} placeholder={t('materialPlaceholder')} />}
          </Field>
          <Field label={t('budget')} optional className="sm:col-span-1">
            {(p) => (
              <Select {...p} {...register('budget')}>
                <option value="">{t('select')}</option>
                {budgetRanges.map((b) => (
                  <option key={b} value={b}>
                    {t(`budgets.${b}`)}
                  </option>
                ))}
              </Select>
            )}
          </Field>
          <Field label={t('timeframe')} optional className="sm:col-span-2">
            {(p) => (
              <Select {...p} {...register('timeframe')}>
                <option value="">{t('select')}</option>
                {timeframes.map((b) => (
                  <option key={b} value={b}>
                    {t(`timeframes.${b}`)}
                  </option>
                ))}
              </Select>
            )}
          </Field>
        </div>
      )}

      <Field label={t('description')} optional>
        {(p) => <Textarea {...p} {...register('description')} rows={short ? 3 : 5} placeholder={t('descriptionPlaceholder')} />}
      </Field>

      {!short && (
        <Field label={t('files')} optional error={err(errors.root?.message)}>
          {(p) => <FileDrop id={p.id} files={files} onChange={setFiles} />}
        </Field>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label={t('name')} required error={err(errors.name?.message)}>
          {(p) => <Input {...p} {...register('name')} autoComplete="name" />}
        </Field>
        <Field label={t('phone')} required error={err(errors.phone?.message)}>
          {(p) => <Controller control={control} name="phone" render={({ field }) => <PhoneInput {...p} ref={field.ref} name={field.name} value={field.value} onChange={field.onChange} onBlur={field.onBlur} />} />}
        </Field>
        {!short && (
          <>
            <Field label={t('email')} optional error={err(errors.email?.message)}>
              {(p) => <Input {...p} {...register('email')} type="email" inputMode="email" autoComplete="email" />}
            </Field>
            <Field label={t('channel')} optional>
              {(p) => (
                <Select {...p} {...register('channel')}>
                  {channels.map((c) => (
                    <option key={c} value={c}>
                      {t(`channels.${c}`)}
                    </option>
                  ))}
                </Select>
              )}
            </Field>
          </>
        )}
      </div>

      <ConsentField control={control} />
      <Turnstile onToken={setTurnstileToken} />
      <Button type="submit" size="lg" loading={pending} loadingLabel={t('sending')} fullWidth className="sm:w-auto sm:self-start">
        {t('customSubmit')}
      </Button>
    </form>
  )
}
