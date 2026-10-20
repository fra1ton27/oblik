'use client'

import { Heart, Menu, ShoppingBag, User } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import { usePathname } from '@/i18n/navigation'
import { TransitionLink } from '@/components/motion/TransitionLink'
import { gsap, ScrollTrigger, useGSAP } from '@/components/motion/gsap'
import { RollingNumber } from '@/components/motion/RollingNumber'
import { useIsClient } from '@/components/motion/useIsClient'
import { SegmentedPill } from '@/components/ui/SegmentedPill'
import { cartCount, useCart } from '@/components/cart/store'
import { useWishlist } from '@/components/account/wishlistStore'
import { useSession } from '@/components/account/sessionStore'
import { LanguageSwitcher } from './LanguageSwitcher'
import { MobileMenu, type MenuContacts } from './MobileMenu'
import { Logo } from './Logo'
import { activeNavKey, type NavItem } from './nav'
import { cn } from '@/lib/cn'

type Props = {
  brand: string
  items: NavItem[]
  contacts: MenuContacts
  /** На оформлении заказа шапка не прячется при скролле */
  sticky?: boolean
}

// без display: его задаёт каждое место использования (иначе конфликт hidden / inline-flex)
const iconBtn =
  'relative size-11 items-center justify-center rounded-pill transition-colors duration-200 hover-device:hover:bg-ink/6'

/**
 * Шапка: 56 px на мобайле (логотип, избранное, корзина, бургер), на десктопе — навигация-пилюля
 * с переезжающей плашкой, язык, кабинет. Прячется при скролле вниз, появляется при скролле вверх.
 */
export function Header({ brand, items, contacts, sticky }: Props) {
  const t = useTranslations('nav')
  const pathname = usePathname()
  const ref = useRef<HTMLElement>(null)
  const isClient = useIsClient()
  const lines = useCart((s) => s.lines)
  const openMiniCart = useCart((s) => s.openMiniCart)
  const wishCount = useWishlist((s) => s.ids.length)
  const [menuOpen, setMenuOpen] = useState(false)
  const count = isClient ? cartCount(lines) : 0
  const favs = isClient ? wishCount : 0
  const active = activeNavKey(pathname)
  const isAuthed = Boolean(useSession((s) => s.customer))
  const loadSession = useSession((s) => s.load)
  useEffect(() => {
    void loadSession()
  }, [loadSession])

  useGSAP(
    () => {
      const el = ref.current
      if (!el || sticky) return
      let hidden = false
      const st = ScrollTrigger.create({
        start: 0,
        end: 'max',
        onUpdate(self) {
          const y = self.scroll()
          el.dataset.scrolled = y > 8 ? 'true' : 'false'
          const shouldHide = self.direction === 1 && y > 160 && !el.matches(':focus-within')
          if (shouldHide !== hidden) {
            hidden = shouldHide
            gsap.to(el, { yPercent: shouldHide ? -110 : 0, duration: 0.4, ease: 'power3.out', overwrite: true })
          }
        },
      })
      return () => st.kill()
    },
    { scope: ref, dependencies: [sticky] },
  )

  return (
    <>
      <header
        ref={ref}
        data-scrolled="false"
        className={cn(
          'fixed inset-x-0 top-0 z-50 border-b border-transparent bg-milk/88 backdrop-blur-md transition-[border-color] duration-200',
          'data-[scrolled=true]:border-line',
        )}
        style={{ paddingTop: 'env(safe-area-inset-top)' }}
      >
        <div className="container-site flex h-[var(--header-h)] items-center justify-between gap-4">
          <TransitionLink href="/" className="-ml-1 inline-flex min-h-11 items-center rounded-pill px-1" aria-label={t('homeLink', { brand })}>
            <Logo name={brand} />
          </TransitionLink>

          <nav aria-label={t('mainLabel')} className="hidden lg:block">
            <SegmentedPill
              activeKey={active}
              items={items.map((item) => ({
                key: item.key,
                render: (props) => (
                  <TransitionLink {...props} href={item.href} aria-current={active === item.key ? 'page' : undefined}>
                    {item.label}
                  </TransitionLink>
                ),
              }))}
            />
          </nav>

          <div className="flex items-center gap-1 md:gap-2">
            <LanguageSwitcher className="mr-2 hidden lg:block" />
            <TransitionLink href="/wishlist" className={cn(iconBtn, 'inline-flex')} aria-label={t('wishlistCount', { count: favs })}>
              <Heart aria-hidden className="size-[22px]" strokeWidth={1.5} />
              {favs > 0 && <CountBadge value={favs} />}
            </TransitionLink>
            <TransitionLink
              href={isAuthed ? '/account' : '/login'}
              className={cn(iconBtn, 'hidden md:inline-flex')}
              aria-label={isAuthed ? t('account') : t('login')}
            >
              <User aria-hidden className="size-[22px]" strokeWidth={1.5} />
            </TransitionLink>
            <button
              type="button"
              data-cart-target
              onClick={openMiniCart}
              className={cn(iconBtn, 'inline-flex')}
              aria-label={t('cartCount', { count })}
              aria-haspopup="dialog"
            >
              <ShoppingBag aria-hidden className="size-[22px]" strokeWidth={1.5} />
              {count > 0 && <CountBadge value={count} />}
            </button>
            <button
              type="button"
              className={cn(iconBtn, 'inline-flex lg:hidden')}
              onClick={() => setMenuOpen(true)}
              aria-label={t('menuTitle')}
              aria-expanded={menuOpen}
              aria-haspopup="dialog"
            >
              <Menu aria-hidden className="size-6" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </header>
      <div aria-hidden style={{ height: 'calc(var(--header-h) + env(safe-area-inset-top))' }} />
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} items={items} contacts={contacts} isAuthed={isAuthed} />
    </>
  )
}

function CountBadge({ value }: { value: number }) {
  return (
    <span
      aria-hidden
      className="absolute top-0.5 right-0.5 inline-flex h-5 min-w-5 items-center justify-center rounded-pill bg-ink px-1 text-[11px] leading-none font-bold text-milk"
    >
      <RollingNumber value={String(value)} />
    </span>
  )
}
