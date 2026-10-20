'use client'

import { useTranslations } from 'next-intl'
import { Controller, type Control, type FieldValues, type Path } from 'react-hook-form'
import { Checkbox } from '@/components/ui/Checkbox'
import { TransitionLink } from '@/components/motion/TransitionLink'
import { SLOT, withSlot } from '@/components/ui/withSlot'
import { useValidationMessage } from './useValidation'

/** Обязательное согласие с политикой конфиденциальности (ссылка внутри переведённой фразы) */
export function ConsentField<T extends FieldValues>({ control, name = 'consent' as Path<T>, tone }: { control: Control<T>; name?: Path<T>; tone?: 'dark' }) {
  const t = useTranslations('forms')
  const tv = useValidationMessage()
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Checkbox
          label={withSlot(
            t('consent', { link: SLOT }),
            <TransitionLink href="/privacy" target="_blank" className={tone === 'dark' ? 'underline underline-offset-4' : 'font-semibold text-lavender-600 underline underline-offset-4'}>
              {t('consentLink')}
            </TransitionLink>,
          )}
          checked={Boolean(field.value)}
          onChange={(e) => field.onChange(e.target.checked)}
          onBlur={field.onBlur}
          name={field.name}
          error={fieldState.error?.message ? tv(fieldState.error.message) : undefined}
        />
      )}
    />
  )
}
