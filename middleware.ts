import { NextResponse, type NextRequest } from "next/server"
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"

import { Database } from "./types/database.types"

// export async function middleware(req: NextRequest) {
//   const res = NextResponse.next()
//   const supabase = createMiddlewareClient<Database>({ req, res })
//   await supabase.auth.getSession()
//   return res
// }


import createMiddleware from 'next-intl/middleware'

export default createMiddleware({
  locales: ['en', 'ar', 'tr', 'ru'],
  defaultLocale: 'en'
})

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)']
}