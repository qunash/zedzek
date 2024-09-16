"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
    createClientComponentClient,
    User,
} from "@supabase/auth-helpers-nextjs"
import { franc } from "franc-min"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Icons } from "@/components/icons"
import { getI18nCLient } from "@/app/locales/client"
import { CorrectionModal } from "@/components/correction-modal"

type HoverButtonProps = {
    className?: string
    icon: React.ComponentType<{ className?: string }>
    text: string
    shortcut: string
    onClick?: () => void
}

const HoverButton: React.FC<HoverButtonProps> = ({
    className,
    icon: Icon,
    text,
    shortcut,
    onClick,
}) => (
    <Button
        variant="ghost"
        onClick={onClick}
        size="lg"
        className={cn(
            className,
            "group relative flex flex-col gap-2 border p-10"
        )}
    >
        <div className="flex flex-col items-center">
            <Icon className="h-8 w-8 shrink-0" />
            <div className="text-sm text-gray-500 opacity-100 transition-opacity md:opacity-0 md:group-hover:opacity-100">
                {text}
            </div>
        </div>
        <kbd className="absolute bottom-1 right-1 aspect-square rounded-sm border border-gray-500 bg-muted px-2 text-xs opacity-0 transition-opacity md:group-hover:opacity-100">
            {shortcut}
        </kbd>
    </Button>
)

type HistoryAction = 
  | { index: number; action: "upvote" }
  | { index: number; action: "downvote" }
  | { index: number; action: "skip" }
  | { 
      index: number; 
      action: "correction"; 
      newTranslation: { text: string; translation: string }; 
      oldTranslation: { id: string; text: string; translation: string } 
    }

