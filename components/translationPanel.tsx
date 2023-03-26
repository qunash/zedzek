import { useEffect, useState } from "react"
import translate from "@/api/api"
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
            {props.translations.slice(1).map((translation, index) => {
              return <div key={index}>{translation}</div>
            })}
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

const TranslatorPanel = () => {
  const [textParam, setTextParam] = useQueryParam("text", withDefault(StringParam, ""))
  const [text, setText] = useState(textParam)

  const [translations, setTranslations] = useState([])
  const [duration, setDuration] = useState(0)
  const [loading, setLoading] = useState(false)
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout>()

  useEffect(() => {
    focusOnTextArea()
  }, [])

  useEffect(() => {
    setText(textParam)
  }, [textParam])

  useEffect(() => {
    if (text.length > 0) {
      clearTimeout(timeoutId)
      setTimeoutId(
        setTimeout(() => {
          api_translate(text)
        }, 500)
      )
    }
  }, [text])


  return (
    <div className="flex max-w-[980px] flex-col items-start rounded-lg border border-gray-800 shadow-lg md:flex-row">
      <div className="flex w-full rounded-l-lg border-gray-800 p-4 md:h-96">
        <textarea
          className="h-full w-full resize-none bg-transparent p-2 text-xl focus:outline-none focus:ring-0"
          placeholder="Type to translate..."
          value={text}
          onInput={onTextInput}
        />
        <div
          className={buttonVariants({
            size: "sm",
            variant: "ghost",
            className: `items-center justify-end self-start p-4 text-slate-700 dark:text-slate-400 cursor-pointer ${text.length == 0 ? "hidden" : ""
              }`,
          })}
          onClick={onClearClick}
        >
          <Icons.close className="h-5 w-5 fill-current" />
        </div>
      </div>
      <div className="h-px w-full bg-gray-800 md:h-full md:w-px" />
      <TranslationPanel
        loading={loading}
        translations={translations}
        duration={duration}
      />
    </div>
  )

  function onTextInput(event: React.FormEvent<HTMLTextAreaElement>) {
    const currentText = event.currentTarget.value
    setText(currentText)
    setTextParam(currentText, 'replaceIn')
    // clearTimeout(timeoutId)
    // setTimeoutId(
    //   setTimeout(() => {
    //     api_translate(currentText)
    //   }, 500)
    // )
  }

  function onClearClick(event: React.MouseEvent<HTMLDivElement>) {
    setTextParam(null)
    setTranslations([])
    focusOnTextArea()
  }

  function api_translate(text: string) {
    if (text.length == 0) {
      setTranslations([])
      return
    }

    setLoading(true)
    translate(text)
      .then((response) => {
        if (text === response.data[0]) {
          setTextParam(text, 'replaceIn')
          setTranslations(response.data[1])
          setDuration(response.duration)
          setLoading(false)
        }
      })
      .catch((error) => {
        // Handle errors if necessary
      })
  }

  function focusOnTextArea() {
    const textarea = document.querySelector("textarea")
    textarea?.focus()
  }
}

export default TranslatorPanel
