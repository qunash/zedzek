import { NextRequest, NextResponse } from "next/server"

const locales = ["en", "tr", "ar", "ru"]
const defaultLocale = "en"

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    const pathnameLocale = locales.find(
        (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`)
    )

    if (pathnameLocale) {
        const headers = new Headers(request.headers)
        headers.set("X-Next-Locale", pathnameLocale)

        const response = NextResponse.next({ request: { headers } })
        response.cookies.set("Next-Locale", pathnameLocale)
        return response
    }

    // No locale in URL — detect from cookie/Accept-Language and redirect
    const cookieLocale = request.cookies.get("Next-Locale")?.value
    const acceptLang = request.headers
        .get("Accept-Language")
        ?.split(",")[0]
        ?.split("-")[0]

    const locale =
        (cookieLocale && locales.includes(cookieLocale)
            ? cookieLocale
            : null) ??
        (acceptLang && locales.includes(acceptLang) ? acceptLang : null) ??
        defaultLocale

    const url = request.nextUrl.clone()
    url.pathname = `/${locale}${pathname}`

    const response = NextResponse.redirect(url)
    response.cookies.set("Next-Locale", locale)
    return response
}

export const config = {
  matcher: ['/((?!api|static|auth|.*\\..*|_next|favicon.ico|robots.txt|sitemap.xml).*)'],
}
