import { isValidPhoneNumber } from 'libphonenumber-js/min'
import { z } from 'zod'

/**
 * Общие куски zod-схем. Сообщения об ошибках — ключи неймспейса validation,
 * переводятся на клиенте и сервере одинаково: t(`validation.${message}`).
 */
export type ValidationKey =
  | 'required'
  | 'email'
  | 'phone'
  | 'contactRequired'
  | 'consent'
  | 'tooShort'
  | 'tooLong'
  | 'passwordShort'
  | 'passwordMismatch'
  | 'number'
  | 'dimensions'
  | 'date'
  | 'files'
  | 'choose'

const msg = (key: ValidationKey) => ({ message: key })

export const requiredText = (max = 200) =>
  z.string(msg('required')).trim().min(1, msg('required')).max(max, msg('tooLong'))

export const optionalText = (max = 2000) => z.string().trim().max(max, msg('tooLong')).optional().or(z.literal(''))

export const email = z.string(msg('required')).trim().min(1, msg('required')).email(msg('email')).max(160, msg('tooLong'))

export const optionalEmail = z
  .string()
  .trim()
  .max(160, msg('tooLong'))
  .refine((v) => v === '' || z.string().email().safeParse(v).success, msg('email'))
  .optional()

export const phone = z
  .string(msg('required'))
  .trim()
  .min(1, msg('required'))
  .refine((v) => isValidPhoneNumber(v), msg('phone'))

export const optionalPhone = z
  .string()
  .trim()
  .refine((v) => v === '' || isValidPhoneNumber(v), msg('phone'))
  .optional()

export const consent = z.literal(true, msg('consent'))

/** Антиспам: ловушка и время заполнения (проверяются на сервере) */
export const antispam = {
  website: z.string().max(0).optional().or(z.literal('')),
  startedAt: z.number().optional(),
}

export { msg }
