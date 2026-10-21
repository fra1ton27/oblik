import { expect, test } from '@playwright/test'
import en from '@messages/en.json' with { type: 'json' }
import { acceptEssentialCookies, pathFor } from './helpers'

/**
 * Полный сценарий гостя (раздел 15.1 ТЗ): товар → в корзину → смена языка на той же посадочной
 * (корзина не сбрасывается) → оформление на английском → «Заказ принят» по ссылке с токеном.
 */
test('гость покупает товар, смена языка не сбрасывает корзину', async ({ page, request }) => {
  await acceptEssentialCookies(page)
  const productRu = await pathFor({ name: 'product', dynamic: 'product' }, 'ru', request)
  const productEn = await pathFor({ name: 'product', dynamic: 'product' }, 'en', request)

  await page.goto(productRu, { waitUntil: 'load' })
  await page.locator('[data-add-to-cart]').first().click()
  await expect(page.getByRole('button', { name: /^Корзина: 1 / })).toBeVisible()

  // переключатель языка ведёт на тот же товар
  await page.keyboard.press('Escape')
  await expect(page.locator('dialog[open]')).toHaveCount(0)
  // переключатель в подвале: шапка прячется при прокрутке вниз, а копия в мобильном меню скрыта
  await page.locator('footer').getByRole('link', { name: 'EN English' }).click()
  await expect(page).toHaveURL(new RegExp(`${productEn}$`))
  await expect(page.getByRole('button', { name: /^Basket: 1 / })).toBeVisible()

  await page.goto('/en/checkout', { waitUntil: 'load' })
  const form = page.locator('main form')
  await form.getByRole('textbox', { name: en.checkout.name, exact: true }).fill('E2E Buyer')
  await form.getByRole('textbox', { name: en.checkout.phone, exact: true }).fill('641234567')
  await form.getByRole('textbox', { name: en.checkout.email, exact: true }).fill('e2e.buyer@oblik.example')
  await form.getByRole('button', { name: en.checkout.continue }).first().click()
  await form.getByRole('textbox', { name: en.checkout.city, exact: true }).fill('Beograd')
  await form.getByRole('textbox', { name: en.checkout.street, exact: true }).fill('Knez Mihailova 10')
  await form.getByRole('button', { name: en.checkout.continue }).last().click()
  await form.locator('input[name=consent]').check()
  await form.getByRole('button', { name: /^Place order/ }).click()

  await expect(page).toHaveURL(/\/en\/order-confirmed\/OB-\d{4}-\d{6}\?token=[a-f0-9]+$/, { timeout: 30_000 })
  await expect(page.locator('h1')).toBeFocused()
  await expect(page.getByRole('button', { name: /^Basket: empty/ })).toBeVisible()
})
