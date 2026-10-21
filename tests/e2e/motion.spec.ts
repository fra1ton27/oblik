import { expect, test } from '@playwright/test'
import { acceptEssentialCookies } from './helpers'

/** prefers-reduced-motion: сайт спокойный и полностью работает, контент виден без анимаций */
test('reduced motion: контент виден сразу, прелоадера нет', async ({ page }) => {
  await acceptEssentialCookies(page)
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/ru', { waitUntil: 'load' })
  const h1 = page.locator('h1')
  await expect(h1).toBeVisible()
  expect(await h1.evaluate((el) => getComputedStyle(el).opacity)).toBe('1')
  await expect(page.locator('.preloader:visible')).toHaveCount(0)
  // витрина каталога работает без WebGL-анимации: карточки и цены в DOM
  await page.goto('/ru/katalog?view=grid', { waitUntil: 'load' })
  await expect(page.locator('[data-product-card]').first()).toBeVisible()
})

test('без JavaScript контент страницы доступен', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false })
  const page = await context.newPage()
  await page.goto('/en/catalog?view=grid', { waitUntil: 'load' })
  await expect(page.locator('h1')).toBeVisible()
  await expect(page.locator('[data-product-card]').first()).toBeVisible()
  await context.close()
})
