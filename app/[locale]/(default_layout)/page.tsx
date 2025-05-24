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
    <section className="grid justify-items-center gap-4 px-2 md:container">
      {/* Mobile title - hidden on desktop since it's now in the header */}
      <h1 className="items-center py-2 text-center text-2xl font-medium lg:py-4 lg:text-3xl md:hidden">
        {t("index.header")}
      </h1>
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
