"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
    createClientComponentClient,
    Session,
} from "@supabase/auth-helpers-nextjs"

import { Profile } from "@/types/supabase"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SignInButton } from "@/components/sign-in-button"
import { getI18nCLient, useChangeLocale } from "@/app/locales/client"

import { UserAvatar } from "./user-avatar"

export function UserNav() {
    const t = getI18nCLient()
    const changeLocale = useChangeLocale()
    const supabase = createClientComponentClient<Database>()
    const [loading, setLoading] = useState(true)
    const [session, setSession] = useState<Session | null>()
    const [profile, setProfile] = useState<Profile>()

    useEffect(() => {
        const fetchProfile = async (user_id: string) => {
            const { data } = await supabase
                .from("profiles")
                .select("*")
                .eq("id", user_id)

            setProfile(data ? data[0] : undefined)
        }

        const { data: listener } = supabase.auth.onAuthStateChange(
            async (event, newSession) => {
                setSession(newSession)
                if (newSession) {
                    fetchProfile(newSession.user.id)
                }
                setLoading(false)
            }
        )

        return () => {
            listener?.subscription.unsubscribe()
        }
    }, [supabase, supabase.auth])

    const handleSignOut = () => supabase.auth.signOut()

    if (loading) return <div className="h-8 w-8" />

    if (!session) {
        return <SignInButton />
    }

    if (!profile) {
        return (
            <Avatar className="h-8 w-8 bg-gray-400">
                <AvatarFallback />
            </Avatar>
        )
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                >
                    <UserAvatar profile={profile} />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 p-0" align="end" forceMount>
                <DropdownMenuLabel className="flex items-center space-x-3 p-4 font-normal">
                    <Avatar className="h-16 w-16 border dark:border-slate-500">
                        <AvatarImage
                            src={profile.avatar_url}
                            alt={profile.name}
                        />
                    </Avatar>
                    <div className="flex flex-col space-y-1">
                        <p className="bold font-medium leading-none">
                            {profile.name}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                            {profile.username}
                        </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="mx-2" />
                {/* <Link href={`/${profile.username}`} passHref> */}
                <Link href={`/`} passHref>
                    <DropdownMenuItem className="cursor-pointer px-4 py-3">
                        {t("index.profile")}
                    </DropdownMenuItem>
                </Link>
                <DropdownMenuSub>
                    <DropdownMenuSubTrigger className="cursor-pointer px-4 py-3">
                        {/* <UserPlus className="mr-2 h-4 w-4" /> */}
                        {t("index.language")}
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                        <DropdownMenuSubContent>
                            <DropdownMenuItem className="cursor-pointer" onClick={() => changeLocale('en')}>
                                {t("index.english")}
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer" onClick={() => changeLocale('tr')}>
                                {t("index.turkish")}
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer" onClick={() => changeLocale('ar')}>
                                {t("index.arabic")}
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer" onClick={() => changeLocale('ru')}>
                                {t("index.russian")}
                            </DropdownMenuItem>
                        </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                </DropdownMenuSub>
                <DropdownMenuSeparator className="mx-2" />
                <DropdownMenuItem
                    className="cursor-pointer px-4 py-3"
                    onClick={handleSignOut}
                >
                    {t("buttons.sign_out")}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
