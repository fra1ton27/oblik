import path from 'node:path'
import { fileURLToPath } from 'node:url'
import type { CollectionConfig } from 'payload'
import { isAdmin, isManager } from '@/lib/access'

const dirname = path.dirname(fileURLToPath(import.meta.url))

/**
 * Файлы из заявок (эскизы, фото, PDF). Приватные: читают только менеджеры.
 * TODO(spec): ТЗ говорит «файлы идут в media», но media публична — для чертежей клиентов
 * выбрана отдельная закрытая коллекция. MIME и размер проверяются на сервере до загрузки.
 */
export const Files: CollectionConfig = {
  slug: 'files',
  labels: { singular: { ru: 'Файл заявки', en: 'Inquiry file' }, plural: { ru: 'Файлы заявок', en: 'Inquiry files' } },
  admin: { group: { ru: 'Продажи', en: 'Sales' }, defaultColumns: ['filename', 'mimeType', 'filesize', 'createdAt'] },
  access: {
    read: isManager,
    create: ({ req }) => req.payloadAPI === 'local' || isManager({ req }),
    update: isManager,
    delete: isAdmin,
  },
  upload: {
    staticDir: path.resolve(dirname, '../../private-files'),
    mimeTypes: ['image/jpeg', 'image/png', 'image/heic', 'image/heif', 'application/pdf'],
    disableLocalStorage: false,
  },
  fields: [],
}
