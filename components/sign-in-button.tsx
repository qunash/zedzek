"use client"

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

import { Button } from "./ui/button"

export function SignInButton() {
    const supabase = createClientComponentClient<Database>()
    
    const handleSignIn = async () => {
        console.log('~~~~~~~~~~~~~  location:', location)
        const { origin, pathname, search } = location
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
            <Button onClick={handleSignIn}>Sign In</Button>
        </div>
    )
}
