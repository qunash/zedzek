import { useEffect, useState } from "react"
import { Icons } from "./icons"
import { Button, buttonVariants } from "./ui/button"
import { TranslationResponse } from "@/types/translation-response"
import UpvoteDownvoteEditButtons from "./upvote-downvote-edit-buttons"
import { getI18nCLient } from "@/app/locales/client"
import PlayTTS from "./play-tts"
import { LoadingSpinner } from "./loading-spinner"

const TranslationPanel = ({ translationResponse, loading, onRetry, fontSize = 'text-3xl' }: {
  translationResponse?: TranslationResponse | Error | null,
  loading: boolean,
  onRetry: () => void,
  fontSize?: 'text-3xl' | 'text-2xl' | 'text-xl'
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
      <LoadingSpinner className="flex h-auto min-h-[150px] w-full flex-col items-center justify-center rounded-r-lg p-3 transition-all duration-300 md:h-[28rem]" />
    )
  }

  if (translationResponse instanceof Error) {
    return (
      <div className="flex h-auto min-h-[150px] w-full flex-col items-center justify-center rounded-r-lg p-3 transition-all duration-300 md:h-[28rem]">
        <div className="text-center text-xl">{translationResponse.message}</div>
        <Button size="lg" className="mt-4" onClick={onRetry}>
          {t("buttons.retry")}
        </Button>
      </div>
    )
  }

  if (!translationResponse || translationResponse.translations.length === 0) {
    return <div className="h-auto min-h-[150px] w-full rounded-r-lg p-3 transition-all duration-300 md:h-[28rem]" />
  }

  return (
    <div className="h-auto min-h-[150px] w-full rounded-r-lg p-3 transition-all duration-300 md:h-[28rem] md:overflow-y-auto">
      <div className="flex h-full flex-col">
        <div className="h-full w-full md:overflow-y-auto">
          <div className="flex items-start justify-between gap-2">
            <div className={`p-2 ${fontSize}`}>
              {displayedText}
              {/* {isAnimating && <span className="animate-pulse">▕</span>} */}
            </div>
            <PlayTTS text={translationResponse.translations[0]} />
          </div>
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
          <div className="flex items-center gap-2">
            <UpvoteDownvoteEditButtons
              translation={translationResponse}
            />
            <div
              className={buttonVariants({
                size: "lg",
                variant: "ghost",
                className: "items-center justify-center min-w-10 min-h-10 text-slate-700 dark:text-slate-300 cursor-pointer hover:bg-gray-200 dark:hover:bg-zinc-600 transition-all duration-200",
              })}
              onClick={handleCopy}
            >
              {isCopyClicked ? <Icons.check className="h-5 w-5" /> : <Icons.copy className="h-5 w-5" />}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TranslationPanel
