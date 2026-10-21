'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { MapPin, Pencil, Plus, Star, Trash2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { deleteAddress, saveAddress, setDefaultAddress, type AddressDTO } from '@/lib/actions/account'
import { addressSchema, type AddressInput } from '@/lib/schemas/auth'
import { Dialog } from '@/components/ui/Dialog'
import { Field } from '@/components/ui/Field'
import { Input } from '@/components/ui/Input'
import { Checkbox } from '@/components/ui/Checkbox'
import { Button } from '@/components/ui/Button'
import { Tag } from '@/components/ui/Chip'
import { EmptyState } from '@/components/ui/EmptyState'
import { toast } from '@/components/ui/Toast'
import { useValidationMessage } from '@/components/forms/useValidation'
import { useAccountAction } from './useAccountAction'

const MAX = 10

function toInput(a?: AddressDTO | null, first = false): AddressInput {
  return {
    label: a?.label ?? '',
    city: a?.city ?? '',
    postalCode: a?.postalCode ?? '',
    street: a?.street ?? '',
    apartment: a?.apartment ?? '',
    floor: a?.floor != null ? String(a.floor) : '',
    elevator: a?.elevator ?? true,
    isDefault: a?.isDefault ?? first,
  }
}

/** Адреса доставки: список, добавить / изменить / удалить, адрес по умолчанию (раздел 9.2 ТЗ) */
export function AddressesView({ initial }: { initial: AddressDTO[] }) {
  const t = useTranslations('account')
  const tc = useTranslations('common')
  const tv = useValidationMessage()
  const [list, setList] = useState(initial)
  const [editing, setEditing] = useState<AddressDTO | 'new' | null>(null)
  const [removing, setRemoving] = useState<AddressDTO | null>(null)
  const [pending, startTransition] = useTransition()

  const mutate = (call: () => Promise<{ ok: boolean; error?: string; data?: AddressDTO[] }>, message: string) =>
    startTransition(async () => {
      try {
        const res = await call()
        if (!res.ok || !res.data) {
          toast({ message: tv(res.error ?? 'generic'), tone: 'error' })
          return
        }
        setList(res.data)
        toast({ message, tone: 'success' })
      } catch {
        toast({ message: tv('network'), tone: 'error' })
      }
    })

  const addButton = (
    <Button onClick={() => setEditing('new')} disabled={list.length >= MAX}>
      <Plus aria-hidden className="size-5" strokeWidth={1.5} />
      {t('addAddress')}
    </Button>
  )

  return (
    <div className="flex flex-col gap-6">
      {list.length === 0 ? (
        <EmptyState title={t('noAddresses')} text={t('noAddressesText')} color="mist" actions={addButton} />
      ) : (
        <>
          <ul className="grid gap-4 md:grid-cols-2">
            {list.map((a) => (
              <li key={a.id} className="flex flex-col gap-4 rounded-card bg-paper p-5">
                <div className="flex items-start gap-3">
                  <MapPin aria-hidden className="mt-0.5 size-5 shrink-0 text-ink-soft" strokeWidth={1.5} />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-[16px] font-semibold break-words">{a.label || a.city}</p>
                      {a.isDefault && (
                        <Tag tone="pistachio" size="xs">
                          {t('defaultAddress')}
                        </Tag>
                      )}
                    </div>
                    <p className="t-small mt-1 font-normal break-words text-ink-soft">
                      {[a.street, a.apartment ? t('apartmentShort', { value: a.apartment }) : null, [a.postalCode, a.city].filter(Boolean).join(' ')].filter(Boolean).join(', ')}
                    </p>
                    {a.floor != null && <p className="t-small mt-0.5 font-normal text-ink-soft">{t(a.elevator ? 'floorWithLift' : 'floorNoLift', { floor: a.floor })}</p>}
                  </div>
                </div>
                <div className="mt-auto flex flex-wrap gap-2">
                  <Button variant="secondary" size="sm" onClick={() => setEditing(a)} aria-label={t('editAddressNamed', { name: a.label || a.street })}>
                    <Pencil aria-hidden className="size-4" strokeWidth={1.5} />
                    {tc('edit')}
                  </Button>
                  {!a.isDefault && (
                    <Button variant="ghost" size="sm" disabled={pending} onClick={() => mutate(() => setDefaultAddress(a.id), t('defaultSaved'))}>
                      <Star aria-hidden className="size-4" strokeWidth={1.5} />
                      {t('makeDefault')}
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" onClick={() => setRemoving(a)} aria-label={t('deleteAddressNamed', { name: a.label || a.street })}>
                    <Trash2 aria-hidden className="size-4" strokeWidth={1.5} />
                    {tc('remove')}
                  </Button>
                </div>
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap items-center gap-4">
            {addButton}
            {list.length >= MAX && <p className="t-small font-normal text-ink-soft">{tv('tooMany')}</p>}
          </div>
        </>
      )}

      <Dialog
        open={editing !== null}
        onClose={() => setEditing(null)}
        title={editing === 'new' ? t('newAddressTitle') : t('editAddress')}
        variant="modal"
        sheetOnMobile
        width={560}
        initialFocus="form input"
      >
        {editing !== null && (
          <AddressForm
            key={editing === 'new' ? 'new' : editing.id}
            initial={toInput(editing === 'new' ? null : editing, list.length === 0)}
            onSaved={(next) => {
              setList(next)
              setEditing(null)
              toast({ message: t('addressSaved'), tone: 'success' })
            }}
            id={editing === 'new' ? null : editing.id}
            onCancel={() => setEditing(null)}
          />
        )}
      </Dialog>

      <Dialog
        open={removing !== null}
        onClose={() => setRemoving(null)}
        title={t('deleteAddressTitle')}
        variant="modal"
        width={420}
        footer={
          <div className="flex flex-wrap justify-end gap-3">
            <Button variant="secondary" onClick={() => setRemoving(null)}>
              {tc('cancel')}
            </Button>
            <Button
              loading={pending}
              onClick={() => {
                const target = removing
                setRemoving(null)
                if (target) mutate(() => deleteAddress(target.id), t('addressDeleted'))
              }}
            >
              {tc('remove')}
            </Button>
          </div>
        }
      >
        <p className="t-body text-ink-soft">{removing ? [removing.street, removing.city].filter(Boolean).join(', ') : null}</p>
      </Dialog>
    </div>
  )
}

function AddressForm({ id, initial, onSaved, onCancel }: { id: string | null; initial: AddressInput; onSaved: (list: AddressDTO[]) => void; onCancel: () => void }) {
  const t = useTranslations('checkout')
  const ta = useTranslations('account')
  const tc = useTranslations('common')
  const tv = useValidationMessage()
  const {
    register,
    handleSubmit,
    setError,
    setFocus,
    formState: { errors },
  } = useForm<AddressInput>({ resolver: zodResolver(addressSchema), mode: 'onTouched', defaultValues: initial })
  const { run, pending } = useAccountAction<AddressInput>({ setError, setFocus })
  const err = (k?: string) => (k ? tv(k) : undefined)

  return (
    <form noValidate onSubmit={(e) => void handleSubmit((v) => run(() => saveAddress(id, v), (res) => res.data && onSaved(res.data)))(e)} className="flex flex-col gap-4">
      <Field label={ta('addressLabel')} optional error={err(errors.label?.message)}>
        {(p) => <Input {...p} {...register('label')} placeholder={ta('addressLabelPlaceholder')} />}
      </Field>
      <div className="grid gap-4 sm:grid-cols-[1fr_140px]">
        <Field label={t('city')} required error={err(errors.city?.message)}>
          {(p) => <Input {...p} {...register('city')} autoComplete="address-level2" />}
        </Field>
        <Field label={t('postalCode')} optional error={err(errors.postalCode?.message)}>
          {(p) => <Input {...p} {...register('postalCode')} autoComplete="postal-code" inputMode="numeric" />}
        </Field>
      </div>
      <Field label={t('street')} required error={err(errors.street?.message)}>
        {(p) => <Input {...p} {...register('street')} autoComplete="address-line1" />}
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label={t('apartment')} optional error={err(errors.apartment?.message)}>
          {(p) => <Input {...p} {...register('apartment')} autoComplete="address-line2" />}
        </Field>
        <Field label={t('floor')} optional error={err(errors.floor?.message)}>
          {(p) => <Input {...p} {...register('floor')} inputMode="numeric" />}
        </Field>
      </div>
      <Checkbox {...register('elevator')} label={t('elevator')} />
      <Checkbox {...register('isDefault')} label={ta('makeDefault')} />
      <div className="flex flex-wrap justify-end gap-3 pt-2">
        <Button variant="secondary" type="button" onClick={onCancel}>
          {tc('cancel')}
        </Button>
        <Button type="submit" loading={pending}>
          {tc('save')}
        </Button>
      </div>
    </form>
  )
}
