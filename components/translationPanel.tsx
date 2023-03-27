import { useEffect, useState, useRef } from "react"
import translate, { TranslationResponse } from "@/api/api"
import { StringParam, useQueryParam, withDefault } from "use-query-params"

import { Icons } from "./icons"
import { buttonVariants } from "./ui/button"

const TranslationPanel = (props: {
  loading: boolean
  translations: string[]
  duration: number
}) => {
  const [copyClicked, setCopyClicked] = useState(false)

  // console.log(props) // this component is being re-rendered many times, find out why

  function onCopyClick(event: React.MouseEvent<HTMLDivElement>) {
    event.currentTarget.blur()
    setCopyClicked(true)
    navigator.clipboard.writeText(props.translations[0])
    setTimeout(() => {
      setCopyClicked(false)
    }, 1500)
  }

  if (props.loading) {
    return (
      <div className="h-80 w-full rounded-r-lg p-4 md:h-96">
        <div className="flex h-full flex-col items-center justify-center">
          <div className="h-5 w-5 animate-spin rounded-full border-y-2 border-gray-500" />
        </div>
      </div>
    )
  }

  return (
    <div className="h-fit w-full rounded-r-lg p-4">
      <div
        className={`flex h-full flex-col items-center justify-center pt-4 ${props.translations.length == 0 ? "hidden" : ""
          }`}
      >
        <div className="h-full w-full overflow-y-auto p-4">
          <div className="text-xl">{props.translations[0]}</div>
          <div className="my-4 h-px w-full bg-gray-500" />
          <div className="pb-2 text-xl text-gray-500">Alternatives:</div>
          <div className="flex flex-col gap-2">
            {
              props.translations.slice(1).map((translation, index) => {
                return <div key={index}>{translation}</div>
              })
            }
          </div>
        </div>
        <div className="flex w-full flex-row items-center justify-between p-4">
          <div className="text-xs text-gray-500">
            {Math.round(props.duration * 100) / 100}s
          </div>
          <div
            className={buttonVariants({
              size: "sm",
              variant: "ghost",
              className:
                "items-center justify-end self-start p-4 text-slate-700 dark:text-slate-400 cursor-pointer",
            })}
            onClick={onCopyClick}
          >
            {copyClicked ? (
              <Icons.check className="h-4 w-4" />
            ) : (
              <Icons.copy className="h-4 w-4" />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TranslationPanel