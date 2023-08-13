'use client'

import Translator from "@/components/translator"
import NextQueryParamAdapter from "@/lib/next-query-params-adapter"
import { GoogleAnalytics } from "nextjs-google-analytics"
import { QueryParamProvider } from "use-query-params"

export default function Home() {
  return (
    // <QueryParamProvider adapter={NextAdapterApp}>
    <QueryParamProvider adapter={NextQueryParamAdapter}>
      <GoogleAnalytics trackPageViews />
      <section className="container grid justify-items-center gap-4">
        <h1 className="text-xl font-bold lg:text-2xl">
          {/* {t("header", { locale })} */}
          Circassian translator demo
        </h1>
        <Translator />
        {/* <Faq /> */}
      </section>
    </QueryParamProvider>
  )
}
