'use server'

import crypto from 'node:crypto'
import { cookies } from 'next/headers'
import { AuthenticationError, LockedAuth, UnverifiedEmail } from 'payload'
import { getPayloadClient } from '@/lib/payload'
import { clientIp, checkSpam, takeRateLimit } from '@/lib/antispam'
import { sendAuthEmail } from '@/emails/send'
import { claimGuestOrders } from '@/lib/claimOrders'
import { isLocale, type Locale } from '@/i18n/routing'
import { forgotSchema, loginSchema, registerSchema, resetSchema, type ForgotInput, type LoginInput, type RegisterInput, type ResetInput } from '@/lib/schemas/auth'
import { fieldErrorsFrom, type ActionResult } from './result'

type AuthError = 'invalidCredentials' | 'locked' | 'unverified' | 'rateLimited' | 'tokenInvalid' | 'spam' | 'generic'
type AuthResult<T = undefined> = ActionResult<T> & { error?: AuthError }

function loc(value: unknown): Locale {
  return isLocale(value) ? value : 'ru'
}

/**
 * Кука сессии Payload. Без «Запомнить меня» — сессионная (живёт до закрытия браузера),
 * с ним — до истечения токена (tokenExpiration коллекции customers, 30 дней).
 */
async function setSessionCookie(token: string, exp: number | undefined, remember: boolean) {
  const payload = await getPayloadClient()
  const store = await cookies()
  store.set(`${payload.config.cookiePrefix}-token`, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    ...(remember && exp ? { expires: new Date(exp * 1000) } : {}),
  })
}

export async function login(input: LoginInput): Promise<AuthResult> {
  const parsed = loginSchema.safeParse(input)
  if (!parsed.success) return { ok: false, fieldErrors: fieldErrorsFrom(parsed.error) }
  // поверх блокировки аккаунта Payload (5 попыток → 15 минут) ограничиваем перебор с одного IP
  if (!takeRateLimit(`login:${await clientIp()}`, 20)) return { ok: false, error: 'rateLimited' }
  const payload = await getPayloadClient()
  try {
    const res = await payload.login({ collection: 'customers', data: { email: parsed.data.email.toLowerCase(), password: parsed.data.password } })
    if (!res.token) return { ok: false, error: 'generic' }
    await setSessionCookie(res.token, res.exp, parsed.data.remember)
    const user = res.user as { id: number | string; email: string }
    try {
      await claimGuestOrders(payload, user)
    } catch (error) {
      payload.logger.error({ err: error, msg: 'гостевые заказы не привязаны' })
    }
    return { ok: true }
  } catch (error) {
    if (error instanceof LockedAuth) return { ok: false, error: 'locked' }
    if (error instanceof UnverifiedEmail) return { ok: false, error: 'unverified' }
    if (error instanceof AuthenticationError) return { ok: false, error: 'invalidCredentials' }
    payload.logger.error({ err: error, msg: 'вход покупателя не удался' })
    return { ok: false, error: 'generic' }
  }
}

/** Регистрация: язык писем = текущая локаль. Payload сам отправляет письмо подтверждения. */
export async function register(input: RegisterInput, meta: { locale: string }): Promise<AuthResult<{ email: string }>> {
  const parsed = registerSchema.safeParse(input)
  if (!parsed.success) return { ok: false, fieldErrors: fieldErrorsFrom(parsed.error) }
  const spam = await checkSpam(parsed.data, 'register')
  if (!spam.ok) return { ok: false, error: spam.reason === 'rateLimited' ? 'rateLimited' : 'spam' }
  const payload = await getPayloadClient()
  const emailValue = parsed.data.email.toLowerCase()
  const existing = await payload.find({ collection: 'customers', where: { email: { equals: emailValue } }, limit: 1, depth: 0, overrideAccess: true })
  if (existing.docs.length) return { ok: false, fieldErrors: { email: 'emailTaken' } }
  try {
    await payload.create({
      collection: 'customers',
      data: { name: parsed.data.name, email: emailValue, phone: parsed.data.phone || undefined, password: parsed.data.password, locale: loc(meta.locale) },
      overrideAccess: true,
    })
  } catch (error) {
    payload.logger.error({ err: error, msg: 'регистрация покупателя не удалась' })
    return { ok: false, error: 'generic' }
  }
  return { ok: true, data: { email: emailValue } }
}

