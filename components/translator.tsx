"use client"

import { getI18nCLient } from '@/app/locales/client'
import '@/styles/globals.css'
import { TranslationResponse } from '@/types/translation-response'
import { useDebounce } from "@uidotdev/usehooks"
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from "react"
import Examples from './examples'
import TranslationPanel from './translationPanel'
import TextAreaWithClearButton from './ui/textarea-with-clear-button'

export default function Translator() {
    const t = getI18nCLient()
    const router = useRouter()
    const pathname = usePathname()

    const textareaRef = useRef<HTMLTextAreaElement | null>(null)
    const [translationResponse, setTranslationResponse] = useState<TranslationResponse | Error | null>(null)
    const [loading, setLoading] = useState(false)
    const [text, setText] = useState('')
    const debouncedText = useDebounce(text, 500)

    const searchParams = useSearchParams();

    useEffect(() => {
        setText(searchParams.get("text") || "")
        const textarea = textareaRef.current
        textarea?.focus()
        textarea?.setSelectionRange(text.length, text.length)
    }, [])

    useEffect(() => {
        updateQueryParam("text", text)
    }, [text])

    useEffect(() => {
        fetchTranslation()
    }, [debouncedText])

    const updateQueryParam = (param: string, value: string) => {
        const current = new URLSearchParams(Array.from(searchParams.entries()))
        if (!value) {
            current.delete(param)
        } else {
            current.set(param, value)
        }
        const search = current.toString()
        const query = search ? `?${search}` : ""
        router.replace(`${pathname}${query}`)
    }

    const handleInputChange = useCallback((event: React.FormEvent<HTMLTextAreaElement>) => {
        setText(event.currentTarget.value)
    }, [])

    const fetchTranslation = async () => {
        setLoading(true)
        try {
            if (debouncedText.trim().length > 0) {
                const response = await fetch("/api/translate", {
                    method: "POST",
                    body: JSON.stringify({ text: debouncedText }),
                    headers: {
                        "Content-Type": "application/json",
                    },
                })
                const data = await response.json()
                if (response.ok) {
                    setTranslationResponse(data)
                } else {
                    throw new Error(data.error)
                }
            } else {
                setTranslationResponse(null)
            }
        } catch (error: any) {
            setTranslationResponse(error)
        } finally {
            setLoading(false)
        }
    }

    const onExampleClick = (example: string) => {
        setText(example)
        window.scrollTo({ top: 0, behavior: "smooth" })
    }

    return (
        <div className="max-w-full">
            <div className="flex max-w-4xl flex-col items-start rounded-lg border border-gray-800 shadow-lg md:flex-row">
                <TextAreaWithClearButton
                    ref={textareaRef}
                    value={text}
                    placeholder={t("translator.type_to_translate")}
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
            <Examples
                onExampleClick={onExampleClick} />
        </div>
    )
}
