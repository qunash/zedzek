import { MainNav } from "@/components/main-nav"
import { UserNav } from "./user-nav"
import I18nProviderClientWrapper from "@/app/locales/i18n-client-component-wrapper"
import { getI18nServer } from "@/app/locales/server"

export async function SiteHeader({ params }: { params: { locale: string } }) {
  const t = await getI18nServer()
  
  return (
    <header className="sticky top-0 z-40 w-full border-b border-b-slate-200 bg-white dark:border-b-slate-700 dark:bg-background">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <MainNav />
        {/* Desktop title - hidden on mobile */}
        <div className="hidden md:flex md:flex-1 md:items-center md:justify-center">
          <h1 className="text-xl font-medium lg:text-2xl">
            {t("index.header")}
          </h1>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4 md:flex-initial">
          <nav className="flex items-center space-x-1">
            <I18nProviderClientWrapper params={params} >
              <UserNav />
            </I18nProviderClientWrapper>
          </nav>
        </div>
      </div>
    </header>
  )
}