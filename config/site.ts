import { NavItem } from "@/types/nav"

interface SiteConfig {
  name: string
  description: string
  mainNav: NavItem[]
  links: {
    twitter: string
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
    twitter: "",
    github: ""
  },
}
