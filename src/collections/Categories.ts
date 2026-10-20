import type { CollectionConfig } from 'payload'
import { anyone, isContentEditor } from '@/lib/access'
import { accentField, missingTranslationsField, slugField, trackTranslationsHook, uniqueSlugHook } from '@/fields'
import { revalidate, tags } from '@/lib/revalidate'
import { createSlugRedirect } from '@/lib/redirects'

export const Categories: CollectionConfig = {
  slug: 'categories',
  labels: {
    singular: { ru: 'Категория', en: 'Category' },
    plural: { ru: 'Категории', en: 'Categories' },
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'order', 'missingTranslations'],
    group: { ru: 'Каталог', en: 'Catalogue' },
  },
  defaultSort: 'order',
  access: { read: anyone, create: isContentEditor, update: isContentEditor, delete: isContentEditor },
  hooks: {
    beforeChange: [uniqueSlugHook('categories')],
    afterChange: [
      trackTranslationsHook('categories'),
      createSlugRedirect('categories', '/catalog/[category]', 'category'),
      ({ doc, context }) => {
        if (!context?.skipRevalidate) revalidate(tags.categories, tags.products)
        return doc
      },
    ],
    afterDelete: [() => revalidate(tags.categories, tags.products)],
  },
  fields: [
    { name: 'title', type: 'text', required: true, localized: true, label: { ru: 'Название', en: 'Title' } },
    slugField(),
    { name: 'description', type: 'textarea', localized: true, label: { ru: 'Описание', en: 'Description' } },
    {
      name: 'chips',
      type: 'array',
      label: { ru: 'Чипы подкатегорий', en: 'Sub-category chips' },
      fields: [{ name: 'label', type: 'text', required: true, localized: true, label: { ru: 'Подпись', en: 'Label' } }],
    },
    { name: 'image', type: 'upload', relationTo: 'media', label: { ru: 'Фото', en: 'Image' } },
    accentField('color', { ru: 'Цвет карточки', en: 'Card colour' }),
    { name: 'parent', type: 'relationship', relationTo: 'categories', label: { ru: 'Родитель', en: 'Parent' } },
    { name: 'order', type: 'number', defaultValue: 0, label: { ru: 'Порядок', en: 'Order' }, admin: { position: 'sidebar' } },
    missingTranslationsField,
  ],
}
