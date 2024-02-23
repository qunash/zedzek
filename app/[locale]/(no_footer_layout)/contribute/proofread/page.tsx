import { cookies } from "next/headers"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"

import { SignInButton } from "@/components/sign-in-button"
import I18nProviderClientWrapper from "@/app/locales/i18n-client-component-wrapper"

import SentenceProofreader from "./proofreader"

export const revalidate = 0 // does not work yet in Next.js 13.4.19. TODO: update later
// export const dynamic = 'force-dynamic' // same
// export const fetchCache = 'force-no-store' // same

const LANG_MAP: { [key: string]: string } = {
    ru: "rus", // Only Russian locale is supported here
}

export default async function ProofreadPage({
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

    // Force the userLanguage to Russian ("rus") since only the Russian locale is supported
    const userLanguage = "rus"

    const { data, error } = await supabase.rpc(
        "get_10_random_texts_to_proofread",
    )

    error && console.error(error)

    return (
        <I18nProviderClientWrapper params={params}>
            <SentenceProofreader
                texts={data}
                user={user}
            />
        </I18nProviderClientWrapper>
    )
}