export default function TranslationValidator({
    translations,
    user,
    isTrustedTranslator,
}: {
    translations:
        | Database["public"]["Tables"]["translations"]["Row"][]
        | null
        | undefined
    user: User | null | undefined
    isTrustedTranslator: boolean
}) {
    const t = getI18nCLient()
    const router = useRouter()
    const supabase = createClientComponentClient<Database>()
    
    const [currentIndex, setCurrentIndex] = useState(0)
    const [history, setHistory] = useState<HistoryAction[]>([])
    const [showCorrectionModal, setShowCorrectionModal] = useState(false)

    useEffect(() => {
        setHistory([])
        setCurrentIndex(0)
    }, [translations])

    const logError = (error: any) => console.error("Error:", error)

    const recordHistory = (action: HistoryAction) => {
        setHistory(prev => [...prev, action])
    }

    const handleUpvote = async (text: string, translation: string, isUserTranslation = false) => {
        if (!user) return

        const { error } = await supabase.rpc("translation_upvote", {
            p_user_id: user.id,
            p_lang: franc(text, {
                minLength: 2,
                ignore: [
                    "bel",
                    "ukr",
                    "srp",
                    "bul",
                    "bos",
                    "koi",
                    "azj",
                    "uzn",
                    "run",
                    "kin",
                ],
            }),
            p_text: text,
            p_translation: translation,
            p_is_user_translation: isUserTranslation,
        })

        if (error) logError(error)
    }

    const handleDownvote = async (text: string, translation: string) => {
        if (!user) return

        const { error } = await supabase.rpc("translation_downvote", {
            p_user_id: user.id,
            p_text: text,
            p_translation: translation,
        })

        if (error) logError(error)
    }

    const handleAction = async (action: "upvote" | "downvote" | "skip") => {
        if (!user || !translations || !translations[currentIndex]) return

        const currentTranslation = translations[currentIndex]

        if (action === "downvote" && isTrustedTranslator) {
            setShowCorrectionModal(true)
            return
        }

        recordHistory({ index: currentIndex, action })

        if (action === "skip") {
            setCurrentIndex(prev => prev + 1)
            return
        }

        if (action === "upvote") {
            await handleUpvote(currentTranslation.text, currentTranslation.translation)
        } else if (action === "downvote") {
            await handleDownvote(currentTranslation.text, currentTranslation.translation)
        }

        setCurrentIndex(prev => prev + 1)
    }

    const handleUndo = async () => {
        if (!user || !translations || history.length === 0) return

        const lastAction = history[history.length - 1]
        setHistory(prev => prev.slice(0, -1))
        
        if (!lastAction) return

        switch (lastAction.action) {
            case "upvote":
                await undoUpvote(lastAction)
                break
            case "downvote":
                await undoDownvote(lastAction)
                break
            case "correction":
                await undoCorrection(lastAction)
                break
            case "skip":
                setCurrentIndex(lastAction.index)
                break
            default:
                break
        }
    }

    const undoUpvote = async (action: Extract<HistoryAction, { action: "upvote" }>) => {
        const translationToDelete = translations?.[action.index] ?? null;
        if (!translationToDelete) return

        const { error } = await supabase.rpc("undo_translation_upvote", {
            p_user_id: user!.id,
            p_text: translationToDelete.text,
            p_translation: translationToDelete.translation,
        })

        if (error) logError(error)

        setCurrentIndex(action.index)
    }

    const undoDownvote = async (action: Extract<HistoryAction, { action: "downvote" }>) => {
        const translation = translations?.[action.index] ?? null;
        if (!translation) return

        const { error } = await supabase
            .from("votes")
            .delete()
            .match({
                translation_id: translation.id,
                user_id: user!.id,
                vote: -1,
            })

        if (error) logError(error)

        setCurrentIndex(action.index)
    }

    const undoCorrection = async (action: Extract<HistoryAction, { action: "correction" }>) => {
        const { newTranslation, oldTranslation } = action

        // Delete the new user translation
        const { error: deleteNewError } = await supabase
            .from("translations")
            .delete()
            .match({ 
                user_id: user!.id, 
                text: newTranslation.text, 
                translation: newTranslation.translation, 
                is_user_translation: true 
            })

        if (deleteNewError) logError(deleteNewError)

        // Remove the downvote for the old translation
        const { error: deleteDownvoteError } = await supabase
            .from("votes")
            .delete()
            .match({ 
                translation_id: oldTranslation.id, 
                user_id: user!.id, 
                vote: -1 
            })

        if (deleteDownvoteError) logError(deleteDownvoteError)

        setCurrentIndex(action.index)
    }

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (showCorrectionModal) return
        switch (event.key) {
            case "ArrowUp":
                handleUndo()
                break
            case "ArrowDown":
                handleAction("skip")
                break
            case "ArrowLeft":
                handleAction("downvote")
                break
            case "ArrowRight":
                handleAction("upvote")
                break
        }
    }

    const handleCorrection = async (correction: string) => {
        if (!user || !translations) return

        const currentTranslation = translations[currentIndex]
        if (!currentTranslation) return

        setShowCorrectionModal(false)

        // Downvote the old translation
        await handleDownvote(currentTranslation.text, currentTranslation.translation)

        // Upvote the corrected translation
        await handleUpvote(currentTranslation.text, correction, true)

        recordHistory({ 
            index: currentIndex, 
            action: "correction", 
            newTranslation: { 
                text: currentTranslation.text, 
                translation: correction 
            }, 
            oldTranslation: { 
                id: currentTranslation.id, 
                text: currentTranslation.text, 
                translation: currentTranslation.translation 
            } 
        })
        
        setCurrentIndex(prev => prev + 1)
    }      

    if (!translations || translations.length === 0) {
        return (
            <div className="flex h-full w-full flex-col items-center justify-center gap-4">
                <h2 className="text-center text-2xl font-semibold">
                    {t("contribute.no_more_translations")}
                </h2>
            </div>
        )
    }

    if (currentIndex >= translations.length) {
        return (
            <div className="flex h-full w-full flex-col items-center justify-center gap-4">
                <h2 className="text-2xl font-semibold">
                    {t("contribute.thank_you_for_your_help")}
                </h2>
                <div className="flex flex-col gap-4">
                    <Button
                        size="lg"
                        variant="default"
                        onClick={() => window.location.reload()}
                    >
                        {t("buttons.keep_going")}
                    </Button>
                    <Button
                        size="lg"
                        variant="secondary"
                        onClick={() => router.push("/")}
                    >
                        {t("buttons.done")}
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div
            className={cn(
                "flex w-full flex-col",
                "md:h-full md:flex-row md:items-start md:gap-2 md:px-20",
                "focus:outline-none"
            )}
            tabIndex={0}
            onKeyDown={handleKeyDown}
        >
            <div className="flex flex-1 flex-col items-center gap-8 md:gap-8">
                <div className="flex items-center gap-4">
                    <h2 className="text-2xl font-semibold">
                        {t("contribute.is_this_translation_correct")}
                    </h2>
                    <div className="text-xl text-gray-500">{`${
                        currentIndex + 1
                    } / ${translations.length}`}</div>
                </div>

                <div className="flex w-full flex-1 flex-col gap-4 px-10 text-center md:flex-row md:gap-8">
                    <Card className="container bg-white md:w-1/2">
                        <CardHeader className="p-2" />
                        <CardContent className="flex flex-col gap-4">
                            <p className="text-xl font-semibold text-black">
                                {translations[currentIndex].text}
                            </p>
                        </CardContent>
                    </Card>
                    <Card className="container md:w-1/2">
                        <CardHeader className="p-2" />
                        <CardContent className="flex flex-col gap-4">
                            <p className="text-xl font-semibold">
                                {translations[currentIndex].translation}
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <div
                className={cn(
                    "sticky bottom-0 grid w-full flex-none grid-cols-2 items-center gap-2 bg-background p-4",
                    "md:right-6 md:max-w-xs md:pt-16"
                )}
            >
                {history.length > 0 ? (
                    <HoverButton
                        className="flex-1"
                        icon={Icons.undo}
                        text={t("buttons.undo")}
                        shortcut="↑"
                        onClick={handleUndo}
                    />
                ) : (
                    <div className="p-10" />
                )}
                <HoverButton
                    className="flex-1"
                    icon={Icons.skip}
                    text={t("buttons.skip")}
                    shortcut="↓"
                    onClick={() => handleAction("skip")}
                />
                <HoverButton
                    className="flex-1"
                    icon={Icons.thumbsDown}
                    text={t("buttons.incorrect")}
                    shortcut="←"
                    onClick={() => handleAction("downvote")}
                />
                <HoverButton
                    className="flex-1"
                    icon={Icons.thumbsUp}
                    text={t("buttons.correct")}
                    shortcut="→"
                    onClick={() => handleAction("upvote")}
                />
            </div>

            <CorrectionModal
                isOpen={showCorrectionModal}
                onClose={() => setShowCorrectionModal(false)}
                onSubmit={handleCorrection}
                onSkip={() => {
                    setShowCorrectionModal(false)
                    handleAction("skip")
                }}
                originalText={translations?.[currentIndex]?.text || ""}
                currentTranslation={translations?.[currentIndex]?.translation || ""}
            />
        </div>
    )
}
