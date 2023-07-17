import Head from "next/head"
import { useTranslations } from 'next-intl'

import { siteConfig } from "@/config/site"
import { Layout } from "@/components/layout"
import TranslatorPanel from "@/components/translatorPanel"
import { useRouter } from "next/router"
import Faq from "@/components/faq"

export default function IndexPage() {

  const t = useTranslations('Index')
  const { locale } = useRouter()

  return (
    <Layout>
      <Head>
        <title>{siteConfig.name}</title>
        <meta name="description" content={t('description', { locale })} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:image" content="https://zedzek.com/api/og" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <section className="container grid items-center gap-6 pt-6 pb-8 md:py-10 justify-items-center">
        <h1 className="text-xl font-bold lg:text-2xl">
          {t('header', { locale })}
        </h1>
        <TranslatorPanel />
        <Faq />
      </section>
    </Layout>
  )
}

export async function getStaticProps(context) {
  return {
    props: {
      messages: {
        ...(await import(`../messages/index/${context.locale}.json`)).default,
        ...(await import(`../messages/translator/${context.locale}.json`)).default,
        ...(await import(`../messages/faq/${context.locale}.json`)).default,
      }
    }
  }
}
