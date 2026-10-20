import type { CollectionBeforeChangeHook, CollectionConfig } from 'payload'
import { isContentEditor, publishedOrStaff } from '@/lib/access'
import { accentOptions, missingTranslationsField, slugField, statusField, trackTranslationsHook, uniqueSlugHook } from '@/fields'
import { layoutField } from '@/blocks/configs'
import { revalidate, tags } from '@/lib/revalidate'
import { createSlugRedirect } from '@/lib/redirects'

/** Цвета и материалы для фильтров каталога собираются из вариантов автоматически */
const collectFacets: CollectionBeforeChangeHook = async ({ data, req }) => {
  const ids = new Set<number | string>()
  for (const v of data?.variants ?? []) {
    for (const key of ['fabric', 'finish'] as const) {
      const ref = v?.[key]
      if (ref) ids.add(typeof ref === 'object' ? ref.id : ref)
    }
  }
  for (const m of data?.materials ?? []) ids.add(typeof m === 'object' ? m.id : m)
  if (ids.size === 0) return data
  const found = await req.payload.find({
    collection: 'materials',
    where: { id: { in: [...ids] } },
    limit: 100,
    depth: 0,
    overrideAccess: true,
    req,
  })
  const colors = [...new Set(found.docs.map((m) => m.colorFamily).filter(Boolean))] as string[]
  return { ...data, colors }
}

