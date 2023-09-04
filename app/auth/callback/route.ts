import { cookies } from "next/headers"
import { NextResponse, type NextRequest } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"

export async function GET(request: NextRequest) {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get("code")
    const redirectUrl =
        requestUrl.searchParams.get("redirect_url") || requestUrl.origin


    console.log("~~~~~~~~ requestUrl: ", requestUrl)
    
    if (code) {
        const supabase = createRouteHandlerClient<Database>({ cookies })
        await supabase.auth.exchangeCodeForSession(code)
    }

    return NextResponse.redirect(redirectUrl)
}
