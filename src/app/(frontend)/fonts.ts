import { Cormorant_Garamond, Manrope, Unbounded } from 'next/font/google'

// latin-ext обязателен: в нём сербские č, ć, đ, š, ž
export const unbounded = Unbounded({
  subsets: ['latin', 'latin-ext', 'cyrillic'],
  weight: 'variable',
  display: 'swap',
  variable: '--font-unbounded',
  preload: true,
  adjustFontFallback: true,
})

export const manrope = Manrope({
  subsets: ['latin', 'latin-ext', 'cyrillic'],
  weight: 'variable',
  display: 'swap',
  variable: '--font-manrope',
  preload: true,
  adjustFontFallback: true,
})

export const cormorant = Cormorant_Garamond({
  subsets: ['latin', 'latin-ext', 'cyrillic'],
  weight: ['400', '500'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-cormorant',
  preload: false,
})

export const fontVariables = `${unbounded.variable} ${manrope.variable} ${cormorant.variable}`
