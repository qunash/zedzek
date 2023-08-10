import { NextAdapter } from "next-query-params"
import type { AppProps } from "next/app"
import { Inter as FontSans } from "next/font/google"
import { GoogleAnalytics } from "nextjs-google-analytics"
import { QueryParamProvider } from "use-query-params"

import { Layout } from "@/components/layout"
import "@/styles/globals.css"
import { NextIntlClientProvider } from "next-intl"

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
})

export default function App({ Component, pageProps }: AppProps) {
  return (
    <NextIntlClientProvider messages={pageProps.messages}>
      <QueryParamProvider adapter={NextAdapter}>
        <GoogleAnalytics trackPageViews />

        <style jsx global>{`
				:root {
          --font-sans: ${fontSans.style.fontFamily};
				}
			}`}</style>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </QueryParamProvider>
    </NextIntlClientProvider>
  )
}
