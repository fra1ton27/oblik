import { HandCircle } from '@/components/shapes'
import { site } from '@/config/site'
import { cn } from '@/lib/cn'

/**
 * Разметка подписи разработчика без хуков: годится и для серверного подвала, и для клиентских
 * страниц ошибок. template получает маркер вместо ника; строку делим по нему и вставляем ссылку.
 */
export function CreditLine({ template, className, tone = 'dark' }: { template: (handle: string) => string; className?: string; tone?: 'dark' | 'light' }) {
  const MARK = '\u0000'
  const [before, after = ''] = template(MARK).split(MARK)
  return (
    <p className={cn('text-[13px] leading-snug', tone === 'dark' ? 'text-milk/85' : 'text-ink-soft', className)} data-developer-credit>
      {before}
      <a
        href={site.developer.url}
        target="_blank"
        rel="noopener"
        className={cn(
          'group relative inline-flex min-h-11 items-center px-1.5 font-semibold underline-offset-4 hover:underline',
          tone === 'dark' ? 'text-milk' : 'text-ink',
        )}
        data-developer-handle
      >
        <HandCircle className="-inset-x-1 -inset-y-0.5 h-[calc(100%+4px)] w-[calc(100%+8px)]" color={tone === 'dark' ? 'lavender' : 'lavender-600'} ratio={2.6} />
        {site.developer.handle}
      </a>
      {after}
    </p>
  )
}
