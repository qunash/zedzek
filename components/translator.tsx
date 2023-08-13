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
    const isClearedRef = useRef<boolean>(false)
    const debouncedText = useDebounce(text, 500)

    useEffect(() => {
        const textarea = textareaRef.current
        textarea?.focus()
        textarea?.setSelectionRange(text.length, text.length)
    })

    useEffect(() => {
        setTextParam(text, "replaceIn");
    }, [text]);
    
    useEffect(() => {
        const fetchTranslation = async () => {
            if (debouncedText.trim().length > 0) {
                setLoading(true)
                const response = await postRequest("/api/translate", { text: debouncedText })
                const data = await response.json()

                if (!isClearedRef.current) {
                    setTranslationResponse(response.ok ? data : new Error(data.error))
                    setLoading(false)
                }
            } else {
                setTextParam(undefined, 'replaceIn')
                setLoading(false)
                setTranslationResponse(null)
            }
        }

        fetchTranslation()
    }, [debouncedText])

    const handleInputChange = useCallback((event: React.FormEvent<HTMLTextAreaElement>) => {
        const newText = event.currentTarget.value
        setText(newText)
        setTextParam(newText, "replaceIn")
    }, [])

    return (
        <div>
            <div className="flex max-w-4xl flex-col items-start rounded-lg border border-gray-800 shadow-lg md:flex-row">
                <TextAreaWithClearButton
                    ref={textareaRef}
                    value={text}
                    onChange={handleInputChange}
                    onClear={() => {
                        isClearedRef.current = true
                        setText('')
                    }}
                />
                <div className="h-px w-full bg-gray-800 md:h-full md:w-px" />
                <TranslationPanel
                    translationResponse={translationResponse}
                    loading={loading}
                    onRetry={() => {
                        setText(text + ' ')
                        setText(text)
                    }}
                />
            </div>
            <Examples onExampleClick={setText} />
        </div>
    )
}
