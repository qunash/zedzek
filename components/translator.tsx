"use client"

import { postRequest } from '@/lib/get-post-requests'
import '@/styles/globals.css'
import { TranslationResponse } from '@/types/translation-response'
import { useEffect, useRef, useState } from "react"
import { StringParam, useQueryParam, withDefault } from 'use-query-params'
import { Icons } from './icons'
import { buttonVariants } from './ui/button'
import Examples from './examples'
import TranslationPanel from './translationPanel'

export default function Translator() {
    const [textParam, setTextParam] = useQueryParam('text', withDefault(StringParam, ''))
    const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout>()
    const [text, setText] = useState(textParam)
    const [translationResponse, setTranslationResponse] = useState<TranslationResponse | Error | null>(null)
    const [loading, setLoading] = useState(false)
    const textareaRef = useRef<HTMLTextAreaElement | null>(null)

    useEffect(() => {
        focusOnTextArea()
    }, [])

    useEffect(() => {
        if (text.trim().length > 0) {
            setTimeoutId(setTimeout(() => { api_translate(text) }, 500))
        } else {
            setTextParam(undefined, 'replaceIn')
            setLoading(false)
            setTranslationResponse(null)
        }

    }, [text, setTextParam])

    const focusOnTextArea = () => {
        const textarea = textareaRef.current
        textarea?.focus()
        textarea?.setSelectionRange(textarea.value.length, textarea.value.length)
    }

    const onTextInput = (event: React.FormEvent<HTMLTextAreaElement>) => {
        const currentText = event.currentTarget.value
        setText(currentText)
        setTextParam(currentText, "replaceIn")
        clearTimeout(timeoutId)
    }

    const onClearClick = () => {
        setText("")
        focusOnTextArea()
    }

    const onExampleClick = (example: string) => {
        window.scrollTo(0, 0)
        setText(example)
        setTextParam(example, "replaceIn")
    }


    if (translationResponse instanceof Error)
        return <p>{translationResponse.message}</p>

    return (
        <div>
            <div className="flex max-w-4xl flex-col items-start rounded-lg border border-gray-800 shadow-lg md:flex-row">
                <div className="flex w-full rounded-l-lg border-gray-800 p-4 md:h-96">
                    <textarea
                        ref={textareaRef}
                        className="h-full min-h-[150px] w-full resize-none bg-transparent p-2 text-xl focus:outline-none focus:ring-0"
                        // placeholder={t("type_to_translate", { locale })}
                        placeholder='Type to translate...'
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
                    translationResponse={translationResponse}
                    loading={loading}
                />
            </div>
            <Examples onExampleClick={onExampleClick} />
        </div >
    )

    async function api_translate(inputText?: string) {
        setLoading(true)
        const response = await postRequest("/api/translate", { text: inputText })
        const data = await response.json()
        setTranslationResponse(response.ok ? data : new Error(data.error))
        setLoading(false)
    }
}