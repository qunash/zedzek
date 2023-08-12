'use client'

import Translator from "@/components/translator"
import NextQueryParamAdapter from "@/lib/next-query-params-adapter"
import { QueryParamProvider } from "use-query-params"

export default function Home() {
  return (
    // <QueryParamProvider adapter={NextAdapterApp}>
    <QueryParamProvider adapter={NextQueryParamAdapter}>
      <Translator />
    </QueryParamProvider>
  )
}
