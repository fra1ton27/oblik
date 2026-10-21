import { expect, test } from '@playwright/test'
import ru from '@messages/ru.json' with { type: 'json' }
import { acceptEssentialCookies } from './helpers'

const email = process.env.SEED_CUSTOMER_EMAIL ?? 'demo@oblik.example'
const password = process.env.SEED_CUSTOMER_PASSWORD ?? 'demo-password'

test('кабинет без входа уводит на вход с returnTo', async ({ page }) => {
  await page.goto('/ru/kabinet/zakazy', { waitUntil: 'load' })
  await expect(page).toHaveURL(/\/ru\/vhod\?returnTo=%2Fru%2Fkabinet%2Fzakazy$/)
})

test('покупатель видит свои заказы, чужой номер — 404', async ({ page }) => {
  await acceptEssentialCookies(page)
  await page.goto('/ru/vhod?returnTo=%2Fru%2Fkabinet%2Fzakazy', { waitUntil: 'load' })
  const form = page.locator('main form')
  await form.getByRole('textbox', { name: ru.auth.email, exact: true }).fill(email)
  await form.locator('input[autocomplete="current-password"]').fill(password)
  await form.getByRole('button', { name: ru.auth.submitLogin }).click()
  await expect(page).toHaveURL(/\/ru\/kabinet\/zakazy$/)

  const first = page.locator('main article h3 a').first()
  const number = (await first.textContent())?.match(/OB-\d{4}-\d{6}/)?.[0]
  expect(number).toBeTruthy()
  await first.click()
  await expect(page.locator('h1')).toContainText(number!)

  const res = await page.goto('/ru/kabinet/zakazy/OB-2000-000001', { waitUntil: 'load' })
  expect(res?.status()).toBe(404)
  await expect(page.locator('h1')).toHaveText(ru.errors.notFoundTitle)

  // REST тоже отдаёт только свои заказы
  const own = await page.evaluate(async () => (await (await fetch('/api/orders?limit=100&depth=0')).json()) as { docs: Array<{ customer: number | null }> })
  const ids = new Set(own.docs.map((o) => o.customer))
  expect(ids.size).toBe(1)
})
