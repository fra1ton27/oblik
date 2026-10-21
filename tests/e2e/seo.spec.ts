import { expect, test } from '@playwright/test'
import { LOCALES, pathFor } from './helpers'

test('sitemap.xml: все локали с hreflang и x-default', async ({ request }) => {
  const xml = await (await request.get('/sitemap.xml')).text()
  for (const l of LOCALES) expect(xml).toContain(`hreflang="${l}"`)
  expect(xml).toContain('hreflang="x-default"')
  for (const path of ['/ru/korzina', '/en/checkout', '/ru/kabinet', '/sr/hvala']) expect(xml).not.toContain(path)
})

test('robots.txt закрывает служебные разделы и ведёт на sitemap', async ({ request }) => {
  const txt = await (await request.get('/robots.txt')).text()
  expect(txt).toMatch(/Sitemap: https?:\/\/[^\s]+\/sitemap\.xml/)
  // production закрывает админку, API и приватные страницы; dev и стенды — весь сайт
  expect(txt.includes('Disallow: /admin') || /Disallow: \/\s*$/m.test(txt)).toBe(true)
  if (txt.includes('Disallow: /admin')) {
    for (const path of ['/api', '/ru/korzina', '/en/checkout', '/sr/nalog', '/ru/zakaz-prinyat/']) expect(txt).toContain(`Disallow: ${path}`)
  }
})

test('товар: canonical, hreflang, Product и BreadcrumbList, OG-картинка', async ({ page, request }) => {
  const path = await pathFor({ name: 'product', dynamic: 'product' }, 'en', request)
  await page.goto(path, { waitUntil: 'load' })
  await expect(page).toHaveTitle(/ — Oblik$/)
  expect(await page.locator('link[rel=canonical]').getAttribute('href')).toMatch(new RegExp(`${path}$`))
  const langs = await page.locator('link[rel=alternate][hreflang]').evaluateAll((els) => els.map((e) => e.getAttribute('hreflang')))
  expect(new Set(langs)).toEqual(new Set(['ru', 'en', 'sr', 'x-default']))
  const ld = await page.locator('script[type="application/ld+json"]').allTextContents()
  const types = ld.flatMap((j) => {
    const data = JSON.parse(j)
    return (Array.isArray(data) ? data : [data]).map((d: { '@type': string }) => d['@type'])
  })
  expect(types).toContain('Product')
  expect(types).toContain('BreadcrumbList')
  const og = await page.locator('meta[property="og:image"]').first().getAttribute('content')
  const image = await request.get(new URL(og!).pathname + new URL(og!).search)
  expect(image.headers()['content-type']).toBe('image/png')
})

test('главная: Organization, FurnitureStore, WebSite и описание', async ({ page }) => {
  await page.goto('/sr', { waitUntil: 'load' })
  const ld = (await page.locator('script[type="application/ld+json"]').allTextContents()).join(' ')
  for (const type of ['Organization', 'FurnitureStore', 'WebSite']) expect(ld).toContain(`"@type":"${type}"`)
  expect(await page.locator('meta[name=description]').getAttribute('content')).toBeTruthy()
  expect(await page.locator('meta[property="og:image"]').getAttribute('content')).toMatch(/\/sr\/og$/)
})

test('каталог с фильтрами: canonical без фильтров, ?page индексируется', async ({ page }) => {
  await page.goto('/ru/katalog?material=oak&sort=price_asc', { waitUntil: 'load' })
  expect(await page.locator('link[rel=canonical]').getAttribute('href')).toMatch(/\/ru\/katalog$/)
  await page.goto('/ru/katalog?page=2', { waitUntil: 'load' })
  expect(await page.locator('link[rel=canonical]').getAttribute('href')).toMatch(/\/ru\/katalog\?page=2$/)
})

test('приватные страницы закрыты noindex', async ({ page }) => {
  for (const path of ['/ru/korzina', '/en/checkout', '/sr/hvala', '/ru/vhod']) {
    await page.goto(path, { waitUntil: 'load' })
    expect(await page.locator('meta[name=robots]').first().getAttribute('content'), path).toContain('noindex')
  }
})

test('текст товаров есть в SSR-HTML каталога (витрина не прячет контент)', async ({ request }) => {
  const html = await (await request.get('/en/catalog')).text()
  const links = html.match(/href="\/en\/furniture\/[^"]+"/g) ?? []
  expect(links.length).toBeGreaterThan(5)
})
