'use client'

import Image from 'next/image'
import { Copy, Phone, ReceiptText, Hammer, Truck } from 'lucide-react'
import { useEffect, useRef, useState, useTransition } from 'react'
import { useTranslations } from 'next-intl'
import { createAccountFromOrder } from '@/lib/actions/order'
import { StepsToCheck } from '@/components/motion/StepsToCheck'
import { TransitionLink } from '@/components/motion/TransitionLink'
import { Button, buttonClasses } from '@/components/ui/Button'
import { Accordion } from '@/components/ui/Accordion'
import { Price } from '@/components/ui/Price'
import { PasswordInput } from '@/components/ui/Input'
import { Field } from '@/components/ui/Field'
import { toast } from '@/components/ui/Toast'
import { useValidationMessage } from '@/components/forms/useValidation'
import { cn } from '@/lib/cn'

export type ConfirmedOrder = {
  number: string
  token: string
  email: string
  canCreateAccount: boolean
  items: Array<{ title: string; variantLabel?: string | null; qty: number; lineTotal: number; image?: string | null }>
  total: number
  delivery: string
}

/**
 * «Заказ принят»: ступени собираются в галочку, номер крупно с копированием, сводка аккордеоном,
 * таймлайн «что дальше», для гостя — создание пароля. Фокус на заголовке для скринридера.
 */
export function OrderConfirmed({ order }: { order: ConfirmedOrder }) {
  const t = useTranslations('success')
  const tv = useValidationMessage()
  const headingRef = useRef<HTMLHeadingElement>(null)
  const [password, setPassword] = useState('')
  const [pwError, setPwError] = useState<string | undefined>()
  const [created, setCreated] = useState(false)
  const [pending, startTransition] = useTransition()

  useEffect(() => {
    headingRef.current?.focus()
  }, [])

  async function copy() {
    try {
      await navigator.clipboard.writeText(order.number)
      toast({ message: t('copied'), tone: 'success' })
    } catch {}
  }

  const steps = [
    { icon: Phone, title: t('next1'), text: t('next1Text') },
    { icon: ReceiptText, title: t('next2'), text: t('next2Text') },
    { icon: Hammer, title: t('next3'), text: t('next3Text') },
    { icon: Truck, title: t('next4'), text: t('next4Text') },
  ]

  return (
    <div className="flex flex-col gap-10">
      <section className="flex flex-col items-center rounded-section bg-lavender px-5 py-10 text-center md:py-16">
        <StepsToCheck />
        <h1 ref={headingRef} tabIndex={-1} className="t-h1 mt-6 outline-none">
          {t('orderTitle')}
        </h1>
        <p className="t-caption mt-6 text-ink-soft">{t('orderNumber')}</p>
        <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
          <span className="font-display text-[clamp(24px,7vw,56px)] leading-none tracking-[-0.02em] whitespace-nowrap">{order.number}</span>
          <button type="button" onClick={copy} className="inline-flex size-11 items-center justify-center rounded-pill bg-paper hover:bg-milk" aria-label={t('copy')}>
            <Copy aria-hidden className="size-5" strokeWidth={1.5} />
          </button>
        </div>
      </section>

      <div className="grid gap-8 lg:grid-cols-12">
        <div className="flex flex-col gap-8 lg:col-span-7">
          <Accordion
            items={[
              {
                id: 'summary',
                title: (
                  <span className="flex items-baseline gap-3">
                    {t('summary')}
                    <Price amount={order.total} size="sm" />
                  </span>
                ),
                content: (
                  <div className="flex flex-col gap-3">
                    <ul className="flex flex-col gap-3">
                      {order.items.map((it, i) => (
                        <li key={i} className="flex items-center gap-3">
                          <div className="relative size-14 shrink-0 overflow-hidden rounded-[10px] bg-sand">{it.image && <Image src={it.image} alt="" fill sizes="56px" className="object-cover" />}</div>
                          <div className="min-w-0 flex-1 text-[14px]">
                            <p className="font-semibold">{it.title}</p>
                            <p className="text-ink-soft">{[it.variantLabel, ['×', it.qty].join(' ')].filter(Boolean).join(' · ')}</p>
                          </div>
                          <Price amount={it.lineTotal} size="sm" />
                        </li>
                      ))}
                    </ul>
                    <p className="t-small font-normal text-ink-soft">{order.delivery}</p>
                    <div className="flex justify-between border-t border-line pt-3 text-[16px] font-semibold">
                      <span>{t('total')}</span>
                      <Price amount={order.total} size="md" />
                    </div>
                  </div>
                ),
              },
            ]}
          />

          <section aria-labelledby="next-title">
            <h2 id="next-title" className="t-h3 mb-6">
              {t('nextTitle')}
            </h2>
            <ol className="relative flex flex-col gap-6 md:flex-row md:gap-4">
              {steps.map((s, i) => (
                <li key={s.title} className="relative flex gap-4 md:flex-1 md:flex-col">
                  <span className={cn('relative z-10 inline-flex size-11 shrink-0 items-center justify-center rounded-full', i === 0 ? 'bg-ink text-milk' : 'bg-sand')}>
                    <s.icon aria-hidden className="size-5" strokeWidth={1.5} />
                  </span>
                  {i < steps.length - 1 && <span aria-hidden className="absolute top-11 left-[21px] h-[calc(100%-20px)] w-px bg-line md:top-[21px] md:left-11 md:h-px md:w-[calc(100%-28px)]" />}
                  <div>
                    <p className="text-[15px] font-semibold">{s.title}</p>
                    <p className="t-small mt-1 font-normal text-ink-soft">{s.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        </div>

        <aside className="flex flex-col gap-6 lg:col-span-5">
          {order.canCreateAccount && (
            <section className="rounded-section bg-paper p-6" aria-labelledby="create-account">
              <h2 id="create-account" className="t-h3">
                {t('createPassword')}
              </h2>
              <p className="t-small mt-2 font-normal text-ink-soft">{t('createPasswordText', { email: order.email })}</p>
              {created ? (
                <p role="status" className="mt-4 rounded-card bg-pistachio p-4 text-[14px] font-semibold">
                  {t('accountCreated')}
                </p>
              ) : (
                <form
                  className="mt-4 flex flex-col gap-3"
                  onSubmit={(e) => {
                    e.preventDefault()
                    startTransition(async () => {
                      const res = await createAccountFromOrder(order.number, order.token, password)
                      if (res.ok) setCreated(true)
                      else setPwError(tv(res.error ?? 'generic'))
                    })
                  }}
                >
                  <input type="email" name="email" value={order.email} autoComplete="username" readOnly hidden />
                  <Field label={t('password')} error={pwError}>
                    {(p) => <PasswordInput {...p} value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" minLength={8} required />}
                  </Field>
                  <Button type="submit" loading={pending} disabled={password.length < 8}>
                    {t('createAccount')}
                  </Button>
                </form>
              )}
            </section>
          )}
          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
            <TransitionLink href="/account" className={buttonClasses({ fullWidth: true })}>
              {t('toAccount')}
            </TransitionLink>
            <TransitionLink href="/catalog" className={buttonClasses({ variant: 'secondary', fullWidth: true })}>
              {t('continue')}
            </TransitionLink>
          </div>
        </aside>
      </div>
    </div>
  )
}
