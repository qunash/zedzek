interface SiteConfig {
    name: string
    description: string
    mainNav: { title: string, href?: string }[]
    links: {
        discord: string
        github: string
    }
}

export const siteConfig: SiteConfig = {
    name: "Zədzək",
    description: "Zədzək is a demo translator into Circassian language.",
    mainNav: [
        {
            title: "Home",
            href: "/",
        },
    ],
    links: {
        discord: "https://discord.gg/ppmwTNUZQb",
        github: "https://github.com/qunash/zedzek",
    },
}