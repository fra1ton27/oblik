import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/cn'

export type ButtonVariant = 'primary' | 'secondary' | 'soft' | 'ghost' | 'inverse' | 'icon'
export type ButtonSize = 'sm' | 'md' | 'lg'

type StyleOptions = {
  variant?: ButtonVariant
  size?: ButtonSize
  fullWidth?: boolean
  className?: string
}

/**
 * Стили кнопки — общие для <button> и ссылок (Link).
 * Hover: заливка «протекает» слева направо (псевдоэлемент scaleX 0 → 1).
 */
export function buttonClasses({ variant = 'primary', size = 'md', fullWidth, className }: StyleOptions = {}) {
  const base = cn(
    'group/btn relative isolate inline-flex select-none items-center justify-center gap-2 overflow-hidden',
    'rounded-pill font-semibold whitespace-nowrap',
    'transition-[color,background-color,border-color,opacity,transform] duration-200 ease-soft',
    'before:absolute before:inset-0 before:-z-10 before:origin-left before:scale-x-0 before:rounded-[inherit]',
    'before:transition-transform before:duration-[400ms] before:ease-soft',
    'hover-device:hover:before:scale-x-100 active:scale-[0.98]',
    'disabled:pointer-events-none disabled:opacity-45 aria-disabled:pointer-events-none aria-disabled:opacity-45',
    'data-[loading=true]:pointer-events-none',
  )
  const sizes: Record<ButtonSize, string> = {
    sm: 'h-10 min-w-10 px-4 text-[14px]',
    md: 'h-12 min-w-12 px-6 text-[15px]',
    lg: 'h-14 min-w-14 px-8 text-[16px]',
  }
  const iconSizes: Record<ButtonSize, string> = {
    sm: 'size-10 text-[14px]',
    md: 'size-12',
    lg: 'size-14',
  }
  const variants: Record<ButtonVariant, string> = {
    primary: 'bg-ink text-milk before:bg-plum',
    secondary: 'border border-ink text-ink hover-device:hover:text-milk before:bg-ink',
    soft: 'bg-lavender text-ink before:bg-paper/60',
    ghost: 'text-ink before:bg-ink/6',
    inverse: 'bg-milk text-ink before:bg-lavender',
    icon: 'border border-line bg-paper text-ink before:bg-lavender',
  }
  return cn(
    base,
    /\b(flex-1|shrink|grow)\b/.test(className ?? '') ? '' : 'shrink-0',
    variant === 'icon' ? iconSizes[size] : sizes[size],
    variants[variant],
    fullWidth && 'w-full',
    className,
  )
}

type ButtonProps = React.ComponentProps<'button'> &
  StyleOptions & {
    loading?: boolean
    loadingLabel?: string
    iconLeft?: React.ReactNode
    iconRight?: React.ReactNode
  }

export function Button({
  variant,
  size,
  fullWidth,
  className,
  loading,
  loadingLabel,
  iconLeft,
  iconRight,
  children,
  type = 'button',
  disabled,
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={buttonClasses({ variant, size, fullWidth, className })}
      disabled={disabled || loading}
      data-loading={loading ? 'true' : undefined}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading ? (
        <Loader2 aria-hidden className="size-[1.1em] animate-spin" strokeWidth={1.5} />
      ) : (
        iconLeft
      )}
      {loading && loadingLabel ? <span>{loadingLabel}</span> : children}
      {!loading && iconRight}
    </button>
  )
}