/** Ссылка из письма подтверждения ведёт на страницу входа с ?verify=… */
export async function verifyEmailToken(token: string): Promise<boolean> {
  if (!token || token.length > 200) return false
  const payload = await getPayloadClient()
  try {
    return Boolean(await payload.verifyEmail({ collection: 'customers', token }))
  } catch {
    return false
  }
}

/** Повторное письмо подтверждения. Ответ одинаковый, есть такой аккаунт или нет. */
export async function resendVerification(input: ForgotInput): Promise<AuthResult> {
  const parsed = forgotSchema.safeParse(input)
  if (!parsed.success) return { ok: false, fieldErrors: fieldErrorsFrom(parsed.error) }
  if (!takeRateLimit(`verify:${await clientIp()}`, 5)) return { ok: false, error: 'rateLimited' }
  const payload = await getPayloadClient()
  const res = await payload.find({ collection: 'customers', where: { email: { equals: parsed.data.email.toLowerCase() } }, limit: 1, depth: 0, overrideAccess: true, showHiddenFields: true })
  const customer = res.docs[0] as (typeof res.docs)[number] & { _verified?: boolean | null }
  if (customer && !customer._verified) {
    const token = crypto.randomBytes(20).toString('hex')
    await payload.db.updateOne({ collection: 'customers', id: customer.id, data: { _verificationToken: token } })
    try {
      await sendAuthEmail(payload, 'verify', customer.email, customer.locale, { token, name: customer.name })
    } catch (error) {
      payload.logger.error({ err: error, msg: 'письмо подтверждения не ушло' })
    }
  }
  return { ok: true }
}

/** Шаг 1 восстановления: ответ одинаковый, есть такой аккаунт или нет. Токен живёт 1 час. */
export async function forgotPassword(input: ForgotInput): Promise<AuthResult> {
  const parsed = forgotSchema.safeParse(input)
  if (!parsed.success) return { ok: false, fieldErrors: fieldErrorsFrom(parsed.error) }
  if (!takeRateLimit(`forgot:${await clientIp()}`, 5)) return { ok: false, error: 'rateLimited' }
  const payload = await getPayloadClient()
  try {
    await payload.forgotPassword({ collection: 'customers', data: { email: parsed.data.email.toLowerCase() } })
  } catch (error) {
    payload.logger.error({ err: error, msg: 'письмо восстановления не ушло' })
  }
  return { ok: true }
}

/**
 * Шаг 2: новый пароль по ссылке из письма. Переход по ссылке подтверждает владение почтой,
 * поэтому неподтверждённый аккаунт заодно подтверждаем. После смены пароля сразу входим.
 */
export async function resetPassword(input: ResetInput): Promise<AuthResult> {
  const parsed = resetSchema.safeParse(input)
  if (!parsed.success) {
    const fieldErrors = fieldErrorsFrom(parsed.error)
    return fieldErrors.token ? { ok: false, error: 'tokenInvalid' } : { ok: false, fieldErrors }
  }
  const payload = await getPayloadClient()
  try {
    const res = await payload.resetPassword({ collection: 'customers', data: { token: parsed.data.token, password: parsed.data.password }, overrideAccess: true })
    const user = res.user as { id: number | string; _verified?: boolean | null } | undefined
    if (user && !user._verified) await payload.db.updateOne({ collection: 'customers', id: user.id, data: { _verified: true, _verificationToken: null } })
    if (res.token) await setSessionCookie(res.token, undefined, false)
    return { ok: true }
  } catch {
    return { ok: false, error: 'tokenInvalid' }
  }
}