export const Products: CollectionConfig = {
  slug: 'products',
  labels: {
    singular: { ru: 'Товар', en: 'Product' },
    plural: { ru: 'Товары', en: 'Products' },
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'sku', 'price', 'category', 'status', 'missingTranslations'],
    group: { ru: 'Каталог', en: 'Catalogue' },
    listSearchableFields: ['title', 'sku'],
  },
  access: {
    read: publishedOrStaff,
    create: isContentEditor,
    update: isContentEditor,
    delete: isContentEditor,
  },
  hooks: {
    beforeChange: [uniqueSlugHook('products'), collectFacets],
    afterChange: [
      trackTranslationsHook('products'),
      createSlugRedirect('products', '/furniture/[slug]', 'slug'),
      ({ doc, context }) => {
        if (!context?.skipRevalidate) revalidate(tags.products, tags.product(doc.id), tags.collections)
        return doc
      },
    ],
    afterDelete: [({ doc }) => revalidate(tags.products, tags.product(doc.id))],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: { ru: 'Основное', en: 'General' },
          fields: [
            { name: 'title', type: 'text', required: true, localized: true, label: { ru: 'Название', en: 'Title' } },
            {
              name: 'shortDescription',
              type: 'textarea',
              localized: true,
              label: { ru: 'Короткое описание', en: 'Short description' },
            },
            { name: 'description', type: 'richText', localized: true, label: { ru: 'Описание', en: 'Description' } },
            {
              type: 'row',
              fields: [
                { name: 'sku', type: 'text', required: true, unique: true, index: true, label: { ru: 'Артикул', en: 'SKU' } },
                {
                  name: 'price',
                  type: 'number',
                  required: true,
                  min: 0,
                  label: { ru: 'Цена, центы', en: 'Price, cents' },
                  admin: { description: { ru: '129000 = 1 290 €', en: '129000 = €1,290' } },
                },
                { name: 'compareAtPrice', type: 'number', min: 0, label: { ru: 'Старая цена, центы', en: 'Compare-at, cents' } },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'category', type: 'relationship', relationTo: 'categories', required: true, index: true, label: { ru: 'Категория', en: 'Category' } },
                { name: 'collection', type: 'relationship', relationTo: 'collections', index: true, label: { ru: 'Коллекция', en: 'Collection' } },
                { name: 'designer', type: 'relationship', relationTo: 'designers', label: { ru: 'Дизайнер', en: 'Designer' } },
              ],
            },
            { name: 'materials', type: 'relationship', relationTo: 'materials', hasMany: true, label: { ru: 'Материалы', en: 'Materials' } },
            {
              name: 'dimensions',
              type: 'group',
              label: { ru: 'Размеры, см / кг', en: 'Dimensions, cm / kg' },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'width', type: 'number', label: { ru: 'Ширина', en: 'Width' } },
                    { name: 'depth', type: 'number', label: { ru: 'Глубина', en: 'Depth' } },
                    { name: 'height', type: 'number', label: { ru: 'Высота', en: 'Height' } },
                    { name: 'seatHeight', type: 'number', label: { ru: 'Высота сиденья', en: 'Seat height' } },
                    { name: 'weight', type: 'number', label: { ru: 'Вес', en: 'Weight' } },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: { ru: 'Фото', en: 'Images' },
          fields: [
            {
              name: 'images',
              type: 'array',
              minRows: 1,
              label: { ru: 'Галерея (первое — главное)', en: 'Gallery (first is main)' },
              fields: [{ name: 'image', type: 'upload', relationTo: 'media', required: true }],
            },
            {
              name: 'cutout',
              type: 'upload',
              relationTo: 'media',
              label: { ru: 'Вырезка для витрины (PNG/WebP с прозрачностью)', en: 'Showcase cut-out (transparent)' },
            },
            {
              name: 'podiumColor',
              type: 'select',
              defaultValue: 'lavender',
              label: { ru: 'Цвет подиума', en: 'Podium colour' },
              options: accentOptions,
            },
          ],
        },
        {
          label: { ru: 'Варианты и наличие', en: 'Variants & stock' },
          fields: [
            {
              name: 'variantRequired',
              type: 'checkbox',
              defaultValue: true,
              label: { ru: 'Покупатель обязан выбрать вариант', en: 'Variant choice required' },
              admin: { description: { ru: 'Иначе в карточке есть быстрое «В корзину» с первым вариантом', en: 'Otherwise quick add uses the first variant' } },
            },
            {
              name: 'variants',
              type: 'array',
              label: { ru: 'Варианты', en: 'Variants' },
              labels: { singular: { ru: 'Вариант', en: 'Variant' }, plural: { ru: 'Варианты', en: 'Variants' } },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'sku', type: 'text', required: true, label: { ru: 'Артикул', en: 'SKU' } },
                    { name: 'size', type: 'text', localized: true, label: { ru: 'Размер', en: 'Size' } },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    { name: 'fabric', type: 'relationship', relationTo: 'materials', label: { ru: 'Ткань', en: 'Fabric' } },
                    { name: 'finish', type: 'relationship', relationTo: 'materials', label: { ru: 'Отделка', en: 'Finish' } },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    { name: 'price', type: 'number', min: 0, label: { ru: 'Цена варианта, центы', en: 'Variant price, cents' } },
                    { name: 'priceDelta', type: 'number', label: { ru: 'или надбавка, центы', en: 'or surcharge, cents' } },
                    { name: 'stock', type: 'number', defaultValue: 0, min: 0, label: { ru: 'Остаток', en: 'Stock' } },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    { name: 'leadTimeMin', type: 'number', label: { ru: 'Срок от, нед.', en: 'Lead time from, wks' } },
                    { name: 'leadTimeMax', type: 'number', label: { ru: 'Срок до, нед.', en: 'Lead time to, wks' } },
                  ],
                },
                { name: 'image', type: 'upload', relationTo: 'media', label: { ru: 'Фото варианта', en: 'Variant image' } },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'stock', type: 'number', defaultValue: 0, min: 0, label: { ru: 'Остаток (без вариантов)', en: 'Stock (no variants)' } },
                {
                  name: 'leadTimeWeeks',
                  type: 'group',
                  label: { ru: 'Срок изготовления, нед.', en: 'Lead time, weeks' },
                  fields: [
                    {
                      type: 'row',
                      fields: [
                        { name: 'min', type: 'number', defaultValue: 4 },
                        { name: 'max', type: 'number', defaultValue: 6 },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: { ru: 'Посадочная', en: 'Landing page' },
          fields: [
            layoutField(),
            {
              name: 'faq',
              type: 'array',
              label: { ru: 'Доставка, сборка, гарантия (FAQ)', en: 'Delivery, assembly, warranty (FAQ)' },
              fields: [
                { name: 'question', type: 'text', required: true, localized: true },
                { name: 'answer', type: 'textarea', required: true, localized: true },
              ],
            },
          ],
        },
      ],
    },
    slugField(),
    statusField,
    {
      name: 'badges',
      type: 'select',
      hasMany: true,
      label: { ru: 'Бейджи', en: 'Badges' },
      admin: { position: 'sidebar' },
      options: [
        { label: { ru: 'Новинка', en: 'New' }, value: 'new' },
        { label: { ru: 'Хит', en: 'Bestseller' }, value: 'bestseller' },
        { label: { ru: 'Скидка', en: 'Sale' }, value: 'sale' },
      ],
    },
    { name: 'featured', type: 'checkbox', defaultValue: false, label: { ru: 'В витрине каталога', en: 'In showcase' }, admin: { position: 'sidebar' } },
    { name: 'popularity', type: 'number', defaultValue: 0, label: { ru: 'Популярность (сортировка)', en: 'Popularity' }, admin: { position: 'sidebar' } },
    {
      name: 'colors',
      type: 'select',
      hasMany: true,
      label: { ru: 'Цвета для фильтра', en: 'Filter colours' },
      admin: { position: 'sidebar', readOnly: true, description: { ru: 'Собираются из материалов вариантов', en: 'Collected from variant materials' } },
      options: ['milk', 'sand', 'oak', 'walnut', 'graphite', 'green', 'blue', 'terracotta', 'lavender'].map((v) => ({ label: v, value: v })),
    },
    missingTranslationsField,
  ],
}
