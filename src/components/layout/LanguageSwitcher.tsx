'use client'

import { useParams } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { useTransition } from 'react'
import { Link, usePathname, useRouter } from '@/i18n/navigation'
import { localeLabels, routing, type Locale } from '@/i18n/routing'
import { SegmentedPill } from '@/components/ui/SegmentedPill'
import { useAlternatesStore } from './alternates'
import { cn } from '@/lib/cn'

type Props = {
  className?: string
  tone?: 'light' | 'dark'
  size?: 'sm' | 'md'
}

/** Сегментированная пилюля RU · EN · SR. Сохраняет сущность и query, корзина живёт в localStorage. */
export function LanguageSwitcher({ className, tone = 'light', size = 'sm' }: Props) {
  const t = useTranslations('common')
  const locale = useLocale() as Locale
  const pathname = usePathname()
  const currentParams = useParams() as Record<string, string | string[]>
  const alternates = useAlternatesStore((s) => s.params)
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  function paramsFor(target: Locale) {
    const { locale: _ignored, ...rest } = currentParams
    return { ...(rest as Record<string, string>), ...(alternates?.[target] ?? {}) }
  }

  function go(event: React.MouseEvent, target: Locale) {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return
    event.preventDefault()
    if (target === locale) return
    const query = Object.fromEntries(new URLSearchParams(window.location.search))
    startTransition(() => {
      router.replace(
        // @ts-expect-error — pathname и params согласованы: это текущий маршрут
        { pathname, params: paramsFor(target), query },
        { locale: target, scroll: false },
      )
    })
  }

  return (
    <nav aria-label={t('languageSwitcher')} className={cn(className)} aria-busy={pending}>
      <SegmentedPill
        tone={tone}
        size={size}
        activeKey={locale}
        items={routing.locales.map((l) => ({
          key: l,
          render: (props) => (
            <Link
              {...props}
              // @ts-expect-error — см. выше
              href={{ pathname, params: paramsFor(l) }}
              locale={l}
              hrefLang={l}
              lang={l === 'sr' ? 'sr-Latn' : l}
              aria-current={l === locale ? 'true' : undefined}
              aria-label={localeLabels[l].name}
              onClick={(e) => go(e, l)}
              prefetch={false}
            >
              {localeLabels[l].short}
            </Link>
          ),
        }))}
      />
    </nav>
  )
}
