import { describe, expect, it } from 'vitest'
import { htmlLang, intlLocale, routing } from '@/i18n/routing'

describe('routing', () => {
  it('ru — язык по умолчанию, префикс всегда', () => {
    expect(routing.defaultLocale).toBe('ru')
    const prefix = routing.localePrefix
    expect(typeof prefix === 'string' ? prefix : prefix?.mode).toBe('always')
    expect(routing.locales).toEqual(['ru', 'en', 'sr'])
  })

  it('сербский пишется латиницей', () => {
    expect(htmlLang.sr).toBe('sr-Latn')
    expect(intlLocale.sr).toBe('sr-Latn-RS')
  })

  it('у каждого маршрута есть адрес на трёх языках, русские сегменты без кириллицы', () => {
    for (const [route, value] of Object.entries(routing.pathnames)) {
      if (typeof value === 'string') continue
      for (const locale of routing.locales) {
        const localized = (value as Record<string, string>)[locale]
        expect(localized, `${route} → ${locale}`).toBeTruthy()
        expect(/[Ѐ-ӿ]/.test(localized)).toBe(false)
      }
    }
  })
})
