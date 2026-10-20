import { defineRouting } from 'next-intl/routing'

/**
 * Внутренние имена маршрутов английские (папки в src/app/(frontend)/[locale]),
 * русские и сербские адреса задаются здесь. Русские сегменты транслитом.
 * Язык по умолчанию меняется в одном месте: defaultLocale.
 */
export const locales = ['ru', 'en', 'sr'] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = 'ru'

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: 'always',
  localeCookie: {
    name: 'NEXT_LOCALE',
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax',
  },
  pathnames: {
    '/': '/',
    '/catalog': { ru: '/katalog', en: '/catalog', sr: '/katalog' },
    '/catalog/[category]': {
      ru: '/katalog/[category]',
      en: '/catalog/[category]',
      sr: '/katalog/[category]',
    },
    '/furniture/[slug]': { ru: '/mebel/[slug]', en: '/furniture/[slug]', sr: '/namestaj/[slug]' },
    '/collections': { ru: '/kollekcii', en: '/collections', sr: '/kolekcije' },
    '/collections/[slug]': {
      ru: '/kollekcii/[slug]',
      en: '/collections/[slug]',
      sr: '/kolekcije/[slug]',
    },
    '/custom': { ru: '/na-zakaz', en: '/custom', sr: '/po-meri' },
    '/about': { ru: '/o-nas', en: '/about', sr: '/o-nama' },
    '/contact': { ru: '/kontakty', en: '/contact', sr: '/kontakt' },
    '/delivery': { ru: '/dostavka-i-oplata', en: '/delivery', sr: '/dostava-i-placanje' },
    '/cart': { ru: '/korzina', en: '/cart', sr: '/korpa' },
    '/checkout': { ru: '/oformlenie', en: '/checkout', sr: '/porucivanje' },
    '/order-confirmed/[number]': {
      ru: '/zakaz-prinyat/[number]',
      en: '/order-confirmed/[number]',
      sr: '/porudzbina-primljena/[number]',
    },
    '/thank-you': { ru: '/spasibo', en: '/thank-you', sr: '/hvala' },
    '/login': { ru: '/vhod', en: '/login', sr: '/prijava' },
    '/register': { ru: '/registraciya', en: '/register', sr: '/registracija' },
    '/reset-password': { ru: '/vosstanovlenie', en: '/reset-password', sr: '/nova-lozinka' },
    '/account': { ru: '/kabinet', en: '/account', sr: '/nalog' },
    '/account/orders': { ru: '/kabinet/zakazy', en: '/account/orders', sr: '/nalog/porudzbine' },
    '/account/orders/[number]': {
      ru: '/kabinet/zakazy/[number]',
      en: '/account/orders/[number]',
      sr: '/nalog/porudzbine/[number]',
    },
    '/account/wishlist': {
      ru: '/kabinet/izbrannoe',
      en: '/account/wishlist',
      sr: '/nalog/omiljeno',
    },
    '/account/inquiries': {
      ru: '/kabinet/zayavki',
      en: '/account/inquiries',
      sr: '/nalog/zahtevi',
    },
    '/account/addresses': {
      ru: '/kabinet/adresa',
      en: '/account/addresses',
      sr: '/nalog/adrese',
    },
    '/account/profile': { ru: '/kabinet/profil', en: '/account/profile', sr: '/nalog/profil' },
    '/wishlist': { ru: '/izbrannoe', en: '/wishlist', sr: '/omiljeno' },
    '/privacy': { ru: '/privacy', en: '/privacy', sr: '/privatnost' },
    '/terms': { ru: '/usloviya', en: '/terms', sr: '/uslovi' },
    '/ui-kit': '/ui-kit',
  },
})

export type Pathname = keyof typeof routing.pathnames
/** Маршруты без динамических сегментов — их можно передавать в Link строкой */
export type StaticPathname = Exclude<Pathname, `${string}[${string}`>

/** Значение для <html lang>: сербский пишем латиницей */
export const htmlLang: Record<Locale, string> = { ru: 'ru', en: 'en', sr: 'sr-Latn' }

/** Локаль для Intl (цены, даты, числа) */
export const intlLocale: Record<Locale, string> = { ru: 'ru-RU', en: 'en-GB', sr: 'sr-Latn-RS' }

export const localeLabels: Record<Locale, { short: string; name: string }> = {
  ru: { short: 'RU', name: 'Русский' },
  en: { short: 'EN', name: 'English' },
  sr: { short: 'SR', name: 'Srpski' },
}

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (locales as readonly string[]).includes(value)
}
