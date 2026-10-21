'use client'

import { Heart, LayoutGrid, LogOut, MapPin, MessageSquareText, Package, UserRound } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useEffect, useRef, useState, useTransition } from 'react'
import { usePathname, useRouter } from '@/i18n/navigation'
import type { StaticPathname } from '@/i18n/routing'
import { TransitionLink } from '@/components/motion/TransitionLink'
import { Dialog } from '@/components/ui/Dialog'
import { Button } from '@/components/ui/Button'
import { toast } from '@/components/ui/Toast'
import { useWishlist } from './wishlistStore'
import { useSession } from './sessionStore'
import { cn } from '@/lib/cn'

const items: Array<{ href: StaticPathname; key: 'overview' | 'orders' | 'wishlist' | 'inquiries' | 'addresses' | 'profile'; icon: typeof Package }> = [
  { href: '/account', key: 'overview', icon: LayoutGrid },
  { href: '/account/orders', key: 'orders', icon: Package },
  { href: '/account/wishlist', key: 'wishlist', icon: Heart },
  { href: '/account/inquiries', key: 'inquiries', icon: MessageSquareText },
  { href: '/account/addresses', key: 'addresses', icon: MapPin },
  { href: '/account/profile', key: 'profile', icon: UserRound },
]

function isActive(pathname: string, href: string) {
  return href === '/account' ? pathname === href : pathname === href || pathname.startsWith(`${href}/`)
}

/**
 * Разделы кабинета (раздел 9.3 ТЗ): на десктопе левое меню, на мобайле горизонтальная лента чипов,
 * активный чип прокручивается в видимую область.
 */
export function AccountNav({ name, email }: { name: string; email: string }) {
  const t = useTranslations('account')
  const pathname = usePathname()
  const stripRef = useRef<HTMLUListElement>(null)
  const [confirm, setConfirm] = useState(false)

  useEffect(() => {
    const strip = stripRef.current
    const active = strip?.querySelector<HTMLElement>('[aria-current="page"]')
    if (!strip || !active || strip.scrollWidth <= strip.clientWidth) return
    strip.scrollTo({ left: active.offsetLeft - (strip.clientWidth - active.offsetWidth) / 2, behavior: 'auto' })
  }, [pathname])

  return (
    <nav aria-label={t('navLabel')}>
      <div className="mb-6 hidden lg:block">
        <p className="t-h3 break-words">{name}</p>
        <p className="t-small mt-1 font-normal break-all text-ink-soft">{email}</p>
      </div>

      {/* мобайл: лента чипов */}
      <ul ref={stripRef} className="no-scrollbar -mx-[var(--page-pad)] flex gap-2 overflow-x-auto px-[var(--page-pad)] pb-1 lg:hidden">
        {items.map((it) => {
          const active = isActive(pathname, it.href)
          return (
            <li key={it.key} className="shrink-0">
              <TransitionLink
                href={it.href}
                aria-current={active ? 'page' : undefined}
                className={cn('inline-flex h-11 items-center gap-2 rounded-pill px-4 text-[14px] font-semibold whitespace-nowrap transition-colors', active ? 'bg-ink text-milk' : 'border border-line bg-paper hover:bg-milk')}
              >
                {t(`nav.${it.key}`)}
              </TransitionLink>
            </li>
          )
        })}
        <li className="shrink-0">
          <button type="button" onClick={() => setConfirm(true)} className="inline-flex h-11 items-center gap-2 rounded-pill border border-line bg-paper px-4 text-[14px] font-semibold whitespace-nowrap hover:bg-milk">
            {t('nav.logout')}
          </button>
        </li>
      </ul>

      {/* десктоп: вертикальное меню */}
      <ul className="hidden flex-col gap-1 lg:flex">
        {items.map((it) => {
          const active = isActive(pathname, it.href)
          return (
            <li key={it.key}>
              <TransitionLink
                href={it.href}
                aria-current={active ? 'page' : undefined}
                className={cn('flex min-h-11 items-center gap-3 rounded-pill px-4 text-[15px] font-semibold transition-colors', active ? 'bg-ink text-milk' : 'hover:bg-paper')}
              >
                <it.icon aria-hidden className="size-5 shrink-0" strokeWidth={1.5} />
                {t(`nav.${it.key}`)}
              </TransitionLink>
            </li>
          )
        })}
        <li className="mt-4 border-t border-line pt-4">
          <button type="button" onClick={() => setConfirm(true)} className="flex min-h-11 w-full items-center gap-3 rounded-pill px-4 text-[15px] font-semibold text-ink-soft transition-colors hover:bg-paper hover:text-ink">
            <LogOut aria-hidden className="size-5 shrink-0" strokeWidth={1.5} />
            {t('nav.logout')}
          </button>
        </li>
      </ul>

      <LogoutDialog open={confirm} onClose={() => setConfirm(false)} />
    </nav>
  )
}

/**
 * Выход с подтверждением. REST-выход Payload закрывает сессию на сервере и стирает куку.
 * Гостевая корзина остаётся на устройстве, избранное аккаунта убираем (чужой компьютер).
 */
function LogoutDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const t = useTranslations('account')
  const tc = useTranslations('common')
  const tv = useTranslations('validation')
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  const logout = () =>
    startTransition(async () => {
      try {
        const res = await fetch('/api/customers/logout', { method: 'POST', credentials: 'include' })
        if (!res.ok && res.status !== 400) throw new Error(String(res.status))
        useSession.getState().set(null)
        useWishlist.getState().clear()
        router.replace('/')
        router.refresh()
      } catch {
        toast({ message: tv('network'), tone: 'error' })
      }
    })

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={t('logoutTitle')}
      variant="modal"
      width={420}
      footer={
        <div className="flex flex-wrap justify-end gap-3">
          <Button variant="secondary" onClick={onClose}>
            {tc('cancel')}
          </Button>
          <Button onClick={logout} loading={pending}>
            {t('logoutConfirm')}
          </Button>
        </div>
      }
    >
      <p className="t-body text-ink-soft">{t('logoutText')}</p>
    </Dialog>
  )
}
