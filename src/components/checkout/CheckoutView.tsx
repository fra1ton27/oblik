'use client'

import Image from 'next/image'
import { zodResolver } from '@hookform/resolvers/zod'
import { Check, ChevronDown } from 'lucide-react'
import { useEffect, useMemo, useRef, useState, useTransition } from 'react'
import { Controller, useForm, useWatch, type FieldErrors, type FieldPath } from 'react-hook-form'
import { useLocale, useTranslations } from 'next-intl'
import { useRouter } from '@/i18n/navigation'
import { checkoutSchema, type CheckoutInput } from '@/lib/schemas/checkout'
import { placeOrder } from '@/lib/actions/order'
import { getCheckoutProfile, type CheckoutProfile } from '@/lib/actions/account'
import { useCart } from '@/components/cart/store'
import { useQuote } from '@/components/cart/useQuote'
import { useIsClient } from '@/components/motion/useIsClient'
import { useFormat } from '@/components/motion/useFormat'
import { TransitionLink } from '@/components/motion/TransitionLink'
import { Field } from '@/components/ui/Field'
import { Input, Textarea } from '@/components/ui/Input'
import { PhoneInput } from '@/components/ui/PhoneInput'
import { Checkbox, Radio } from '@/components/ui/Checkbox'
import { Button, buttonClasses } from '@/components/ui/Button'
import { Price } from '@/components/ui/Price'
import { Stepper } from '@/components/ui/Stepper'
import { Skeleton } from '@/components/ui/Skeleton'
import { EmptyState } from '@/components/ui/EmptyState'
import { toast } from '@/components/ui/Toast'
import { SLOTS, withSlots } from '@/components/ui/withSlot'
import { useValidationMessage } from '@/components/forms/useValidation'
import { cn } from '@/lib/cn'

const STORAGE_KEY = 'oblik-checkout-v1'
const PROMO_KEY = 'oblik-promo'
const STEPS = ['contacts', 'delivery', 'payment'] as const
type Step = (typeof STEPS)[number]

const stepFields: Record<Step, FieldPath<CheckoutInput>[]> = {
  contacts: ['contacts.name', 'contacts.phone', 'contacts.email'],
  delivery: ['delivery.method', 'delivery.city', 'delivery.street', 'delivery.floor', 'delivery.date'],
  payment: ['payment.method', 'consent'],
}

