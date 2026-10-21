import { expect, test, type Page } from '@playwright/test'
import { acceptEssentialCookies, pathFor } from './helpers'

/**
 * Бюджеты раздела 13 на мобильном профиле: JS первой загрузки ≤ 200 КБ gzip (на мобайле WebGL-чанк
 * не грузится), LCP ≤ 2,5 с и CLS ≤ 0,05 при Slow 4G и 4× замедлении CPU. Имеет смысл на production-сборке.
 */
// 200 КБ — цель раздела 13 ТЗ; PERF_JS_BUDGET_KB — временный бюджет, если цель пересмотрена (см. README)
const BUDGET_JS = Number(process.env.PERF_JS_BUDGET_KB ?? 200) * 1024

async function throttle(page: Page) {
  const cdp = await page.context().newCDPSession(page)
  await cdp.send('Network.enable')
  // профиль Lighthouse «Slow 4G»: 1,6 Мбит/с, RTT 150 мс
  await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 150, downloadThroughput: (1.6 * 1024 * 1024) / 8, uploadThroughput: (750 * 1024) / 8 })
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 })
}

const cases = [
  { name: 'home', route: '/ru' },
  { name: 'catalog', route: '/ru/katalog' },
  { name: 'cart', route: '/ru/korzina' },
]

for (const c of [...cases, { name: 'product', route: '' }]) {
  test(`бюджеты · ${c.name}`, async ({ page, request }, info) => {
    test.skip(info.project.name !== 'mobile', 'бюджеты меряем на мобильном профиле')
    test.skip(process.env.E2E_DEV === '1', 'в dev-режиме бандл не минифицирован')
    const route = c.route || (await pathFor({ name: 'product', dynamic: 'product' }, 'ru', request))
    await acceptEssentialCookies(page)
    let js = 0
    page.on('requestfinished', async (req) => {
      if (req.resourceType() !== 'script') return
      const sizes = await req.sizes().catch(() => null)
      js += sizes?.responseBodySize ?? 0
    })
    await page.addInitScript(() => {
      const w = window as unknown as { __lcp: number; __cls: number; __lcpEl: string; __shifts: string[] }
      w.__lcp = 0
      w.__cls = 0
      w.__lcpEl = ''
      w.__shifts = []
      const describe = (el: Element | null | undefined) => (el ? `${el.tagName.toLowerCase()}.${String(el.className).split(' ').slice(0, 3).join('.')}` : '?')
      new PerformanceObserver((list) => {
        for (const e of list.getEntries() as Array<PerformanceEntry & { element?: Element }>) {
          w.__lcp = e.startTime
          w.__lcpEl = describe(e.element)
        }
      }).observe({ type: 'largest-contentful-paint', buffered: true })
      new PerformanceObserver((list) => {
        for (const e of list.getEntries() as Array<PerformanceEntry & { value: number; hadRecentInput: boolean; sources?: Array<{ node?: Node }> }>) {
          if (e.hadRecentInput) continue
          w.__cls += e.value
          w.__shifts.push(`${e.value.toFixed(3)} ${(e.sources ?? []).map((s) => describe(s.node as Element)).join(',')}`)
        }
      }).observe({ type: 'layout-shift', buffered: true })
    })
    await throttle(page)
    await page.goto(route, { waitUntil: 'networkidle', timeout: 60_000 })
    await page.waitForTimeout(1500)
    const { lcp, cls, lcpEl, shifts } = await page.evaluate(() => {
      const w = window as unknown as { __lcp: number; __cls: number; __lcpEl: string; __shifts: string[] }
      return { lcp: w.__lcp, cls: w.__cls, lcpEl: w.__lcpEl, shifts: w.__shifts }
    })
    info.annotations.push({ type: 'metrics', description: `JS ${(js / 1024).toFixed(0)} КБ · LCP ${Math.round(lcp)} мс (${lcpEl}) · CLS ${cls.toFixed(3)} ${shifts.join(' | ')}` })
    console.log(`${c.name}: JS ${(js / 1024).toFixed(0)} KB, LCP ${Math.round(lcp)} ms, CLS ${cls.toFixed(3)}`)
    expect(js, 'JS первой загрузки').toBeLessThanOrEqual(BUDGET_JS)
    expect(lcp, 'LCP').toBeLessThanOrEqual(2500)
    expect(cls, 'CLS').toBeLessThanOrEqual(0.05)
  })
}
