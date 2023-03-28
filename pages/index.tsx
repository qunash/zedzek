import Head from "next/head"

import { siteConfig } from "@/config/site"
import { Layout } from "@/components/layout"
import TranslatorPanel from "@/components/translatorPanel"

export default function IndexPage() {
  return (
    <Layout>
      <Head>
        <title>{siteConfig.name}</title>
        <meta name="description" content={siteConfig.description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:image" content="https://zedzek.com/api/og" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <section className="container grid items-center gap-6 pt-6 pb-8 md:py-10">
        <h1 className="text-xl font-bold lg:text-2xl">
          Circassian translator demo
        </h1>
        <TranslatorPanel />
      </section>
    </Layout>
  )
}
