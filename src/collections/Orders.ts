import type { CollectionConfig, Field } from 'payload'
import { isAdmin, isManager, ownerOrManager } from '@/lib/access'
import { nextNumber } from '@/lib/sequences'
import { restockOrder } from '@/lib/stock'
import { sendOrderStatusEmail } from '@/emails/send'

export const orderStatuses = ['new', 'confirmed', 'production', 'ready', 'delivered', 'cancelled'] as const
export type OrderStatus = (typeof orderStatuses)[number]

const statusOptions = [
  { label: { ru: 'Новый', en: 'New' }, value: 'new' },
  { label: { ru: 'Подтверждён', en: 'Confirmed' }, value: 'confirmed' },
  { label: { ru: 'В производстве', en: 'In production' }, value: 'production' },
  { label: { ru: 'Готов к отправке', en: 'Ready to ship' }, value: 'ready' },
  { label: { ru: 'Доставлен', en: 'Delivered' }, value: 'delivered' },
  { label: { ru: 'Отменён', en: 'Cancelled' }, value: 'cancelled' },
]

const money = (name: string, ru: string, en: string): Field => ({ name, type: 'number', defaultValue: 0, label: { ru, en } })

export const Orders: CollectionConfig = {
  slug: 'orders',
  labels: {
    singular: { ru: 'Заказ', en: 'Order' },
    plural: { ru: 'Заказы', en: 'Orders' },
  },
  admin: {
    useAsTitle: 'number',
    defaultColumns: ['number', 'status', 'contact.name', 'totals.total', 'locale', 'createdAt'],
    group: { ru: 'Продажи', en: 'Sales' },
  },
  defaultSort: '-createdAt',
  access: {
    // покупатель читает только свои заказы; гость — по одноразовому токену на сервере
    read: ownerOrManager('customer'),
    create: ({ req }) => req.payloadAPI === 'local' || isManager({ req }),
    update: isManager,
    delete: isAdmin,
  },
  hooks: {
    beforeChange: [
      async ({ data, operation, originalDoc, req }) => {
        if (operation === 'create' && !data.number) data.number = await nextNumber(req.payload, 'order')
        const at = new Date().toISOString()
        if (operation === 'create') {
          if (!data.statusHistory?.length) data.statusHistory = [{ status: data.status ?? 'new', at, note: '' }]
        } else if (data.status && data.status !== originalDoc?.status) {
          data.statusHistory = [...((originalDoc?.statusHistory as unknown[]) ?? []), { status: data.status, at, note: '' }]
        }
        return data
      },
    ],
    afterChange: [
      async ({ doc, previousDoc, operation, req, context }) => {
        if (operation !== 'update' || !previousDoc || previousDoc.status === doc.status) return doc
        // Отмена возвращает остатки
        if (doc.status === 'cancelled' && previousDoc.status !== 'cancelled') await restockOrder(req.payload, doc, req)
        // Письмо покупателю на языке заказа
        if (!context?.skipEmail) {
          try {
            await sendOrderStatusEmail(req.payload, doc)
          } catch (error) {
            req.payload.logger.error({ err: error, msg: `письмо о смене статуса ${doc.number} не отправлено` })
          }
        }
        return doc
      },
    ],
  },
  fields: [
    { name: 'number', type: 'text', unique: true, index: true, label: { ru: 'Номер', en: 'Number' }, admin: { readOnly: true } },
    {
      type: 'row',
      fields: [
        { name: 'status', type: 'select', defaultValue: 'new', required: true, options: statusOptions, label: { ru: 'Статус', en: 'Status' } },
        {
          name: 'paymentStatus',
          type: 'select',
          defaultValue: 'pending',
          label: { ru: 'Оплата', en: 'Payment' },
          options: [
            { label: { ru: 'Ожидает', en: 'Pending' }, value: 'pending' },
            { label: { ru: 'Оплачен', en: 'Paid' }, value: 'paid' },
            { label: { ru: 'Возврат', en: 'Refunded' }, value: 'refunded' },
          ],
        },
        {
          name: 'paymentMethod',
          type: 'select',
          defaultValue: 'manual',
          label: { ru: 'Способ оплаты', en: 'Payment method' },
          options: [
            { label: { ru: 'После подтверждения менеджером', en: 'After manager confirmation' }, value: 'manual' },
            { label: { ru: 'Картой онлайн', en: 'Card online' }, value: 'card' },
          ],
        },
      ],
    },
    { name: 'customer', type: 'relationship', relationTo: 'customers', index: true, label: { ru: 'Покупатель', en: 'Customer' } },
    {
      name: 'contact',
      type: 'group',
      label: { ru: 'Контакты', en: 'Contact' },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'name', type: 'text', required: true, label: { ru: 'Имя', en: 'Name' } },
            { name: 'phone', type: 'text', required: true, label: { ru: 'Телефон', en: 'Phone' } },
            { name: 'email', type: 'email', required: true, label: { ru: 'Email', en: 'Email' } },
          ],
        },
      ],
    },
    {
      name: 'items',
      type: 'array',
      label: { ru: 'Позиции (снимок)', en: 'Items (snapshot)' },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'product', type: 'relationship', relationTo: 'products' },
            { name: 'title', type: 'text', required: true },
            { name: 'variantSku', type: 'text' },
            { name: 'variantLabel', type: 'text' },
          ],
        },
        {
          type: 'row',
          fields: [
            { name: 'qty', type: 'number', required: true, min: 1 },
            { name: 'unitPrice', type: 'number', required: true },
            { name: 'lineTotal', type: 'number', required: true },
            { name: 'reserved', type: 'number', defaultValue: 0, admin: { description: { ru: 'Списано со склада', en: 'Taken from stock' } } },
          ],
        },
        { name: 'image', type: 'text' },
        { name: 'slug', type: 'text' },
        { name: 'leadTime', type: 'text' },
      ],
    },
    {
      name: 'totals',
      type: 'group',
      label: { ru: 'Суммы, центы', en: 'Totals, cents' },
      fields: [
        {
          type: 'row',
          fields: [
            money('subtotal', 'Подытог', 'Subtotal'),
            money('bundleDiscount', 'Скидка комплекта', 'Bundle discount'),
            money('promoDiscount', 'Скидка по промокоду', 'Promo discount'),
          ],
        },
        {
          type: 'row',
          fields: [
            money('delivery', 'Доставка', 'Delivery'),
            money('services', 'Подъём и сборка', 'Lift & assembly'),
            money('total', 'Итого', 'Total'),
          ],
        },
        { name: 'currency', type: 'text', defaultValue: 'EUR' },
      ],
    },
    { name: 'promoCode', type: 'text', label: { ru: 'Промокод', en: 'Promo code' } },
    {
      name: 'delivery',
      type: 'group',
      label: { ru: 'Доставка', en: 'Delivery' },
      fields: [
        {
          name: 'method',
          type: 'select',
          options: [
            { label: { ru: 'По городу', en: 'City' }, value: 'city' },
            { label: { ru: 'По стране', en: 'Country' }, value: 'country' },
            { label: { ru: 'Самовывоз', en: 'Pick-up' }, value: 'pickup' },
          ],
        },
        {
          type: 'row',
          fields: [
            { name: 'city', type: 'text' },
            { name: 'postalCode', type: 'text' },
            { name: 'street', type: 'text' },
            { name: 'apartment', type: 'text' },
          ],
        },
        {
          type: 'row',
          fields: [
            { name: 'floor', type: 'number' },
            { name: 'elevator', type: 'checkbox' },
            { name: 'lift', type: 'checkbox', label: { ru: 'Подъём', en: 'Carry upstairs' } },
            { name: 'assembly', type: 'checkbox', label: { ru: 'Сборка', en: 'Assembly' } },
          ],
        },
        { name: 'date', type: 'date', label: { ru: 'Желаемая дата', en: 'Preferred date' } },
      ],
    },
    { name: 'comment', type: 'textarea', label: { ru: 'Комментарий', en: 'Comment' } },
    { name: 'newsletter', type: 'checkbox', defaultValue: false },
    {
      name: 'statusHistory',
      type: 'array',
      label: { ru: 'История статусов', en: 'Status history' },
      admin: { readOnly: true },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'status', type: 'select', options: statusOptions },
            { name: 'at', type: 'date', admin: { date: { pickerAppearance: 'dayAndTime' } } },
            { name: 'note', type: 'text' },
          ],
        },
      ],
    },
    {
      name: 'locale',
      type: 'select',
      defaultValue: 'ru',
      label: { ru: 'Язык заказа', en: 'Order language' },
      admin: { position: 'sidebar' },
      options: ['ru', 'en', 'sr'].map((v) => ({ label: v.toUpperCase(), value: v })),
    },
    { name: 'utm', type: 'json', admin: { position: 'sidebar' } },
    { name: 'accessToken', type: 'text', index: true, admin: { readOnly: true, position: 'sidebar' }, access: { read: ({ req }) => req.user?.collection === 'users' } },
    { name: 'idempotencyKey', type: 'text', unique: true, index: true, admin: { readOnly: true, position: 'sidebar' } },
    { name: 'managerNote', type: 'textarea', label: { ru: 'Заметка менеджера', en: 'Manager note' }, admin: { position: 'sidebar' } },
  ],
}
