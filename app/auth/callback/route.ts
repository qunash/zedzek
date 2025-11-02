import { cookies } from "next/headers"
import { NextResponse, type NextRequest } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"

export async function GET(request: NextRequest) {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get("code")
    const redirectUrlParam = requestUrl.searchParams.get("redirect_url") || requestUrl.origin

    if (code) {
        const supabase = createRouteHandlerClient<Database>({ cookies })
        await supabase.auth.exchangeCodeForSession(code)
    }

    // Unlike Vercel, Netlify preserves query parameters on GET redirects, so we need to manually strip them
    const { origin, pathname } = new URL(redirectUrlParam)
    return NextResponse.redirect(`${origin}${pathname}`)
}
