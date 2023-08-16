import { AvatarProps } from "@radix-ui/react-avatar"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Icons } from "@/components/icons"
import { Profile } from "@/types/supabase"

interface ProfileAvatarProps extends AvatarProps {
  profile: Pick<Profile, "avatar_url" | "name">
}

export function UserAvatar({ profile, ...props }: ProfileAvatarProps) {
  return (
    <Avatar {...props} className="h-7 w-7 border dark:border-slate-500">
      {profile.avatar_url ? (
        <AvatarImage alt="Picture" src={profile.avatar_url} />
      ) : (
        <AvatarFallback>
          <span className="sr-only">{profile.name}</span>
          <Icons.user className="h-4 w-4" />
        </AvatarFallback>
      )}
    </Avatar>
  )
}