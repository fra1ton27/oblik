'use client'

import { useCallback, type ComponentProps } from 'react'
import { Link } from '@/i18n/navigation'
import { usePageTransition } from './PageTransition'

type Props = ComponentProps<typeof Link> & {
  /** Цвет шторки при переходе (токен палитры следующей страницы) */
  transitionColor?: string
}

/**
 * Ссылка со ступенчатой шторкой: закрытие → router.push → открытие.
 * Не ломает prefetch (это обычный Link), кнопку «Назад», открытие в новой вкладке (модификаторы,
 * средняя кнопка, target) и фокус. Без JS — обычная ссылка.
 */
export function TransitionLink({ onClick, transitionColor, ...props }: Props) {
  const transition = usePageTransition()

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>) => {
      onClick?.(event)
      if (event.defaultPrevented || !transition) return
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
      const anchor = event.currentTarget
      if (anchor.target && anchor.target !== '_self') return
      if (anchor.hasAttribute('download')) return
      const url = new URL(anchor.href, window.location.href)
      if (url.origin !== window.location.origin) return
      // тот же путь (якорь или смена query) — без шторки
      if (url.pathname === window.location.pathname) return
      event.preventDefault()
      transition.navigate(url.pathname + url.search + url.hash, transitionColor)
    },
    [onClick, transition, transitionColor],
  )

  return <Link {...props} onClick={handleClick} />
}
