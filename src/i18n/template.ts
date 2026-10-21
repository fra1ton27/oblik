import { routing } from './routing'

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

/**
 * Внутренний шаблон маршрута по текущему пути и параметрам: '/furniture/vaza-stupen' → '/furniture/[slug]'.
 * При статической сборке usePathname из next-intl отдаёт внутренний путь с подставленным слагом, который
 * не совпадает с локализованными pathnames, — без шаблона ссылки переключателя языка получались вида
 * /ru/furniture/… вместо /ru/mebel/…. На клиенте шаблон уже приходит готовым — результат тот же.
 */
export function routeTemplate(pathname: string, params: Record<string, string | string[] | undefined>): string {
  if (pathname in routing.pathnames) return pathname
  let out = pathname
  for (const [key, raw] of Object.entries(params)) {
    if (key === 'locale' || raw === undefined) continue
    const value = Array.isArray(raw) ? raw.join('/') : raw
    for (const candidate of new Set([value, encodeURIComponent(value), safeDecode(value)])) {
      const re = new RegExp(`/${escape(candidate)}(?=/|$)`)
      if (re.test(out)) {
        out = out.replace(re, `/[${key}]`)
        break
      }
    }
  }
  return out in routing.pathnames ? out : pathname
}

function safeDecode(value: string) {
  try {
    return decodeURIComponent(value)
  } catch {
    return value
  }
}
