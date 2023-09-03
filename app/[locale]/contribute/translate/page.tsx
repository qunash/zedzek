import { SignInButton } from "@/components/sign-in-button"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import I18nProviderClientWrapper from "@/app/locales/i18n-client-component-wrapper"
import SentenceTranslator from "./sentence-translator"

const LANG_MAP: { [key: string]: string } = {
    ar: "ara",
    ru: "rus",
    en: "eng",
    tr: "tur",
}

export default async function TranslatePage({ params }: { params: { locale: string } }) {
    const _cookies = cookies()
    const supabase = createServerComponentClient<Database>({ cookies: () => _cookies })

    const user = (await supabase.auth.getSession()).data?.session?.user
    if (!user) return <SignInButton />

    const userLanguage = LANG_MAP[_cookies.get("Next-Locale")?.value || "en"] || "eng"

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