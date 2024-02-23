"use client"

import { getI18nCLient } from "@/app/locales/client"
import I18nProviderClientWrapper from "@/app/locales/i18n-client-component-wrapper"
import CountingNumbers from "@/components/counting-numbers"
import { Icons } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Profile } from "@/types/supabase"
import { Session, User, createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function ContributePage({ params }: { params: { locale: string } }) {
    return (
        <I18nProviderClientWrapper params={params}>
            <ContributePageLocalized />
        </I18nProviderClientWrapper>
    )
}

function ContributePageLocalized() {

    const t = getI18nCLient()

    const supabase = createClientComponentClient<Database>()
    const [user, setUser] = useState<User | null | undefined>()
    const [userContributions, setUserContributions] = useState(0)
    const [allContributions, setAllContributions] = useState(0)
    const [profile, setProfile] = useState<Profile>()

    useEffect(() => {
        const fetchUser = async () => {
            const supaSession = await supabase.auth.getSession()
            if (supaSession?.data) {
                setUser(supaSession.data.session?.user)
            }
        }

        console.log("fetching user")
        fetchUser()

        const { data: listener } = supabase.auth.onAuthStateChange(
            async (event, newSession) => {
                if (event === "SIGNED_OUT") {
                    setUser(null)
                } else if (event === "SIGNED_IN" && newSession) {
                    setUser(newSession.user)
                }
            }
        )

        return () => {
            listener?.subscription.unsubscribe()
        }
    }, [supabase, supabase.auth])

    useEffect(() => {

        if (!user) return

        const fetchProfile = async (user_id: string) => {
            const { data } = await supabase
                .from("profiles")
                .select("*")
                .eq("id", user_id)

            setProfile(data ? data[0] : undefined)
        }

        const fetchUserContributions = async () => {

            if (!user) return

            const { count, error } = await supabase
                .from('votes')
                .select('*', { count: 'exact', head: true })
                .match({ user_id: user?.id })

            setUserContributions(count ? count : 0)

            if (error) console.error(error)
        }

        const fetchAllContributions = async () => {

            const { count, error } = await supabase
                .from('votes')
                .select('*', { count: 'exact', head: true })

            setAllContributions(count ? count : 0)

            if (error) console.error(error)
        }

        fetchProfile(user.id)
        fetchUserContributions()
        fetchAllContributions()

    }, [supabase, user])



    const Stats = () => {
        return (
            <div className="flex flex-col gap-6">
                <h2 className="flex items-end text-4xl font-semibold">
                    <Icons.stats className="mr-4 h-8 w-8" />
                    {t("contribute.stats")}
                </h2>
                <div className="flex max-w-[64rem] flex-col gap-4 text-center md:flex-row">
                    <Card className="mx-auto w-full min-w-[18rem] lg:min-w-[24rem]">
                        <CardHeader className="flex flex-row items-center justify-center space-y-0 pb-2">
                            <CardTitle className="text-base font-medium">
                                {t("contribute.your_contributions")}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-row items-center justify-center gap-4">
                            <Icons.listPlus className="h-12 w-12" />
                            <CountingNumbers
                                value={userContributions}
                                className="text-6xl font-bold"
                            />
                        </CardContent>
                    </Card>
                    <Card className="mx-auto w-full min-w-[18rem] lg:min-w-[24rem]">
                        <CardHeader className="flex flex-row items-center justify-center space-y-0 pb-2">
                            <CardTitle className="text-base font-medium">
                                {t("contribute.contributions_by_all_users")}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-row items-center justify-center gap-4">
                            <CountingNumbers
                                value={allContributions}
                                className="text-6xl font-bold"
                            />
                        </CardContent>
                    </Card>
                </div>
            </div>
        )
    }

    return (
        <div className="container flex flex-col items-center gap-16">
            <div className="flex flex-col gap-6">
                <h2 className="flex items-end text-4xl font-semibold">
                    <Icons.clipboardCheck className="mr-4 h-8 w-8" />
                    {t("contribute.tasks")}
                </h2>
                <div className="flex max-w-[64rem] flex-col gap-4 text-center md:flex-row">
                    <Link href="/contribute/validate">
                        <Button
                            variant={"ghost"}
                            className="h-full w-full gap-4 rounded-2xl border-2 border-gray-400 p-6 py-10 text-2xl hover:border-gray-500 md:p-10"
                        >
                            <Icons.thumbsUp className="h-10 w-10 md:h-8 md:w-8" />
                            <Icons.thumbsDown className="h-10 w-10 md:h-8 md:w-8" />
                            {t("contribute.validate_translations")}
                        </Button>
                    </Link>

                    <Link href="/contribute/translate">
                        <Button
                            variant={"ghost"}
                            className="h-full w-full gap-4 rounded-2xl border-2 border-gray-400 p-6 text-2xl hover:border-gray-500 md:p-10"
                        >
                            <Icons.logo className="h-20 w-20 fill-current md:h-16 md:w-16" />
                            {t("contribute.translate")}
                        </Button>
                    </Link>

                    {user && profile?.role === "proofreader" && (
                        <Link href="/contribute/proofread">
                            <Button
                                variant={"ghost"}
                                className="h-full w-full gap-4 rounded-2xl border-2 border-gray-400 p-6 text-2xl hover:border-gray-500 md:p-10"
                            >
                                <Icons.proofread className="h-20 w-20 fill-current md:h-16 md:w-16" />
                                {t("contribute.proofread")}
                            </Button>
                        </Link>
                    )}
                </div>
            </div>
            <Stats />
        </div>
    )
}
