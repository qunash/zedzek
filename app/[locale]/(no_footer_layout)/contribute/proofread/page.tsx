import { cookies } from "next/headers"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { getI18nServer } from "@/app/locales/server"

import { SignInButton } from "@/components/sign-in-button"
import I18nProviderClientWrapper from "@/app/locales/i18n-client-component-wrapper"

import SentenceProofreader from "./proofreader"
import { Button } from "@/components/ui/button"
import { RequestRoleAccessButton } from "@/components/request-role-access-button"

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
    const t = await getI18nServer() // Use the hook to get the translation function
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

    const profileData = await supabase.from("profiles").select("*").eq("id", user?.id)
    const profile = profileData.data ? profileData.data[0] : null

    if (!profile || profile.role != "proofreader") {
        return (
            <I18nProviderClientWrapper params={params}>
                <div className="mx-auto flex flex-col items-center justify-center gap-4 text-center">
                    {t("contribute.proofread_access_denied")}
                    <RequestRoleAccessButton
                        user={user}
                        role="proofreader"
                    />
                </div>
            </I18nProviderClientWrapper>
        );
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