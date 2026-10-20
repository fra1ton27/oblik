import type { CollectionConfig, Where } from 'payload'
import { isContentEditor, staffRole } from '@/lib/access'
import { revalidate, tags } from '@/lib/revalidate'

export const Reviews: CollectionConfig = {
  slug: 'reviews',
  labels: {
    singular: { ru: 'Отзыв', en: 'Review' },
    plural: { ru: 'Отзывы', en: 'Reviews' },
  },
  admin: {
    useAsTitle: 'author',
    defaultColumns: ['author', 'product', 'rating', 'approved', 'createdAt'],
    group: { ru: 'Каталог', en: 'Catalogue' },
  },
  access: {
    // публично видны только одобренные
    read: ({ req }) => (staffRole(req) ? true : ({ approved: { equals: true } } satisfies Where)),
    create: isContentEditor,
    update: isContentEditor,
    delete: isContentEditor,
  },
  hooks: {
    afterChange: [
      ({ doc, context }) => {
        if (!context?.skipRevalidate) revalidate(tags.reviews, tags.products)
        return doc
      },
    ],
  },
  fields: [
    { name: 'product', type: 'relationship', relationTo: 'products', label: { ru: 'Товар', en: 'Product' } },
    {
      type: 'row',
      fields: [
        { name: 'author', type: 'text', required: true, label: { ru: 'Автор', en: 'Author' } },
        { name: 'city', type: 'text', localized: true, label: { ru: 'Город', en: 'City' } },
      ],
    },
    { name: 'rating', type: 'number', required: true, min: 1, max: 5, defaultValue: 5, label: { ru: 'Оценка', en: 'Rating' } },
    { name: 'text', type: 'textarea', required: true, localized: true, label: { ru: 'Текст', en: 'Text' } },
    { name: 'photos', type: 'upload', relationTo: 'media', hasMany: true, label: { ru: 'Фото покупателя', en: 'Customer photos' } },
    { name: 'approved', type: 'checkbox', defaultValue: false, label: { ru: 'Одобрен', en: 'Approved' }, admin: { position: 'sidebar' } },
  ],
}
