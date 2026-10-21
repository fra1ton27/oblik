'use client'

import { ChevronDown } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import { useLenis } from '@/components/motion/SmoothScroll'
import { cn } from '@/lib/cn'

type Item = { id: string; text: string; level: 2 | 3 }

/**
 * Оглавление юридических страниц: на десктопе липкий список с подсветкой текущего раздела,
 * на мобайле свёрнутый блок «Содержание». Переход по якорю — через Lenis, если он включён.
 */
export function TocNav({ items }: { items: Item[] }) {
  const t = useTranslations('pages')
  const lenis = useLenis()
  const [active, setActive] = useState<string | null>(items[0]?.id ?? null)

  useEffect(() => {
    const nodes = items.map((i) => document.getElementById(i.id)).filter((n): n is HTMLElement => Boolean(n))
    if (!nodes.length) return
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]) setActive(visible[0].target.id)
      },
      { rootMargin: '-15% 0px -70% 0px' },
    )
    nodes.forEach((n) => io.observe(n))
    return () => io.disconnect()
  }, [items])

  if (!items.length) return null

  const go = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    const target = document.getElementById(id)
    if (!target) return
    e.preventDefault()
    const offset = -(parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 64) - 24
    if (lenis) lenis.scrollTo(target, { offset })
    else window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY + offset, behavior: 'smooth' })
    history.replaceState(null, '', `#${id}`)
    target.focus({ preventScroll: true })
    setActive(id)
  }

  const list = (
    <ol className="flex flex-col gap-1">
      {items.map((i) => (
        <li key={i.id} className={i.level === 3 ? 'pl-4' : undefined}>
          <a
            href={`#${i.id}`}
            onClick={(e) => go(e, i.id)}
            aria-current={active === i.id ? 'location' : undefined}
            className={cn(
              'block rounded-[10px] px-3 py-2 text-[14px] leading-snug transition-colors',
              active === i.id ? 'bg-paper font-semibold text-ink' : 'text-ink-soft hover:text-ink',
            )}
          >
            {i.text}
          </a>
        </li>
      ))}
    </ol>
  )

  return (
    <nav aria-label={t('toc')}>
      <details className="group rounded-card bg-paper lg:hidden">
        <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between px-4 text-[15px] font-semibold">
          {t('toc')}
          <ChevronDown aria-hidden className="size-5 transition-transform group-open:rotate-180" strokeWidth={1.5} />
        </summary>
        <div className="px-1 pb-3">{list}</div>
      </details>
      <div className="hidden lg:block">
        <p className="t-caption mb-3 px-3 text-ink-soft">{t('toc')}</p>
        {list}
      </div>
    </nav>
  )
}
