import { test } from '@playwright/test'
import { LOCALES, PAGES, acceptEssentialCookies, expectNoHorizontalScroll, pathFor } from './helpers'

/**
 * Раздел 11.3 ТЗ: каждая страница на трёх языках и шести вьюпортах — скриншот
 * (test-results/sweep) и проверка, что нет горизонтального скролла.
 *   pnpm test:e2e --project=sweep
 */
const VIEWPORTS = [
  { name: '360x740', width: 360, height: 740 },
  { name: '375x667', width: 375, height: 667 },
  { name: '393x852', width: 393, height: 852 },
  { name: '412x915', width: 412, height: 915 },
  { name: '768x1024', width: 768, height: 1024 },
  { name: '852x393-landscape', width: 852, height: 393 },
]

test.describe.configure({ mode: 'parallel' })

for (const vp of VIEWPORTS) {
  for (const p of PAGES) {
    test(`${vp.name} · ${p.name}`, async ({ page, request }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height })
      await acceptEssentialCookies(page)
      await page.emulateMedia({ reducedMotion: 'reduce' })
      for (const locale of LOCALES) {
        await page.goto(await pathFor(p, locale, request), { waitUntil: 'load' })
        await expectNoHorizontalScroll(page)
        await page.screenshot({ path: `test-results/sweep/${vp.name}/${locale}-${p.name}.png`, fullPage: true })
      }
    })
  }
}
