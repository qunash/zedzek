import { createI18nMiddleware } from 'next-international/middleware'
import { NextRequest } from 'next/server'


const locales = ['en', 'tr', 'ar', 'ru']
const I18nMiddleware = createI18nMiddleware(locales, 'en')

export function middleware(request: NextRequest) {
  return I18nMiddleware(request)
}

export const config = {
  matcher: ['/((?!api|static|auth|.*\\..*|_next|favicon.ico|robots.txt|sitemap.xml).*)'],
}
