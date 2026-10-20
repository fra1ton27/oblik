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

export function absoluteUrl(path: string): string {
  return `${site.url}${path.startsWith('/') ? path : `/${path}`}`
}
