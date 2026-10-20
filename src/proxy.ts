import createMiddleware from 'next-intl/middleware'
import type { NextRequest } from 'next/server'
import { routing } from './i18n/routing'

// Корень / редиректит: кука NEXT_LOCALE → Accept-Language → ru (поведение next-intl по умолчанию)
const handleI18nRouting = createMiddleware(routing)

export function proxy(request: NextRequest) {
  return handleI18nRouting(request)
}

export const config = {
  // Исключаем api, admin, _next, _vercel и файлы с точкой, иначе сломается админка Payload
  matcher: ['/((?!api|admin|_next|_vercel|.*\\..*).*)'],
}
