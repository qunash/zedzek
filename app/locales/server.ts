import { createI18nServer } from 'next-international/server'

export const { getI18n: getI18nServer, getScopedI18n, getStaticParams } = createI18nServer({
  en: () => import('./en'),
  ar: () => import('./ar'),
  tr: () => import('./tr'),
  ru: () => import('./ru')
})
