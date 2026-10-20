import type { CollectionConfig } from 'payload'
import { isContentEditor, publishedOrStaff } from '@/lib/access'
import { accentOptions, missingTranslationsField, slugField, statusField, trackTranslationsHook, uniqueSlugHook } from '@/fields'
import { layoutField } from '@/blocks/configs'
import { revalidate, tags } from '@/lib/revalidate'
import { createSlugRedirect } from '@/lib/redirects'

/** Коллекции и комплекты (isBundle): гостиная, столовая, спальня */
export const ProductCollections: CollectionConfig = {
  slug: 'collections',
  labels: {
    singular: { ru: 'Коллекция', en: 'Collection' },
    plural: { ru: 'Коллекции и комплекты', en: 'Collections & bundles' },
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'isBundle', 'bundleDiscount', 'status', 'missingTranslations'],
    group: { ru: 'Каталог', en: 'Catalogue' },
  },
  access: { read: publishedOrStaff, create: isContentEditor, update: isContentEditor, delete: isContentEditor },
  hooks: {
    beforeChange: [uniqueSlugHook('collections')],
    afterChange: [
      trackTranslationsHook('collections'),
      createSlugRedirect('collections', '/collections/[slug]', 'slug'),
      ({ doc, context }) => {
        if (!context?.skipRevalidate) revalidate(tags.collections, tags.products)
        return doc
      },
    ],
  },
  fields: [
    { name: 'title', type: 'text', required: true, localized: true, label: { ru: 'Название', en: 'Title' } },
    { name: 'tagline', type: 'text', localized: true, label: { ru: 'Подзаголовок', en: 'Tagline' } },
    { name: 'room', type: 'text', localized: true, label: { ru: 'Комната (гостиная, спальня…)', en: 'Room' } },
    { name: 'story', type: 'textarea', localized: true, label: { ru: 'История коллекции', en: 'Story' } },
    { name: 'hero', type: 'upload', relationTo: 'media', label: { ru: 'Hero-фото', en: 'Hero image' } },
    { name: 'cutout', type: 'upload', relationTo: 'media', label: { ru: 'Композиция для витрины', en: 'Showcase composition' } },
    { name: 'podiumColor', type: 'select', defaultValue: 'blush', options: accentOptions, label: { ru: 'Цвет подиума', en: 'Podium colour' } },
    {
      name: 'products',
      type: 'relationship',
      relationTo: 'products',
      hasMany: true,
      label: { ru: 'Состав (для комплекта — по одному каждого)', en: 'Products (one of each for a bundle)' },
    },
    {
      type: 'row',
      fields: [
        { name: 'isBundle', type: 'checkbox', defaultValue: false, label: { ru: 'Это комплект', en: 'Is a bundle' } },
        {
          name: 'bundleDiscount',
          type: 'number',
          min: 0,
          max: 50,
          defaultValue: 0,
          label: { ru: 'Скидка комплекта, %', en: 'Bundle discount, %' },
          admin: { condition: (_, s) => Boolean(s?.isBundle) },
        },
      ],
    },
    { name: 'gallery', type: 'upload', relationTo: 'media', hasMany: true, label: { ru: 'Интерьерная галерея', en: 'Interior gallery' } },
    layoutField(),
    slugField(),
    statusField,
    { name: 'order', type: 'number', defaultValue: 0, admin: { position: 'sidebar' } },
    missingTranslationsField,
  ],
}
