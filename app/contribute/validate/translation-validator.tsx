"use client"

import { Icons } from '@/components/icons'
import { SignInButton } from '@/components/sign-in-button'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { cn } from '@/lib/utils'
import { User, createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

type HoverButtonProps = {
    className?: string
    icon: React.ComponentType<{ className?: string }>
    text: string
    shortcut: string
    onClick?: () => void
}

const HoverButton: React.FC<HoverButtonProps> = ({ className, icon: Icon, text, shortcut, onClick }) => {
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


export default function TranslationValidator({ translations, user }: {
    translations: Database["public"]["Tables"]["translations"]["Row"][] | null | undefined,
    user: User | null | undefined
}) {
    const router = useRouter()
    const supabase = createClientComponentClient<Database>()
    const [history, setHistory] = useState<{ index: number, action: 'like' | 'dislike' | 'skip' }[]>([])
    const currentIndex = history.length

    useEffect(() => {
        setHistory([])
    }, [translations])

    useEffect(() => {
        console.log("translations", translations)
    }, [translations])

    const logError = (error: any) => console.error("Error:", error)

    const handleAction = async (action: 'like' | 'dislike' | 'skip') => {
        if (!user || !translations) return

        const currentTranslation = translations[currentIndex]
        if (!currentTranslation) return

        setHistory(prev => [...prev, { index: currentIndex, action }])

        if (action === 'skip') return

        if (action === 'like') {
            const { error } = await supabase
                .from("translations")
                .insert({
                    user_id: user.id,
                    text: currentTranslation.text,
                    translation: currentTranslation.translation,
     
                    is_user_translation: true,
                })

            if (error) logError(error)
        }

        if (action === 'dislike') {
            const { error } = await supabase
                .from("translations")
                .delete()
                .match({
                    user_id: user.id,
                    text: currentTranslation.text,
                    translation: currentTranslation.translation,
                    is_user_translation: true,
                })

            if (error) logError(error)
        }

    }

    const handleUndo = async () => {

        if (!user || !translations) return

        const lastAction = history.pop()
        setHistory([...history])

        if (lastAction?.action === 'like') {
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
            case 'ArrowUp':
                history.length > 0 && handleUndo()
                break
            case 'ArrowDown':
                handleAction('skip')
                break
            case 'ArrowLeft':
                handleAction('dislike')
                break
            case 'ArrowRight':
                handleAction('like')
                break
            default:
                return
        }
    }

    if (!translations || translations.length === 0) {
        return (
            <div className="flex h-full w-full flex-col items-center justify-center gap-4">
                <h2 className="text-center text-2xl font-semibold">
                    No more translations at the moment. Come back later!
                </h2>
            </div>
        )
    }

    if (currentIndex >= translations.length) {
        return (
            <div className="flex h-full w-full flex-col items-center justify-center gap-4">
                <h2 className="text-2xl font-semibold">Thanks for your contribution!</h2>
                <div className="flex flex-col gap-4">
                    <Button
                        size="lg"
                        variant="default"
                        onClick={
                            () => {
                                router.refresh()
                            }
                        }
                    >
                        Keep going
                    </Button>
                    <Button
                        size="lg"
                        variant="secondary"
                        onClick={() => router.push('/')}
                    >
                        Done
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className={cn(
            "flex w-full flex-col",
            "md:h-full md:flex-row md:items-start md:gap-2 md:px-20",
            "focus:outline-none"
        )}
            tabIndex={0}
            onKeyDown={handleKeyDown}
        >
            <div className="flex flex-1 flex-col items-center gap-8 md:gap-8">
                <div className="flex items-center gap-4">
                    <h2 className="text-2xl font-semibold">Is this translation correct?</h2>
                    <div className="text-xl text-gray-500">{`${currentIndex + 1} / ${translations.length}`}</div>
                </div>

                <div className="flex w-full flex-1 flex-col gap-4 px-10 text-center md:flex-row md:gap-8">
                    <Card className="container bg-white md:w-1/2">
                        <CardHeader className="p-2" />
                        <CardContent className="flex flex-col gap-4">
                            <p className="text-xl font-semibold text-black">{translations[currentIndex].text}</p>
                        </CardContent>
                    </Card>
                    <Card className="container md:w-1/2">
                        <CardHeader className="p-2" />
                        <CardContent className="flex flex-col gap-4">
                            <p className="text-xl font-semibold">{translations[currentIndex].translation}</p>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <div className={cn(
                "sticky bottom-0 grid w-full flex-none grid-cols-2 items-center gap-2 bg-background p-4",
                "md:right-6 md:max-w-xs md:pt-16"
            )}>

                {history.length > 0 ?
                    <HoverButton
                        className="flex-1"
                        icon={Icons.undo}
                        text="Undo"
                        shortcut="↑"
                        onClick={handleUndo}
                    />
                    : <div className="p-10" />
                }
                <HoverButton
                    className="flex-1"
                    icon={Icons.skip}
                    text="Skip"
                    shortcut="↓"
                    onClick={() => handleAction('skip')}
                />
                <HoverButton
                    className="flex-1"
                    icon={Icons.thumbsDown}
                    text="Incorrect"
                    shortcut="←"
                    onClick={() => handleAction('dislike')}
                />
                <HoverButton
                    className="flex-1"
                    icon={Icons.thumbsUp}
                    text="Correct"
                    shortcut="→"
                    onClick={() => handleAction('like')}
                />
            </div >
        </div >
    )
}