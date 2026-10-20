import { z } from 'zod'
import { email, msg, optionalText, phone, requiredText } from './common'

/** Одна схема оформления заказа на клиенте и в Server Action placeOrder */
export const deliveryMethods = ['city', 'country', 'pickup'] as const

export const checkoutSchema = z
  .object({
    contacts: z.object({ name: requiredText(120), phone, email }),
    delivery: z.object({
      method: z.enum(deliveryMethods, msg('choose')),
      addressIndex: z.string().optional(),
      city: optionalText(120),
      street: optionalText(200),
      apartment: optionalText(40),
      postalCode: optionalText(20),
      floor: z.string().trim().refine((v) => v === '' || /^-?\d{1,3}$/.test(v), msg('number')).optional(),
      elevator: z.boolean().optional(),
      date: z.string().optional(),
      lift: z.boolean().optional(),
      assembly: z.boolean().optional(),
    }),
    payment: z.object({ method: z.literal('manual', msg('choose')) }),
    comment: optionalText(2000),
    consent: z.literal(true, msg('consent')),
    newsletter: z.boolean().optional(),
    promoCode: z.string().trim().max(40).optional(),
    idempotencyKey: z.string().min(8).max(80),
  })
  .superRefine((v, ctx) => {
    if (v.delivery.method !== 'pickup') {
      if (!v.delivery.city?.trim()) ctx.addIssue({ code: 'custom', message: 'required', path: ['delivery', 'city'] })
      if (!v.delivery.street?.trim()) ctx.addIssue({ code: 'custom', message: 'required', path: ['delivery', 'street'] })
    }
    if (v.delivery.date) {
      const d = new Date(v.delivery.date)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      if (Number.isNaN(d.getTime()) || d < today) ctx.addIssue({ code: 'custom', message: 'date', path: ['delivery', 'date'] })
    }
  })

export type CheckoutInput = z.infer<typeof checkoutSchema>

export const cartLineSchema = z.object({
  key: z.string(),
  productId: z.union([z.number(), z.string()]),
  variantSku: z.string().nullable(),
  qty: z.number().int().min(1).max(99),
  snapshot: z.object({ price: z.number(), title: z.string(), inStock: z.boolean().optional() }).partial().optional(),
})
export type CartLineInput = z.infer<typeof cartLineSchema>
