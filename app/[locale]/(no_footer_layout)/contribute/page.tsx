"use client"

import { getI18nCLient } from "@/app/locales/client"
import I18nProviderClientWrapper from "@/app/locales/i18n-client-component-wrapper"
import CountingNumbers from "@/components/counting-numbers"
import { Icons } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Profile } from "@/types/supabase"
import { Session, User, createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import Link from "next/link"
import { useEffect, useState } from "react"

type LeaderboardEntry = {
    name: string;
    avatar_url: string;
    translations: number;
    votes: number;
}

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
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])

    useEffect(() => {
        const fetchUser = async () => {
            const supaSession = await supabase.auth.getSession()
            if (supaSession?.data) {
                setUser(supaSession.data.session?.user)
            }
        }

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

        const fetchLeaderboard = async () => {
            const { data, error } = await supabase.rpc('get_contributors_leaderboard')

            if (error) {
                console.error('Error fetching leaderboard:', error)
            } else {
                setLeaderboard(data)
            }
        }

        fetchProfile(user.id)
        fetchUserContributions()
        fetchAllContributions()
        fetchLeaderboard()
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

    const Leaderboard = () => {
        return (
            <div className="flex flex-col gap-4 w-full max-w-sm sm:max-w-md md:max-w-lg pb-16">
                <h2 className="flex items-center text-2xl sm:text-3xl font-semibold">
                    <Icons.trophy className="mr-2 sm:mr-4 h-6 w-6 sm:h-8 sm:w-8" />
                    {t("contribute.leaderboard")}
                </h2>
                <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow">
                    <table className="w-full table-auto">
                        <thead>
                            <tr className="text-left bg-gray-100 dark:bg-gray-700">
                                <th className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    {t("contribute.leaderboard_name")}
                                </th>
                                <th className="px-2 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider text-center">
                                    {t("contribute.leaderboard_translations")}
                                </th>
                                <th className="px-2 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider text-center">
                                    {t("contribute.leaderboard_votes")}
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                            {leaderboard.map((entry, index) => (
                                <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                    <td className="px-3 py-2">
                                        <div className="flex items-center">
                                            <Avatar className="h-8 w-8 mr-2 border border-gray-200 dark:border-gray-600 flex-shrink-0">
                                                <AvatarImage src={entry.avatar_url} alt={entry.name} />
                                                <AvatarFallback className="text-xs font-medium text-gray-700 dark:text-gray-300">
                                                    {entry.name.charAt(0)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="font-medium text-xs md:text-base text-gray-900 dark:text-gray-100 truncate">
                                                {entry.name}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-2 py-2 text-center text-sm">
                                        {entry.translations}
                                    </td>
                                    <td className="px-2 py-2 text-center text-sm">
                                        {entry.votes}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
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

                    {user && (profile?.role === "proofreader" || profile?.role === "admin") && (
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
            <Leaderboard />
        </div>
    )
}