import { defineConfig, devices } from '@playwright/test'

// тестовые данные (демо-покупатель из seed) — из .env проекта
try {
  process.loadEnvFile('.env')
} catch {}

const baseURL = process.env.E2E_BASE_URL ?? 'http://localhost:3000'

/**
 * E2E (раздел 13 и 15.1 ТЗ). По умолчанию поднимает production-сборку (pnpm build заранее),
 * E2E_BASE_URL — прогон против уже запущенного сервера (dev, стенд).
 *   desktop, mobile — сценарии, axe, подпись @fra1ton27, SEO, производительность
 *   sweep — все страницы × 3 языка × 6 вьюпортов: скриншоты и проверка горизонтального скролла
 */
export default defineConfig({
  testDir: 'tests/e2e',
  timeout: 90_000,
  expect: { timeout: 15_000 },
  fullyParallel: true,
  workers: process.env.CI ? 2 : 3,
  retries: process.env.CI ? 1 : 0,
  reporter: [['list'], ['html', { open: 'never', outputFolder: 'playwright-report' }]],
  use: {
    baseURL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  webServer: process.env.E2E_BASE_URL
    ? undefined
    : { command: 'pnpm start', url: baseURL, reuseExistingServer: true, timeout: 180_000 },
  projects: [
    {
      name: 'desktop',
      testIgnore: /sweep\.spec/,
      use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } },
    },
    {
      name: 'mobile',
      testMatch: /(pages|purchase|perf)\.spec/,
      use: { ...devices['Pixel 5'], viewport: { width: 360, height: 740 } },
    },
    {
      name: 'sweep',
      testMatch: /sweep\.spec/,
      use: { ...devices['Desktop Chrome'] },
    },
  ],
})
