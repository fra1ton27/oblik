import type { CollectionConfig } from 'payload'
import { anyone, isContentEditor } from '@/lib/access'
import { missingTranslationsField, slugField, trackTranslationsHook, uniqueSlugHook } from '@/fields'
import { layoutField } from '@/blocks/configs'
import { revalidate, tags } from '@/lib/revalidate'

/** Контентные страницы: политика, условия, доставка и оплата, «О нас», «На заказ», «Контакты» */
export const Pages: CollectionConfig = {
  slug: 'pages',
  labels: {
    singular: { ru: 'Страница', en: 'Page' },
    plural: { ru: 'Страницы', en: 'Pages' },
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'key', 'updatedAt', 'missingTranslations'],
    group: { ru: 'Контент', en: 'Content' },
  },
  access: { read: anyone, create: isContentEditor, update: isContentEditor, delete: isContentEditor },
  hooks: {
    beforeChange: [uniqueSlugHook('pages')],
    afterChange: [
      trackTranslationsHook('pages'),
      ({ doc, context }) => {
        if (!context?.skipRevalidate) revalidate(tags.pages, `page:${doc.key}`)
        return doc
      },
    ],
  },
  fields: [
    { name: 'title', type: 'text', required: true, localized: true, label: { ru: 'Заголовок', en: 'Title' } },
    {
      name: 'key',
      type: 'select',
      required: true,
      unique: true,
      label: { ru: 'Какая страница сайта', en: 'Site page' },
      admin: { position: 'sidebar' },
      options: [
        { label: { ru: 'Политика конфиденциальности', en: 'Privacy policy' }, value: 'privacy' },
        { label: { ru: 'Условия продажи', en: 'Terms of sale' }, value: 'terms' },
        { label: { ru: 'Доставка и оплата', en: 'Delivery & payment' }, value: 'delivery' },
        { label: { ru: 'О компании', en: 'About' }, value: 'about' },
        { label: { ru: 'На заказ', en: 'Made to measure' }, value: 'custom' },
        { label: { ru: 'Контакты', en: 'Contact' }, value: 'contact' },
      ],
    },
    { name: 'intro', type: 'textarea', localized: true, label: { ru: 'Вступление', en: 'Intro' } },
    { name: 'content', type: 'richText', localized: true, label: { ru: 'Текст', en: 'Content' } },
    layoutField(),
    {
      name: 'needsLegalReview',
      type: 'checkbox',
      defaultValue: false,
      label: { ru: 'Требует проверки юристом', en: 'Needs legal review' },
      admin: { position: 'sidebar' },
    },
    slugField(),
    missingTranslationsField,
  ],
}
