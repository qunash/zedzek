"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Icons } from '@/components/icons'
import IconButton from '@/components/ui/icon-button'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

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


export default function TranslationValidator({ translations }: {
    translations: {
        created_at: string
        id: string
        is_user_translation: boolean
        text: string
        translation: string
        user_id: string
    }[] | null
}) {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [history, setHistory] = useState<number[]>([])

    const handleLike = () => {
        setHistory(prev => [...prev, currentIndex])
        setCurrentIndex(prev => prev + 1)
    }

    const handleDislike = () => {
        setHistory(prev => [...prev, currentIndex])
        setCurrentIndex(prev => prev + 1)
    }

    const handleSkip = () => {
        setHistory(prev => [...prev, currentIndex])
        setCurrentIndex(prev => prev + 1)
    }

    const handleUndo = () => {
        if (history.length > 0) {
            const lastAction = history[history.length - 1]
            setHistory(prev => prev.slice(0, -1))
            setCurrentIndex(lastAction)
        }
    }

    if (!translations || currentIndex >= (translations?.length || 0)) {
        return <p>No more translations.</p>
    }

    return (
        <div className={cn(
            "flex w-full flex-col",
            "md:h-full md:flex-row md:items-start md:gap-2 md:px-20"
        )}>
            <div className="flex flex-1 flex-col items-center gap-8 md:gap-8">
                <h2 className="text-2xl font-semibold">Is this translation correct?</h2>
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
                    onClick={handleSkip}
                />
                <HoverButton
                    className="flex-1"
                    icon={Icons.thumbsDown}
                    text="Incorrect"
                    shortcut="←"
                    onClick={handleDislike}
                />
                <HoverButton
                    className="flex-1"
                    icon={Icons.thumbsUp}
                    text="Correct"
                    shortcut="→"
                    onClick={handleLike}
                />
            </div >
        </div >
    )
}