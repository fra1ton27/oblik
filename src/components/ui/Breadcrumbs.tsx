import { ChevronRight } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import type { ComponentProps } from 'react'
import { TransitionLink } from '@/components/motion/TransitionLink'
import type { Link } from '@/i18n/navigation'
import { cn } from '@/lib/cn'

export type Crumb = { label: string; href?: ComponentProps<typeof Link>['href'] }

/** Хлебные крошки. Разметка BreadcrumbList — в components/seo/JsonLd. */
export async function Breadcrumbs({ items, className, tone = 'ink' }: { items: Crumb[]; className?: string; tone?: 'ink' | 'milk' }) {
  const t = await getTranslations('common')
  return (
    <nav aria-label={t('breadcrumbs')} className={cn('t-small', className)}>
      <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
        {items.map((item, i) => {
          const last = i === items.length - 1
          return (
            <li key={i} className="inline-flex items-center gap-1.5">
              {item.href && !last ? (
                <TransitionLink
                  href={item.href}
                  className={cn(
                    'underline-offset-4 hover:underline',
                    tone === 'ink' ? 'text-ink-soft hover:text-ink' : 'text-milk/80 hover:text-milk',
                  )}
                >
                  {item.label}
                </TransitionLink>
              ) : (
                <span aria-current={last ? 'page' : undefined} className={tone === 'ink' ? 'text-ink' : 'text-milk'}>
                  {item.label}
                </span>
              )}
              {!last && <ChevronRight aria-hidden className="size-3.5 text-ink-soft" strokeWidth={1.5} />}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
