import GoogleAnalytics from '@/components/google-analytics'
import { SiteHeader } from '@/components/site-header'
import { ThemeProvider } from '@/components/theme-provider'
import { siteConfig } from '@/config/site'
import { cn } from '@/lib/utils'
import '@/styles/globals.css'
import type { Metadata } from 'next'
import { Inter as FontSans } from "next/font/google"
import { getI18nServer } from '../locales/server'


const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export async function generateMetadata(): Promise<Metadata> {

  const t = await getI18nServer()
  
  return {
    // metadataBase: new URL(siteConfig.url),
    title: t("metadata.name"),
    description: t("metadata.description"),
    keywords: siteConfig.keywords,
    authors: [
      {
        name: "anzor.qunash",
        url: "https://github.com/qunash",
      }
    ],
    creator: "anzor.qunash",
    icons: {
      icon: "/favicon.ico",
    }
  }
}

export default function RootLayout({ children, params, }: {
  children: React.ReactNode,
  params: { locale: string }
}) {

  return (
    <html lang={params.locale}>
      <body
        className={cn(
          "flex h-screen flex-col items-center gap-8 bg-background md:gap-12",
          fontSans.variable
        )}
      >
          <ThemeProvider attribute="class" defaultTheme='system' enableSystem>
            <GoogleAnalytics />
            <SiteHeader params={params} />
            <main className="flex w-full flex-1 justify-center">{children}</main>
            {/* <SiteFooter /> */}
          </ThemeProvider>
      </body>
    </html>
  )
}
