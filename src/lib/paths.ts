import { routing, type Locale, type Pathname } from '@/i18n/routing'
import { site } from '@/config/site'

/**
 * Локализованный путь без React-контекста: для хуков Payload, писем, sitemap и редиректов.
 * localizedPath('/furniture/[slug]', { slug: 'divan-oblako' }, 'ru') → /ru/mebel/divan-oblako
 */
export function localizedPath(route: Pathname, params: Record<string, string> = {}, locale: Locale): string {
  const config = routing.pathnames[route] as string | Record<Locale, string>
  let template = typeof config === 'string' ? config : config[locale]
  for (const [key, value] of Object.entries(params)) {
    template = template.replace(`[${key}]`, encodeURIComponent(value))
  }
  const path = template === '/' ? '' : template
  return `/${locale}${path}`
}

/**
 * returnTo после входа: только внутренние пути. Отбрасываем протоколы, «//host», обратные слэши
 * и служебные разделы. Путь без префикса локали (например, «/checkout» из ссылки оформления)
 * переводим в локализованный адрес текущего языка.
 */
export function safeReturnTo(raw: unknown, locale: Locale): string {
  const fallback = localizedPath('/account', {}, locale)
  if (typeof raw !== 'string' || raw.length > 512) return fallback
  const value = raw.trim()
  if (!value.startsWith('/') || value.startsWith('//') || /[\\\s]/.test(value) || /^\/[^/]*:/.test(value)) return fallback
  let url: URL
  try {
    url = new URL(value, 'http://internal.invalid')
  } catch {
    return fallback
  }
  if (url.origin !== 'http://internal.invalid') return fallback
  const path = url.pathname
  if (/^\/(api|admin|_next)(\/|$)/.test(path)) return fallback
  const first = path.split('/')[1] ?? ''
  if ((routing.locales as readonly string[]).includes(first)) return path + url.search
  if (path in routing.pathnames && !path.includes('[')) return localizedPath(path as Pathname, {}, locale) + url.search
  return `/${locale}${path === '/' ? '' : path}${url.search}`
}

export function absoluteUrl(path: string): string {
  return `${site.url}${path.startsWith('/') ? path : `/${path}`}`
}
