import React, { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { getI18nCLient } from "@/app/locales/client"

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

    useEffect(() => {
        setCorrection(currentTranslation)
    }, [currentTranslation])

    const handleSubmit = () => {
        onSubmit(correction)
        onClose()
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
                        <Textarea
                            id="correction"
                            value={correction}
                            onChange={(e) => setCorrection(e.target.value)}
                            placeholder={t("validate.enter_correction")}
                        />
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