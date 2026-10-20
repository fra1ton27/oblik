import type { CollectionConfig } from 'payload'
import { isAdmin, isStaff } from '@/lib/access'

/** Сотрудники: админы, менеджеры, контент-редакторы. В кабинет покупателя не попадают. */
export const Users: CollectionConfig = {
  slug: 'users',
  labels: {
    singular: { ru: 'Сотрудник', en: 'Staff member' },
    plural: { ru: 'Сотрудники', en: 'Staff' },
  },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'name', 'role'],
    group: { ru: 'Система', en: 'System' },
  },
  auth: {
    maxLoginAttempts: 5,
    lockTime: 15 * 60 * 1000,
    cookies: { sameSite: 'Lax', secure: process.env.NODE_ENV === 'production' },
  },
  access: {
    admin: ({ req }) => req.user?.collection === 'users',
    read: isStaff,
    create: isAdmin,
    update: ({ req }) => {
      if (req.user?.collection !== 'users') return false
      if (req.user.role === 'admin') return true
      return { id: { equals: req.user.id } }
    },
    delete: isAdmin,
  },
  fields: [
    { name: 'name', type: 'text', label: { ru: 'Имя', en: 'Name' } },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'manager',
      saveToJWT: true,
      label: { ru: 'Роль', en: 'Role' },
      options: [
        { label: { ru: 'Администратор', en: 'Admin' }, value: 'admin' },
        { label: { ru: 'Менеджер', en: 'Manager' }, value: 'manager' },
        { label: { ru: 'Контент', en: 'Content' }, value: 'content' },
      ],
      access: {
        update: ({ req }) => req.user?.collection === 'users' && req.user.role === 'admin',
      },
    },
  ],
}
