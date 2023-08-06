import { useTranslations } from "next-intl"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { Icons } from "./icons"
import { buttonVariants } from "./ui/button"
import LikeAndEdit from './like-edit-panel'

const LoadingState = () => (
  <div className="flex h-80 w-full flex-col items-center justify-center rounded-r-lg p-4 md:h-96">
    <div className="h-5 w-5 animate-spin rounded-full border-y-2 border-gray-500" />
  </div>
)

const EmptyState = () => <div className="h-80 w-full rounded-r-lg p-4 md:h-96" />

const ErrorState = ({ error }) => (
  <div className="flex h-80 w-full items-center justify-center rounded-r-lg p-4 md:h-96">
    <div className='text-center text-xl'>{error.message}</div>
  </div>
)

const TranslationPanel = ({ translationResponse, loading }) => {
  const { locale } = useRouter()
  const t = useTranslations("Translator")

  const emptyState = {
    text: '',
    translations: [],
    duration: 0,
    isCopyClicked: false,
  }

  const [state, setState] = useState(emptyState)

  useEffect(() => {
    if (translationResponse && !(translationResponse instanceof Error)) {
      setState({ ...translationResponse, isCopyClicked: false })
    } else {
      setState(emptyState)
    }
  }, [translationResponse])

  const handleCopy = async () => {
    await navigator.clipboard.writeText(state.translations[0])
    setState(prevState => ({ ...prevState, isCopyClicked: true }))
    setTimeout(() => setState(prevState => ({ ...prevState, isCopyClicked: false })), 1500)
  }

  if (loading) return <LoadingState />
  if (translationResponse instanceof Error) return <ErrorState error={translationResponse} />
  if (state.translations.length === 0) return <EmptyState />

  return (
    <div className="min-h-80 md:min-h-96 h-fit w-full rounded-r-lg p-4">
      <div className="flex h-full flex-col items-center justify-center pt-4">
        <div className="h-full w-full overflow-y-auto p-4">
          <div className="text-xl">{state.translations[0]}</div>
          <div className="my-4 h-px w-full bg-gray-500" />
          <div className="flex w-full flex-row items-center justify-between">
            <LikeAndEdit text={state.text} translation={state.translations[0]} />
            <div
              className={buttonVariants({
                size: "lg",
                variant: "ghost",
                className: "items-center justify-end self-starttext-slate-700 dark:text-slate-400 cursor-pointer"
              })}
              onClick={handleCopy}
            >
              {state.isCopyClicked ? <Icons.check className="h-4 w-4" /> : <Icons.copy className="h-4 w-4" />}
            </div>
          </div>
          <div className="pb-2 pt-4 text-xl text-gray-500">{t("alternatives", { locale })}:</div>
          <div className="flex flex-col gap-2">
            {state.translations.slice(1).map((translation, index) => (
              <div key={index}>{translation}</div>
            ))}
          </div>
        </div>
        <div className="flex w-full flex-row items-center justify-between p-4">
          <div className="text-xs text-gray-500">
            {Math.round(state.duration * 100) / 100}s
          </div>
        </div>
      </div>
    </div>
  )
}

export default TranslationPanel
