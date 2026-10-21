import { z } from 'zod'
import { antispam, consent, email, msg, optionalPhone, optionalText, requiredText } from './common'

/** Пароль покупателя: от 8 символов (раздел 9.1 ТЗ), надёжность только подсказывается индикатором */
export const password = z.string(msg('required')).min(8, msg('passwordShort')).max(128, msg('tooLong'))

const anyPassword = z.string(msg('required')).min(1, msg('required')).max(128, msg('tooLong'))

export const loginSchema = z.object({
  email,
  password: anyPassword,
  remember: z.boolean(),
})
export type LoginInput = z.infer<typeof loginSchema>

export const registerSchema = z.object({
  name: requiredText(120),
  email,
  phone: optionalPhone,
  password,
  consent,
  ...antispam,
})
export type RegisterInput = z.infer<typeof registerSchema>

export const forgotSchema = z.object({ email })
export type ForgotInput = z.infer<typeof forgotSchema>

export const resetSchema = z
  .object({
    token: z.string().min(10).max(200),
    password,
    confirm: z.string(msg('required')).min(1, msg('required')),
  })
  .refine((d) => d.password === d.confirm, { ...msg('passwordMismatch'), path: ['confirm'] })
export type ResetInput = z.infer<typeof resetSchema>

export const profileSchema = z.object({
  name: requiredText(120),
  phone: optionalPhone,
  locale: z.enum(['ru', 'en', 'sr']),
  newsletter: z.boolean(),
})
export type ProfileInput = z.infer<typeof profileSchema>

export const passwordChangeSchema = z
  .object({
    current: anyPassword,
    next: password,
    confirm: z.string(msg('required')).min(1, msg('required')),
  })
  .refine((d) => d.next === d.confirm, { ...msg('passwordMismatch'), path: ['confirm'] })
export type PasswordChangeInput = z.infer<typeof passwordChangeSchema>

export const emailChangeSchema = z.object({ email, password: anyPassword })
export type EmailChangeInput = z.infer<typeof emailChangeSchema>

export const addressSchema = z.object({
  label: optionalText(60),
  city: requiredText(80),
  postalCode: optionalText(12),
  street: requiredText(160),
  apartment: optionalText(20),
  floor: z
    .string()
    .trim()
    .refine((v) => v === '' || /^-?\d{1,3}$/.test(v), msg('number')),
  elevator: z.boolean(),
  isDefault: z.boolean(),
})
export type AddressInput = z.infer<typeof addressSchema>

/**
 * Оценка надёжности пароля 0–4 для индикатора: длина, разнообразие символов, без повторов
 * и очевидных последовательностей. Это подсказка, а не требование — сервер проверяет только длину.
 */
export function passwordStrength(value: string): 0 | 1 | 2 | 3 | 4 {
  if (!value) return 0
  let score = 0
  if (value.length >= 8) score++
  if (value.length >= 12) score++
  const classes = [/[a-zа-яčćđšž]/, /[A-ZА-ЯČĆĐŠŽ]/, /\d/, /[^\p{L}\d]/u].filter((r) => r.test(value)).length
  if (classes >= 2) score++
  if (classes >= 3) score++
  // очевидные куски (1234, qwerty, «пароль») штрафуем, только если без них пароль почти пуст: фраза-пароль остаётся надёжной
  const stripped = value.toLowerCase().replace(/(0123|1234|2345|3456|4567|5678|6789|qwer|asdf|йцук|password|parol|lozinka)/g, '')
  const weak = /^(.)\1+$/.test(value) || stripped.length < 6
  if (weak) score = Math.min(score, 1)
  if (value.length < 8) score = Math.min(score, 1)
  return Math.min(4, score) as 0 | 1 | 2 | 3 | 4
}
