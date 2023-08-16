"use client"

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Button } from "./ui/button"

export function SignInButton() {

    const supabase = createClientComponentClient<Database>()

    const handleSignIn = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: `${location.origin}/auth/callback/${location.search}`,
            },
        })
        if (error) console.error("Supabase auth error:", error)
    }
    
    
    return (
        <div className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
            <Button onClick={handleSignIn}>
                Sign In
            </Button>
        </div>
    )
}