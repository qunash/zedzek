import { getRequestConfig } from 'next-intl/server'

export default getRequestConfig(async ({ locale }) => ({
    messages: {
        ...(await import(`./messages/index/${locale}.json`)).default,
        ...(await import(`./messages/translator/${locale}.json`)).default,
        ...(await import(`./messages/faq/${locale}.json`)).default,
      }
}))