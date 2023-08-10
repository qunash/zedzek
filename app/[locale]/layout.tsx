
import { NextIntlClientProvider, useLocale } from 'next-intl';
import { SiteHeader } from "@/components/site-header"
import { ThemeProvider } from "@/components/theme-provider"
import { notFound } from 'next/navigation';


export default async function RootLayout({ children, params: { params } }) {

  // const locale = useLocale();
  const locale = 'en';
  console.log('~~~~~locale', locale)

  let messages;
  try {
    messages = {
      ...(await import(`../../messages/index/${locale}.json`)).default,
      ...(await import(`../../messages/translator/${locale}.json`)).default,
      ...(await import(`../../messages/faq/${locale}.json`)).default,
    }
  } catch (error) {
    notFound();
  }


  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <div className="relative flex min-h-screen flex-col">
              <SiteHeader />
              <div className="h-16 w-full bg-red-500"/>
              <main>{children}</main>
            </div>
          </ThemeProvider>
        </NextIntlClientProvider >
      </body>
    </html>
  )
}
