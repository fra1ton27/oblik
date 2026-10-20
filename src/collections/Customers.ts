import type { CollectionConfig } from 'payload'
import { isAdmin, isManager, selfOrManager, staffRole } from '@/lib/access'
import { renderAuthEmail } from '@/emails/auth'
import { isLocale } from '@/i18n/routing'

/**
 * Покупатели: отдельная auth-коллекция (email + пароль, httpOnly-кука, подтверждение email,
 * восстановление пароля). Сотрудники живут в users и в кабинет покупателя не попадают.
 */
export const Customers: CollectionConfig = {
  slug: 'customers',
  labels: {
    singular: { ru: 'Покупатель', en: 'Customer' },
    plural: { ru: 'Покупатели', en: 'Customers' },
  },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'name', 'phone', 'locale', 'createdAt'],
    group: { ru: 'Продажи', en: 'Sales' },
  },
  auth: {
    tokenExpiration: 60 * 60 * 24 * 30,
    maxLoginAttempts: 5,
    lockTime: 15 * 60 * 1000,
    cookies: { sameSite: 'Lax', secure: process.env.NODE_ENV === 'production' },
    verify: {
      generateEmailSubject: ({ user }) =>
        renderAuthEmail('verify', isLocale(user?.locale) ? user.locale : 'ru', { token: '', name: user?.name }).subject,
      generateEmailHTML: ({ token, user }) =>
        renderAuthEmail('verify', isLocale(user?.locale) ? user.locale : 'ru', { token: token ?? '', name: user?.name }).html,
    },
    forgotPassword: {
      expiration: 60 * 60 * 1000,
      generateEmailSubject: (args) => {
        const user = args?.user as { locale?: string; name?: string } | undefined
        return renderAuthEmail('reset', isLocale(user?.locale) ? user.locale : 'ru', { token: '', name: user?.name }).subject
      },
      generateEmailHTML: (args) => {
        const user = args?.user as { locale?: string; name?: string } | undefined
        return renderAuthEmail('reset', isLocale(user?.locale) ? user.locale : 'ru', { token: args?.token ?? '', name: user?.name }).html
      },
    },
  },
  access: {
    // покупатели никогда не попадают в админку
    admin: () => false,
    create: () => true,
    read: selfOrManager,
    update: selfOrManager,
    delete: isAdmin,
    unlock: isManager,
  },
  fields: [
    { name: 'name', type: 'text', required: true, label: { ru: 'Имя', en: 'Name' } },
    { name: 'phone', type: 'text', label: { ru: 'Телефон', en: 'Phone' } },
    {
      name: 'locale',
      type: 'select',
      defaultValue: 'ru',
      label: { ru: 'Язык писем', en: 'Email language' },
      options: [
        { label: 'Русский', value: 'ru' },
        { label: 'English', value: 'en' },
        { label: 'Srpski', value: 'sr' },
      ],
    },
    { name: 'newsletter', type: 'checkbox', defaultValue: false, label: { ru: 'Подписка на рассылку', en: 'Newsletter' } },
    {
      name: 'addresses',
      type: 'array',
      label: { ru: 'Адреса', en: 'Addresses' },
      labels: { singular: { ru: 'Адрес', en: 'Address' }, plural: { ru: 'Адреса', en: 'Addresses' } },
      fields: [
        { name: 'label', type: 'text', label: { ru: 'Название', en: 'Label' } },
        {
          type: 'row',
          fields: [
            { name: 'city', type: 'text', required: true, label: { ru: 'Город', en: 'City' } },
            { name: 'postalCode', type: 'text', label: { ru: 'Индекс', en: 'Postcode' } },
          ],
        },
        { name: 'street', type: 'text', required: true, label: { ru: 'Улица и дом', en: 'Street and number' } },
        {
          type: 'row',
          fields: [
            { name: 'apartment', type: 'text', label: { ru: 'Квартира', en: 'Apartment' } },
            { name: 'floor', type: 'number', label: { ru: 'Этаж', en: 'Floor' } },
            { name: 'elevator', type: 'checkbox', label: { ru: 'Есть лифт', en: 'Lift available' } },
          ],
        },
        { name: 'isDefault', type: 'checkbox', label: { ru: 'По умолчанию', en: 'Default' } },
      ],
    },
    {
      name: 'favorites',
      type: 'relationship',
      relationTo: 'products',
      hasMany: true,
      label: { ru: 'Избранное', en: 'Wishlist' },
    },
    {
      name: 'pendingEmail',
      type: 'email',
      label: { ru: 'Новый email (ждёт подтверждения)', en: 'New email (pending)' },
      admin: { readOnly: true },
    },
    { name: 'pendingEmailToken', type: 'text', hidden: true },
    {
      name: 'deletionRequestedAt',
      type: 'date',
      label: { ru: 'Запрошено удаление данных', en: 'Data deletion requested' },
      admin: { readOnly: true, position: 'sidebar' },
      access: { update: ({ req }) => staffRole(req) !== null || Boolean(req.user) },
    },
  ],
}
