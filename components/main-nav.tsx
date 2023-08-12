"use client"

import Link from "next/link"

import { Icons } from "@/components/icons"
import { siteConfig } from "@/config/site"

interface MainNavProps {}

export function MainNav() {
  return (
    <div className="flex gap-6 md:gap-10">
      <Link href="/" className="flex items-center space-x-2">
        <Icons.logo className="h-6 w-6 fill-current" />
        <span className="inline-block font-bold">{siteConfig.name}</span>
      </Link>
    </div>
  )
}