"use client"

import { I18nProviderClient } from "./client"
import en from "./en"
import ru from "./ru"
import ar from "./ar"
import tr from "./tr"

export default function I18nProviderClientWrapper({ children, params }: { children: React.ReactNode, params: { locale: string } }) {
    const fallbackLocale = { ru, ar, tr }[params.locale] || en

    return (
        <I18nProviderClient locale={params.locale} fallbackLocale={fallbackLocale}>
            {children}
        </I18nProviderClient>
    )
}
