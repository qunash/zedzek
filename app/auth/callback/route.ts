import { cookies } from "next/headers"
import { NextResponse, type NextRequest } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"

export async function GET(request: NextRequest) {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get("code")
    const originalUrl =
        requestUrl.searchParams.get("redirect_to") || requestUrl.origin

    requestUrl.searchParams.delete("redirect_to")
    requestUrl.searchParams.delete("code")

    if (code) {
        const supabase = createRouteHandlerClient<Database>({ cookies })
        await supabase.auth.exchangeCodeForSession(code)
    }

    return NextResponse.redirect(originalUrl)
}
