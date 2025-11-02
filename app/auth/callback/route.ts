import { cookies } from "next/headers"
import { NextResponse, type NextRequest } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"

export async function GET(request: NextRequest) {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get("code")
    let redirectUrl =
        requestUrl.searchParams.get("redirect_url") || requestUrl.origin

    // Ensure redirectUrl is a proper URL without query parameters
    try {
        const parsedRedirect = new URL(redirectUrl)
        redirectUrl = `${parsedRedirect.origin}${parsedRedirect.pathname}`
    } catch {
        // If parsing fails, use origin with the pathname from the redirect_url
        redirectUrl = requestUrl.origin
    }

    if (code) {
        const supabase = createRouteHandlerClient<Database>({ cookies })
        await supabase.auth.exchangeCodeForSession(code)
    }

    // Use 303 See Other status for GET redirects (explicit for Netlify compatibility)
    return NextResponse.redirect(redirectUrl, { status: 303 })
}
