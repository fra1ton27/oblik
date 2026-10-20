import type { CollectionConfig } from 'payload'
import { isAdmin, ownerOrManager } from '@/lib/access'

/** Серверная корзина вошедшего покупателя (у гостя корзина в localStorage) */
export const Carts: CollectionConfig = {
  slug: 'carts',
  labels: { singular: { ru: 'Корзина', en: 'Cart' }, plural: { ru: 'Корзины', en: 'Carts' } },
  admin: { useAsTitle: 'id', defaultColumns: ['customer', 'updatedAt'], group: { ru: 'Продажи', en: 'Sales' } },
  access: {
    read: ownerOrManager('customer'),
    create: ({ req }) => req.payloadAPI === 'local',
    update: ownerOrManager('customer'),
    delete: isAdmin,
  },
  fields: [
    { name: 'customer', type: 'relationship', relationTo: 'customers', required: true, unique: true, index: true },
    {
      name: 'items',
      type: 'json',
      admin: { description: { ru: 'productId, variantSku, qty, снимок цены и названия', en: 'productId, variantSku, qty, price/title snapshot' } },
    },
  ],
}