function newKey() {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

/**
 * Оформление: одна страница, три шага аккордеоном со степпером; заполненный шаг сворачивается в
 * сводку с «Изменить». Данные сохраняются в sessionStorage. Отправка — Server Action placeOrder.
 */
export function CheckoutView({ showroom }: { showroom: string }) {
  const t = useTranslations('checkout')
  const tc = useTranslations('cart')
  const tv = useValidationMessage()
  const f = useFormat()
  const locale = useLocale()
  const router = useRouter()
  const isClient = useIsClient()
  const lines = useCart((s) => s.lines)
  const clearCart = useCart((s) => s.clear)
  const [step, setStep] = useState<Step>('contacts')
  const [done, setDone] = useState<Set<Step>>(new Set())
  const [profile, setProfile] = useState<CheckoutProfile>(null)
  const [summaryOpen, setSummaryOpen] = useState(false)
  const [changed, setChanged] = useState<number | null>(null)
  const [pending, startTransition] = useTransition()
  const promo = isClient ? (sessionStorage.getItem(PROMO_KEY) ?? undefined) : undefined
  const restored = useRef(false)

  const form = useForm<CheckoutInput>({
    resolver: zodResolver(checkoutSchema),
    mode: 'onTouched',
    defaultValues: {
      contacts: { name: '', phone: '', email: '' },
      delivery: { method: 'city', city: '', street: '', apartment: '', postalCode: '', floor: '', elevator: true, date: '', lift: false, assembly: false, addressIndex: 'new' },
      payment: { method: 'manual' },
      comment: '',
      consent: false as unknown as true,
      newsletter: false,
      idempotencyKey: '',
    },
  })
  const { register, control, handleSubmit, setError, setFocus, trigger, setValue, reset, formState } = form
  const values = useWatch({ control })

  // восстановление из sessionStorage и подстановка данных вошедшего
  useEffect(() => {
    if (restored.current) return
    restored.current = true
    let saved: Partial<CheckoutInput> | null = null
    try {
      saved = JSON.parse(sessionStorage.getItem(STORAGE_KEY) ?? 'null')
    } catch {}
    if (saved) {
      reset({ ...form.getValues(), ...saved, consent: false as unknown as true, idempotencyKey: saved.idempotencyKey || newKey() })
      toast({ message: t('restore') })
    } else setValue('idempotencyKey', newKey())
    getCheckoutProfile()
      .then((p) => {
        setProfile(p)
        if (!p) return
        const cur = form.getValues()
        if (!cur.contacts.name) setValue('contacts.name', p.name)
        if (!cur.contacts.email) setValue('contacts.email', p.email)
        if (!cur.contacts.phone && p.phone) setValue('contacts.phone', p.phone)
        const def = p.addresses.findIndex((a) => a.isDefault)
        if (def >= 0 && !cur.delivery.city) pickAddress(String(def), p)
      })
      .catch(() => {})
    // eslint-disable-next-line react-hooks/exhaustive-deps -- один раз при монтировании
  }, [])

  // сохранение черновика
  useEffect(() => {
    if (!restored.current) return
    const { consent: _c, ...rest } = values as CheckoutInput
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(rest))
    } catch {}
  }, [values])

  function pickAddress(index: string, p = profile) {
    setValue('delivery.addressIndex', index)
    const a = p?.addresses[Number(index)]
    if (!a) return
    setValue('delivery.city', a.city)
    setValue('delivery.street', a.street)
    setValue('delivery.apartment', a.apartment ?? '')
    setValue('delivery.postalCode', a.postalCode ?? '')
    setValue('delivery.floor', a.floor != null ? String(a.floor) : '')
    setValue('delivery.elevator', Boolean(a.elevator))
  }

  const d = values.delivery ?? {}
  const deliveryOpts = useMemo(
    () => ({ method: d.method, lift: Boolean(d.lift), assembly: Boolean(d.assembly), floor: d.floor ? Number(d.floor) : null, elevator: Boolean(d.elevator) }),
    [d.method, d.lift, d.assembly, d.floor, d.elevator],
  )
  const { quote, loading } = useQuote(lines, promo, deliveryOpts, isClient && lines.length > 0)

  async function next(current: Step) {
    const ok = await trigger(stepFields[current])
    if (!ok) return
    setDone((s) => new Set([...s, current]))
    const i = STEPS.indexOf(current)
    if (i < STEPS.length - 1) setStep(STEPS[i + 1])
  }

  const onValid = (data: CheckoutInput) => {
    if (!quote) return
    startTransition(async () => {
      try {
        const res = await placeOrder(data, lines.map((l) => ({ key: l.key, productId: l.productId, variantSku: l.variantSku, qty: l.qty, snapshot: { price: l.snapshot.price, title: l.snapshot.title, inStock: l.snapshot.inStock } })), {
          locale,
          expectedTotal: changed ?? quote.totals.total,
        })
        if (res.ok) {
          clearCart()
          try {
            sessionStorage.removeItem(STORAGE_KEY)
            sessionStorage.removeItem(PROMO_KEY)
          } catch {}
          router.push({ pathname: '/order-confirmed/[number]', params: { number: res.number }, query: { token: res.token } })
          return
        }
        if (res.priceChanged) {
          setChanged(res.priceChanged.totals.total)
          toast({ message: t('priceChanged', { total: f.money(res.priceChanged.totals.total) }), tone: 'error', duration: 10000 })
          return
        }
        if (res.fieldErrors) {
          const entries = Object.entries(res.fieldErrors)
          entries.forEach(([name, key]) => setError(name as FieldPath<CheckoutInput>, { message: key }))
          const first = entries[0]?.[0] ?? ''
          const s = STEPS.find((st) => stepFields[st].some((fld) => first.startsWith(fld))) ?? 'payment'
          setStep(s)
          window.setTimeout(() => setFocus(first as FieldPath<CheckoutInput>), 50)
          return
        }
        toast({ message: tv(res.error === 'cartEmpty' ? 'generic' : 'generic'), tone: 'error' })
      } catch {
        toast({ message: tv('network'), tone: 'error' })
      }
    })
  }

  // ошибки клиентской валидации при отправке → открываем шаг с первой ошибкой и ставим фокус на поле
  const onInvalid = (errs: FieldErrors<CheckoutInput>) => {
    const hasError = (fld: string) => fld.split('.').reduce<unknown>((o, k) => (o as Record<string, unknown> | undefined)?.[k], errs)
    const s = STEPS.find((st) => stepFields[st].some(hasError))
    if (!s) return
    setStep(s)
    const first = stepFields[s].find(hasError)
    if (first) window.setTimeout(() => setFocus(first), 50)
  }

  if (isClient && !lines.length) {
    return (
      <EmptyState
        title={tc('empty')}
        text={t('cartEmpty')}
        actions={
          <TransitionLink href="/catalog" className={buttonClasses()}>
            {tc('toCatalog')}
          </TransitionLink>
        }
      />
    )
  }

  const err = (k?: string) => (k ? tv(k) : undefined)
  const e = formState.errors
  const total = changed ?? quote?.totals.total ?? 0
  const itemsCount = lines.reduce((s, l) => s + l.qty, 0)

  const summary = (
    <div className="flex flex-col gap-4">
      <ul className="flex flex-col gap-3">
        {(quote?.lines ?? []).filter((l) => l.available).map((l) => (
          <li key={l.key} className="flex gap-3">
            <div className="relative size-14 shrink-0 overflow-hidden rounded-[10px] bg-sand">{l.image && <Image src={l.image.src} alt="" fill sizes="56px" className="object-cover" />}</div>
            <div className="min-w-0 flex-1 text-[14px]">
              <p className="font-semibold">{l.title}</p>
              {l.variantLabel && <p className="text-ink-soft">{l.variantLabel}</p>}
              <p className="text-ink-soft tabular-nums">{['×', l.qty].join(' ')}</p>
            </div>
            <Price amount={l.lineTotal} size="sm" />
          </li>
        ))}
      </ul>
      <dl className="flex flex-col gap-2 border-t border-line pt-4 text-[14px]">
        <SumRow label={tc('subtotal')} value={quote ? f.money(quote.totals.subtotal) : '…'} />
        {!!quote?.totals.bundleDiscount && <SumRow label={tc('bundleDiscount')} value={f.money(-quote.totals.bundleDiscount)} accent />}
        {!!quote?.totals.promoDiscount && <SumRow label={tc('promoDiscount', { code: quote.promo?.code ?? '' })} value={f.money(-quote.totals.promoDiscount)} accent />}
        <SumRow label={t('deliveryCost')} value={quote ? (quote.totals.delivery ? f.money(quote.totals.delivery) : t('free')) : '…'} />
        {!!quote?.totals.services && <SumRow label={t('servicesTotal')} value={f.money(quote.totals.services)} />}
      </dl>
      <div className="flex items-baseline justify-between border-t border-line pt-4">
        <span className="text-[16px] font-semibold">{tc('total')}</span>
        {quote ? <Price amount={total} size="lg" rolling /> : <Skeleton className="h-7 w-24" rounded="pill" />}
      </div>
      <p className="text-[13px] text-ink-soft">{t('noManual')}</p>
    </div>
  )

  return (
    <form noValidate onSubmit={(ev) => void handleSubmit(onValid, onInvalid)(ev)} className="grid gap-8 lg:grid-cols-12">
      {/* мобайл: свёрнутая плашка сводки сверху */}
      <div className="lg:hidden">
        <button type="button" onClick={() => setSummaryOpen((v) => !v)} aria-expanded={summaryOpen} className="flex min-h-14 w-full items-center justify-between gap-3 rounded-card bg-paper px-4 text-left text-[15px] font-semibold">
          <span>{t('summaryBar', { items: tc('items', { count: itemsCount }), total: quote ? f.money(total) : '…' })}</span>
          <ChevronDown aria-hidden className={cn('size-5 transition-transform duration-[400ms]', summaryOpen && 'rotate-180')} strokeWidth={1.5} />
        </button>
        {summaryOpen && <div className="mt-2 rounded-card bg-paper p-4">{summary}</div>}
      </div>

      <div className="flex flex-col gap-4 lg:col-span-7">
        <Stepper label={t('stepsLabel')} steps={STEPS.map((s) => t(`step.${s}`))} current={STEPS.indexOf(step)} />

        {/* 1. Контакты */}
        <StepCard title={t('step.contacts')} index={1} open={step === 'contacts'} done={done.has('contacts')} onEdit={() => setStep('contacts')} summary={[values.contacts?.name, values.contacts?.phone, values.contacts?.email].filter(Boolean).join(' · ')} editLabel={t('edit')}>
          {profile ? (
            <p className="t-small font-normal text-ink-soft">{t('loggedAs', { email: profile.email })}</p>
          ) : (
            <p className="t-small flex flex-wrap gap-x-1.5 font-normal text-ink-soft">
              <span>{t('alreadyBought')}</span>
              <TransitionLink href={{ pathname: '/login', query: { returnTo: '/checkout' } }} className="font-semibold text-lavender-600 underline underline-offset-4">
                {t('login')}
              </TransitionLink>
            </p>
          )}
          <Field label={t('name')} required error={err(e.contacts?.name?.message)}>
            {(p) => <Input {...p} {...register('contacts.name')} autoComplete="name" />}
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={t('phone')} required error={err(e.contacts?.phone?.message)}>
              {(p) => <Controller control={control} name="contacts.phone" render={({ field }) => <PhoneInput {...p} ref={field.ref} name={field.name} value={field.value} onChange={field.onChange} onBlur={field.onBlur} />} />}
            </Field>
            <Field label={t('email')} required error={err(e.contacts?.email?.message)} hint={t('emailHint')}>
              {(p) => <Input {...p} {...register('contacts.email')} type="email" inputMode="email" autoComplete="email" />}
            </Field>
          </div>
          <StepAction>
            <Button size="lg" fullWidth onClick={() => void next('contacts')}>
              {t('continue')}
            </Button>
          </StepAction>
        </StepCard>

        {/* 2. Доставка */}
        <StepCard
          title={t('step.delivery')}
          index={2}
          open={step === 'delivery'}
          done={done.has('delivery')}
          onEdit={() => setStep('delivery')}
          editLabel={t('edit')}
          summary={d.method === 'pickup' ? t('methods.pickup') : [d.method && t(`methods.${d.method}`), d.city, d.street].filter(Boolean).join(' · ')}
        >
          <fieldset className="flex flex-col gap-3">
            <legend className="t-small mb-2 font-semibold">{t('method')}</legend>
            {(quote?.zones ?? []).map((z) => (
              <Radio
                key={z.code}
                {...register('delivery.method')}
                value={z.code}
                label={z.label || t(`methods.${z.code}`)}
                description={z.code === 'pickup' ? t('pickupAddress', { address: showroom }) : [z.description, z.freeFrom ? t('freeFrom', { amount: f.money(z.freeFrom) }) : ''].filter(Boolean).join(' · ')}
                aside={z.price ? f.money(z.price) : t('free')}
              />
            ))}
            {!quote && <Skeleton className="h-16" />}
          </fieldset>

          {d.method !== 'pickup' && (
            <>
              {profile?.addresses.length ? (
                <fieldset className="flex flex-col gap-2">
                  <legend className="t-small mb-2 font-semibold">{t('savedAddresses')}</legend>
                  {profile.addresses.map((a, i) => (
                    <Radio key={i} name="saved-address" checked={d.addressIndex === String(i)} onChange={() => pickAddress(String(i))} label={a.label || a.city} description={[a.city, a.street, a.apartment].filter(Boolean).join(', ')} />
                  ))}
                  <Radio name="saved-address" checked={d.addressIndex === 'new'} onChange={() => setValue('delivery.addressIndex', 'new')} label={t('newAddress')} />
                </fieldset>
              ) : null}
              <div className="grid gap-4 sm:grid-cols-6">
                <Field label={t('city')} required error={err(e.delivery?.city?.message)} className="sm:col-span-3">
                  {(p) => <Input {...p} {...register('delivery.city')} autoComplete="address-level2" />}
                </Field>
                <Field label={t('postalCode')} optional className="sm:col-span-3">
                  {(p) => <Input {...p} {...register('delivery.postalCode')} autoComplete="postal-code" inputMode="numeric" />}
                </Field>
                <Field label={t('street')} required error={err(e.delivery?.street?.message)} className="sm:col-span-4">
                  {(p) => <Input {...p} {...register('delivery.street')} autoComplete="street-address" />}
                </Field>
                <Field label={t('apartment')} optional className="sm:col-span-2">
                  {(p) => <Input {...p} {...register('delivery.apartment')} autoComplete="address-line2" />}
                </Field>
                <Field label={t('floor')} optional error={err(e.delivery?.floor?.message)} className="sm:col-span-2">
                  {(p) => <Input {...p} {...register('delivery.floor')} inputMode="numeric" />}
                </Field>
                <div className="flex items-end sm:col-span-4">
                  <Checkbox {...register('delivery.elevator')} label={t('elevator')} />
                </div>
              </div>
              <Field label={t('date')} optional hint={t('dateHint')} error={err(e.delivery?.date?.message)}>
                {(p) => <Input {...p} {...register('delivery.date')} type="date" min={new Date().toISOString().slice(0, 10)} />}
              </Field>
              <fieldset className="flex flex-col gap-1">
                <legend className="t-small mb-2 font-semibold">{t('services')}</legend>
                <Checkbox
                  {...register('delivery.lift')}
                  label={t('lift')}
                  description={quote ? (d.elevator ? f.money(quote.rates.liftPrice) : f.money(quote.rates.liftPerFloor * Math.max(1, Number(d.floor) || 1))) : undefined}
                />
                <Checkbox {...register('delivery.assembly')} label={t('assembly')} description={quote ? f.money(quote.rates.assemblyPrice) : undefined} />
              </fieldset>
            </>
          )}
          <StepAction>
            <Button size="lg" fullWidth onClick={() => void next('delivery')}>
              {t('continue')}
            </Button>
          </StepAction>
        </StepCard>

        {/* 3. Оплата и подтверждение */}
        <StepCard title={t('step.payment')} index={3} open={step === 'payment'} done={false} onEdit={() => setStep('payment')} editLabel={t('edit')} summary="">
          <fieldset className="flex flex-col gap-3">
            <legend className="t-small mb-2 font-semibold">{t('payment')}</legend>
            <Radio {...register('payment.method')} value="manual" label={t('paymentManual')} description={t('paymentManualHint')} />
            <Radio name="payment-card" value="card" disabled label={t('paymentCard')} aside={t('soon')} />
          </fieldset>
          <Field label={t('comment')} optional>
            {(p) => <Textarea {...p} {...register('comment')} rows={3} placeholder={t('commentPlaceholder')} />}
          </Field>
          <Controller
            control={control}
            name="consent"
            render={({ field, fieldState }) => (
              <Checkbox
                label={withSlots(t('agree', { terms: SLOTS[0], privacy: SLOTS[1] }), [
                  <TransitionLink key="t" href="/terms" target="_blank" className="font-semibold text-lavender-600 underline underline-offset-4">
                    {t('terms')}
                  </TransitionLink>,
                  <TransitionLink key="p" href="/privacy" target="_blank" className="font-semibold text-lavender-600 underline underline-offset-4">
                    {t('privacy')}
                  </TransitionLink>,
                ])}
                checked={Boolean(field.value)}
                onChange={(ev) => field.onChange(ev.target.checked)}
                onBlur={field.onBlur}
                ref={field.ref}
                name={field.name}
                error={fieldState.error?.message ? tv(fieldState.error.message) : undefined}
              />
            )}
          />
          <Checkbox {...register('newsletter')} label={t('newsletter')} />
          {changed !== null && (
            <p role="alert" className="rounded-card bg-blush p-4 text-[14px] font-semibold">
              {t('priceChanged', { total: f.money(changed) })}
            </p>
          )}
          <StepAction>
            <Button type="submit" size="lg" fullWidth loading={pending || (loading && !quote)} loadingLabel={t('placing')} disabled={!quote}>
              {t('confirm', { total: quote ? f.money(total) : '…' })}
            </Button>
          </StepAction>
        </StepCard>
      </div>

      <aside className="hidden lg:col-span-5 lg:block">
        <div className="sticky top-[calc(var(--header-h)+24px)] rounded-section bg-paper p-6">
          <h2 className="t-h3 mb-4">{t('summary')}</h2>
          {summary}
        </div>
      </aside>
    </form>
  )
}

