import type { CollectionConfig } from 'payload'
import { anyone, isContentEditor } from '@/lib/access'
import { missingTranslationsField, slugField, trackTranslationsHook, uniqueSlugHook } from '@/fields'
import { revalidate, tags } from '@/lib/revalidate'

export const materialTypes = ['wood', 'fabric', 'metal', 'stone', 'other'] as const

export const colorFamilies = [
  { value: 'milk', label: { ru: 'Молочный', en: 'Milk' } },
  { value: 'sand', label: { ru: 'Песочный', en: 'Sand' } },
  { value: 'oak', label: { ru: 'Натуральный дуб', en: 'Natural oak' } },
  { value: 'walnut', label: { ru: 'Орех', en: 'Walnut' } },
  { value: 'graphite', label: { ru: 'Графит', en: 'Graphite' } },
  { value: 'green', label: { ru: 'Зелёный', en: 'Green' } },
  { value: 'blue', label: { ru: 'Голубой', en: 'Blue' } },
  { value: 'terracotta', label: { ru: 'Терракота', en: 'Terracotta' } },
  { value: 'lavender', label: { ru: 'Лавандовый', en: 'Lavender' } },
]

export const Materials: CollectionConfig = {
  slug: 'materials',
  labels: {
    singular: { ru: 'Материал', en: 'Material' },
    plural: { ru: 'Материалы', en: 'Materials' },
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'type', 'colorFamily', 'missingTranslations'],
    group: { ru: 'Каталог', en: 'Catalogue' },
  },
  access: { read: anyone, create: isContentEditor, update: isContentEditor, delete: isContentEditor },
  hooks: {
    beforeChange: [uniqueSlugHook('materials')],
    afterChange: [
      trackTranslationsHook('materials'),
      ({ doc, context }) => {
        if (!context?.skipRevalidate) revalidate(tags.materials, tags.products)
        return doc
      },
    ],
  },
  fields: [
    { name: 'title', type: 'text', required: true, localized: true, label: { ru: 'Название', en: 'Title' } },
    slugField(),
    {
      name: 'key',
      type: 'text',
      unique: true,
      index: true,
      label: { ru: 'Ключ для фильтра', en: 'Filter key' },
      admin: { position: 'sidebar', description: { ru: 'Латиницей, например oak', en: 'Latin, e.g. oak' } },
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      label: { ru: 'Тип', en: 'Type' },
      options: [
        { value: 'wood', label: { ru: 'Дерево', en: 'Wood' } },
        { value: 'fabric', label: { ru: 'Ткань', en: 'Fabric' } },
        { value: 'metal', label: { ru: 'Металл', en: 'Metal' } },
        { value: 'stone', label: { ru: 'Камень', en: 'Stone' } },
        { value: 'other', label: { ru: 'Другое', en: 'Other' } },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'swatchColor',
          type: 'text',
          label: { ru: 'Цвет свотча (CSS)', en: 'Swatch colour (CSS)' },
          admin: { description: { ru: 'Например #E8DCC8 — пока нет фото свотча', en: 'E.g. #E8DCC8 — until a swatch photo exists' } },
        },
        { name: 'colorFamily', type: 'select', label: { ru: 'Цвет для фильтра', en: 'Filter colour' }, options: colorFamilies },
      ],
    },
    { name: 'swatch', type: 'upload', relationTo: 'media', label: { ru: 'Фото свотча', en: 'Swatch image' } },
    { name: 'macro', type: 'upload', relationTo: 'media', label: { ru: 'Макрофото', en: 'Macro photo' } },
    { name: 'origin', type: 'text', localized: true, label: { ru: 'Происхождение', en: 'Origin' } },
    { name: 'description', type: 'textarea', localized: true, label: { ru: 'Описание', en: 'Description' } },
    { name: 'care', type: 'textarea', localized: true, label: { ru: 'Уход', en: 'Care' } },
    missingTranslationsField,
  ],
}
