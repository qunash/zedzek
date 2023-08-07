import { NextIntlProvider } from "next-intl"
import { NextAdapter } from "next-query-params"
import type { AppProps } from "next/app"
import { Inter as FontSans } from "next/font/google"
import { GoogleAnalytics } from "nextjs-google-analytics"
import { QueryParamProvider } from "use-query-params"

import "@/styles/globals.css"
import { Layout } from "@/components/layout"

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
})

export default function App({ Component, pageProps }: AppProps) {
  return (
    <NextIntlProvider messages={pageProps.messages}>
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
    </NextIntlProvider>
  )
}
