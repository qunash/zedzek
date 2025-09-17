"use client"

import { useCallback, useMemo, useState } from "react"

import { getI18nCLient } from "@/app/locales/client"
import { Icons } from "./icons"
import { Button } from "./ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog"

declare global {
    interface Window {
        gtag?: (...args: unknown[]) => void
    }
}

const TELEGRAM_INVITE_URL = "https://t.me/+ile9fiH1gcUxOGE8"

export function CommonVoiceCTA() {
    const t = getI18nCLient()
    const [isOpen, setIsOpen] = useState(false)

    const handleBannerClick = useCallback(() => {
        setIsOpen(true)
        if (typeof window !== "undefined" && typeof window.gtag === "function") {
            window.gtag("event", "common_voice_cta_click", {
                event_category: "engagement",
                event_label: "common_voice_modal",
            })
        }
    }, [setIsOpen])

    const handleTelegramClick = useCallback(() => {
        if (typeof window !== "undefined" && typeof window.gtag === "function") {
            window.gtag("event", "common_voice_telegram_click", {
                event_category: "outbound",
                event_label: TELEGRAM_INVITE_URL,
            })
        }

        if (typeof window !== "undefined") {
            window.open(TELEGRAM_INVITE_URL, "_blank", "noopener,noreferrer")
        }
    }, [])

    const paragraphs = useMemo(() => {
        const keys = ["paragraph1", "paragraph2", "paragraph3", "paragraph4"] as const
        return keys
            .map((key) => t(`commonVoiceCTA.${key}`))
            .filter((value) => value && value.trim().length > 0)
    }, [t])



    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <button
                type="button"
                onClick={handleBannerClick}
                className="my-4 w-full rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 text-left text-sm font-medium text-primary shadow-sm transition hover:bg-primary/10 focus-visible:outline focus-visible:ring-2 focus-visible:ring-primary md:text-base"
                aria-label={t("commonVoiceCTA.bannerAriaLabel")}
            >
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <span className="text-base">{t("commonVoiceCTA.bannerTitle")}</span>
                    <span className="inline-flex items-center gap-2 text-sm md:text-base">
                        {t("commonVoiceCTA.bannerCta")}
                        <Icons.submit className="h-4 w-4" aria-hidden="true" />
                    </span>
                </div>
            </button>
            <DialogContent className="max-w-xl">
                <DialogHeader>
                    <DialogTitle>{t("commonVoiceCTA.modalTitle")}</DialogTitle>
                </DialogHeader>
                <div className="space-y-3 text-base leading-6 text-foreground">
                    {paragraphs.map((paragraph, index) => (
                        <p
                            key={index}
                            {...(index === 0
                                ? { dangerouslySetInnerHTML: { __html: paragraph } }
                                : { children: paragraph })}
                        />
                    ))}
                    <button
                        type="button"
                        onClick={handleTelegramClick}
                        className="flex w-full items-center gap-3 rounded-md bg-primary/10 p-6 text-left text-sm transition hover:bg-primary/20 focus-visible:outline focus-visible:ring-2 focus-visible:ring-primary"
                        aria-label={t("commonVoiceCTA.telegramAriaLabel")}
                    >
                        <Icons.telegram className="h-6 w-6 text-primary" aria-hidden="true" />
                        <span className="font-medium">{t("commonVoiceCTA.telegramButtonTitle")}</span>
                    </button>
                </div>
                <DialogFooter>
                    <Button variant="secondary" onClick={() => setIsOpen(false)}>
                        {t("commonVoiceCTA.close")}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
