import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import {
  Session,
  createClientComponentClient,
} from "@supabase/auth-helpers-nextjs"
import { useTranslations } from "next-intl"

import { Database } from "@/types/database.types"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function UserNav() {
  const supabase = createClientComponentClient<Database>()
  const [session, setSession] = useState<Session | null>(null)
  const t = useTranslations("Index")
  const { locale } = useRouter()

  useEffect(() => {
    const fetchSession = async () => {
      const supaSession = await supabase.auth.getSession()
      if (supaSession?.data) {
        setSession(supaSession.data.session)
      }
    }

    fetchSession()

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        if (event === "SIGNED_OUT") {
          setSession(null)
        } else if (event === "SIGNED_IN" && newSession) {
          setSession(newSession)
        }
      }
    )

    return () => {
      listener?.subscription.unsubscribe()
    }
  }, [supabase.auth])

  const handleSignIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${location.origin}/auth/callback/` },
    })
    if (error) console.log("Error: ", error.message)
  }

  const handleSignOut = () => supabase.auth.signOut()

  return session ? (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-7 w-7">
            <AvatarImage
              src={session.user.user_metadata.avatar_url}
              alt={session.user.user_metadata.name}
            />
            <AvatarFallback>
              {session.user.user_metadata.name[0]}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 p-0" align="end" forceMount>
        <DropdownMenuLabel className="flex items-center space-x-3 p-4 font-normal">
          <Avatar className="h-16 w-16 border dark:border-slate-500">
            <AvatarImage
              src={session.user.user_metadata.avatar_url}
              alt={session.user.user_metadata.name}
            />
          </Avatar>
          <div className="flex flex-col space-y-1">
            <p className="bold font-medium leading-none">
              {session.user.user_metadata.name}
            </p>
            <p className="text-muted-foreground text-xs leading-none">
              {session.user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuItem
          className="cursor-pointer px-4 py-3"
          onClick={() => {
            window.location.href = "/profile"
          }}
        >
          {t("profile", { locale })}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer px-4 py-3"
          onClick={handleSignOut}
        >
          {t("log_out", { locale })}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ) : (
    <Button onClick={handleSignIn}>{t("sign_in", { locale })}</Button>
  )
}
