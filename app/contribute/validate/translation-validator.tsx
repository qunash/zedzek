"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Icons } from '@/components/icons'
import IconButton from '@/components/ui/icon-button'
import { Button } from '@/components/ui/button'

type HoverButtonProps = {
    icon: React.ComponentType<{ className?: string }>
    text: string
    shortcut: string
    onClick?: () => void
}

const HoverButton: React.FC<HoverButtonProps> = ({ icon: Icon, text, shortcut, onClick }) => {
    return (
        <Button
            variant="ghost"
            onClick={onClick}
            size="lg"
            className="group relative flex flex-col gap-2 border p-12 "
        >
            <div className="text-sm text-gray-500 opacity-100 transition-opacity md:opacity-0 md:group-hover:opacity-100">
                {text}
            </div>
            <Icon className="h-8 w-8 shrink-0" />
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

    return (
        <div className='h-full w-full flex-1 border'>
            {translations && currentIndex < translations.length && (
                <Card className='min-h-full'>
                    <CardHeader
                        className='text-lg font-semibold'
                    >
                        Is this translation correct?
                    </CardHeader>
                    <CardContent className="flex h-full flex-col gap-4">
                        <div className="flex-1">
                            <p className="text-lg font-semibold">{translations[currentIndex].text}</p>
                            <p>{translations[currentIndex].translation}</p>
                        </div>
                        <div className="grid flex-1 grid-cols-2 gap-4 self-center">
                            <HoverButton
                                icon={Icons.skip}
                                text="Skip"
                                shortcut="↓"
                                onClick={handleSkip}
                            />
                            {history.length > 0 ?
                                <HoverButton
                                    icon={Icons.undo}
                                    text="Undo"
                                    shortcut="↑"
                                    onClick={handleUndo}
                                />
                                : <div className="p-12" />
                            }
                            <HoverButton
                                icon={Icons.thumbsDown}
                                text="Incorrect"
                                shortcut="←"
                                onClick={handleDislike}
                            />
                            <HoverButton
                                icon={Icons.thumbsUp}
                                text="Correct"
                                shortcut="→"
                                onClick={handleLike}
                            />
                        </div>
                    </CardContent>
                </Card>
            )}
            {currentIndex >= (translations?.length || 0) && <p>No more translations.</p>}
        </div>
    )
}