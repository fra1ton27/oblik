import { X } from 'lucide-react'
import { cn } from '@/lib/cn'

type Tone = 'line' | 'lavender' | 'pistachio' | 'blush' | 'mist' | 'sand' | 'ink' | 'paper' | 'error'

const tones: Record<Tone, string> = {
  line: 'border border-line bg-paper text-ink',
  lavender: 'bg-lavender text-ink',
  pistachio: 'bg-pistachio text-ink',
  blush: 'bg-blush text-ink',
  mist: 'bg-mist text-ink',
  sand: 'bg-sand text-ink',
  ink: 'bg-ink text-milk',
  paper: 'bg-paper text-ink',
  error: 'border border-error text-error bg-paper',
}

/** Статичный тег / бейдж-пилюля */
export function Tag({
  children,
  tone = 'line',
  className,
  size = 'sm',
}: {
  children: React.ReactNode
  tone?: Tone
  className?: string
  size?: 'xs' | 'sm'
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-pill whitespace-nowrap',
        size === 'xs' ? 'h-6 px-2.5 text-[12px] font-semibold' : 'h-8 px-3 text-[13px] font-semibold',
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}

type ChipProps = Omit<React.ComponentProps<'button'>, 'onToggle'> & {
  selected?: boolean
  count?: number
  removable?: boolean
  removeLabel?: string
}

// у этих ролей своё состояние (aria-checked / aria-selected) — aria-pressed на них запрещён
const ROLES_WITH_STATE = new Set(['radio', 'checkbox', 'switch', 'option', 'menuitemradio', 'menuitemcheckbox', 'tab'])

/** Интерактивный чип: фильтры, быстрые варианты. selected → aria-pressed (если роль не задаёт своё состояние) */
export function Chip({ selected, count, removable, removeLabel, children, className, disabled, ...rest }: ChipProps) {
  const ownState = typeof rest.role === 'string' && ROLES_WITH_STATE.has(rest.role)
  return (
    <button
      type="button"
      aria-pressed={removable || ownState ? undefined : selected}
      aria-label={removable && removeLabel ? removeLabel : undefined}
      disabled={disabled}
      className={cn(
        'inline-flex h-11 shrink-0 items-center gap-2 rounded-pill border px-4 text-[14px] font-semibold whitespace-nowrap',
        'transition-colors duration-200 ease-soft',
        selected || removable
          ? 'border-ink bg-ink text-milk'
          : 'border-line bg-paper text-ink hover-device:hover:border-ink',
        'disabled:cursor-not-allowed disabled:opacity-40',
        className,
      )}
      {...rest}
    >
      {children}
      {typeof count === 'number' && (
        <span className={cn('tabular-nums text-[12px]', selected ? 'text-milk/80' : 'text-ink-soft')}>{count}</span>
      )}
      {removable && <X aria-hidden className="size-4" strokeWidth={1.5} />}
    </button>
  )
}

/** Бейдж: маленькая плашка статуса. Цвет не единственный носитель смысла — всегда с текстом. */
export function Badge({ children, tone = 'pistachio', className }: { children: React.ReactNode; tone?: Tone; className?: string }) {
  return (
    <Tag tone={tone} size="xs" className={className}>
      {children}
    </Tag>
  )
}
