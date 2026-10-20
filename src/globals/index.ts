import type { GlobalConfig } from 'payload'
import { isAdmin, isContentEditor } from '@/lib/access'
import { routeField } from '@/fields'
import { layoutField } from '@/blocks/configs'
import { revalidate, tags } from '@/lib/revalidate'

const revalidateGlobal = (slug: string) => () => revalidate(tags.global(slug))

export const Header: GlobalConfig = {
  slug: 'header',
  label: { ru: 'Шапка', en: 'Header' },
  admin: { group: { ru: 'Сайт', en: 'Site' } },
  access: { read: () => true, update: isContentEditor },
  hooks: { afterChange: [revalidateGlobal('header')] },
  fields: [
    {
      name: 'items',
      type: 'array',
      label: { ru: 'Пункты меню', en: 'Menu items' },
      maxRows: 7,
      fields: [
        { name: 'label', type: 'text', required: true, localized: true },
        routeField('route', true),
      ],
    },
  ],
}

export const Footer: GlobalConfig = {
  slug: 'footer',
  label: { ru: 'Подвал', en: 'Footer' },
  admin: { group: { ru: 'Сайт', en: 'Site' } },
  access: { read: () => true, update: isContentEditor },
  hooks: { afterChange: [revalidateGlobal('footer')] },
  fields: [
    {
      name: 'columns',
      type: 'array',
      label: { ru: 'Колонки ссылок', en: 'Link columns' },
      maxRows: 3,
      fields: [
        { name: 'title', type: 'text', required: true, localized: true },
        {
          name: 'links',
          type: 'array',
          fields: [
            { name: 'label', type: 'text', required: true, localized: true },
            routeField('route'),
            { name: 'hash', type: 'text', label: { ru: 'Якорь (#…)', en: 'Anchor (#…)' } },
            { name: 'category', type: 'relationship', relationTo: 'categories', label: { ru: 'или категория каталога', en: 'or catalogue category' } },
          ],
        },
      ],
    },
    {
      name: 'socials',
      type: 'array',
      label: { ru: 'Соцсети и мессенджеры', en: 'Social & messengers' },
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'url', type: 'text', required: true },
      ],
    },
  ],
}

export const Homepage: GlobalConfig = {
  slug: 'homepage',
  label: { ru: 'Главная', en: 'Homepage' },
  admin: { group: { ru: 'Сайт', en: 'Site' } },
  access: { read: () => true, update: isContentEditor },
  hooks: { afterChange: [revalidateGlobal('homepage')] },
  fields: [
    layoutField(),
    {
      name: 'meta',
      type: 'group',
      label: 'SEO',
      fields: [
        { name: 'title', type: 'text', localized: true },
        { name: 'description', type: 'textarea', localized: true },
      ],
    },
  ],
}

