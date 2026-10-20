import type { CollectionConfig } from 'payload'
import { isManager } from '@/lib/access'

/** Промокоды: проверяются только на сервере */
export const PromoCodes: CollectionConfig = {
  slug: 'promoCodes',
  labels: { singular: { ru: 'Промокод', en: 'Promo code' }, plural: { ru: 'Промокоды', en: 'Promo codes' } },
  admin: { useAsTitle: 'code', defaultColumns: ['code', 'kind', 'value', 'active', 'validTo'], group: { ru: 'Продажи', en: 'Sales' } },
  access: { read: isManager, create: isManager, update: isManager, delete: isManager },
  fields: [
    {
      name: 'code',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      hooks: { beforeValidate: [({ value }) => (typeof value === 'string' ? value.trim().toUpperCase() : value)] },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'kind',
          type: 'select',
          required: true,
          defaultValue: 'percent',
          options: [
            { label: { ru: 'Процент', en: 'Percent' }, value: 'percent' },
            { label: { ru: 'Сумма, центы', en: 'Amount, cents' }, value: 'amount' },
          ],
        },
        { name: 'value', type: 'number', required: true, min: 0 },
        { name: 'minTotal', type: 'number', min: 0, label: { ru: 'Минимальная сумма, центы', en: 'Minimum total, cents' } },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'validFrom', type: 'date' },
        { name: 'validTo', type: 'date' },
      ],
    },
    { name: 'active', type: 'checkbox', defaultValue: true },
    { name: 'usageLimit', type: 'number', min: 0, label: { ru: 'Лимит использований', en: 'Usage limit' } },
    { name: 'usedCount', type: 'number', defaultValue: 0, admin: { readOnly: true } },
  ],
}
