import { cookies } from "next/headers"
import { NextResponse, type NextRequest } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"

export async function GET(request: NextRequest) {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get("code")
    const redirectUrlParam =
        requestUrl.searchParams.get("redirect_url") || requestUrl.origin

    // Parse redirect URL and strip query parameters to avoid Netlify preserving them
    const redirectUrlObj = new URL(redirectUrlParam)
    const cleanRedirectUrl = `${redirectUrlObj.origin}${redirectUrlObj.pathname}`

    console.log("redirectUrl", cleanRedirectUrl)

    if (code) {
        const supabase = createRouteHandlerClient<Database>({ cookies })
        await supabase.auth.exchangeCodeForSession(code)
    }

    return NextResponse.redirect(cleanRedirectUrl)
}
