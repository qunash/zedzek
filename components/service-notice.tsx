"use client"

import { getI18nCLient } from "@/app/locales/client"
import { Icons } from "./icons"

export function ServiceNotice() {
    const t = getI18nCLient()

    return (
        <div
            role="status"
            className="mb-4 w-full rounded-lg border border-amber-300/70 bg-amber-50 px-4 py-3 text-amber-900 shadow-sm dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-100"
        >
            <div className="flex items-start gap-3">
                <Icons.info className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" aria-hidden="true" />
                <div className="space-y-0.5">
                    <p
                        className="text-sm font-semibold md:text-base"
                        dangerouslySetInnerHTML={{ __html: t("notice.title") }}
                    />
                    <p
                        className="text-sm text-amber-800/90 dark:text-amber-100/80"
                        dangerouslySetInnerHTML={{ __html: t("notice.message") }}
                    />
                </div>
            </div>
        </div>
    )
}
