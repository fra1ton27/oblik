'use client'

import { Ruler } from 'lucide-react'
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Button, type ButtonVariant } from '@/components/ui/Button'
import { Dialog } from '@/components/ui/Dialog'
import { CustomOrderForm } from './CustomOrderForm'

/** Кнопка, открывающая форму индивидуального заказа в модалке (с подставленной моделью) */
export function CustomOrderModalButton({
  label,
  product,
  variant = 'primary',
  asLink,
}: {
  label: string
  product?: { id: number; title: string } | null
  variant?: ButtonVariant
  asLink?: boolean
}) {
  const t = useTranslations('forms')
  const [open, setOpen] = useState(false)
  return (
    <>
      {asLink ? (
        <button type="button" onClick={() => setOpen(true)} className="inline-flex min-h-11 items-center gap-2 text-[15px] font-semibold text-lavender-600 underline underline-offset-4">
          <Ruler aria-hidden className="size-4" strokeWidth={1.5} />
          {label}
        </button>
      ) : (
        <Button size="lg" variant={variant} onClick={() => setOpen(true)} aria-haspopup="dialog">
          {label}
        </Button>
      )}
      <Dialog open={open} onClose={() => setOpen(false)} title={t('customTitle')} width={560}>
        <CustomOrderForm product={product ?? null} />
      </Dialog>
    </>
  )
}
