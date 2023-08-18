import { SignInButton } from "@/components/sign-in-button"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import TranslationValidator from "./translation-validator"


export default async function ValidatePage() {
    const _cookies = cookies()
    const supabase = createServerComponentClient<Database>({ cookies: () => _cookies })

    const supaSession = await supabase.auth.getSession()
    const user = supaSession.data?.session?.user

    if (!user) return <SignInButton />

    const { data, error } = await supabase.rpc("get_10_random_translations", { p_user_id: user?.id })

    if (error) console.error(error)

    return (
        <TranslationValidator
            translations={data}
            user={user}
        />
    )
}
