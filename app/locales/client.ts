import { createI18nClient } from 'next-international/client'

export const { useChangeLocale, useI18n: getI18nCLient, useScopedI18n, I18nProviderClient } = createI18nClient({
    en: () => import('./en'),
    ar: () => import('./ar'),
    tr: () => import('./tr'),
    ru: () => import('./ru')
})
