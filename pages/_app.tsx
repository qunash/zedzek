import type { AppProps } from "next/app"
import { NextIntlProvider } from 'next-intl'
import { Inter as FontSans } from "next/font/google"
import { NextAdapter } from "next-query-params"
import { ThemeProvider } from "next-themes"
import { GoogleAnalytics } from "nextjs-google-analytics"
import { QueryParamProvider } from "use-query-params"
import { SessionProvider } from "next-auth/react"

import "@/styles/globals.css"

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
})

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      <QueryParamProvider adapter={NextAdapter}>
        <GoogleAnalytics trackPageViews />

        <style jsx global>{`
				:root {
					--font-sans: ${fontSans.style.fontFamily};
				}
			}`}</style>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <NextIntlProvider messages={pageProps.messages}>
            <Component {...pageProps} />
          </NextIntlProvider>
        </ThemeProvider>
      </QueryParamProvider>
    </SessionProvider>
  )
}
