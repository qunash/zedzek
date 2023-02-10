import * as React from "react"
import Link from "next/link"

import { NavItem } from "@/types/nav"
import { siteConfig } from "@/config/site"
import { Icons } from "@/components/icons"

interface MainNavProps {}

export function MainNav() {
  return (
    <div className="flex gap-6 md:gap-10">
      <Link href="/" className="items-center space-x-2 flex">
        <Icons.logo className="h-6 w-6 fill-current" />
        <span className="font-bold inline-block">
          {siteConfig.name}
        </span>
      </Link>
    </div>
  )
}
