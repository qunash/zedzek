"use client"

import {
  Session,
  createClientComponentClient,
} from "@supabase/auth-helpers-nextjs"
import { useEffect, useState } from "react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Profile } from "@/types/supabase"
import Link from "next/link"
import { UserAvatar } from "./user-avatar"
import { getI18nCLient } from "@/app/locales/client"
import { getBaseUrl } from "@/lib/utils"

export function UserNav() {
  const t = getI18nCLient()
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

  const handleSignIn = async () => {
    const { pathname, search } = location
    const origin = getBaseUrl()
    const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
            redirectTo: `${origin}/auth/callback/?redirect_url=${origin}${pathname}/${search}`,
        },
    })
    
    if (error) console.log("Error: ", error.message)
  }

  const handleSignOut = () => supabase.auth.signOut()

  if (loading) return <div className="h-8 w-8" />

  if (!session) {
    return <Button onClick={handleSignIn}>
      {t("buttons.sign_in")}
    </Button>
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
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
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
          <DropdownMenuItem
            className="cursor-pointer px-4 py-3"
          >
            {t("index.profile")}
          </DropdownMenuItem>
        </Link>
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