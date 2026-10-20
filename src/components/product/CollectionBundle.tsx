'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'
import type { CollectionDTO } from '@/lib/data/catalog'
import { SplitHeading } from '@/components/motion/SplitHeading'
import { TransitionLink } from '@/components/motion/TransitionLink'
import { Button } from '@/components/ui/Button'
import { Price } from '@/components/ui/Price'
import { toast } from '@/components/ui/Toast'
import { addCardToCart } from '@/components/cart/addToCart'
import { useCart } from '@/components/cart/store'

type Props = { collection: Pick<CollectionDTO, 'title' | 'products' | 'totals' | 'discount' | 'isBundle'> }

/** Блок комплекта: состав, цена по отдельности и цена комплекта, экономия, «Весь комплект в корзину» */
export function CollectionBundle({ collection }: Props) {
  const t = useTranslations('catalog.collectionsPage')
  const { products, totals } = collection

  function addAll() {
    products.forEach((p) => addCardToCart(p, { silent: true }))
    useCart.getState().openMiniCart()
    toast({ message: t('bundleAdded', { title: collection.title }), tone: 'success' })
  }

  return (
    <section className="mt-section" id="bundle">
      <div className="container-site">
        <div className="grid gap-8 rounded-section bg-blush p-5 md:grid-cols-12 md:p-10">
          <div className="md:col-span-7">
            <SplitHeading className="t-h2 mb-6">{t('bundleHeading')}</SplitHeading>
            <ul className="flex flex-col divide-y divide-ink/10 border-y border-ink/10">
              {products.map((p) => (
                <li key={p.id} className="flex items-center gap-4 py-3">
                  <div className="relative size-16 shrink-0 overflow-hidden rounded-[12px] bg-paper">
                    {(p.cutout ?? p.images[0]) && <Image src={(p.cutout ?? p.images[0])!.src} alt="" fill sizes="64px" className="object-contain p-1" />}
                  </div>
                  <TransitionLink href={{ pathname: '/furniture/[slug]', params: { slug: p.slug } }} className="flex-1 text-[15px] font-semibold hover:underline">
                    {p.title}
                  </TransitionLink>
                  <Price amount={p.price} from={p.maxPrice > p.price} size="sm" />
                </li>
              ))}
            </ul>
          </div>
          <aside className="flex flex-col gap-4 rounded-card bg-paper p-6 md:col-span-5 md:self-start">
            <dl className="flex flex-col gap-3 text-[15px]">
              <div className="flex justify-between gap-4">
                <dt className="text-ink-soft">{t('bundleSeparately')}</dt>
                <dd className="line-through">
                  <Price amount={totals.full} size="sm" />
                </dd>
              </div>
              {collection.isBundle && collection.discount > 0 && (
                <div className="flex justify-between gap-4">
                  <dt className="text-ink-soft">{t('bundleSavings')}</dt>
                  <dd className="font-semibold text-success">
                    <Price amount={totals.savings} size="sm" />
                  </dd>
                </div>
              )}
              <div className="flex items-baseline justify-between gap-4 border-t border-line pt-3">
                <dt className="font-semibold">{t('bundlePrice')}</dt>
                <dd>
                  <Price amount={totals.total} size="xl" />
                </dd>
              </div>
            </dl>
            <Button size="lg" fullWidth onClick={addAll}>
              {t('bundleAdd')}
            </Button>
          </aside>
        </div>
      </div>
    </section>
  )
}
