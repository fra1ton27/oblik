import type { CollectionAfterChangeHook, CollectionBeforeChangeHook, Field, SelectField } from 'payload'
import { slugify } from '@/lib/slug'
import { locales, routing, type Locale } from '@/i18n/routing'

/** Слаг: локализован, генерируется транслитом из title текущей локали */
export function slugField(source = 'title'): Field {
  return {
    name: 'slug',
    type: 'text',
    localized: true,
    index: true,
    label: { ru: 'Слаг (адрес)', en: 'Slug' },
    admin: {
      position: 'sidebar',
      description: {
        ru: 'Генерируется из названия транслитом. Смена слага создаёт 301-редирект.',
        en: 'Generated from the title. Changing it creates a 301 redirect.',
      },
    },
    hooks: {
      beforeValidate: [
        ({ value, siblingData }) => {
          if (typeof value === 'string' && value.trim()) return slugify(value)
          const title = siblingData?.[source]
          return typeof title === 'string' && title ? slugify(title) : value
        },
      ],
    },
  }
}

/** Уникальность слага в рамках локали: добавляем -2, -3… */
export function uniqueSlugHook(collection: string): CollectionBeforeChangeHook {
  return async ({ data, req, originalDoc }) => {
    const slug = data?.slug
    if (!slug || typeof slug !== 'string') return data
    let candidate = slug
    for (let i = 2; i < 50; i++) {
      const found = await req.payload.find({
        collection: collection as 'products',
        where: { slug: { equals: candidate }, ...(originalDoc?.id ? { id: { not_equals: originalDoc.id } } : {}) },
        locale: (req.locale as Locale) ?? 'ru',
        limit: 1,
        depth: 0,
        overrideAccess: true,
        req,
      })
      if (found.docs.length === 0) break
      candidate = `${slug}-${i}`
    }
    return { ...data, slug: candidate }
  }
}

export const accentOptions = [
  { label: { ru: 'Лаванда', en: 'Lavender' }, value: 'lavender' },
  { label: { ru: 'Фисташка', en: 'Pistachio' }, value: 'pistachio' },
  { label: { ru: 'Румянец', en: 'Blush' }, value: 'blush' },
  { label: { ru: 'Туман', en: 'Mist' }, value: 'mist' },
  { label: { ru: 'Песок', en: 'Sand' }, value: 'sand' },
]

export function accentField(name = 'color', label = { ru: 'Цвет', en: 'Colour' }): SelectField {
  return { name, type: 'select', label, defaultValue: 'lavender', options: accentOptions }
}

export const statusField: Field = {
  name: 'status',
  type: 'select',
  label: { ru: 'Статус', en: 'Status' },
  defaultValue: 'published',
  index: true,
  admin: { position: 'sidebar' },
  options: [
    { label: { ru: 'Черновик', en: 'Draft' }, value: 'draft' },
    { label: { ru: 'Опубликован', en: 'Published' }, value: 'published' },
  ],
}

/** Статичные маршруты сайта для ссылок из CMS (меню, CTA, подвал) */
export const routeOptions = (Object.keys(routing.pathnames) as string[])
  .filter((p) => !p.includes('['))
  .map((p) => ({ label: p, value: p }))

export function routeField(name = 'route', required = false): SelectField {
  return {
    name,
    type: 'select',
    required,
    label: { ru: 'Страница сайта', en: 'Site page' },
    options: routeOptions,
  }
}

/** Пометка «нет перевода» в админке: какие локали не заполнены */
export const missingTranslationsField: Field = {
  name: 'missingTranslations',
  type: 'select',
  hasMany: true,
  label: { ru: 'Нет перевода', en: 'Missing translation' },
  options: locales.map((l) => ({ label: l.toUpperCase(), value: l })),
  admin: {
    position: 'sidebar',
    readOnly: true,
    description: {
      ru: 'Языки без названия. На сайте вместо них показывается русский текст.',
      en: 'Locales without a title. The site falls back to Russian for them.',
    },
  },
}

/** После сохранения пересчитываем, в каких локалях нет названия */
export function trackTranslationsHook(collection: string, field = 'title'): CollectionAfterChangeHook {
  return async ({ doc, req, context }) => {
    if (context?.skipTranslationCheck) return doc
    // findByID с locale 'all' и общим req переключает req.locale — сохраняем и возвращаем
    const prevLocale = req.locale
    const prevFallback = req.fallbackLocale
    const all = await req.payload.findByID({
      collection: collection as 'products',
      id: doc.id,
      locale: 'all',
      depth: 0,
      overrideAccess: true,
      req,
    })
    req.locale = prevLocale
    req.fallbackLocale = prevFallback
    const values = (all as unknown as Record<string, unknown>)[field] as Record<string, string | null> | undefined
    const missing = locales.filter((l) => !values?.[l] || !String(values[l]).trim())
    const current = (doc.missingTranslations ?? []) as string[]
    if (missing.join(',') !== [...current].sort().join(',')) {
      await req.payload.update({
        collection: collection as 'products',
        id: doc.id,
        data: { missingTranslations: missing } as never,
        locale: (prevLocale as Locale) ?? 'ru',
        depth: 0,
        overrideAccess: true,
        context: { ...context, skipTranslationCheck: true, skipRevalidate: true, skipRedirect: true },
        req,
      })
    }
    return doc
  }
}
