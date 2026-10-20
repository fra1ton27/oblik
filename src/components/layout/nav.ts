import type { StaticPathname } from '@/i18n/routing'

/** Пункты основного меню: внутренние маршруты + ключ подписи в неймспейсе nav. В проде их задаёт global header. */
export type NavItem = { key: string; href: StaticPathname; label: string }

export const mainNav: Array<{ key: string; href: StaticPathname; labelKey: 'catalog' | 'collections' | 'custom' | 'about' | 'contact' }> = [
  { key: 'catalog', href: '/catalog', labelKey: 'catalog' },
  { key: 'collections', href: '/collections', labelKey: 'collections' },
  { key: 'custom', href: '/custom', labelKey: 'custom' },
  { key: 'about', href: '/about', labelKey: 'about' },
  { key: 'contact', href: '/contact', labelKey: 'contact' },
]

/** Какой пункт меню подсветить по внутреннему pathname */
export function activeNavKey(pathname: string): string | null {
  if (pathname.startsWith('/catalog') || pathname.startsWith('/furniture')) return 'catalog'
  if (pathname.startsWith('/collections')) return 'collections'
  if (pathname.startsWith('/custom')) return 'custom'
  if (pathname.startsWith('/about')) return 'about'
  if (pathname.startsWith('/contact')) return 'contact'
  return null
}
