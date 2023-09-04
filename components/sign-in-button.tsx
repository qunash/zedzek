"use client"

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

import { getBaseUrl } from "@/lib/utils"

import { Button } from "./ui/button"
import { getI18nCLient } from "@/app/locales/client"

export function SignInButton() {
    const supabase = createClientComponentClient<Database>()
    const t = getI18nCLient()

    const handleSignIn = async () => {
        const { pathname, search } = location
        const origin = getBaseUrl()
        const { error } = await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: `${origin}/auth/callback/?redirect_to=${origin}${pathname}/${search}`,
            },
        })
        if (error) console.error("Supabase auth error:", error)
    }

    return (
        <div className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
            <Button onClick={handleSignIn}>{t("buttons.sign_in")}</Button>
        </div>
    )
}
