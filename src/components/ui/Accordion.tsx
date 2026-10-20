import { Plus } from 'lucide-react'
import { cn } from '@/lib/cn'

export type AccordionItem = { id: string; title: React.ReactNode; content: React.ReactNode }

/**
 * Аккордеон на нативных <details>/<summary>: работает без JS, с клавиатуры,
 * группа с name="" ведёт себя как эксклюзивный аккордеон.
 */
export function Accordion({
  items,
  className,
  exclusive,
  name,
  defaultOpen,
  tone = 'line',
}: {
  items: AccordionItem[]
  className?: string
  exclusive?: boolean
  name?: string
  defaultOpen?: string
  tone?: 'line' | 'dark'
}) {
  return (
    <div className={cn('flex flex-col', tone === 'line' ? 'border-t border-line' : 'border-t border-milk/20', className)}>
      {items.map((item) => (
        <details
          key={item.id}
          name={exclusive ? (name ?? 'accordion') : undefined}
          open={defaultOpen === item.id}
          className={cn('group/acc', tone === 'line' ? 'border-b border-line' : 'border-b border-milk/20')}
        >
          <summary
            className={cn(
              'flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-4 text-left text-[16px] font-semibold',
              '[&::-webkit-details-marker]:hidden',
            )}
          >
            <span>{item.title}</span>
            <span
              aria-hidden
              className={cn(
                'inline-flex size-9 shrink-0 items-center justify-center rounded-pill border transition-transform duration-[400ms] ease-soft group-open/acc:rotate-45',
                tone === 'line' ? 'border-line' : 'border-milk/30',
              )}
            >
              <Plus className="size-4" strokeWidth={1.5} />
            </span>
          </summary>
          <div className="pb-5 opacity-100 transition-opacity duration-[400ms] ease-soft starting:opacity-0">{item.content}</div>
        </details>
      ))}
    </div>
  )
}
