import { Icons } from "@/components/icons"
import Translator from "@/components/translator"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Home() {
  return (
    <section className="container grid justify-items-center gap-4">
      <h1 className="text-xl font-bold lg:text-2xl">
        {/* {t("header", { locale })} */}
        Circassian translator demo
      </h1>
      <Translator />
      <Link href="/contribute">
        <Button
          className="gap-4 rounded-2xl border-2 border-gray-400 p-10 px-8 text-2xl hover:border-gray-500"
        >
          <Icons.logo className="h-12 w-12 fill-current" />
          Contribute
        </Button>
      </Link>
      {/* <Faq /> */}
    </section>
  )
}
