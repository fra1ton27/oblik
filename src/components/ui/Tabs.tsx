'use client'

import { useId, useRef, useState } from 'react'
import { SegmentedPill } from './SegmentedPill'
import { cn } from '@/lib/cn'

export type TabItem = { id: string; label: React.ReactNode; content: React.ReactNode }

/** Вкладки: role=tablist, стрелки ← → / Home / End, плашка активной вкладки переезжает (Flip) */
export function Tabs({ items, className, defaultTab }: { items: TabItem[]; className?: string; defaultTab?: string }) {
  const [active, setActive] = useState(defaultTab ?? items[0]?.id)
  const base = useId()
  const listRef = useRef<HTMLDivElement>(null)

  function onKeyDown(e: React.KeyboardEvent) {
    const index = items.findIndex((i) => i.id === active)
    let next = index
    if (e.key === 'ArrowRight') next = (index + 1) % items.length
    else if (e.key === 'ArrowLeft') next = (index - 1 + items.length) % items.length
    else if (e.key === 'Home') next = 0
    else if (e.key === 'End') next = items.length - 1
    else return
    e.preventDefault()
    setActive(items[next].id)
    listRef.current?.querySelector<HTMLElement>(`[data-key="${items[next].id}"]`)?.focus()
  }

  return (
    <div className={className}>
      <div ref={listRef} role="tablist" onKeyDown={onKeyDown} className="no-scrollbar max-w-full overflow-x-auto">
        <SegmentedPill
          activeKey={active ?? null}
          items={items.map((item) => ({
            key: item.id,
            render: (props) => (
              <button
                {...props}
                type="button"
                role="tab"
                id={`${base}-tab-${item.id}`}
                aria-selected={item.id === active}
                aria-controls={`${base}-panel-${item.id}`}
                tabIndex={item.id === active ? 0 : -1}
                onClick={() => setActive(item.id)}
              >
                {item.label}
              </button>
            ),
          }))}
        />
      </div>
      {items.map((item) => (
        <div
          key={item.id}
          role="tabpanel"
          id={`${base}-panel-${item.id}`}
          aria-labelledby={`${base}-tab-${item.id}`}
          hidden={item.id !== active}
          tabIndex={0}
          className={cn('mt-6 focus-visible:outline-offset-4')}
        >
          {item.content}
        </div>
      ))}
    </div>
  )
}
