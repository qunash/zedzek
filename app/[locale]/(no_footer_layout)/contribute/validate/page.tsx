import { cookies } from "next/headers"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"

import { SignInButton } from "@/components/sign-in-button"
import I18nProviderClientWrapper from "@/app/locales/i18n-client-component-wrapper"

import TranslationValidator from "./translation-validator"

export const revalidate = 0 // does not work yet in Next.js 13.4.19. TODO: update later

const LANG_MAP: { [key: string]: string } = {
    ar: "ara",
    ru: "rus",
    en: "eng",
    tr: "tur",
}

export default async function ValidatePage({
    params,
}: {
    params: { locale: string }
}) {
    const _cookies = cookies()
    const supabase = createServerComponentClient<Database>({
        cookies: () => _cookies,
    })

    const supaSession = await supabase.auth.getSession()
    const user = supaSession.data?.session?.user

    if (!user) {
        return (
            <I18nProviderClientWrapper params={params}>
                <SignInButton />
            </I18nProviderClientWrapper>
        )
    }

    const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single()
        
    const userLanguage =
        LANG_MAP[_cookies.get("Next-Locale")?.value || "en"] || "eng"

    const isTrustedTranslator = profile?.role === "trusted_translator"


    const { data, error } = await supabase.rpc("get_10_random_translations_new", {
        p_user_id: user?.id,
        p_lang: userLanguage,
        p_user_role: profile?.role,
    })

    if (error) console.error(error)

    return (
        <I18nProviderClientWrapper params={params}>
            <TranslationValidator translations={data} user={user} isTrustedTranslator={isTrustedTranslator} />
        </I18nProviderClientWrapper>
    )
}
