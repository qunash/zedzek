import { cookies } from "next/headers"
import { NextResponse, type NextRequest } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"

export async function GET(request: NextRequest) {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get("code")

    if (code) {
        const supabase = createRouteHandlerClient<Database>({ cookies })
        await supabase.auth.exchangeCodeForSession(code)
    }

    // Clean redirect URL to prevent Netlify from preserving query params
    const redirectUrl = new URL(
        requestUrl.searchParams.get("redirect_url") || requestUrl.origin
    )
    redirectUrl.search = ""

    return NextResponse.redirect(redirectUrl.toString())
}
