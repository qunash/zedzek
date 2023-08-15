"use client"

import Link from "next/link"

import { Icons } from "@/components/icons"
import { siteConfig } from "@/config/site"

interface MainNavProps { }

export function MainNav() {
  return (
    <div className="flex gap-6 md:gap-10">
      <Link href="/" className="flex items-center space-x-2">
        <Icons.logo className="h-6 w-6 fill-current" />
        <span className="inline-block font-bold">{siteConfig.name}</span>
      </Link>

      <Link href="/contribute" className="flex items-center self-center font-medium text-foreground/80 transition-colors hover:text-foreground sm:text-sm">
        <span className="inline-block">Contribute</span>
      </Link>
    </div>
  )
}