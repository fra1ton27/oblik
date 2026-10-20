import type { CollectionConfig } from 'payload'
import { isAdmin, isManager, ownerOrManager } from '@/lib/access'
import { nextNumber } from '@/lib/sequences'

export const inquiryTypes = ['contact', 'custom', 'question', 'newsletter'] as const
export const inquiryStatuses = ['new', 'in_progress', 'offer_sent', 'closed'] as const

/** Заявки со всех форм сайта: обратная связь, индивидуальный заказ, вопрос по товару, подписка */
export const Inquiries: CollectionConfig = {
  slug: 'inquiries',
  labels: { singular: { ru: 'Заявка', en: 'Inquiry' }, plural: { ru: 'Заявки', en: 'Inquiries' } },
  admin: {
    useAsTitle: 'number',
    defaultColumns: ['number', 'type', 'status', 'name', 'email', 'locale', 'createdAt'],
    group: { ru: 'Продажи', en: 'Sales' },
  },
  defaultSort: '-createdAt',
  access: {
    // создание всем — но только через Server Actions с антиспамом (Local API), не через публичный REST
    create: ({ req }) => req.payloadAPI === 'local' || isManager({ req }),
    read: ownerOrManager('customer'),
    update: isManager,
    delete: isAdmin,
  },
  hooks: {
    beforeChange: [
      async ({ data, operation, req }) => {
        if (operation === 'create' && !data.number) data.number = await nextNumber(req.payload, 'inquiry')
        return data
      },
    ],
  },
  fields: [
    { name: 'number', type: 'text', unique: true, index: true, admin: { readOnly: true }, label: { ru: 'Номер', en: 'Number' } },
    {
      type: 'row',
      fields: [
        {
          name: 'type',
          type: 'select',
          required: true,
          label: { ru: 'Тип', en: 'Type' },
          options: [
            { label: { ru: 'Обратная связь', en: 'Contact' }, value: 'contact' },
            { label: { ru: 'Индивидуальный заказ', en: 'Custom order' }, value: 'custom' },
            { label: { ru: 'Вопрос по товару', en: 'Product question' }, value: 'question' },
            { label: { ru: 'Подписка', en: 'Newsletter' }, value: 'newsletter' },
          ],
        },
        {
          name: 'status',
          type: 'select',
          defaultValue: 'new',
          label: { ru: 'Статус', en: 'Status' },
          options: [
            { label: { ru: 'Новая', en: 'New' }, value: 'new' },
            { label: { ru: 'В работе', en: 'In progress' }, value: 'in_progress' },
            { label: { ru: 'Предложение отправлено', en: 'Offer sent' }, value: 'offer_sent' },
            { label: { ru: 'Закрыта', en: 'Closed' }, value: 'closed' },
          ],
        },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'name', type: 'text', label: { ru: 'Имя', en: 'Name' } },
        { name: 'phone', type: 'text', label: { ru: 'Телефон', en: 'Phone' } },
        { name: 'email', type: 'email', label: { ru: 'Email', en: 'Email' } },
      ],
    },
    { name: 'product', type: 'relationship', relationTo: 'products', label: { ru: 'Товар', en: 'Product' } },
    { name: 'data', type: 'json', label: { ru: 'Данные формы', en: 'Form data' } },
    { name: 'files', type: 'upload', relationTo: 'files', hasMany: true, label: { ru: 'Файлы', en: 'Files' } },
    { name: 'customer', type: 'relationship', relationTo: 'customers', index: true, label: { ru: 'Покупатель', en: 'Customer' } },
    { name: 'managerNote', type: 'textarea', label: { ru: 'Заметка менеджера', en: 'Manager note' } },
    {
      name: 'locale',
      type: 'select',
      defaultValue: 'ru',
      admin: { position: 'sidebar' },
      options: ['ru', 'en', 'sr'].map((v) => ({ label: v.toUpperCase(), value: v })),
    },
    { name: 'sourcePage', type: 'text', admin: { position: 'sidebar' }, label: { ru: 'Страница-источник', en: 'Source page' } },
    { name: 'utm', type: 'json', admin: { position: 'sidebar' } },
  ],
}
