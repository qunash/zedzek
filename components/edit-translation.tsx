import React, { useRef, useEffect, useState, MutableRefObject } from 'react'
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTrigger
} from "@/components/ui/dialog"
import { TranslationResponse } from "@/types/translation-response"
import { Textarea } from './ui/textarea'
import { Toggle } from "./ui/toggle"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip'

export function EditTranslationDialog(
    { translation, children }: { translation: TranslationResponse, children: JSX.Element }
) {
    const [isOpened, setIsOpened] = useState(false)
    const [activeToggles, setActiveToggles] = useState(
        new Array(translation.translations.length).fill(false)
    )
    const [text, setText] = useState('')
    const textAreaRef = useRef() as MutableRefObject<HTMLTextAreaElement>

    useEffect(() => {
        if (!isOpened) return

        const handleKeyDown = ({ ctrlKey, key, target }: KeyboardEvent) => {

            if (!isOpened) return

            if (key === "Escape") {
                handleClose()
                return
            }

            if (ctrlKey && key === "Enter") {
                handleClose()
                return
            }

            const index = Number(key) - 1
            if (["1", "2", "3", "4"].includes(key) && index < translation.translations.length) {
                if (target === textAreaRef.current) return
                const updatedToggles = [...activeToggles]
                updatedToggles[index] = !updatedToggles[index]
                setActiveToggles(updatedToggles)
            }
        }

        document.addEventListener("keydown", handleKeyDown)

        return () => document.removeEventListener("keydown", handleKeyDown)

    }, [activeToggles, translation.translations.length, isOpened])

    const handleClose = () => {
        setIsOpened(false)
    }

    const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setText(event.currentTarget.value)
    }


    return (
        <Dialog open={isOpened} onOpenChange={setIsOpened}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="min-w-fit max-w-sm sm:max-w-[425px] md:w-full">
                <DialogHeader className="items-center justify-center">
                    <h1 className="max-h-12 overflow-hidden text-ellipsis text-xl font-bold md:max-h-20">
                        {translation.text}
                    </h1>
                </DialogHeader>
                <div className="flex flex-col flex-wrap items-center justify-center gap-4">
                    <DialogDescription>
                        Choose correct translations
                    </DialogDescription>
                    <div className="flex max-h-52 w-full flex-wrap justify-center gap-3 overflow-y-auto py-4 md:max-h-52">
                        {
                            translation.translations.map((t, i) => (
                                <div key={i} className="w-content md:w-content group relative max-w-full">
                                    <Toggle
                                        variant="outline"
                                        pressed={activeToggles[i]}
                                        className="h-fit max-w-full p-2 transition-colors hover:border-gray-500 hover:bg-transparent md:p-6"
                                        onClick={() => {
                                            const updatedToggles = [...activeToggles]
                                            updatedToggles[i] = !updatedToggles[i]
                                            setActiveToggles(updatedToggles)
                                        }}
                                    >
                                        {t}
                                    </Toggle>
                                    <kbd className="absolute bottom-1 right-1 rounded-sm border border-gray-500 bg-muted px-1 text-xs uppercase opacity-0 transition-opacity md:group-hover:opacity-100">
                                        {i + 1}
                                    </kbd>
                                </div>
                            ))
                        }
                    </div>
                    <DialogDescription>
                        Or suggest your own
                    </DialogDescription>
                    <Textarea value={text} onChange={handleTextChange}
                        ref={textAreaRef}
                    />
                </div>
                <DialogFooter>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button type="submit" onClick={handleClose}>
                                    Submit
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side='bottom' className='mt-2'>
                                <p>Ctrl + Enter</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </DialogFooter>
            </DialogContent>
        </Dialog >
    )
}
