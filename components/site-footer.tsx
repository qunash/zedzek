import * as React from "react"
import Link from "next/link"
import Image from "next/image"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"

import { ThemeToggle } from "./theme-toggle"
import { buttonVariants } from "./ui/button"

export function SiteFooter({ className }: React.HTMLAttributes<HTMLElement>) {
    return (
        <footer className={cn(className, "w-full")}>
            <div className="h-px bg-slate-300 dark:bg-slate-800" />
            <div className="container flex w-fit items-center justify-between gap-4 pt-8 pb-4">
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
                <Link
                    href="https://t.me/adiga_ai"
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
                        <Icons.telegram className="h-5 w-5" />
                        <span className="sr-only">Telegram</span>
                    </div>
                </Link>
                <Link
                    href="https://www.instagram.com/adiga.ai"
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
                        <Icons.instagram className="h-5 w-5" />
                        <span className="sr-only">Instagram</span>
                    </div>
                </Link>
                <ThemeToggle />
            </div>
            <div className="container flex w-fit items-center pb-8">
                <Link
                    href="https://adiga.ai"
                    target="_blank"
                    rel="noreferrer"
                >
                    <div className="relative w-[120px] h-[50px]">
                        <Image
                            src="/adiga_banner.svg"
                            alt="Adiga.ai Banner"
                            fill
                            className="object-contain invert dark:invert-0"
                        />
                    </div>
                </Link>
            </div>
        </footer>
    )
}