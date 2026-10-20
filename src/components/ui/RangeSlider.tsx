'use client'

import { useId } from 'react'
import { cn } from '@/lib/cn'
import { fieldClasses } from './Field'

type Props = {
  min: number
  max: number
  value: [number, number]
  onChange: (value: [number, number]) => void
  step?: number
  labels: { min: string; max: string }
  format?: (v: number) => string
}

/** Двухсторонний слайдер + поля ввода: два нативных range (клавиатура из коробки) поверх общей дорожки */
export function RangeSlider({ min, max, value, onChange, step = 1, labels, format }: Props) {
  const id = useId()
  const [lo, hi] = value
  const span = Math.max(1, max - min)
  const left = ((lo - min) / span) * 100
  const right = ((hi - min) / span) * 100
  const thumb =
    'pointer-events-none absolute inset-x-0 top-1/2 h-0 w-full -translate-y-1/2 appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:size-6 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-ink [&::-webkit-slider-thumb]:bg-paper [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:size-6 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-ink [&::-moz-range-thumb]:bg-paper focus-visible:[&::-webkit-slider-thumb]:outline-2 focus-visible:[&::-webkit-slider-thumb]:outline-offset-2 focus-visible:[&::-webkit-slider-thumb]:outline-lavender-600'

  return (
    <div className="flex flex-col gap-4">
      <div className="relative h-11">
        <span className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 rounded-pill bg-line" aria-hidden />
        <span className="absolute top-1/2 h-1 -translate-y-1/2 rounded-pill bg-ink" style={{ left: `${left}%`, right: `${100 - right}%` }} aria-hidden />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={lo}
          aria-label={labels.min}
          aria-valuetext={format?.(lo)}
          onChange={(e) => onChange([Math.min(Number(e.target.value), hi - step), hi])}
          className={cn(thumb, 'z-10')}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={hi}
          aria-label={labels.max}
          aria-valuetext={format?.(hi)}
          onChange={(e) => onChange([lo, Math.max(Number(e.target.value), lo + step)])}
          className={cn(thumb, 'z-20')}
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <label htmlFor={`${id}-lo`} className="flex flex-col gap-1">
          <span className="t-small text-ink-soft">{labels.min}</span>
          <input
            id={`${id}-lo`}
            type="number"
            inputMode="numeric"
            min={min}
            max={hi}
            value={lo}
            onChange={(e) => onChange([Math.max(min, Math.min(Number(e.target.value) || min, hi)), hi])}
            className={cn(fieldClasses, 'tabular-nums')}
          />
        </label>
        <label htmlFor={`${id}-hi`} className="flex flex-col gap-1">
          <span className="t-small text-ink-soft">{labels.max}</span>
          <input
            id={`${id}-hi`}
            type="number"
            inputMode="numeric"
            min={lo}
            max={max}
            value={hi}
            onChange={(e) => onChange([lo, Math.min(max, Math.max(Number(e.target.value) || max, lo))])}
            className={cn(fieldClasses, 'tabular-nums')}
          />
        </label>
      </div>
    </div>
  )
}
