import type { CollectionConfig } from 'payload'
import { anyone, isContentEditor } from '@/lib/access'
import { revalidate, tags } from '@/lib/revalidate'
import { slugify } from '@/lib/slug'

export const Designers: CollectionConfig = {
  slug: 'designers',
  labels: {
    singular: { ru: 'Дизайнер', en: 'Designer' },
    plural: { ru: 'Дизайнеры', en: 'Designers' },
  },
  admin: { useAsTitle: 'name', group: { ru: 'Каталог', en: 'Catalogue' } },
  access: { read: anyone, create: isContentEditor, update: isContentEditor, delete: isContentEditor },
  hooks: {
    afterChange: [
      ({ doc, context }) => {
        if (!context?.skipRevalidate) revalidate(tags.designers, tags.products)
        return doc
      },
    ],
  },
  fields: [
    { name: 'name', type: 'text', required: true, label: { ru: 'Имя', en: 'Name' } },
    {
      name: 'key',
      type: 'text',
      index: true,
      unique: true,
      label: { ru: 'Ключ для фильтра', en: 'Filter key' },
      admin: { position: 'sidebar' },
      hooks: { beforeValidate: [({ value, siblingData }) => value || (siblingData?.name ? slugify(siblingData.name) : value)] },
    },
    { name: 'role', type: 'text', localized: true, label: { ru: 'Роль', en: 'Role' } },
    { name: 'bio', type: 'textarea', localized: true, label: { ru: 'Биография', en: 'Bio' } },
    { name: 'quote', type: 'textarea', localized: true, label: { ru: 'Цитата', en: 'Quote' } },
    { name: 'photo', type: 'upload', relationTo: 'media', label: { ru: 'Фото', en: 'Photo' } },
  ],
}
