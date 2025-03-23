import Link from "next/link"

import { getI18nServer } from "@/app/locales/server"
import { Icons } from "@/components/icons"
import { siteConfig } from "@/config/site"

export async function MainNav() {
  const t = await getI18nServer()

  return (
    <div className="flex gap-6 md:gap-10">
      <a href="/" className="flex items-center space-x-2">
        <Icons.logo className="h-6 w-6 fill-current" />
        <span className="inline-block font-bold">{siteConfig.name}</span>
      </a>

      <Link href="/contribute" className="flex items-center self-center font-medium text-foreground/80 transition-colors hover:text-foreground sm:text-sm">
        <span className="inline-block">
          {t("index.contribute")}
        </span>
      </Link>
    </div>
  )
}