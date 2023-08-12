"use client"

import { postRequest } from '@/lib/get-post-requests'
import '@/styles/globals.css'
import { TranslationResponse } from '@/types/translation-response'
import { useEffect, useRef, useState } from "react"
import { StringParam, useQueryParam, withDefault } from 'use-query-params'

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


    if (translationResponse instanceof Error)
        return <p>{translationResponse.message}</p>

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <form>
                <textarea className='w-full h-32 p-2 border-2 rounded-xl focus:outline-none'
                    ref={textareaRef}
                    onInput={onTextInput}
                    value={text}
                />
            </form>
            {loading ? <p>Loading...</p> : translationResponse && <p>{translationResponse.translations.toString()}</p>}
        </div>
    )

    async function api_translate(inputText?: string) {
        setLoading(true)
        const response = await postRequest("/api/translate", { text: inputText })
        const data = await response.json()
        setTranslationResponse(response.ok ? data : new Error(data.error))
        setLoading(false)
    }
}