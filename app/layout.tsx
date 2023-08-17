import GoogleAnalytics from '@/components/google-analytics'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'
import { ThemeProvider } from '@/components/theme-provider'
import { siteConfig } from '@/config/site'
import { cn } from '@/lib/utils'
import '@/styles/globals.css'
import type { Metadata } from 'next'
import { Inter as FontSans } from "next/font/google"

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [
    {
      name: "qunash",
      url: "https://github.com/qunash",
    }
  ],
  creator: "qunash",
  icons: {
    icon: "/favicon.ico",
  }
}

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body
        className={cn(
          "flex h-screen flex-col items-center gap-8 bg-background md:gap-12",
          fontSans.variable
        )}
      >
        <ThemeProvider attribute="class" defaultTheme='system' enableSystem>
          <GoogleAnalytics />
          <SiteHeader />
          <main className="flex w-full flex-1 justify-center">{children}</main>
          {/* <SiteFooter /> */}
        </ThemeProvider>
      </body>
    </html>
  )
}
