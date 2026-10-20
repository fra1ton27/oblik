import type { CollectionAfterChangeHook } from 'payload'
import type { Locale, Pathname } from '@/i18n/routing'
import { isLocale } from '@/i18n/routing'
import { localizedPath } from './paths'

/**
 * Смена слага создаёт 301-редирект со старого локализованного адреса на новый
 * (коллекция redirects из @payloadcms/plugin-redirects). Страницы проверяют её при 404.
 */
export function createSlugRedirect(collection: string, route: Pathname, param: string): CollectionAfterChangeHook {
  return async ({ doc, previousDoc, req, operation, context }) => {
    if (operation !== 'update' || context?.skipRedirect) return doc
    const locale: Locale = isLocale(req.locale) ? req.locale : 'ru'
    const before = previousDoc?.slug
    const after = doc?.slug
    if (!before || !after || before === after) return doc
    const from = localizedPath(route, { [param]: before }, locale)
    const to = localizedPath(route, { [param]: after }, locale)
    try {
      const existing = await req.payload.find({
        collection: 'redirects',
        where: { from: { equals: from } },
        limit: 1,
        depth: 0,
        overrideAccess: true,
        req,
      })
      const data = { from, to: { type: 'custom' as const, url: to }, type: '301' as const }
      if (existing.docs[0]) {
        await req.payload.update({ collection: 'redirects', id: existing.docs[0].id, data, overrideAccess: true, req })
      } else {
        await req.payload.create({ collection: 'redirects', data, overrideAccess: true, req })
      }
      req.payload.logger.info(`redirect ${from} → ${to} (${collection})`)
    } catch (error) {
      req.payload.logger.error({ err: error, msg: 'не удалось создать редирект' })
    }
    return doc
  }
}
