'use client'

import { MessageCircle, Phone, X } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { usePathname } from '@/i18n/navigation'
import { gsap, prefersReducedMotion } from '@/components/motion/gsap'
import { TransitionLink } from '@/components/motion/TransitionLink'
import { usePageTransition } from '@/components/motion/PageTransition'
import { Terrace } from '@/components/shapes'
import { LanguageSwitcher } from './LanguageSwitcher'
import { activeNavKey, type NavItem } from './nav'
import { cn } from '@/lib/cn'

export type MenuContacts = {
  phone: string
  messengers: Array<{ label: string; href: string }>
}

type Props = {
  open: boolean
  onClose: () => void
  items: NavItem[]
  contacts: MenuContacts
  isAuthed?: boolean
}

/**
 * Полноэкранное меню (lavender, ступенчатый фон): крупные ссылки Unbounded 32 px выезжают каскадом,
 * внизу язык, телефон и мессенджеры. Фокус внутри (<dialog>), скролл страницы заблокирован,
 * закрытие по Esc и по системной кнопке «Назад» (запись в history).
 */
export function MobileMenu({ open, onClose, items, contacts, isAuthed }: Props) {
  const t = useTranslations('nav')
  const tc = useTranslations('common')
  const ref = useRef<HTMLDialogElement>(null)
  const pathname = usePathname()
  const transition = usePageTransition()
  const pushed = useRef(false)
  const pendingHref = useRef<string | null>(null)
  const active = activeNavKey(pathname)

  // открытие / закрытие
  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) {
      dialog.showModal()
      document.documentElement.classList.add('scroll-locked')
      // сохраняем состояние роутера Next, иначе «Назад» перезагрузит страницу
      window.history.pushState({ ...window.history.state, oblikMenu: true }, '')
      pushed.current = true
      if (!prefersReducedMotion()) {
        gsap.fromTo(dialog, { clipPath: 'inset(0% 0% 100% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.5, ease: 'power3.inOut' })
        gsap.fromTo(
          dialog.querySelectorAll('[data-menu-link]'),
          { yPercent: 110 },
          { yPercent: 0, duration: 0.7, ease: 'soft', stagger: 0.06, delay: 0.15 },
        )
        gsap.fromTo(dialog.querySelectorAll('[data-menu-fade]'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4, delay: 0.45 })
      }
    }
    if (!open && dialog.open) {
      const done = () => {
        dialog.close()
        document.documentElement.classList.remove('scroll-locked')
        gsap.set(dialog, { clearProps: 'clipPath' })
      }
      if (prefersReducedMotion()) done()
      else gsap.to(dialog, { clipPath: 'inset(0% 0% 100% 0%)', duration: 0.4, ease: 'power3.inOut', onComplete: done })
    }
  }, [open])

  // «Назад» системы закрывает меню
  useEffect(() => {
    const onPop = () => {
      if (!pushed.current) return
      pushed.current = false
      onClose()
      const href = pendingHref.current
      pendingHref.current = null
      if (href) transition?.navigate(href)
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [onClose, transition])

  useEffect(() => () => document.documentElement.classList.remove('scroll-locked'), [])

  function requestClose() {
    if (pushed.current) window.history.back()
    else onClose()
  }

  // Esc
  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    const onCancel = (e: Event) => {
      e.preventDefault()
      requestClose()
    }
    dialog.addEventListener('cancel', onCancel)
    return () => dialog.removeEventListener('cancel', onCancel)
  })

  // Клик по ссылке: сначала убираем запись меню из history, потом переходим
  function onLinkClick(e: React.MouseEvent<HTMLAnchorElement>) {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
    e.preventDefault()
    const url = new URL(e.currentTarget.href)
    const href = url.pathname + url.search
    if (url.pathname === window.location.pathname) return requestClose()
    pendingHref.current = href
    requestClose()
  }

  const extra: NavItem[] = [
    { key: 'delivery', href: '/delivery', label: t('delivery') },
    { key: 'wishlist', href: '/wishlist', label: t('wishlist') },
    { key: 'account', href: isAuthed ? '/account' : '/login', label: isAuthed ? t('account') : t('login') },
  ]

  return (
    <dialog
      ref={ref}
      aria-label={t('menuTitle')}
      className="fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none overflow-hidden border-0 bg-lavender p-0 text-ink backdrop:bg-transparent"
    >
      <div className="relative flex h-full flex-col overflow-y-auto" data-lenis-prevent>
        <Terrace color="lavender" tone steps={6} className="pointer-events-none absolute right-0 bottom-0 w-[90%] max-w-[640px] opacity-90" />
        <div className="container-site relative flex h-[var(--header-h)] shrink-0 items-center justify-end" style={{ marginTop: 'env(safe-area-inset-top)' }}>
          <button
            type="button"
            onClick={requestClose}
            className="inline-flex size-11 items-center justify-center rounded-pill bg-paper"
            aria-label={tc('closeMenu')}
            autoFocus
          >
            <X aria-hidden className="size-6" strokeWidth={1.5} />
          </button>
        </div>
        <nav aria-label={t('mainLabel')} className="container-site relative flex-1 pt-4">
          <ul className="flex flex-col gap-1">
            {[...items, ...extra].map((item) => (
              <li key={item.key} className="overflow-hidden">
                <TransitionLink
                  href={item.href}
                  data-menu-link
                  onClick={onLinkClick}
                  aria-current={active === item.key ? 'page' : undefined}
                  className={cn(
                    'inline-flex min-h-12 items-center font-display text-[32px] leading-[1.15] tracking-[-0.02em]',
                    active === item.key && 'underline decoration-[1.5px] underline-offset-[6px]',
                  )}
                >
                  {item.label}
                </TransitionLink>
              </li>
            ))}
          </ul>
        </nav>
        <div data-menu-fade className="container-site relative flex flex-col gap-4 pt-8" style={{ paddingBottom: 'calc(24px + env(safe-area-inset-bottom))' }}>
          <LanguageSwitcher size="md" />
          <div className="flex flex-wrap gap-2">
            <a href={`tel:${contacts.phone.replace(/[^\d+]/g, '')}`} className="inline-flex h-11 items-center gap-2 rounded-pill bg-ink px-5 text-[15px] font-semibold text-milk">
              <Phone aria-hidden className="size-4" strokeWidth={1.5} />
              {contacts.phone}
            </a>
            {contacts.messengers.map((m) => (
              <a
                key={m.href}
                href={m.href}
                target="_blank"
                rel="noopener"
                className="inline-flex h-11 items-center gap-2 rounded-pill bg-paper px-4 text-[15px] font-semibold"
              >
                <MessageCircle aria-hidden className="size-4" strokeWidth={1.5} />
                {m.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </dialog>
  )
}
