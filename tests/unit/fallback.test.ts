import { describe, expect, it } from 'vitest'
import { fallbackTexts } from '@/i18n/fallback'
import ru from '@messages/ru.json'
import en from '@messages/en.json'
import sr from '@messages/sr.json'

const messages = { ru, en, sr }

describe('тексты global-error совпадают со словарями', () => {
  for (const locale of ['ru', 'en', 'sr'] as const) {
    it(locale, () => {
      const m = messages[locale]
      expect(fallbackTexts[locale]).toEqual({
        serverTitle: m.errors.serverTitle,
        serverText: m.errors.serverText,
        retry: m.errors.retry,
        toHome: m.errors.toHome,
        credit: m.footer.credit,
      })
    })
  }
})
