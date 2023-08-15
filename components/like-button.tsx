import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { PostgrestError, User } from "@supabase/supabase-js"
import { useEffect, useState } from "react"
// import { useTranslations } from "next-intl"

import { TranslationResponse } from "@/types/translation-response"
import { EditTranslationDialog } from "./edit-translation"
import { Icons } from "./icons"
import { Button, buttonVariants } from "./ui/button"
import IconButton from "./ui/icon-button"

export default function LikeButton({ translation }: { translation: TranslationResponse }) {
    const supabase = createClientComponentClient<Database>()
    const [user, setUser] = useState<User | null | undefined>()
    const [showSignIn, setShowSignIn] = useState(false)
    const [isLiked, setIsLiked] = useState(false)
    const [isDialogOpen, setDialogOpen] = useState(false)

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

    const logError = (error: PostgrestError | Error) => console.error("Error:", error)

    const handleSignIn = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: `${location.origin}/auth/callback/${location.search}`,
            },
        })
        if (error) logError(error)
    }

    const handleLike = async () => {
        if (!user) {
            setShowSignIn(true)
            return
        }

        if (isLiked) {
            const { error } = await supabase
                .from("translations")
                .delete()
                .match({ user_id: user?.id, text: translation.text, translation: translation.translations[0] })
            setIsLiked(false)
            if (error) logError(error)
        } else {
            const { error } = await supabase
                .from("translations")
                .insert({
                    user_id: user?.id,
                    text: translation.text,
                    translation: translation.translations[0],
                    is_user_translation: false,
                })
            setIsLiked(true)
            if (error) logError(error)
        }
    }

    const handleEdit = () => {
        if (!user) {
            setShowSignIn(true)
            return
        }
    }

    if (showSignIn) return (
        <div className="flex w-full flex-row items-center justify-center">
            <Button onClick={handleSignIn}>
                Sign In
            </Button>
        </div>
    )

    return (
        <div className="flex w-full flex-row items-center justify-between">
            <IconButton
                icon={<Icons.thumbsUp />}
                isFilled={isLiked}
                onClick={handleLike}
            />
            <EditTranslationDialog
                translation={translation}
            >
                <IconButton icon={<Icons.thumbsDown />} onClick={handleEdit} />
            </EditTranslationDialog>
            <EditTranslationDialog
                translation={translation}
            >
                <IconButton icon={<Icons.edit />} onClick={handleEdit} />
            </EditTranslationDialog>
        </div>
    )
}