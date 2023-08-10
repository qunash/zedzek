import { UserAvatar } from "@/components/user-avatar"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"


export default async function ProfilePage({ params }: { params: { username: string } }) {

  const supabase = createServerComponentClient<Database>({ cookies })

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", params.username)
    .single()

  return (
    <div className="flex flex-col items-center justify-center gap-6 pb-8 pt-6 md:flex-row md:py-10">
      <div className="flex w-full flex-col items-start gap-4 pl-24 md:w-1/3">
        <UserAvatar className="h-64 w-64 rounded-full border dark:border-slate-500"
          profile={profile} />

        <div className="flex flex-col gap-2 text-center md:text-left">
          {/* <div className="text-lg">{profile.username}</div> */}
          <div className="text-lg">{profile.name}</div>
        </div>
      </div>

      <div className="flex w-full justify-center md:w-2/3 md:justify-start">
        <div className="text-center md:text-left">
          Profile
        </div>
      </div>
    </div>
  )
}
