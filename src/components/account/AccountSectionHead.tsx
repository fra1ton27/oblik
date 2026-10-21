import { ArrowRight } from 'lucide-react'
import type { StaticPathname } from '@/i18n/routing'
import { TransitionLink } from '@/components/motion/TransitionLink'

/** Заголовок блока в кабинете со ссылкой «Все …» справа */
export function AccountSectionHead({ id, title, href, more }: { id: string; title: string; href?: StaticPathname; more?: string }) {
  return (
    <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
      <h2 id={id} className="t-h3">
        {title}
      </h2>
      {href && more && (
        <TransitionLink href={href} className="inline-flex min-h-11 items-center gap-1.5 text-[14px] font-semibold underline-offset-4 hover:underline">
          {more}
          <ArrowRight aria-hidden className="size-4" strokeWidth={1.5} />
        </TransitionLink>
      )}
    </div>
  )
}

/** Заголовок страницы кабинета */
export function AccountPageHead({ title, lead, children }: { title: React.ReactNode; lead?: React.ReactNode; children?: React.ReactNode }) {
  return (
    <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div className="min-w-0">
        <h1 className="t-h1 break-words">{title}</h1>
        {lead && <p className="t-lead mt-3 text-ink-soft">{lead}</p>}
      </div>
      {children}
    </header>
  )
}
