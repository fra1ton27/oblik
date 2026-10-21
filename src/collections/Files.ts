import path from 'node:path'
import { fileURLToPath } from 'node:url'
import type { CollectionConfig } from 'payload'
import { isAdmin, isManager, ownerOrManager } from '@/lib/access'

const dirname = path.dirname(fileURLToPath(import.meta.url))

/**
 * Файлы из заявок (эскизы, фото, PDF). Приватные: читают только менеджеры.
 * TODO(spec): ТЗ говорит «файлы идут в media», но media публична — для чертежей клиентов
 * выбрана отдельная закрытая коллекция. MIME и размер проверяются на сервере до загрузки.
 * Покупатель видит и скачивает только свои файлы (поле owner ставится при отправке заявки из кабинета).
 */
export const Files: CollectionConfig = {
  slug: 'files',
  labels: { singular: { ru: 'Файл заявки', en: 'Inquiry file' }, plural: { ru: 'Файлы заявок', en: 'Inquiry files' } },
  admin: { group: { ru: 'Продажи', en: 'Sales' }, defaultColumns: ['filename', 'mimeType', 'filesize', 'createdAt'] },
  access: {
    read: ownerOrManager('owner'),
    create: ({ req }) => req.payloadAPI === 'local' || isManager({ req }),
    update: isManager,
    delete: isAdmin,
  },
  upload: {
    staticDir: path.resolve(dirname, '../../private-files'),
    mimeTypes: ['image/jpeg', 'image/png', 'image/heic', 'image/heif', 'application/pdf'],
    disableLocalStorage: false,
  },
  fields: [
    {
      name: 'owner',
      type: 'relationship',
      relationTo: 'customers',
      index: true,
      label: { ru: 'Покупатель', en: 'Customer' },
      admin: { readOnly: true, position: 'sidebar' },
    },
  ],
}
