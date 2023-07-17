import { useState } from "react"

import { Icons } from "./icons"
import { buttonVariants } from "./ui/button"
import { useTranslations } from "next-intl"
import { useRouter } from "next/router"

const IconButton = ({ icon, onClick, clickedIcon = null, isClicked = false }) => (
  <div
    className={buttonVariants({
      size: "lg",
      variant: "ghost",
      className: "items-center justify-end self-starttext-slate-700 dark:text-slate-400 cursor-pointer",
    })}
    onClick={onClick}
  >
    {isClicked && clickedIcon ? clickedIcon : icon}
  </div>
)

const LoadingState = () => (
  <div className="h-80 w-full rounded-r-lg p-4 md:h-96">
    <div className="flex h-full flex-col items-center justify-center">
      <div className="h-5 w-5 animate-spin rounded-full border-y-2 border-gray-500" />
    </div>
  </div>
)

const EmptyState = () => (<div className="h-80 w-full rounded-r-lg p-4 md:h-96" />)

const TranslationItem = ({ translation }) => <div>{translation}</div>

const TranslationPanel = (props: {
  loading: boolean
  translations: string[]
  duration: number
}) => {
  const t = useTranslations("Translator")
  const { locale } = useRouter()

  const [copyClicked, setCopyClicked] = useState(false)

  function onCopyClick(event: React.MouseEvent<HTMLDivElement>) {
    event.currentTarget.blur()
    setCopyClicked(true)
    navigator.clipboard.writeText(props.translations[0])
    setTimeout(() => {
      setCopyClicked(false)
    }, 1500)
  }

  if (props.loading) {
    return <LoadingState />
  }

  if (props.translations.length == 0) {
    return <EmptyState />
  }

  return (
    <div className="min-h-80 md:min-h-96 h-fit w-full rounded-r-lg p-4">
      <div className="flex h-full flex-col items-center justify-center pt-4">
        <div className="h-full w-full overflow-y-auto p-4">
          <div className="text-xl">{props.translations[0]}</div>
          <div className="my-4 h-px w-full bg-gray-500" />
          <div className="flex w-full flex-row items-center justify-between">
            <IconButton
              icon={<Icons.thumbsUp className="h-4 w-4" />}
              onClick={() => { }}
            />
            <IconButton
              icon={<Icons.thumbsDown className="h-4 w-4" />}
              onClick={() => { }}
            />
            <IconButton
              icon={<Icons.edit className="h-4 w-4" />}
              onClick={() => { }}
            />
            <IconButton
              icon={<Icons.copy className="h-4 w-4" />}
              clickedIcon={<Icons.check className="h-4 w-4" />}
              isClicked={copyClicked}
              onClick={onCopyClick}
            />
          </div>
          <div className="pb-2 pt-4 text-xl text-gray-500">{t("alternatives", { locale })}:</div>
          <div className="flex flex-col gap-2">
            {props.translations.slice(1).map((translation, index) => (
              <TranslationItem key={index} translation={translation} />
            ))}
          </div>
        </div>
        <div className="flex w-full flex-row items-center justify-between p-4">
          <div className="text-xs text-gray-500">
            {Math.round(props.duration * 100) / 100}s
          </div>
        </div>
      </div>
    </div>
  )
}

export default TranslationPanel
