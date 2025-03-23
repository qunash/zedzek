import { useEffect, useState } from "react"
import { Icons } from "./icons"
import { Button, buttonVariants } from "./ui/button"
import { TranslationResponse } from "@/types/translation-response"
import UpvoteDownvoteEditButtons from "./upvote-downvote-edit-buttons"
import { getI18nCLient } from "@/app/locales/client"
import PlayTTS from "./play-tts"
import { LoadingSpinner } from "./loading-spinner"

const TranslationPanel = ({ translationResponse, loading, onRetry }: {
  translationResponse?: TranslationResponse | Error | null,
  loading: boolean,
  onRetry: () => void
}) => {
  const t = getI18nCLient()
  const [isCopyClicked, setIsCopyClicked] = useState(false)
  // State for the animated displayed text
  const [displayedText, setDisplayedText] = useState("")
  // Track if animation is in progress
  const [isAnimating, setIsAnimating] = useState(false)
  // Store the full translation from the response
  const [fullTranslation, setFullTranslation] = useState("")

  // Handle copy button
  const handleCopy = async () => {
    if (translationResponse && !(translationResponse instanceof Error)) {
      // Copy the full translation, not just the animated text
      await navigator.clipboard.writeText(translationResponse.translations[0])
      setIsCopyClicked(true)
      setTimeout(() => setIsCopyClicked(false), 1500)
    }
  }

  // Update the full translation when response changes
  useEffect(() => {
    if (translationResponse && !(translationResponse instanceof Error)) {
      setFullTranslation(translationResponse.translations[0])
    } else {
      setFullTranslation("")
      setDisplayedText("")
    }
  }, [translationResponse])

  // Handle smooth typing animation
  useEffect(() => {
    if (!fullTranslation || fullTranslation === displayedText) {
      setIsAnimating(false)
      return
    }

    setIsAnimating(true)

    // If displayed text is longer than the full translation (rare edge case),
    // reset it to match the full translation
    if (displayedText.length > fullTranslation.length) {
      setDisplayedText(fullTranslation)
      setIsAnimating(false)
      return
    }

    // Word-level animation
    // Split both texts into words
    const fullWords = fullTranslation.split(/\s+/)
    const displayedWords = displayedText.trim() ? displayedText.split(/\s+/) : []
    
    // If we've shown all words already
    if (displayedWords.length >= fullWords.length) {
      setDisplayedText(fullTranslation) // Ensure perfect match at the end
      setIsAnimating(false)
      return
    }
    
    // Add 1-2 new words at a time (adjust as needed)
    const newWordsCount = Math.min(2, fullWords.length - displayedWords.length)
    const nextWordIndex = displayedWords.length
    const nextWords = fullWords.slice(0, nextWordIndex + newWordsCount)
    
    // Schedule next word animation
    const timer = setTimeout(() => {
      setDisplayedText(nextWords.join(' '))
    }, 30)

    return () => clearTimeout(timer)
  }, [fullTranslation, displayedText])

  if (loading) {
    return (
      <LoadingSpinner className="flex h-80 w-full flex-col items-center justify-center rounded-r-lg p-4 md:h-96" />
    )
  }

  if (translationResponse instanceof Error) {
    return (
      <div className="flex h-80 w-full flex-col items-center justify-center rounded-r-lg p-4 md:h-96">
        <div className="text-center text-xl">{translationResponse.message}</div>
        <Button size="lg" className="mt-4" onClick={onRetry}>
          {t("buttons.retry")}
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
          <div className="flex items-start justify-between gap-2">
            <div className="text-xl">
              {displayedText}
              {/* {isAnimating && <span className="animate-pulse">▕</span>} */}
            </div>
            <PlayTTS text={translationResponse.translations[0]} />
          </div>
          <div className="my-4 h-px w-full bg-gray-500" />
          <div className="flex w-full items-center justify-between gap-4">
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
          {/* <div className="pb-2 pt-4 text-xl text-gray-500">
            {t("translator.alternatives")}
          </div> */}
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
