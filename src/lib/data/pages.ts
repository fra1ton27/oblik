import 'server-only'
import { unstable_cache } from 'next/cache'
import type { Page } from '@/payload-types'
import type { Locale } from '@/i18n/routing'
import { getPayloadClient } from '@/lib/payload'
import { tags } from '@/lib/revalidate'

export type PageKey = Page['key']

/**
 * Контентная страница по ключу (privacy, terms, delivery, about, custom, contact).
 * Кэш сбрасывает хук коллекции pages тегами pages и page:<key>.
 */
export const getPageByKey = (key: PageKey, locale: Locale) =>
  unstable_cache(
    async (): Promise<Page | null> => {
      const payload = await getPayloadClient()
      const res = await payload.find({ collection: 'pages', where: { key: { equals: key } }, locale, depth: 2, limit: 1, overrideAccess: false })
      return (res.docs[0] as Page | undefined) ?? null
    },
    ['page', key, locale],
    { tags: [tags.pages, `page:${key}`] },
  )()
