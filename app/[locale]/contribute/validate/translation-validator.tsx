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
}) => {
    return (
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
}

export default function TranslationValidator({
    translations,
    user,
}: {
    translations:
        | Database["public"]["Tables"]["translations"]["Row"][]
        | null
        | undefined
    user: User | null | undefined
}) {
    const t = getI18nCLient()
    const router = useRouter()
    const supabase = createClientComponentClient<Database>()
    const [history, setHistory] = useState<
        { index: number; action: "upvote" | "downvote" | "skip" }[]
    >([])
    const currentIndex = history.length

    useEffect(() => {
        router.refresh() // ugly hack to force data revalidation. Revalidation does not work yet in Next.js 13.4.19. TODO: update later. see /page.tsx
    }, [])

    useEffect(() => {
        setHistory([])
    }, [translations])

    const logError = (error: any) => console.error("Error:", error)

    const handleAction = async (action: "upvote" | "downvote" | "skip") => {
        if (!user || !translations) return

        const currentTranslation = translations[currentIndex]
        if (!currentTranslation) return

        setHistory((prev) => [...prev, { index: currentIndex, action }])

        if (action === "skip") return

        if (action === "upvote") {
            const { error } = await supabase.rpc("translation_upvote", {
                p_user_id: user?.id,
                p_lang: franc(currentTranslation.text, {
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
                p_text: currentTranslation.text,
                p_translation: currentTranslation.translation,
                p_is_user_translation: false,
            })

            if (error) logError(error)
        }

        if (action === "downvote") {
            const { error } = await supabase.rpc("translation_downvote", {
                p_user_id: user?.id,
                p_text: currentTranslation.text,
                p_translation: currentTranslation.translation,
            })

            if (error) logError(error)
        }
    }

    const handleUndo = async () => {
        if (!user || !translations) return

        const lastAction = history.pop()
        setHistory([...history])

        if (lastAction?.action === "upvote") {
            const { error } = await supabase
                .from("translations")
                .delete()
                .match({
                    user_id: user.id,
                    text: translations[lastAction.index].text,
                    translation: translations[lastAction.index].translation,
                    is_user_translation: true,
                })

            if (error) logError(error)
        }
    }

    const handleKeyDown = (event: React.KeyboardEvent) => {
        switch (event.key) {
            case "ArrowUp":
                history.length > 0 && handleUndo()
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
            default:
                return
        }
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
                        onClick={() => {
                            // setHistory([])
                            // router.refresh()
                            window.location.reload()
                        }}
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
        </div>
    )
}
