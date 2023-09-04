import { cookies } from "next/headers"
import { NextResponse, type NextRequest } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"

export async function GET(request: NextRequest) {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get("code")
    const redirectUrl =
        requestUrl.searchParams.get("redirect_to") || requestUrl.origin

    console.log("~~~~~~~~~~~~~ requestUrl :", requestUrl)
    console.log("~~~~~~~~~~~~~ code       :", code)
    console.log("~~~~~~~~~~~~~ originalUrl:", redirectUrl)

    // requestUrl.searchParams.delete("redirect_to")
    // requestUrl.searchParams.delete("code")

    if (code) {
        const supabase = createRouteHandlerClient<Database>({ cookies })
        await supabase.auth.exchangeCodeForSession(code)
    }

    return NextResponse.redirect(redirectUrl)
}
