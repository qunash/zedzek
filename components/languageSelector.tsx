import { getI18nCLient } from '@/app/locales/client'
import React from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown } from 'lucide-react'

export type TargetLanguage = 'kbd' | 'ady' | 'ru'

interface LanguageSelectorProps {
  targetLanguage: TargetLanguage
  onLanguageChange: (language: TargetLanguage) => void
}

export default function LanguageSelector({ 
  targetLanguage, 
  onLanguageChange 
}: LanguageSelectorProps) {
  const t = getI18nCLient()
  
  // Get label for current language
  const getCurrentLanguageLabel = () => {
    switch(targetLanguage) {
      case 'kbd': return t("translator.circassian_east")
      case 'ady': return t("translator.circassian_west")
      case 'ru': return t("translator.russian")
      default: return ''
    }
  }

  return (
    <div className="w-full rounded-t-lg border-b bg-white dark:border-zinc-700 dark:bg-zinc-800">
      <div className="flex items-center">
        <div className="flex w-[40%] items-center justify-center md:w-1/2">
          <span className="text-base text-gray-700 dark:text-gray-300 md:font-medium">
            {t("translator.translate_to")}
          </span>
        </div>
        
        {/* Divider */}
        {/* <div className="h-8 w-px bg-gray-300 dark:bg-zinc-600"></div> */}
        
        <div className="flex w-[60%] justify-center md:w-1/2">
          <DropdownMenu>
            <DropdownMenuTrigger className="flex h-full w-full items-center justify-center px-4 py-2 text-base text-gray-700 transition-colors hover:bg-gray-100 focus:outline-none dark:text-gray-200 dark:hover:bg-zinc-700 md:p-3 md:font-medium">
              {getCurrentLanguageLabel()}
              <ChevronDown className="ml-1 h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-full">
              <DropdownMenuItem 
                className="cursor-pointer rounded-sm p-4 focus:bg-gray-100 dark:focus:bg-zinc-700"
                onClick={() => onLanguageChange('kbd')}
              >
                {t("translator.circassian_east")}
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="cursor-pointer rounded-sm p-4 focus:bg-gray-100 dark:focus:bg-zinc-700"
                onClick={() => onLanguageChange('ady')}
              >
                {t("translator.circassian_west")}
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="cursor-pointer rounded-sm p-4 focus:bg-gray-100 dark:focus:bg-zinc-700"
                onClick={() => onLanguageChange('ru')}
              >
                {t("translator.russian")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}
