import type { Access, FieldAccess, PayloadRequest, Where } from 'payload'

type StaffRole = 'admin' | 'manager' | 'content'

type AnyUser = { id: number | string; collection?: string; role?: StaffRole | null }

function user(req: PayloadRequest): AnyUser | null {
  return (req.user as AnyUser | null) ?? null
}

export function staffRole(req: PayloadRequest): StaffRole | null {
  const u = user(req)
  if (!u || u.collection !== 'users') return null
  return u.role ?? 'manager'
}

export function customerId(req: PayloadRequest): number | string | null {
  const u = user(req)
  return u && u.collection === 'customers' ? u.id : null
}

export const anyone: Access = () => true
export const nobody: Access = () => false

export const isStaff: Access = ({ req }) => staffRole(req) !== null
export const isAdmin: Access = ({ req }) => staffRole(req) === 'admin'
export const isManager: Access = ({ req }) => {
  const role = staffRole(req)
  return role === 'admin' || role === 'manager'
}
export const isContentEditor: Access = ({ req }) => {
  const role = staffRole(req)
  return role === 'admin' || role === 'content' || role === 'manager'
}

export const isStaffField: FieldAccess = ({ req }) => staffRole(req) !== null

/** Сотрудники видят всё, остальные только опубликованное */
export const publishedOrStaff: Access = ({ req }) => {
  if (staffRole(req)) return true
  return { status: { equals: 'published' } } satisfies Where
}

/** Сотрудники-менеджеры видят всё, покупатель только свои записи по полю customer */
export function ownerOrManager(field = 'customer'): Access {
  return ({ req }) => {
    const role = staffRole(req)
    if (role === 'admin' || role === 'manager') return true
    const id = customerId(req)
    if (id === null) return false
    return { [field]: { equals: id } } satisfies Where
  }
}

/** Покупатель читает и меняет только свой профиль */
export const selfOrManager: Access = ({ req }) => {
  const role = staffRole(req)
  if (role === 'admin' || role === 'manager') return true
  const id = customerId(req)
  if (id === null) return false
  return { id: { equals: id } } satisfies Where
}
