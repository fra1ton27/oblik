import createMiddleware from 'next-intl/middleware'
import { NextRequest } from 'next/server'
import { routing } from './i18n/routing'
import { PATH_HEADER } from './config/headers'

// Корень / редиректит: кука NEXT_LOCALE → Accept-Language → ru (поведение next-intl по умолчанию)
const handleI18nRouting = createMiddleware(routing)

const UTM_COOKIE = 'oblik_utm'
const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content']

export function proxy(request: NextRequest) {
  // next-intl копирует заголовки запроса в ответ next()/rewrite(), так путь доходит до layout кабинета
  const headers = new Headers(request.headers)
  headers.set(PATH_HEADER, request.nextUrl.pathname + request.nextUrl.search)
  const response = handleI18nRouting(new NextRequest(request, { headers }))

  // UTM-метки первого визита: попадают в заказы и заявки
  const params = request.nextUrl.searchParams
  if (!request.cookies.has(UTM_COOKIE) && UTM_KEYS.some((k) => params.has(k))) {
    const utm = Object.fromEntries(UTM_KEYS.filter((k) => params.has(k)).map((k) => [k, (params.get(k) ?? '').slice(0, 120)]))
    response.cookies.set(UTM_COOKIE, encodeURIComponent(JSON.stringify(utm)), {
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
      sameSite: 'lax',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    })
  }
  return response
}

export const config = {
  // Исключаем api, admin, _next, _vercel и файлы с точкой, иначе сломается админка Payload
  matcher: ['/((?!api|admin|_next|_vercel|.*\\..*).*)'],
}
