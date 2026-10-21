import path from 'node:path'
import { fileURLToPath } from 'node:url'
import type { CollectionConfig } from 'payload'
import { anyone, isContentEditor } from '@/lib/access'

const dirname = path.dirname(fileURLToPath(import.meta.url))

export const Media: CollectionConfig = {
  slug: 'media',
  labels: {
    singular: { ru: 'Медиафайл', en: 'Media file' },
    plural: { ru: 'Медиа', en: 'Media' },
  },
  admin: {
    group: { ru: 'Контент', en: 'Content' },
    defaultColumns: ['filename', 'alt', 'updatedAt'],
  },
  access: {
    read: anyone,
    create: isContentEditor,
    update: isContentEditor,
    delete: isContentEditor,
  },
  upload: {
    // в Docker — том (см. docker-compose.prod.yml)
    staticDir: process.env.MEDIA_DIR || path.resolve(dirname, '../../media'),
    mimeTypes: ['image/*', 'video/mp4', 'video/webm'],
    focalPoint: true,
    crop: true,
    formatOptions: { format: 'webp', options: { quality: 82 } },
    imageSizes: [
      { name: 'thumb', width: 400, formatOptions: { format: 'webp', options: { quality: 78 } } },
      { name: 'card', width: 800, formatOptions: { format: 'webp', options: { quality: 80 } } },
      { name: 'hero', width: 1600, formatOptions: { format: 'webp', options: { quality: 82 } } },
      { name: 'full', width: 2400, formatOptions: { format: 'webp', options: { quality: 82 } } },
    ],
    adminThumbnail: 'thumb',
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      localized: true,
      label: { ru: 'Альтернативный текст', en: 'Alt text' },
    },
    {
      name: 'tone',
      type: 'select',
      label: { ru: 'Тон плейсхолдера', en: 'Placeholder tone' },
      admin: { description: { ru: 'Цвет фона, пока картинка грузится', en: 'Background while loading' } },
      defaultValue: 'sand',
      options: ['sand', 'lavender', 'pistachio', 'blush', 'mist'].map((value) => ({
        label: value,
        value,
      })),
    },
  ],
}
