import { NavItem } from "@/types/nav"

interface SiteConfig {
  name: string
  description: string
  mainNav: NavItem[]
  links: {
    // twitter: string
    discord: string
    github: string
  }
}

export const siteConfig: SiteConfig = {
  name: "Zədzək",
  description:
    "Zədzək is a demo translator into Circassian language.",
  mainNav: [
    {
      title: "Home",
      href: "/",
    },
  ],
  links: {
    // twitter: "",
    discord: "https://discord.gg/ppmwTNUZQb",
    github: "https://github.com/qunash/zedzek"
  },
}
