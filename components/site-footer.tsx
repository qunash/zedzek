import * as React from "react"

import { Icons } from "@/components/icons"
import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { ThemeToggle } from "./theme-toggle"
import { buttonVariants } from "./ui/button"
import { Separator } from "@radix-ui/react-separator"

export function SiteFooter({ className }: React.HTMLAttributes<HTMLElement>) {
    return (
        <footer className={cn(className, "w-full")}>
            <div className="h-px bg-slate-300 dark:bg-slate-800" />
            <div className="container flex w-fit items-center justify-between gap-4 py-8">
                <Link
                    href={siteConfig.links.github}
                    target="_blank"
                    rel="noreferrer"
                >
                    <div
                        className={buttonVariants({
                            size: "sm",
                            variant: "ghost",
                            className: "text-slate-700 dark:text-slate-400",
                        })}
                    >
                        <Icons.gitHub className="h-5 w-5" />
                        <span className="sr-only">GitHub</span>
                    </div>
                </Link>
                <Link
                    href={siteConfig.links.discord}
                    target="_blank"
                    rel="noreferrer"
                >
                    <div
                        className={buttonVariants({
                            size: "sm",
                            variant: "ghost",
                            className: "text-slate-700 dark:text-slate-400",
                        })}
                    >
                        <Icons.discord className="h-5 w-5 stroke-current" />
                        <span className="sr-only">Discord</span>
                    </div>
                </Link>
                <ThemeToggle />
            </div>
        </footer>
    )
}