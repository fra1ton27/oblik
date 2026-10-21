import { expect, test } from '@playwright/test'
import ru from '@messages/ru.json' with { type: 'json' }
import en from '@messages/en.json' with { type: 'json' }
import sr from '@messages/sr.json' with { type: 'json' }
import { localizedPath } from '@/lib/paths'
import { acceptEssentialCookies } from './helpers'

const messages = { ru, en, sr } as const

/** Формы валидируются на трёх языках: ошибки связаны с полем через aria-describedby */
for (const locale of ['ru', 'en', 'sr'] as const) {
  test(`форма обратной связи: ошибки · ${locale}`, async ({ page }) => {
    const m = messages[locale]
    await acceptEssentialCookies(page)
    await page.goto(localizedPath('/contact', {}, locale), { waitUntil: 'load' })
    const form = page.locator('main form').filter({ has: page.getByRole('button', { name: m.forms.contactSubmit }) })
    await form.getByRole('button', { name: m.forms.contactSubmit }).click()
    // доступное имя без декоративной звёздочки обязательного поля
    const name = form.getByRole('textbox', { name: m.forms.name, exact: true })
    await expect(name).toHaveAttribute('aria-invalid', 'true')
    const describedBy = await name.getAttribute('aria-describedby')
    expect(describedBy).toBeTruthy()
    await expect(page.locator(`[id="${describedBy!.split(' ')[0]}"]`)).toHaveText(m.validation.required)
  })
}

test('заявка уходит и ведёт на «Спасибо» с номером', async ({ page }) => {
  await acceptEssentialCookies(page)
  await page.goto('/ru/kontakty', { waitUntil: 'load' })
  const form = page.locator('main form').filter({ has: page.getByRole('button', { name: ru.forms.contactSubmit }) })
  await form.getByRole('textbox', { name: ru.forms.name, exact: true }).fill('E2E Тест')
  await form.getByRole('textbox', { name: ru.forms.email, exact: true }).fill('e2e.contact@oblik.example')
  await form.getByRole('textbox', { name: ru.forms.message, exact: true }).fill('Проверка формы обратной связи из e2e-теста.')
  await form.locator('input[name=consent]').check()
  // антиспам: форму нельзя отправить быстрее 3 секунд
  await page.waitForTimeout(3200)
  await form.getByRole('button', { name: ru.forms.contactSubmit }).click()
  await expect(page).toHaveURL(/\/ru\/spasibo\?type=contact&ref=Z-\d{4}-\d{5,}$/, { timeout: 30_000 })
  await expect(page.locator('h1')).toHaveText(ru.thanks.title)
  await expect(page.locator('h1')).toBeFocused()
})
