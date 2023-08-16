import { Icons } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import Link from "next/link"

export default async function ContributePage() {

    const supabase = createServerComponentClient<Database>({ cookies })
    const supaSession = await supabase.auth.getSession()
    const user = supaSession.data?.session?.user

    var userContributions = "0"
    if (user) {
        const { count, error } = await supabase
            .from('translations')
            .select('*', { count: 'exact', head: true })
            .match({ user_id: user?.id, is_user_translation: true })

        const formattedNumber = new Intl.NumberFormat().format(count ? count : 0)
        userContributions = formattedNumber

        if (error) console.error(error)
    }

    var allContributions = "0"
    const { count, error } = await supabase
        .from('translations')
        .select('*', { count: 'exact', head: true })

    const formattedNumber = new Intl.NumberFormat().format(count ? count : 0)
    allContributions = formattedNumber

    if (error) console.error(error)


    const Stats = () => {
        return (
            <div className="flex flex-col gap-6">
                <h2 className="flex items-end text-4xl font-semibold">
                    <Icons.stats className="mr-4 h-8 w-8" />
                    Stats
                </h2>
                <div className="flex max-w-[64rem] flex-col gap-4 text-center md:flex-row">
                    <Card className="mx-auto w-full min-w-[18rem] lg:min-w-[24rem]">
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
                    <Card className="mx-auto w-full min-w-[18rem] lg:min-w-[24rem]">
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
        )
    }

    return (
        <div className="container flex flex-col gap-16">
            <div className="flex flex-col gap-6">
                <h2 className="flex items-end text-4xl font-semibold">
                    <Icons.clipboardCheck className="mr-4 h-8 w-8" />
                    Tasks
                </h2>
                <div className="flex max-w-[64rem] flex-col gap-4 text-center md:flex-row">
                    <Link href="/contribute/validate">
                        <Button
                            variant={"ghost"}
                            className="h-fit w-full gap-4 rounded-2xl border-2 border-gray-400 p-6 py-10 text-2xl hover:border-gray-500 md:p-10"
                        >
                            <Icons.thumbsUp className="h-10 w-10 md:h-8 md:w-8" />
                            <Icons.thumbsDown className="h-10 w-10 md:h-8 md:w-8" />
                            Validate translations for accuracy
                        </Button>
                    </Link>

                    <Link href="/contribute/translate">
                        <Button
                            variant={"ghost"}
                            className="h-fit w-full gap-4 rounded-2xl border-2 border-gray-400 p-6 text-2xl hover:border-gray-500 md:p-10"
                        >
                            <Icons.logo className="h-20 w-20 fill-current md:h-16 md:w-16" />
                            Translate words and phrases
                        </Button>
                    </Link>
                </div>
            </div>
            <Stats />
        </div>
    )
}
