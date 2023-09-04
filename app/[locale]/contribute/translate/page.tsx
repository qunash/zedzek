import { cookies } from "next/headers"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"

import { SignInButton } from "@/components/sign-in-button"
import I18nProviderClientWrapper from "@/app/locales/i18n-client-component-wrapper"

import SentenceTranslator from "./sentence-translator"

export const revalidate = 0 // does not work yet in Next.js 13.4.19. TODO: update later
// export const dynamic = 'force-dynamic' // same
// export const fetchCache = 'force-no-store' // same

const LANG_MAP: { [key: string]: string } = {
    ar: "ara",
    ru: "rus",
    en: "eng",
    tr: "tur",
}

export default async function TranslatePage({
    params,
}: {
    params: { locale: string }
}) {
    const _cookies = cookies()
    const supabase = createServerComponentClient<Database>({
        cookies: () => _cookies,
    })

    const user = (await supabase.auth.getSession()).data?.session?.user

    if (!user) {
        return (
            <I18nProviderClientWrapper params={params}>
                <SignInButton />
            </I18nProviderClientWrapper>
        )
    }

    const userLanguage =
        LANG_MAP[_cookies.get("Next-Locale")?.value || "en"] || "eng"

    const { data, error } = await supabase.rpc(
        "get_10_random_untranslated_sentences",
        { p_user_id: user?.id, p_lang: userLanguage }
    )

    error && console.error(error)

    return (
        <I18nProviderClientWrapper params={params}>
            <SentenceTranslator
                sentences={data}
                user={user}
                lang={userLanguage}
            />
        </I18nProviderClientWrapper>
    )
}
