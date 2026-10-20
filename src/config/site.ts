/**
 * Бренд и значения по умолчанию. Имя «Oblik» рабочее: меняется здесь, в одном месте.
 * Контакты, часы работы и курсы в проде берутся из global siteSettings в Payload,
 * а эти значения используются как запасные и для seed.
 */
export const site = {
  name: 'Oblik',
  developer: {
    handle: '@fra1ton27',
    url: 'https://github.com/fra1ton27',
  },
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000').replace(/\/$/, ''),
  currency: 'EUR',
  /** Вторая валюта только для показа, курс задаётся в админке */
  displayCurrency: 'RSD',
  displayRate: 117.2,
  defaultCountry: 'RS',
  contacts: {
    phone: '+381 11 123 4567',
    email: 'hello@oblik.example',
    whatsapp: 'https://wa.me/381111234567',
    viber: 'viber://chat?number=%2B381111234567',
    telegram: 'https://t.me/oblik_studio',
    instagram: 'https://instagram.com/oblik.studio',
    pinterest: 'https://pinterest.com/oblikstudio',
    showroom: {
      lat: 44.8125,
      lng: 20.4612,
    },
  },
  features: {
    /** WebGL-сцена витрины поверх CSS 3D-варианта (этап 6) */
    showcaseWebGL: false,
  },
  orderPrefix: 'OB',
  inquiryPrefix: 'Z',
  itemsPerPage: 24,
} as const

export type SiteConfig = typeof site
