import { MainNav } from "@/components/main-nav"
import { UserNav } from "./user-nav"
import I18nProviderClientWrapper from "@/app/locales/i18n-client-component-wrapper"

export function SiteHeader({ params }: { params: { locale: string } }) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-b-slate-200 bg-white dark:border-b-slate-700 dark:bg-background">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <MainNav />
        <div className="flex flex-1 items-center justify-end space-x-4">
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