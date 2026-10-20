'use client'

import Image from 'next/image'
import { Check } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'
import type { ProductCard } from '@/lib/catalog'
import { bundleTotals } from '@/lib/pricing'
import { SplitHeading } from '@/components/motion/SplitHeading'
import { TransitionLink } from '@/components/motion/TransitionLink'
import { Button } from '@/components/ui/Button'
import { Price } from '@/components/ui/Price'
import { Tag } from '@/components/ui/Chip'
import { toast } from '@/components/ui/Toast'
import { addCardToCart } from '@/components/cart/addToCart'
import { useCart } from '@/components/cart/store'
import { cn } from '@/lib/cn'

type Props = { heading: string; lead: string; items: ProductCard[]; selfId: number | null; discount: number; bundleIds: number[] }

export function BundleBuilder({ heading, lead, items, selfId, discount, bundleIds }: Props) {
  const t = useTranslations('product')
  const [selected, setSelected] = useState<Set<number>>(() => new Set(items.map((p) => p.id)))
  const chosen = items.filter((p) => selected.has(p.id))
  const complete = bundleIds.length > 0 && bundleIds.every((id) => selected.has(id))
  const totals = useMemo(() => bundleTotals(chosen.map((p) => p.price), complete ? discount : 0), [chosen, complete, discount])

  function toggle(id: number) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function addAll() {
    chosen.forEach((p) => addCardToCart(p, { silent: true }))
    useCart.getState().openMiniCart()
    toast({ message: t('bundleAdded', { count: chosen.length }), tone: 'success' })
  }

  return (
    <section className="mt-section" id="bundle">
      <div className="container-site">
        <div className="rounded-section bg-paper p-5 md:p-10">
          <div className="mb-8 flex flex-col gap-3">
            <SplitHeading className="t-h2">{heading}</SplitHeading>
            <p className="t-lead max-w-[48ch] text-ink-soft">{lead}</p>
          </div>
          <div className="grid gap-8 lg:grid-cols-12">
            <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:col-span-8">
              {items.map((p) => {
                const on = selected.has(p.id)
                return (
                  <li key={p.id}>
                    <label className={cn('group relative flex h-full cursor-pointer flex-col gap-3 rounded-card border p-3 transition-colors', on ? 'border-ink bg-milk' : 'border-line')}>
                      <input type="checkbox" className="peer sr-only" checked={on} onChange={() => toggle(p.id)} />
                      <span
                        aria-hidden
                        className={cn(
                          'absolute top-4 right-4 z-10 inline-flex size-7 items-center justify-center rounded-[8px] border transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-lavender-600',
                          on ? 'border-ink bg-ink text-milk' : 'border-ink-soft bg-paper',
                        )}
                      >
                        {on && <Check className="size-4" strokeWidth={2} />}
                      </span>
                      <span className="relative block aspect-square overflow-hidden rounded-[12px] bg-sand">
                        {(p.cutout ?? p.images[0]) && (
                          <Image src={(p.cutout ?? p.images[0])!.src} alt="" fill sizes="(min-width: 1024px) 18vw, 44vw" className="object-contain p-2" />
                        )}
                      </span>
                      <span className="flex flex-col gap-1">
                        {p.id === selfId && (
                          <span>
                            <Tag size="xs" tone="lavender">
                              {t('bundleThis')}
                            </Tag>
                          </span>
                        )}
                        <span className="text-[14px] leading-snug font-semibold">{p.title}</span>
                        <Price amount={p.price} from={p.maxPrice > p.price} size="sm" />
                      </span>
                    </label>
                    {p.id !== selfId && (
                      <TransitionLink href={{ pathname: '/furniture/[slug]', params: { slug: p.slug } }} className="sr-only focus:not-sr-only">
                        {p.title}
                      </TransitionLink>
                    )}
                  </li>
                )
              })}
            </ul>
            <aside className="flex flex-col gap-4 lg:col-span-4 lg:self-start" aria-live="polite">
              <p className="t-small font-normal text-ink-soft">{t('bundleSelected', { count: chosen.length })}</p>
              <dl className="border-t border-line">
                {complete && discount > 0 && (
                  <div className="flex justify-between gap-4 border-b border-line py-3 text-[15px]">
                    <dt>{t('bundleDiscount', { percent: discount })}</dt>
                    <dd className="font-semibold text-success">
                      <Price amount={-totals.savings} size="sm" />
                    </dd>
                  </div>
                )}
                <div className="flex items-baseline justify-between gap-4 py-3">
                  <dt className="text-[15px] font-semibold">{t('bundleTotal')}</dt>
                  <dd>
                    <Price amount={totals.total} compareAt={complete && discount ? totals.full : null} size="lg" rolling />
                  </dd>
                </div>
              </dl>
              <Button size="lg" fullWidth onClick={addAll} disabled={!chosen.length}>
                {complete ? t('bundleAdd') : t('bundleAddSelected')}
              </Button>
            </aside>
          </div>
        </div>
      </div>
    </section>
  )
}
