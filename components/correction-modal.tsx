import React, { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { getI18nCLient } from "@/app/locales/client"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { Icons } from "@/components/icons"
import { buttonVariants } from "@/components/ui/button"
import { LoadingSpinner } from "@/components/loading-spinner"


interface CorrectionModalProps {
    isOpen: boolean
    onClose: () => void
    onSubmit: (correction: string) => void
    onSkip: () => void
    originalText: string
    currentTranslation: string
}

export function CorrectionModal({
    isOpen,
    onClose,
    onSubmit,
    onSkip,
    originalText,
    currentTranslation
}: CorrectionModalProps) {
    const t = getI18nCLient()
    const [correction, setCorrection] = useState(currentTranslation)
    const [autotranslationLoading, setAutotranslationLoading] = useState(false)

    useEffect(() => {
        setCorrection(currentTranslation)
    }, [currentTranslation])

    const handleSubmit = () => {
        onSubmit(correction)
        onClose()
    }

    const handleAutoTranslate = async () => {
        if (autotranslationLoading) return

        setAutotranslationLoading(true)
        try {
            const response = await fetch("/api/claude-translate", {
                method: "POST",
                body: JSON.stringify({ text: originalText }),
                headers: {
                    "Content-Type": "application/json",
                },
            })
            const data = await response.json()
            if (response.ok) {
                setCorrection(data.translation)
            } else {
                throw new Error(data.error)
            }
        } catch (error) {
            console.error(error)
        } finally {
            setAutotranslationLoading(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{t("validate.provide_correction")}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <div id="original-text" className="p-2 bg-gray-100 rounded text-black text-sm font-medium">
                            {originalText}
                        </div>
                    </div>
                    <div className="grid gap-2">
                        {autotranslationLoading ? (
                            <LoadingSpinner />
                        ) : (
                            <div className="relative">
                                <Textarea
                                    id="correction"
                                    value={correction}
                                    onChange={(e) => setCorrection(e.target.value)}
                                    placeholder={t("validate.enter_correction")}
                                    className="pr-14"
                                />
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <div
                                                className={buttonVariants({
                                                    size: "sm",
                                                    variant: "ghost",
                                                    className: "absolute right-2 top-2 p-2 text-slate-700 dark:text-slate-400 cursor-pointer",
                                                })}
                                                onClick={handleAutoTranslate}
                                            >
                                                <Icons.logo className="h-5 w-5 fill-current" />
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent side="left">
                                            <p>{t("contribute.auto_translate")}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={onSkip}>
                        {t("buttons.skip")}
                    </Button>
                    <Button onClick={handleSubmit} disabled={!correction.trim()}>
                        {t("buttons.submit")}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}