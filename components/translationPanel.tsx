import translate from "@/api/api"
import { Separator } from "@/components/ui/separator"
import { useEffect, useState } from "react"
import { Button } from "./ui/button"

const TranslationPanel = (
    props: {
        loading: boolean
        translations: string[]
        duration: number
    }
) => {

    console.log(props)

    function onCopyClick() {
        navigator.clipboard.writeText(props.translations[0])
    }


    if (props.loading) {
        return (
            <div className="w-1/2 h-96 p-2 rounded-r-lg">
                <div className="flex flex-col items-center justify-center h-full">
                    <div className="w-5 h-5 border-t-2 border-b-2 border-gray-500 rounded-full animate-spin" />
                </div>
            </div>
        )
    }

    return (
        <div className="sm:w-1/2 sm:h-96 p-4 rounded-r-lg p-0
                        w-full h-1/2">
            <div className={`flex flex-col pt-4 items-center justify-center h-full ${props.translations.length == 0 ? "hidden" : ""}`}>
                <div className="w-full h-full p-4 overflow-y-auto">
                    <div className="text-xl">
                        {props.translations[0]}
                    </div>
                    <div className="w-full h-px my-4 bg-gray-500" />
                    <div className="text-xl text-gray-500 pb-2">
                        Alternatives:
                    </div>
                    <div className="flex flex-col gap-2">
                        {props.translations.slice(1).map((translation, index) => {
                            return (
                                <div key={index}>
                                    {translation}
                                </div>
                            )
                        }
                        )}
                    </div>
                </div>
                <div className="flex flex-row items-center justify-between w-full p-4">
                    <div className="text-xs text-gray-500">
                        {Math.round(props.duration * 100) / 100}s
                    </div>
                    <Button
                        className="w-24"
                        onClick={onCopyClick}>
                        Copy
                    </Button>
                </div>
            </div>
        </div>
    )
}

const TranslatorPanel = () => {

    const [text, setText] = useState("")
    const [translations, setTranslations] = useState([])
    const [duration, setDuration] = useState(0)
    const [loading, setLoading] = useState(false)

    // useEffect(() => {
    //     const textarea = document.querySelector("textarea")
    //     textarea?.focus()
    // }, [])

    return (
        <div>
            <div className="flex max-w-[980px] sm:flex-row items-start gap-0 border border-gray-800 rounded-lg shadow-lg
            flex-col">
                <div className="sm:w-1/2 sm:h-96 p-2 pt-4 rounded-l-lg sm:border-r border-gray-800 w-full sm:border-b h-1/2 border-b">
                    <textarea
                        className="w-full h-full p-4 text-xl resize-none bg-transparent focus:ring-0 focus:outline-none"
                        placeholder="Type to translate..."
                        value={text}
                        onInput={onTextInput}
                        onKeyDown={onKeyDown}
                    />
                </div>
                <TranslationPanel
                    loading={loading}
                    translations={translations}
                    duration={duration}
                />
            </div>
            <Button
                className="mt-3"
                onClick={onTranslateClick}>
                Translate
            </Button>
        </div>
    )

    function onTranslateClick() {
        api_translate(text)
    }

    function onTextInput(event: React.FormEvent<HTMLTextAreaElement>) {
        setText(event.currentTarget.value)
    }

    function onKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
        if (event.ctrlKey && event.key === "Enter") {
            api_translate(text)
        }
    }

    function api_translate(text: string) {
        if (text === "" || loading) return

        setLoading(true)
        // translate(text) is async function
        translate(text).then((translation) => {
            setTranslations(translation.data)
            setDuration(translation.duration)
            setLoading(false)
        }
        )
    }
}

export default TranslatorPanel