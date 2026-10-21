import { Cormorant_Garamond, Manrope, Unbounded } from 'next/font/google'

// subsets у next/font — это то, что предзагружается: только latin, чтобы шесть файлов (~255 КБ)
// не отнимали канал у CSS и первой отрисовки. Кириллица и latin-ext (сербские č, ć, đ, š, ž) остаются
// в @font-face с unicode-range и грузятся, когда на странице есть их символы.
export const unbounded = Unbounded({
  subsets: ['latin'],
  weight: 'variable',
  display: 'swap',
  variable: '--font-unbounded',
  preload: true,
  adjustFontFallback: true,
})

export const manrope = Manrope({
  subsets: ['latin'],
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
