"use client"

import { Icons } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { User, createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useEffect, useState } from "react"

export default function ContributePage() {

    const supabase = createClientComponentClient<Database>()
    const [user, setUser] = useState<User | null | undefined>()
    const [showSignIn, setShowSignIn] = useState(false)
    const [userContributions, setUserContributions] = useState<string>("0")
    const [allContributions, setAllContributions] = useState<string>("0")

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
    }, [supabase.auth])

    useEffect(() => {

        const fetchUserContributions = async () => {

            if (!user) return

            const { count, error } = await supabase
                .from('translations')
                .select('*', { count: 'exact', head: true })
                .match({ user_id: user?.id, is_user_translation: true })

            const formattedNumber = new Intl.NumberFormat().format(count ? count : 0)
            setUserContributions(formattedNumber)

            if (error) console.error(error)
        }

        const fetchAllContributions = async () => {

            const { count, error } = await supabase
                .from('translations')
                .select('*', { count: 'exact', head: true })

            const formattedNumber = new Intl.NumberFormat().format(count ? count : 0)
            setAllContributions(formattedNumber)

            if (error) console.error(error)
        }

        fetchUserContributions()
        fetchAllContributions()

    }, [user])

    const handleClick = async () => {
        if (!user) {
            setShowSignIn(true)
            return
        }
    }

    const handleValidateClick = async () => {
        handleClick()

        // TODO: redirect to /contribute/validate
    }

    const handleTranslateClick = async () => {
        handleClick()

        // TODO: redirect to /contribute/translate
    }

    const handleSignIn = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: `${location.origin}/auth/callback/${location.search}`,
            },
        })
        if (error) console.error("Supabase auth error:", error)
    }


    if (showSignIn) return (
        <div className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
            <Button onClick={handleSignIn}>
                Sign In
            </Button>
        </div>
    )

    return (
        <>
            <section className="flex flex-col items-center gap-12 space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-16">
                <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center md:flex-row">
                    <Button
                        variant={"ghost"}
                        className="h-fit gap-4 rounded-2xl border-2 border-gray-400 p-6 text-2xl hover:border-gray-500 md:p-10"
                        onClick={handleValidateClick}
                    >
                        <Icons.thumbsUp className="h-14 w-14 md:h-8 md:w-8" />
                        <Icons.thumbsDown className="h-14 w-14 md:h-8 md:w-8" />
                        Validate translations for accuracy
                    </Button>

                    <Button
                        variant={"ghost"}
                        className="h-fit gap-4 rounded-2xl border-2 border-gray-400 p-6 text-2xl hover:border-gray-500 md:p-10"
                        onClick={handleTranslateClick}
                    >
                        <Icons.logo className="h-20 w-20 fill-current md:h-16 md:w-16" />
                        Translate words and phrases
                    </Button>
                </div>
                <div className="container flex flex-col items-center gap-4">
                    <h2 className="flex items-center text-center text-4xl font-semibold">
                        <Icons.stats className="mr-4 h-16 w-16" />
                        Stats
                    </h2>
                    <div className="container flex max-w-[64rem] flex-col gap-4 text-center md:flex-row">
                        <Card className="mx-auto min-w-[18rem] max-w-[64rem] lg:min-w-[24rem]">
                            <CardHeader className="flex flex-row items-center justify-center space-y-0 pb-2">
                                <CardTitle className="text-base font-medium">
                                    Your contributions
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-row items-center justify-center gap-4">
                                <Icons.listPlus className="h-12 w-12" />
                                <div className="text-6xl font-bold">
                                    {userContributions}
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="mx-auto min-w-[18rem] max-w-[64rem] lg:min-w-[24rem]">
                            <CardHeader className="flex flex-row items-center justify-center space-y-0 pb-2">
                                <CardTitle className="text-base font-medium">
                                    Contributions by all users
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-row items-center justify-center gap-4">
                                <div className="text-6xl font-bold">
                                    {allContributions}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>
        </>
    )
}