"use client"

import { postRequest } from '@/lib/get-post-requests'
import '@/styles/globals.css'
import { TranslationResponse } from '@/types/translation-response'
import { useDebounce } from "@uidotdev/usehooks"
import { useCallback, useEffect, useRef, useState } from "react"
import { StringParam, useQueryParam, withDefault } from 'use-query-params'
import Examples from './examples'
import TranslationPanel from './translationPanel'
import TextAreaWithClearButton from './ui/textarea-with-clear-button'


export default function Translator() {
    const textareaRef = useRef<HTMLTextAreaElement | null>(null)
    const [translationResponse, setTranslationResponse] = useState<TranslationResponse | Error | null>(null)
    const [loading, setLoading] = useState(false)
    const [textParam, setTextParam] = useQueryParam('text', withDefault(StringParam, ''))
    const [text, setText] = useState(textParam)
    const debouncedText = useDebounce(text, 500)

    useEffect(() => {
        const textarea = textareaRef.current
        textarea?.focus()
        textarea?.setSelectionRange(text.length, text.length)
    })

    useEffect(() => {
        setTextParam(text || undefined, "replaceIn")
    }, [text])

    useEffect(() => {
        fetchTranslation()
    }, [debouncedText])

    const handleInputChange = useCallback((event: React.FormEvent<HTMLTextAreaElement>) => {
        setText(event.currentTarget.value)
    }, [])

    const fetchTranslation = async () => {
        setLoading(true)
        if (debouncedText.trim().length > 0) {
            const response = await postRequest("/api/translate", { text: debouncedText })
            const data = await response.json()
            
            setTranslationResponse(response.ok ? data : new Error(data.error))
        } else {
            setTranslationResponse(null)
        }
        setLoading(false)
    }
    

    return (
        <div>
            <div className="flex max-w-4xl flex-col items-start rounded-lg border border-gray-800 shadow-lg md:flex-row">
                <TextAreaWithClearButton
                    ref={textareaRef}
                    value={text}
                    onChange={handleInputChange}
                    onClear={() => { setText('') }}
                />
                <div className="h-px w-full bg-gray-800 md:h-full md:w-px" />
                <TranslationPanel
                    translationResponse={translationResponse}
                    loading={loading}
                    onRetry={() => {
                        fetchTranslation()
                    }}
                />
            </div>
            <Examples onExampleClick={setText} />
        </div>
    )
}
