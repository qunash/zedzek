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
import { User } from '@supabase/supabase-js'
import React, { MutableRefObject, useRef, useState } from 'react'
import { Textarea } from './ui/textarea'
import { Toggle } from "./ui/toggle"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip'
import { getI18nCLient } from "@/app/locales/client"

export function EditTranslationDialog(
    { supabase, user, translation, children }: {
        supabase: any,
        user: User | null | undefined,
        translation: TranslationResponse,
        children: JSX.Element
    }
) {
    const t = getI18nCLient()
    const [isOpened, setIsOpened] = useState(false)
    const [activeToggles, setActiveToggles] = useState(
        new Array(translation.translations.length).fill(false)
    )
    const [text, setText] = useState('')
    const textAreaRef = useRef() as MutableRefObject<HTMLTextAreaElement>

    const handleKeyDown = (event: React.KeyboardEvent) => {
        const { ctrlKey, metaKey, key, target } = event
    
        if (!isOpened) return
    
        if (key === "Escape") {
            handleClose()
            return
        }
    
        if ((ctrlKey || metaKey) && key === "Enter") {
            handleSubmit()
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

    const handleClose = () => {
        setIsOpened(false)
    }

    const handleSubmit = async () => {
        const translations = translation.translations.filter((_, i) => activeToggles[i])
        const userTranslation = text.trim()
    
        const upsertData = [
            ...translations.map((t) => ({
                user_id: user?.id,
                text: translation.text,
                translation: t,
                is_user_translation: false,
            }))
        ]
    
        if (userTranslation) {
            upsertData.push({
                user_id: user?.id,
                text: translation.text.trim(),
                translation: userTranslation,
                is_user_translation: true,
            })
        }
    
        const { error } = await supabase
            .from("translations")
            .upsert(
                upsertData,
                { onConflict: 'text, translation' }
            )
    
        if (error) console.log('supabase error', error)
    
        handleClose()
    }


    return (

        <div tabIndex={-1} onKeyDown={handleKeyDown}>
            <Dialog open={isOpened} onOpenChange={setIsOpened}>
                <DialogTrigger asChild>
                    {children}
                </DialogTrigger>
                <DialogContent className="max-h-[80%] min-w-fit max-w-sm overflow-y-auto sm:max-w-[425px] md:w-full">
                    <DialogHeader className="items-center justify-center rounded-md bg-white p-4">
                        <h1 className="text-xl font-semibold text-black">
                            {translation.text}
                        </h1>
                    </DialogHeader>
                    <div className="flex flex-col flex-wrap items-center justify-center gap-3">
                        <DialogDescription>
                            {t('edit_translations.choose_correct_translations')}
                        </DialogDescription>
                        <div className="flex w-full flex-wrap justify-center gap-3 py-4 ">
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
                            {t('edit_translations.or_add_your_own')}
                        </DialogDescription>
                        <Textarea value={text} onChange={(e) => setText(e.target.value)} ref={textAreaRef} />
                    </div>
                    <DialogFooter>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button type="submit" onClick={handleSubmit}>
                                        {t('buttons.submit')}
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent side='left' className='mr-4'>
                                    <p>Ctrl + Enter</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </DialogFooter>
                </DialogContent>
            </Dialog >
        </div>
    )
}