export const SiteSettings: GlobalConfig = {
  slug: 'siteSettings',
  label: { ru: 'Настройки сайта', en: 'Site settings' },
  admin: { group: { ru: 'Сайт', en: 'Site' } },
  access: { read: () => true, update: isAdmin },
  hooks: { afterChange: [revalidateGlobal('siteSettings')] },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: { ru: 'Бренд и контакты', en: 'Brand & contacts' },
          fields: [
            { name: 'brandName', type: 'text', defaultValue: 'Oblik', label: { ru: 'Название бренда', en: 'Brand name' } },
            {
              type: 'row',
              fields: [
                { name: 'phone', type: 'text', label: { ru: 'Телефон', en: 'Phone' } },
                { name: 'email', type: 'email', label: 'Email' },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'whatsapp', type: 'text' },
                { name: 'viber', type: 'text' },
                { name: 'telegram', type: 'text' },
              ],
            },
            { name: 'address', type: 'text', localized: true, label: { ru: 'Адрес шоурума', en: 'Showroom address' } },
            {
              name: 'hours',
              type: 'array',
              label: { ru: 'Часы работы', en: 'Opening hours' },
              fields: [
                { name: 'days', type: 'text', required: true, localized: true },
                { name: 'time', type: 'text', required: true },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'mapLat', type: 'number', label: { ru: 'Широта', en: 'Latitude' } },
                { name: 'mapLng', type: 'number', label: { ru: 'Долгота', en: 'Longitude' } },
              ],
            },
            { name: 'mapImage', type: 'upload', relationTo: 'media', label: { ru: 'Статичная карта', en: 'Static map image' } },
            {
              name: 'openingHoursSpec',
              type: 'text',
              label: { ru: 'Часы для поисковиков', en: 'Hours for search engines' },
              defaultValue: 'Mo-Fr 10:00-19:00, Sa 11:00-17:00',
            },
          ],
        },
        {
          label: { ru: 'Деньги и доставка', en: 'Money & delivery' },
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'currency', type: 'text', defaultValue: 'EUR', label: { ru: 'Базовая валюта', en: 'Base currency' } },
                { name: 'displayCurrency', type: 'text', defaultValue: 'RSD', label: { ru: 'Вторая валюта (показ)', en: 'Display currency' } },
                { name: 'displayRate', type: 'number', defaultValue: 117.2, label: { ru: 'Курс к базовой', en: 'Rate' } },
              ],
            },
            {
              name: 'deliveryZones',
              type: 'array',
              label: { ru: 'Зоны доставки', en: 'Delivery zones' },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'code',
                      type: 'select',
                      required: true,
                      options: [
                        { label: { ru: 'По городу', en: 'City' }, value: 'city' },
                        { label: { ru: 'По стране', en: 'Country' }, value: 'country' },
                        { label: { ru: 'Самовывоз', en: 'Pick-up' }, value: 'pickup' },
                      ],
                    },
                    { name: 'price', type: 'number', defaultValue: 0, label: { ru: 'Цена, центы', en: 'Price, cents' } },
                    { name: 'freeFrom', type: 'number', label: { ru: 'Бесплатно от, центы', en: 'Free from, cents' } },
                  ],
                },
                { name: 'label', type: 'text', localized: true },
                { name: 'description', type: 'text', localized: true },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'liftPrice', type: 'number', defaultValue: 2000, label: { ru: 'Подъём на лифте, центы', en: 'Lift (elevator), cents' } },
                { name: 'liftPerFloor', type: 'number', defaultValue: 800, label: { ru: 'Подъём без лифта за этаж', en: 'No elevator, per floor' } },
                { name: 'assemblyPrice', type: 'number', defaultValue: 4500, label: { ru: 'Сборка, центы', en: 'Assembly, cents' } },
              ],
            },
          ],
        },
        {
          label: { ru: 'Заявки и письма', en: 'Requests & email' },
          fields: [
            { name: 'responseTime', type: 'text', localized: true, label: { ru: 'Срок ответа на заявки', en: 'Response time' } },
            {
              name: 'managerEmails',
              type: 'array',
              label: { ru: 'Email менеджеров', en: 'Manager emails' },
              fields: [{ name: 'email', type: 'email', required: true }],
            },
            {
              name: 'defaultProductFaq',
              type: 'array',
              label: { ru: 'FAQ товара по умолчанию', en: 'Default product FAQ' },
              fields: [
                { name: 'question', type: 'text', required: true, localized: true },
                { name: 'answer', type: 'textarea', required: true, localized: true },
              ],
            },
          ],
        },
        {
          label: { ru: 'Техработы', en: 'Maintenance' },
          fields: [
            { name: 'maintenance', type: 'checkbox', defaultValue: false, label: { ru: 'Режим техработ', en: 'Maintenance mode' } },
            { name: 'maintenanceMessage', type: 'textarea', localized: true },
          ],
        },
      ],
    },
  ],
}

export const globals = [Header, Footer, Homepage, SiteSettings]
