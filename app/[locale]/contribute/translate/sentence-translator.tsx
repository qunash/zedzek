"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import {
    createClientComponentClient,
    User,
} from "@supabase/auth-helpers-nextjs"

import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { Icons } from "@/components/icons"
import { getI18nCLient } from "@/app/locales/client"

type HistoryEntry = {
    index: number
    action: "submit" | "skip"
    translation?: string
}

type HoverButtonProps = {
    className?: string
    icon: React.ComponentType<{ className?: string }>
    text: string
    onClick?: () => void
    disabled?: boolean
}

const HoverButton: React.FC<HoverButtonProps> = ({
    className,
    icon: Icon,
    text,
    onClick,
    disabled,
}) => {
    return (
        <Button
            variant="ghost"
            onClick={onClick}
            size="lg"
            className={cn(
                className,
                "group relative flex flex-col gap-2 border p-10",
                disabled && "cursor-not-allowed opacity-50"
            )}
            disabled={disabled}
        >
            <div className="flex flex-col items-center">
                <Icon className="h-8 w-8 shrink-0" />
                <div className="text-sm text-gray-500 opacity-100 transition-opacity md:opacity-0 md:group-hover:opacity-100">
                    {text}
                </div>
            </div>
        </Button>
    )
}

export default function SentenceTranslator({
    sentences,
    user,
    lang,
}: {
    sentences:
        | Database["public"]["Tables"]["sentences"]["Row"][]
        | null
        | undefined
    user: User | null | undefined
    lang: string
}) {
    const t = getI18nCLient()
    const router = useRouter()
    const supabase = createClientComponentClient<Database>()

    const textareaRef = useRef<HTMLTextAreaElement>(null)

    const [history, setHistory] = useState<HistoryEntry[]>([])
    const currentIndex = history.length
    const [userTranslation, setUserTranslation] = useState("")
    const [loading, setLoading] = useState(false)

    const logError = (error: any) => console.error("Error:", error)

    function focusOnTextarea() {
        textareaRef.current?.focus()
    }

    useEffect(() => {
        // router.refresh() // ugly hack to force data revalidation. Revalidation does not work yet in Next.js 13.4.19. TODO: update later. see /page.tsx

        focusOnTextarea()
    }, [])

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.ctrlKey && e.key === "Enter") {
            handleAction("submit")
        }

        if (e.altKey && e.key === "t") {
            handleAutoTranslate()
        }
    }

    const handleAutoTranslate = async () => {
        if (loading) return
        if (!sentences || sentences.length === 0) return

        setLoading(true)
        try {
            const response = await fetch("/api/translate", {
                method: "POST",
                body: JSON.stringify({ text: sentences[currentIndex].text }),
                headers: {
                    "Content-Type": "application/json",
                },
            })
            const data = await response.json()
            if (response.ok) {
                setUserTranslation(data.translations[0])
            } else {
                throw new Error(data.error)
            }
        } catch (error: any) {
            setUserTranslation(error)
        } finally {
            setLoading(false)
            focusOnTextarea()
        }
    }

    const handleUndo = async () => {
        if (!user || !sentences) return

        const lastAction = history.pop()
        setHistory([...history])

        if (lastAction?.action === "submit") {
            const { error } = await supabase
                .from("translations")
                .delete()
                .match({
                    user_id: user.id,
                    text: sentences[lastAction.index].text,
                    translation: lastAction?.translation,
                    is_user_translation: true,
                })

            if (error) logError(error)
        }

        setUserTranslation(lastAction?.translation || "")

        focusOnTextarea()
    }

    const handleAction = async (action: "submit" | "skip") => {
        if (!user || !sentences) return

        const currentSentence = sentences[currentIndex]
        if (!currentSentence) return

        setHistory((prev) => [
            ...prev,
            { index: currentIndex, action, translation: userTranslation },
        ])

        // if (action === 'skip') {}

        if (action === "submit") {
            const { error } = await supabase.rpc("translation_upvote", {
                p_user_id: user?.id,
                p_lang: lang,
                p_text: currentSentence.text!,
                p_translation: userTranslation,
                p_is_user_translation: true,
            })

            if (error) logError(error)
        }

        setUserTranslation("")
        focusOnTextarea()
    }

    if (!sentences || sentences.length === 0) {
        return <div>No sentences available.</div>
    }

    if (currentIndex >= sentences.length) {
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
                            setHistory([])
                            router.refresh()
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
        <div className="flex w-full flex-col items-center gap-10">
            <div className="flex items-center gap-4">
                <h2 className="text-2xl font-semibold">
                    Translate the following text
                </h2>
                <div className="text-xl text-gray-500">
                    {`${currentIndex + 1} / ${sentences.length}`}
                </div>
            </div>
            <div className="flex w-full flex-1 flex-col items-center gap-6 px-10 text-center">
                <Card className="container bg-white md:w-1/2">
                    <CardHeader className="p-2" />
                    <CardContent className="flex flex-col gap-4">
                        <p className="text-xl font-semibold text-black">
                            {sentences[currentIndex].text}
                        </p>
                    </CardContent>
                </Card>
                <div className="relative h-full w-full md:w-1/2">
                    {loading ? (
                        <div className="flex h-full items-center justify-center">
                            <div className="h-4 w-4 animate-spin rounded-full border-y-2 border-gray-500" />
                        </div>
                    ) : (
                        <>
                            <Textarea
                                ref={textareaRef}
                                value={userTranslation}
                                onChange={(e) =>
                                    setUserTranslation(e.target.value)
                                }
                                className="h-full w-full text-base focus:border-0"
                                placeholder="Enter your translation here..."
                                onKeyDown={handleKeyDown}
                            />
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <div
                                            className={buttonVariants({
                                                size: "sm",
                                                variant: "ghost",
                                                className:
                                                    "absolute right-0 top-0 m-1 items-center justify-end self-start text-slate-700 dark:text-slate-400 cursor-pointer",
                                            })}
                                            onClick={handleAutoTranslate}
                                        >
                                            {<Icons.logo className="h-6 w-6" />}
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent side="bottom">
                                        <p>Auto translate (Alt + T)</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </>
                    )}
                </div>
            </div>

            <div
                className={cn(
                    "sticky bottom-0 grid w-full flex-none grid-cols-2 items-center gap-2 bg-background p-4",
                    "md:right-6 md:max-w-xs md:pt-16"
                )}
            >
                <HoverButton
                    icon={Icons.skip}
                    text="Skip"
                    onClick={() => handleAction("skip")}
                />
                <HoverButton
                    icon={Icons.submit}
                    text="Submit"
                    onClick={() => handleAction("submit")}
                    disabled={userTranslation.trim() === ""}
                />
                {history.length > 0 ? (
                    <HoverButton
                        icon={Icons.undo}
                        text="Undo"
                        onClick={handleUndo}
                    />
                ) : (
                    <div className="p-10" />
                )}
            </div>
        </div>
    )
}
