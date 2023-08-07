import { useTranslations } from "next-intl"
import Head from "next/head"
import { useRouter } from "next/router"

import Faq from "@/components/faq"
import TranslatorPanel from "@/components/translatorPanel"
import { siteConfig } from "@/config/site"

export default function IndexPage() {
  const t = useTranslations("Index")
  const { locale } = useRouter()

  return (
    <>
      <Head>
        <title>{siteConfig.name}</title>
        <meta name="description" content={t("description", { locale })} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:image" content="https://zedzek.com/api/og" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <section className="container grid items-center justify-items-center gap-6 pb-8 pt-6 md:py-10">
        <h1 className="text-xl font-bold lg:text-2xl">
          {t("header", { locale })}
        </h1>
        <TranslatorPanel />
        <Faq />
      </section>
    </>
  )
}

export async function getStaticProps(context: { locale: any }) {
  return {
    props: {
      messages: {
        ...(await import(`../messages/index/${context.locale}.json`)).default,
        ...(await import(`../messages/translator/${context.locale}.json`)).default,
        ...(await import(`../messages/faq/${context.locale}.json`)).default,
      },
    },
  }
}
