import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { PostgrestError, User } from "@supabase/supabase-js"
import { useEffect, useState } from "react"

import { TranslationResponse } from "@/types/translation-response"
import { EditTranslationDialog } from "./edit-translation"
import { Icons } from "./icons"
import { Button } from "./ui/button"
import IconButton from "./ui/icon-button"

export default function UpvoteDownvoteEditButtons({ translation }: { translation: TranslationResponse }) {
    const supabase = createClientComponentClient<Database>()
    const [user, setUser] = useState<User | null | undefined>()
    const [showSignIn, setShowSignIn] = useState(false)
    const [isUpvoted, setIsUpvoted] = useState(false)
    const [isDownvoted, setIsDownvoted] = useState(false)

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

    const handleUpvote = async () => {
        if (!user) {
            setShowSignIn(true)
            return
        }

        setIsDownvoted(false)

        if (isUpvoted) {
            const { error } = await supabase.rpc("translation_remove_vote",
                { p_user_id: user?.id, p_text: translation.text, p_translation: translation.translations[0] }
            )
            if (error) logError(error)
            setIsUpvoted(false)
        } else {
            const { error } = await supabase.rpc("translation_upvote",
                { p_user_id: user?.id, p_text: translation.text, p_translation: translation.translations[0] }
            )
            setIsUpvoted(true)
            if (error) logError(error)
        }
    }

    const handleDownvote = async () => {
        if (!user) {
            setShowSignIn(true)
            return
        }

        setIsUpvoted(false)

        if (isDownvoted) {
            const { error } = await supabase.rpc("translation_remove_vote",
                { p_user_id: user?.id, p_text: translation.text, p_translation: translation.translations[0] }
            )
            if (error) logError(error)
            setIsDownvoted(false)
        } else {
            const { error } = await supabase.rpc("translation_downvote",
                { p_user_id: user?.id, p_text: translation.text, p_translation: translation.translations[0] }
            )
            setIsDownvoted(true)
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
                isFilled={isUpvoted}
                onClick={handleUpvote}
            />
            <IconButton
                icon={<Icons.thumbsDown />}
                isFilled={isDownvoted}
                onClick={handleDownvote}
            />
            <EditTranslationDialog
                supabase={supabase}
                user={user}
                translation={translation}
            >
                <IconButton icon={<Icons.edit />} onClick={handleEdit} />
            </EditTranslationDialog>
        </div>
    )
}
