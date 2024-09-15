import { cookies } from "next/headers"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { getI18nServer } from "@/app/locales/server"
import { SignInButton } from "@/components/sign-in-button"
import I18nProviderClientWrapper from "@/app/locales/i18n-client-component-wrapper"
import { RequestRoleAccessButton } from "@/components/request-role-access-button"
import { redirect } from "next/navigation"

export default async function ValidateApplyPage({
    params,
}: {
    params: { locale: string }
}) {
    const t = await getI18nServer()
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

    const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single()

    if (profile?.role === "trusted_translator") {
        redirect(`/contribute/validate`)
    }

    return (
        <I18nProviderClientWrapper params={params}>
            <div className="flex flex-col items-center justify-center gap-4">
                <h1 className="text-2xl font-bold">
                    Подать заявку на доступ
                </h1>
                Подать заявку на доступ к проверке и исправлению переводов с черкесского на русский язык.
                <RequestRoleAccessButton user={user} role="trusted_translator" />
            </div>
        </I18nProviderClientWrapper>
    )
}