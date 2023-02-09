import translate from "@/api/api"
import { useEffect, useState } from "react"
import { Icons } from "./icons"
import { Button } from "./ui/button"


const TranslationPanel = (
    props: {
        loading: boolean
        translations: string[]
        duration: number
    }
) => {

    const [copyClicked, setCopyClicked] = useState(false)

    // console.log(props) // this component is being re-rendered many times, find out why

    function onCopyClick(event: React.MouseEvent<HTMLButtonElement>) {
        event.currentTarget.blur()
        setCopyClicked(true)
        navigator.clipboard.writeText(props.translations[0])
        setTimeout(() => {
            setCopyClicked(false)
        }, 1500)
    }


    if (props.loading) {
        return (
            <div className="w-full h-80 p-4 md:h-96 p-2 rounded-r-lg">
                <div className="flex flex-col items-center justify-center h-full">
                    <div className="w-5 h-5 border-t-2 border-b-2 border-gray-500 rounded-full animate-spin" />
                </div>
            </div>
        )
    }

    return (
        <div className="w-full h-80 md:h-96 p-4 rounded-r-lg p-0">
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
                        onClick={onCopyClick}>

                        {copyClicked ?
                            <Icons.check className="h-4 w-4" />
                            :
                            <Icons.copy className="h-4 w-4" />
                        }
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
    const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout>()


    // useEffect(() => {
    //     const textarea = document.querySelector("textarea")
    //     textarea?.focus()
    // }, [])

    return (
        <div>
            <div className="flex flex-col md:flex-row max-w-[980px] items-start border border-gray-800 rounded-lg shadow-lg">
                <div className="w-full h-1/2 md:h-96 p-2 pt-4 rounded-l-lg border-gray-800">
                    <textarea
                        className="w-full h-full p-4 text-xl resize-none bg-transparent focus:ring-0 focus:outline-none"
                        placeholder="Type to translate..."
                        value={text}
                        onInput={onTextInput}
                        onKeyDown={onKeyDown}
                    />
                </div>
                <div className="w-full h-px bg-gray-800 md:h-full md:w-px" />
                <TranslationPanel
                    loading={loading}
                    translations={translations}
                    duration={duration}
                />
            </div>
        </div>
    )

    function onTextInput(event: React.FormEvent<HTMLTextAreaElement>) {
        const currentText = event.currentTarget.value
        setText(currentText)
        clearTimeout(timeoutId)
        setTimeoutId(setTimeout(() => {
            api_translate(currentText)
        }, 500))
    }

    function onKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
        if (event.ctrlKey && event.key === "Enter") {
            api_translate(text)
        }
    }

    function api_translate(text: string) {
        if (text === "") {
            setTranslations([])
            return
        }

        setLoading(true)
        translate(text).then((translation) => {
            setTranslations(translation.data)
            setDuration(translation.duration)
            setLoading(false)
        })
    }
}

export default TranslatorPanel
