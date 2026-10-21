import AxeBuilder from '@axe-core/playwright'
import { expect, type APIRequestContext, type Page } from '@playwright/test'
import { routing, type Locale, type StaticPathname } from '@/i18n/routing'
import { localizedPath } from '@/lib/paths'

export const LOCALES = routing.locales as readonly Locale[]

export type PageCase = {
  name: string
  /** статический маршрут или динамический из sitemap */
  route?: StaticPathname
  dynamic?: 'category' | 'product' | 'collection'
  /** готовый путь (404, «Заказ принят» с чужим номером) */
  path?: (locale: Locale) => string
  status?: number
}

/** Все страницы из раздела 6 ТЗ (кроме ui-kit — только dev) */
export const PAGES: PageCase[] = [
  { name: 'home', route: '/' },
  { name: 'catalog', route: '/catalog' },
  { name: 'category', dynamic: 'category' },
  { name: 'product', dynamic: 'product' },
  { name: 'collections', route: '/collections' },
  { name: 'collection', dynamic: 'collection' },
  { name: 'custom', route: '/custom' },
  { name: 'about', route: '/about' },
  { name: 'contact', route: '/contact' },
  { name: 'delivery', route: '/delivery' },
  { name: 'cart', route: '/cart' },
  { name: 'checkout', route: '/checkout' },
  { name: 'order-confirmed', path: (l) => localizedPath('/order-confirmed/[number]', { number: 'OB-0000-000000' }, l) },
  { name: 'thank-you', route: '/thank-you' },
  { name: 'login', route: '/login' },
  { name: 'register', route: '/register' },
  { name: 'reset-password', route: '/reset-password' },
  { name: 'account', route: '/account' },
  { name: 'wishlist', route: '/wishlist' },
  { name: 'privacy', route: '/privacy' },
  { name: 'terms', route: '/terms' },
  { name: '404', path: (l) => `/${l}/net-takoy-stranicy-e2e`, status: 404 },
]

type Alternates = Partial<Record<Locale, string>>
let sitemapCache: Promise<Alternates[]> | null = null

/** Группы альтернатив из sitemap.xml: для каждой записи — адреса на трёх языках */
export function sitemapGroups(request: APIRequestContext): Promise<Alternates[]> {
  sitemapCache ??= (async () => {
    const xml = await (await request.get('/sitemap.xml')).text()
    return [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)].map(([, block]) => {
      const out: Alternates = {}
      for (const [, lang, href] of block.matchAll(/hreflang="([a-z-]+)"\s+href="([^"]+)"/g)) {
        if ((LOCALES as readonly string[]).includes(lang)) out[lang as Locale] = new URL(href).pathname
      }
      return out
    })
  })()
  return sitemapCache
}

const DYNAMIC_PREFIX: Record<NonNullable<PageCase['dynamic']>, StaticPathname> = { category: '/catalog', product: '/catalog', collection: '/collections' }

/** Путь страницы на нужном языке; для динамических — первая подходящая запись sitemap */
export async function pathFor(page: PageCase, locale: Locale, request: APIRequestContext): Promise<string> {
  if (page.path) return page.path(locale)
  if (page.route) return localizedPath(page.route, {}, locale)
  const groups = await sitemapGroups(request)
  const ru = (g: Alternates) => g.ru ?? ''
  const product = localizedPath('/furniture/[slug]', { slug: '' }, 'ru')
  const match =
    page.dynamic === 'product'
      ? groups.find((g) => ru(g).startsWith(product))
      : groups.find((g) => {
          const base = `${localizedPath(DYNAMIC_PREFIX[page.dynamic!], {}, 'ru')}/`
          return ru(g).startsWith(base) && ru(g).split('/').length === base.split('/').length
        })
  const path = match?.[locale]
  if (!path) throw new Error(`в sitemap нет страницы ${page.name} (${locale})`)
  return path
}

/** Cookie-баннер скрываем согласием «только необходимые», чтобы он не мешал скриншотам и axe */
export async function acceptEssentialCookies(page: Page) {
  await page.addInitScript(() => {
    try {
      localStorage.setItem('oblik_consent', JSON.stringify({ necessary: true, analytics: false, marketing: false, at: Date.now() }))
    } catch {}
  })
}

export async function expectNoHorizontalScroll(page: Page) {
  const { scroll, width } = await page.evaluate(() => ({ scroll: document.documentElement.scrollWidth, width: window.innerWidth }))
  expect(scroll, 'горизонтальный скролл').toBeLessThanOrEqual(width)
}

/**
 * Подпись @fra1ton27 (раздел 14.3 ТЗ): видимая ссылка на GitHub, не меньше 12 px,
 * и в своей точке не перекрыта баннером или липкими плашками.
 */
export async function expectDeveloperCredit(page: Page) {
  const link = page.locator('[data-developer-handle]').last()
  await link.scrollIntoViewIfNeeded()
  await expect(link).toBeVisible()
  await expect(link).toHaveText('@fra1ton27')
  await expect(link).toHaveAttribute('href', 'https://github.com/fra1ton27')
  await expect(link).toHaveAttribute('target', '_blank')
  const check = await link.evaluate((el) => {
    const r = el.getBoundingClientRect()
    const top = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2)
    return { covered: !(top && (top === el || el.contains(top))), size: parseFloat(getComputedStyle(el).fontSize) }
  })
  expect(check.covered, 'подпись перекрыта').toBe(false)
  expect(check.size).toBeGreaterThanOrEqual(12)
}

/** axe: нуль нарушений serious и critical (раздел 13.3 ТЗ) */
export async function expectNoSeriousA11yViolations(page: Page) {
  const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze()
  const serious = result.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical')
  const report = serious.map((v) => `${v.id} (${v.impact}): ${v.help}\n  ${v.nodes.slice(0, 3).map((n) => n.target.join(' ')).join('\n  ')}`).join('\n')
  expect(serious, report).toEqual([])
}
