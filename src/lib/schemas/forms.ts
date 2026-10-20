import { z } from 'zod'
import { antispam, consent, email, msg, optionalEmail, optionalPhone, optionalText, phone, requiredText } from './common'

/** Одна zod-схема на клиенте и сервере для каждой формы (раздел 10 ТЗ) */

export const newsletterSchema = z.object({
  email,
  consent,
  ...antispam,
})
export type NewsletterInput = z.infer<typeof newsletterSchema>

export const contactTopics = ['product', 'delivery', 'partnership', 'other'] as const

export const contactSchema = z
  .object({
    name: requiredText(120),
    phone: optionalPhone,
    email: optionalEmail,
    topic: z.enum(contactTopics, msg('choose')),
    message: requiredText(4000),
    consent,
    ...antispam,
  })
  .refine((v) => Boolean(v.phone) || Boolean(v.email), { message: 'contactRequired', path: ['phone'] })
export type ContactInput = z.infer<typeof contactSchema>

export const questionSchema = z
  .object({
    name: requiredText(120),
    phone: optionalPhone,
    email: optionalEmail,
    question: requiredText(4000),
    productId: z.union([z.string(), z.number()]).optional(),
    variantSku: z.string().optional(),
    consent,
    ...antispam,
  })
  .refine((v) => Boolean(v.phone) || Boolean(v.email), { message: 'contactRequired', path: ['phone'] })
export type QuestionInput = z.infer<typeof questionSchema>

export const furnitureTypes = ['sofa', 'armchair', 'table', 'chair', 'storage', 'bed', 'kitchen', 'other'] as const
export const budgetRanges = ['lt1000', '1000_3000', '3000_6000', 'gt6000', 'unknown'] as const
export const timeframes = ['asap', '1_2m', '3_6m', 'flexible'] as const
export const channels = ['phone', 'whatsapp', 'viber', 'telegram', 'email'] as const

const dimension = z
  .union([z.literal(''), z.coerce.number(msg('number')).int(msg('number')).min(10, msg('dimensions')).max(1000, msg('dimensions'))])
  .optional()

export const customSchema = z.object({
  furnitureType: z.enum(furnitureTypes, msg('choose')),
  width: dimension,
  depth: dimension,
  height: dimension,
  material: optionalText(200),
  budget: z.enum(budgetRanges).optional().or(z.literal('')),
  timeframe: z.enum(timeframes).optional().or(z.literal('')),
  description: optionalText(4000),
  name: requiredText(120),
  phone,
  email: optionalEmail,
  channel: z.enum(channels).optional().or(z.literal('')),
  productId: z.union([z.string(), z.number()]).optional(),
  consent,
  ...antispam,
})
export type CustomInput = z.infer<typeof customSchema>
