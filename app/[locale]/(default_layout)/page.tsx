import { Icons } from "@/components/icons"
import Translator from "@/components/translator"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import I18nProviderClientWrapper from "@/app/locales/i18n-client-component-wrapper"
import { getI18nServer } from "@/app/locales/server"
import Faq from "@/components/faq"

export default async function Home({ params }: { params: { locale: string } }) {

  const t = await getI18nServer()

  return (
    <section className="container grid justify-items-center gap-4">
      <h1 className="text-xl font-bold lg:text-2xl text-center">
        {t("index.header")}
      </h1>
      <h2
        className="text-base text-center"
        dangerouslySetInnerHTML={{ __html: t("index.info") }}
      />
      <I18nProviderClientWrapper params={params} >
        <Translator />
      </I18nProviderClientWrapper>
      <Link href="/contribute">
        <Button
          className="gap-4 rounded-2xl border-2 border-gray-400 p-10 px-8 text-2xl hover:border-gray-500"
        >
          <Icons.logo className="h-12 w-12 fill-current" />
          {t("index.contribute")}
        </Button>
      </Link>
      <Faq />
    </section >
  )
}
