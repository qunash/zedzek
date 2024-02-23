"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import {
    createClientComponentClient,
    User,
} from "@supabase/auth-helpers-nextjs"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Icons } from "@/components/icons"
import { getI18nCLient } from "@/app/locales/client"

type HistoryEntry = {
    index: number
    action: "approve" | "skip"
    textId: string
    text?: string
}

type HoverButtonProps = {
    icon: React.ComponentType<{ className?: string }>
    text: string
    onClick?: () => void
    disabled?: boolean
}

const HoverButton: React.FC<HoverButtonProps> = ({
    icon: Icon,
    text,
    onClick,
    disabled,
}) => (
    <Button
        variant="ghost"
        onClick={onClick}
        size="lg"
        className="group flex flex-col border p-10"
        disabled={disabled}
    >
        <div className="flex flex-col items-center justify-center">
            <Icon className="h-8 w-8" />
            <div className="text-sm text-gray-500 opacity-100 transition-opacity md:opacity-0 md:group-hover:opacity-100">
                {text}
            </div>
        </div>
    </Button>
)

export default function SentenceProofreader({
    texts,
    user,
}: {
    texts:
        | Database["public"]["Tables"]["texts_to_proofread"]["Row"][]
        | null
        | undefined
    user: User | null | undefined
}) {
    const t = getI18nCLient()
    const router = useRouter()
    const supabase = createClientComponentClient<Database>()

    const textareaRef = useRef<HTMLTextAreaElement>(null)

    const [history, setHistory] = useState<HistoryEntry[]>([])
    const currentIndex = history.length
    const [text, setText] = useState("")
    

    useEffect(() => {
        if (texts && texts.length > 0) {
            setText(texts[currentIndex]?.text || "")
        }
    }, [texts, currentIndex])

    const logError = (error: any) => console.error("Error:", error)

    function focusOnTextarea() {
        textareaRef.current?.focus()
    }

    useEffect(() => {
        // router.refresh() // ugly hack to force data revalidation. Revalidation does not work yet in Next.js 13.4.19. TODO: update later. see /page.tsx
    }, [])

    const handleAction = async (action: "approve" | "skip") => {
        if (!user || !texts) return

        const currentText = texts[currentIndex]
        if (!currentText) return

        const newHistory = [
            ...history,
            { index: currentIndex, action, textId: currentText.id, text },
        ]
        setHistory(newHistory)

        // if (action === 'skip') {}

        if (action === "approve") {
            const { error } = await supabase.rpc("insert_or_update_proofread_text", {
                p_user_id: user?.id,
                p_text_id: currentText.id,
                p_text: text,
            })

            if (error) logError(error)
        }

        const nextIndex = newHistory.length

        if (nextIndex < texts.length) {
            setText(texts[nextIndex]?.text || "")
        } else {
            // Handle the case where there are no more texts
            setText("")
        }
    }

    const handleUndo = async () => {
        if (!user || !texts || history.length === 0) return

        const lastAction = history.pop()
        setHistory([...history])

        if (lastAction?.action === "approve") {
            const { error } = await supabase
                .from("proofread_texts")
                .delete()
                .match({
                    user_id: user.id,
                    text_id: lastAction.textId,
                })

            if (error) logError(error)
        }

        setText(lastAction?.text || "")
    }

    if (!texts || texts.length === 0) {
        return <div>No texts available for proofreading.</div>
    }

    if (currentIndex >= texts.length) {
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
            className="flex w-full flex-col items-center gap-4 md:gap-10"
            tabIndex={-1}
        >
            <div className="mx-10 flex flex-col items-center gap-1 md:w-1/2 md:gap-4">
                <h2 className="text-lg font-semibold md:text-2xl">
                    {t("contribute.review_the_following_translation_pair")}
                </h2>
                <div className="text-lg text-gray-500">
                {`${currentIndex + 1} / ${texts.length}`}
                </div>
            </div>
            <div className="flex w-full flex-1 flex-col items-center gap-3 px-10 text-center md:gap-6">
                <Card className="container cursor-pointer bg-white md:w-1/2" onClick={() => setText(texts[currentIndex]?.text || "")}>
                    <CardHeader className="p-2" />
                    <CardContent className="flex flex-col gap-4">
                        <p className="text-xl font-semibold text-black">
                            {texts[currentIndex].text}
                        </p>
                    </CardContent>
                </Card>
                <div className="relative h-full w-full md:w-1/2">
                    <Textarea
                        ref={textareaRef}
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        className="w-full text-base focus:border-0 h-36"
                        placeholder={t("contribute.enter_proofread_text")}
                    />
                    <p className="whitespace-pre-line p-2 text-start text-sm text-gray-500"
                        dangerouslySetInnerHTML={{__html: t("contribute.proofread_instructions")}}>
                    </p>
                </div>
            </div>

            <div
                className={cn(
                    "sticky bottom-0 grid w-full flex-none grid-cols-2 items-center gap-1 bg-background p-2",
                    "md:right-6 md:max-w-xs md:pt-16"
                )}
            >
              
                <HoverButton
                    icon={Icons.skip}
                    text={t("buttons.skip")}
                    onClick={() => handleAction("skip")}
                />

                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <HoverButton
                                icon={Icons.submit}
                                text={t("buttons.submit")}
                                onClick={() => handleAction("approve")}
                                disabled={text.trim() === ""}
                            />
                        </TooltipTrigger>
                        <TooltipContent side="bottom">
                            <p>Ctrl+Enter</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>

                {history.length > 0 ? (
                    <HoverButton
                        icon={Icons.undo}
                        text={t("buttons.undo")}
                        onClick={handleUndo}
                    />
                ) : (
                    <div className="p-10" />
                )}
            </div>
        </div>
    )
}