function SumRow({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-ink-soft">{label}</dt>
      <dd className={cn('font-semibold', accent && 'text-success')}>{value}</dd>
    </div>
  )
}

function StepAction({ children }: { children: React.ReactNode }) {
  // на мобайле кнопка шага прижата к низу экрана
  return <div className="sticky bottom-0 -mx-5 mt-2 bg-paper/95 px-5 py-3 backdrop-blur md:static md:mx-0 md:bg-transparent md:p-0" style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}>{children}</div>
}

function StepCard({
  title,
  index,
  open,
  done,
  onEdit,
  summary,
  editLabel,
  children,
}: {
  title: string
  index: number
  open: boolean
  done: boolean
  onEdit: () => void
  summary: string
  editLabel: string
  children: React.ReactNode
}) {
  return (
    <section className={cn('rounded-section bg-paper', open ? 'p-5 md:p-8' : 'px-5 py-4 md:px-8')} aria-labelledby={`step-${index}`}>
      <div className="flex items-center justify-between gap-4">
        <h2 id={`step-${index}`} className="flex items-center gap-3 text-[18px] font-semibold">
          <span className={cn('inline-flex size-8 items-center justify-center rounded-full text-[14px] tabular-nums', done && !open ? 'bg-ink text-milk' : open ? 'bg-lavender' : 'bg-sand')}>
            {done && !open ? <Check aria-hidden className="size-4" strokeWidth={2} /> : index}
          </span>
          {title}
        </h2>
        {!open && done && (
          <button type="button" onClick={onEdit} className="min-h-11 px-2 text-[14px] font-semibold underline underline-offset-4">
            {editLabel}
          </button>
        )}
      </div>
      {!open && done && summary && <p className="t-small mt-2 pl-11 font-normal text-ink-soft">{summary}</p>}
      {/* поля не размонтируются, чтобы данные и ошибки сохранялись */}
      <div className={cn('mt-6 flex flex-col gap-5', !open && 'hidden')}>{children}</div>
    </section>
  )
}
