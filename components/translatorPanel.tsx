import translate, { TranslationResponse } from "@/api/api"
import { useState, useEffect } from "react"
import { useQueryParam, withDefault, StringParam } from "use-query-params"
import { Icons } from "./icons"
import TranslationPanel from "./translationPanel"
import { buttonVariants } from "./ui/button"

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
    }
  
    function onClearClick(event: React.MouseEvent<HTMLDivElement>) {
      setTextParam(null)
      setTranslations([])
      focusOnTextArea()
    }
  
    function api_translate(input: string) {
      if (input.length == 0) {
        setTranslations([])
        return
      }
    
      setLoading(true)
      translate(input)
        .then((response: TranslationResponse) => {
          console.log("text: ", input)
          console.log(response)
          if (input.toLowerCase() === response.input.toLowerCase()) {
            setTextParam(input, 'replaceIn')
            setTranslations(response.translations)
            setDuration(response.duration)
            setLoading(false)
          }
        })
        .catch((error) => {
        })
    }
  
    function focusOnTextArea() {
      const textarea = document.querySelector("textarea")
      textarea?.focus()
    }
  }
  
  export default TranslatorPanel
  