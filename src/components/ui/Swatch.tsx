'use client'

import { Check } from 'lucide-react'
import { cn } from '@/lib/cn'

type SwatchProps = {
  /** CSS-цвет свотча: var(--color-…) или цвет из CMS (свотч материала) */
  color?: string
  image?: string
  label: string
  selected?: boolean
  disabled?: boolean
  size?: 'xs' | 'sm' | 'md'
  onSelect?: () => void
  /** radio внутри radiogroup или просто декоративный кружок */
  as?: 'radio' | 'static'
  name?: string
  value?: string
}

/** Свотч ткани или отделки: кружок с текстурой/цветом, у выбранного — кольцо и галочка */
export function Swatch({ color, image, label, selected, disabled, size = 'md', onSelect, as = 'radio', name, value }: SwatchProps) {
  const dims = { xs: 'size-4', sm: 'size-7', md: 'size-10' }[size]
  const dot = (
    <span
      className={cn(
        'relative inline-flex shrink-0 items-center justify-center rounded-full border border-ink/15 bg-cover bg-center',
        dims,
      )}
      style={{ backgroundColor: color, backgroundImage: image ? `url(${image})` : undefined }}
    >
      {selected && size !== 'xs' && (
        <Check aria-hidden className="size-4 text-paper mix-blend-difference" strokeWidth={2} />
      )}
    </span>
  )

  if (as === 'static') {
    return (
      <span title={label} className="inline-flex">
        <span className="sr-only">{label}</span>
        {dot}
      </span>
    )
  }

  return (
    <label
      title={label}
      className={cn(
        'relative inline-flex size-11 cursor-pointer items-center justify-center rounded-full',
        'transition-[box-shadow] duration-200',
        selected ? 'ring-[1.5px] ring-ink ring-offset-2 ring-offset-milk' : 'hover-device:hover:ring-[1.5px] hover-device:hover:ring-line',
        'has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-4 has-[:focus-visible]:outline-lavender-600',
        disabled && 'cursor-not-allowed opacity-40',
      )}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={!!selected}
        disabled={disabled}
        onChange={() => onSelect?.()}
        className="sr-only"
        aria-label={label}
      />
      {dot}
    </label>
  )
}
