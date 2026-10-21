import { expect, test } from '@playwright/test'
import { htmlLang } from '@/i18n/routing'
import { LOCALES, PAGES, acceptEssentialCookies, expectDeveloperCredit, expectNoHorizontalScroll, expectNoSeriousA11yViolations, pathFor } from './helpers'

/**
 * Каждая страница раздела 6 на трёх языках (desktop 1440 и mobile 360): статус, один h1, lang,
 * без горизонтального скролла, видимая подпись @fra1ton27, axe без serious и critical.
 */
for (const p of PAGES) {
  for (const locale of LOCALES) {
    test(`${p.name} · ${locale}`, async ({ page, request }) => {
      const path = await pathFor(p, locale, request)
      await acceptEssentialCookies(page)
      // анимации в конечном состоянии: axe не ловит промежуточные цвета, контент виден сразу
      await page.emulateMedia({ reducedMotion: 'reduce' })
      const res = await page.goto(path, { waitUntil: 'load' })
      expect(res?.status(), path).toBe(p.status ?? 200)
      await expect(page.locator('h1')).toHaveCount(1)
      await expect(page.locator('h1')).toBeVisible()
      expect(await page.getAttribute('html', 'lang')).toBe(htmlLang[locale])
      await expectNoHorizontalScroll(page)
      await expectDeveloperCredit(page)
      await expectNoSeriousA11yViolations(page)
    })
  }
}

test('подпись не перекрыта cookie-баннером', async ({ page }) => {
  // без Lenis: плавный скролл догоняет позицию уже после проверки точки
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/ru', { waitUntil: 'load' })
  await expect(page.getByRole('button', { name: 'Только необходимые' })).toBeVisible()
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight))
  await expectDeveloperCredit(page)
})

test('ссылка «Перейти к содержанию» ведёт к main', async ({ page }) => {
  await acceptEssentialCookies(page)
  await page.goto('/ru', { waitUntil: 'load' })
  await page.keyboard.press('Tab')
  const skip = page.getByRole('link', { name: 'Перейти к содержанию' })
  await expect(skip).toBeFocused()
  await expect(skip).toHaveAttribute('href', '#main')
  await expect(page.locator('main#main')).toHaveCount(1)
})
