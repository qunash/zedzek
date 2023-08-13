import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { PostgrestError, User } from "@supabase/supabase-js"
import { cloneElement, useEffect, useState } from "react"
// import { useTranslations } from "next-intl"

import { TranslationResponse } from "@/types/translation-response"
import { EditTranslationDialog } from "./edit-translation"
import { Icons } from "./icons"
import { Button, buttonVariants } from "./ui/button"

export default function LikeButton({ translation }: { translation: TranslationResponse }) {
    const supabase = createClientComponentClient<Database>()
    const [user, setUser] = useState<User | null | undefined>()
    const [showSignIn, setShowSignIn] = useState(false)
    const [isLiked, setIsLiked] = useState(false)
    const [isDialogOpen, setDialogOpen] = useState(false)

    // const { locale } = useRouter()
    // const t = useTranslations("Index")

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
            const { error } = await supabase.from("translations").insert({
                user_id: user?.id,
                text: translation.text,
                translation: translation.translations[0],
                is_user_translation: false,
            })
            setIsLiked(true)
            if (error) logError(error)
        }
    }

    const openDialog = () => setDialogOpen(true)
    
    const closeDialog = () => setDialogOpen(false)
    

    const SignInDiv = (
        <div className="flex w-full flex-row items-center justify-center">
            <Button onClick={handleSignIn}>
                {/* {t("sign_in", { locale })} */}
                Sign In
            </Button>
        </div>
    )

    if (showSignIn) return SignInDiv

    const ButtonDiv = ({ icon, isFilled = false, onClick }: { icon: JSX.Element, isFilled?: boolean, onClick: () => void }) => {
        const baseClass = buttonVariants({
            size: "lg",
            variant: "ghost",
            className:
                "items-center justify-end self-start text-slate-700 dark:text-slate-400 cursor-pointer",
        })

        return (
            <div className={baseClass} onClick={onClick}>
                {cloneElement(icon, {
                    className: `h-4 w-4 ${isFilled ? "fill-current" : ""}`,
                })}
            </div>
        )
    }

    return (
        <div className="flex w-full flex-row items-center justify-between">
            <ButtonDiv
                icon={<Icons.thumbsUp />}
                isFilled={isLiked}
                onClick={handleLike}
            />
            <EditTranslationDialog
                translation={translation}
                isOpen={isDialogOpen}
                onClose={closeDialog}
            >
                <ButtonDiv icon={<Icons.thumbsDown />} onClick={openDialog} />
            </EditTranslationDialog>
            <EditTranslationDialog
                translation={translation}
                isOpen={isDialogOpen}
                onClose={closeDialog}
            >
                <ButtonDiv icon={<Icons.edit />} onClick={openDialog} />
            </EditTranslationDialog>
        </div>
    )    
}