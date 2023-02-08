import Head from "next/head"

import { Layout } from "@/components/layout"
import TranslatorPanel from "@/components/translationPanel"

export default function IndexPage() {
  return (
    <Layout>
      <Head>
        <title>Zedzek</title>
        <meta
          name="description"
          content="Zedzek is a demo translator into Circassian language."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <section className="container grid items-center gap-6 pt-6 pb-8 md:py-10">
        <TranslatorPanel />
      </section>
    </Layout>
  )
}
