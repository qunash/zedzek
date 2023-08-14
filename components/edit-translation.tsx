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

export function EditTranslationDialog(
    { translation, children, isOpen, onClose }:
        { translation: TranslationResponse, children: JSX.Element, isOpen: boolean, onClose: () => void }
) {
    const [activeToggles, setActiveToggles] = useState(
        new Array(translation.translations.length).fill(false)
    )
    const [text, setText] = useState('')

    // const dialogRef = useRef<HTMLDivElement | null>(null)
    // const textAreaRef = useRef<HTMLTextAreaElement | null>(null)

    useEffect(() => {
        const handleKeyDown = ({ ctrlKey, key, target }: KeyboardEvent) => {

            if (!isOpen) return

            if (key === "Escape") {
                onClose()
                return
            }

            if (ctrlKey && key === "Enter") {
                onClose()
                return
            }

            const index = Number(key) - 1
            if (["1", "2", "3", "4"].includes(key) && index < translation.translations.length) {
                // if (target === textAreaRef.current) return
                const updatedToggles = [...activeToggles]
                updatedToggles[index] = !updatedToggles[index]
                setActiveToggles(updatedToggles)
            }
        }

        document.addEventListener("keydown", handleKeyDown)

        return () => {
            document.removeEventListener("keydown", handleKeyDown)
        }
    }, [activeToggles, translation.translations.length])

    const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setText(event.currentTarget.value)
    }

    return (
        // <div ref={dialogRef}>
        <Dialog open={isOpen} onOpenChange={() => console.log("onOpenChange")}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="min-w-fit sm:max-w-[425px] md:w-full"
            // onInteractOutside={() => onClose()}
            >
                <DialogHeader className="items-center justify-center">
                    <h1 className="text-2xl font-bold">
                        {translation.text}
                    </h1>
                    <DialogDescription>
                        Choose correct translations
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col flex-wrap items-center justify-center gap-4 overflow-auto">
                    <div className="flex w-full flex-wrap justify-center gap-2">
                        {
                            translation.translations.map((t, i) => (
                                <div key={i} className="group relative w-full md:w-1/3">
                                    <Toggle variant="outline" className="w-full p-8" pressed={activeToggles[i]}
                                        onClick={() => {
                                            const updatedToggles = [...activeToggles]
                                            updatedToggles[i] = !updatedToggles[i]
                                            setActiveToggles(updatedToggles)
                                        }}
                                    >
                                        {t}
                                    </Toggle>
                                    <kbd className="absolute bottom-2 right-2 rounded-sm border border-gray-500 bg-muted px-1 text-xs uppercase opacity-0 transition-opacity md:group-hover:opacity-100">
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
                    // ref={textAreaRef}
                    />
                </div>
                <DialogFooter>
                    <Button type="submit" onClick={onClose}>
                        Submit
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog >
        // </div>
    )
}
