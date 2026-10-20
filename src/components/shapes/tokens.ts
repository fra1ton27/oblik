export const shapeColors = [
  'milk',
  'paper',
  'sand',
  'line',
  'ink',
  'ink-soft',
  'plum',
  'lavender',
  'lavender-600',
  'pistachio',
  'blush',
  'mist',
] as const

export type ShapeColor = (typeof shapeColors)[number]

/** Акцентные пастели: цвет подиума и цветных карточек-секций */
export const accentColors = ['lavender', 'pistachio', 'blush', 'mist', 'sand'] as const
export type AccentColor = (typeof accentColors)[number]

export function colorVar(color: ShapeColor): string {
  return `var(--color-${color})`
}

/** «Тон в тон»: цвет фона, слегка притемнённый чернилами */
export function toneOnTone(color: ShapeColor, amount = 7): string {
  return `color-mix(in oklab, var(--color-${color}) ${100 - amount}%, var(--color-ink))`
}
