"use client"

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

import { cn, getBaseUrl } from "@/lib/utils"
import { getI18nCLient } from "@/app/locales/client"

import { Button } from "./ui/button"

export function SignInButton({ className }: { className?: string }) {
    const supabase = createClientComponentClient<Database>()
    const t = getI18nCLient()

    const handleSignIn = async () => {
        const { pathname, search } = location
        const origin = getBaseUrl()
        console.log("origin", origin)
        const { error } = await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: `${origin}/auth/callback/?redirect_url=${origin}${pathname}${search}`,
                queryParams: {
                    redirect_url: `${origin}${pathname}${search}`,
                },
            },
        })
        if (error) console.error("Supabase auth error:", error)
    }

    return (
        <div
            className={cn(
                className,
                "self-center"
            )}
        >
            <Button onClick={handleSignIn}>{t("buttons.sign_in")}</Button>
        </div>
    )
}
