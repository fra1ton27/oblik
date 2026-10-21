'use client'

import { RotateCcw } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { useTransition } from 'react'
import { repeatOrder } from '@/lib/actions/account'
import { useCart } from '@/components/cart/store'
import { Button } from '@/components/ui/Button'
import { toast } from '@/components/ui/Toast'
import { useValidationMessage } from '@/components/forms/useValidation'

/** «Повторить заказ»: позиции снова в корзину (цены пересчитает сервер), открываем мини-корзину */
export function RepeatOrderButton({ number }: { number: string }) {
  const t = useTranslations('account')
  const tv = useValidationMessage()
  const locale = useLocale()
  const [pending, startTransition] = useTransition()

  const onClick = () =>
    startTransition(async () => {
      try {
        const res = await repeatOrder(number, locale)
        if (!res.ok) {
          toast({ message: tv(res.error ?? 'generic'), tone: 'error' })
          return
        }
        const cart = useCart.getState()
        for (const line of res.data.lines) cart.add(line)
        if (res.data.lines.length) cart.openMiniCart()
        toast({
          message: res.data.skipped ? t('repeatSkipped', { count: res.data.skipped }) : t('repeated'),
          tone: res.data.lines.length ? 'success' : 'error',
        })
      } catch {
        toast({ message: tv('network'), tone: 'error' })
      }
    })

  return (
    <Button variant="secondary" onClick={onClick} loading={pending}>
      <RotateCcw aria-hidden className="size-5" strokeWidth={1.5} />
      {t('repeat')}
    </Button>
  )
}
