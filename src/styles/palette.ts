/**
 * JS-копия цветов из tokens.css — только для мест, где CSS-переменные недоступны:
 * HTML-письма и OG-картинки. Совпадение с tokens.css проверяет tests/unit/palette.test.ts.
 */
export const palette = {
  milk: '#f7f3ee',
  paper: '#fffdfb',
  sand: '#ede4d7',
  line: '#e2dad0',
  ink: '#2b2433',
  'ink-soft': '#5a5165',
  plum: '#3b3049',
  lavender: '#d6ccf3',
  'lavender-600': '#6a55b5',
  pistachio: '#e1ecc0',
  'pistachio-700': '#56702a',
  blush: '#f4ddd3',
  mist: '#d6e5ec',
  success: '#3f7a55',
  error: '#b04a40',
  warning: '#8a6420',
} as const

export type PaletteColor = keyof typeof palette
