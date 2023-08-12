'use client'

import Translator from "@/components/translator"
import NextQueryParamAdapter from "@/lib/next-query-params-adapter"
import { QueryParamProvider } from "use-query-params"

export default function Home() {
  return (
    // <QueryParamProvider adapter={NextAdapterApp}>
    <QueryParamProvider adapter={NextQueryParamAdapter}>
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
