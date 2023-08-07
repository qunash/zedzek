import { SiteHeader } from "@/components/site-header"
import { cn } from "@/lib/utils"
import { ThemeProvider } from "next-themes"

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <div className="relative flex min-h-screen flex-col">
          <SiteHeader />
          <main>{children}</main>
        </div>
      </ThemeProvider>
    </>
  )
}
