import { useState } from "react"
import { Icons } from "./icons"
import { Button, buttonVariants } from "./ui/button"
import { TranslationResponse } from "@/types/translation-response"
import UpvoteDownvoteEditButtons from "./upvote-downvote-edit-buttons"

const TranslationPanel = ({ translationResponse, loading, onRetry }: {
  translationResponse?: TranslationResponse | Error | null,
  loading: boolean,
  onRetry: () => void
}) => {

  const [isCopyClicked, setIsCopyClicked] = useState(false)

  const handleCopy = async () => {
    if (translationResponse && !(translationResponse instanceof Error)) {
      await navigator.clipboard.writeText(translationResponse.translations[0])
      setIsCopyClicked(true)
      setTimeout(() => setIsCopyClicked(false), 1500)
    }
  }

  if (loading) {
    return (
      <div className="flex h-80 w-full flex-col items-center justify-center rounded-r-lg p-4 md:h-96">
        <div className="h-5 w-5 animate-spin rounded-full border-y-2 border-gray-500" />
      </div>
    )
  }

  if (translationResponse instanceof Error) {
    return (
      <div className="flex h-80 w-full flex-col items-center justify-center rounded-r-lg p-4 md:h-96">
        <div className="text-center text-xl">{translationResponse.message}</div>
        <Button size="lg" className="mt-4" onClick={onRetry}>
          Retry
        </Button>
      </div>
    )
  }

  if (!translationResponse || translationResponse.translations.length === 0) {
    return <div className="h-80 w-full rounded-r-lg p-4 md:h-96" />
  }

  return (
    <div className="min-h-80 md:min-h-96 h-fit w-full rounded-r-lg p-4">
      <div className="flex h-full flex-col items-center justify-center pt-4">
        <div className="h-full w-full overflow-y-auto">
          <div className="text-xl">{translationResponse.translations[0]}</div>
          <div className="my-4 h-px w-full bg-gray-500" />
          <div className="flex w-full items-center justify-between">
            <UpvoteDownvoteEditButtons
              translation={translationResponse}
            />
            <div
              className={buttonVariants({
                size: "lg",
                variant: "ghost",
                className: "items-center justify-end self-start text-slate-700 dark:text-slate-400 cursor-pointer",
              })}
              onClick={handleCopy}
            >
              {isCopyClicked ? <Icons.check className="h-4 w-4" /> : <Icons.copy className="h-4 w-4" />}
            </div>
          </div>
          <div className="pb-2 pt-4 text-xl text-gray-500">Alternatives:</div>
          <div className="flex flex-col gap-2">
            {translationResponse.translations.slice(1).map((translation, index) => (
              <div key={index}>{translation}</div>
            ))}
          </div>
        </div>
        <div className="flex w-full items-center justify-between p-4">
          <div className="text-xs text-gray-500">
            {Math.round(translationResponse.duration * 100) / 100}s
          </div>
        </div>
      </div>
    </div>
  )
}

export default TranslationPanel
