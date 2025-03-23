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
    const searchParams = useSearchParams();

    const textareaRef = useRef<HTMLTextAreaElement | null>(null)
    const lastUrlText = useRef<string>("")
    const urlUpdateTimeoutRef = useRef<NodeJS.Timeout | null>(null)
    
    const [translationResponse, setTranslationResponse] = useState<TranslationResponse | Error | null>(null)
    const [loading, setLoading] = useState(false)
    const [text, setText] = useState('')
    const debouncedText = useDebounce(text, 500)
    
    // Initialize from URL on first load only
    useEffect(() => {
        const initialText = searchParams.get("text") || ""
        setText(initialText)
        lastUrlText.current = initialText
        
        const textarea = textareaRef.current
        textarea?.focus()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    
    // Safe URL update function with throttling
    const updateUrl = useCallback((newText: string) => {
        // Only update if text has changed from last URL update
        if (newText === lastUrlText.current) {
            return
        }
        
        // Clear any pending update
        if (urlUpdateTimeoutRef.current) {
            clearTimeout(urlUpdateTimeoutRef.current)
        }
        
        // Schedule new update with small delay to batch rapid changes
        urlUpdateTimeoutRef.current = setTimeout(() => {
            lastUrlText.current = newText
            
            // Build new URL
            const query = newText.trim() ? `?text=${encodeURIComponent(newText)}` : ""
            
            // Use push to update URL without full page reload
            router.push(`${pathname}${query}`, { scroll: false })
            urlUpdateTimeoutRef.current = null
        }, 100)
    }, [pathname, router])
    
    // Handle input text change
    const handleInputChange = useCallback((event: React.FormEvent<HTMLTextAreaElement>) => {
        const newText = event.currentTarget.value
        setText(newText)
        updateUrl(newText)
    }, [updateUrl])
    
    // Fetch translation with streaming
    const fetchTranslation = useCallback(async () => {
        if (!debouncedText.trim()) {
            setTranslationResponse(null)
            return
        }
        
        setLoading(true)
        try {
            // Reset or initialize translation response
            setTranslationResponse({
                text: debouncedText,
                translations: [""],
                duration: 0
            })
            
            // Create response stream
            const response = await fetch("/api/translate", {
                method: "POST",
                body: JSON.stringify({ text: debouncedText }),
                headers: {
                    "Content-Type": "application/json",
                },
            })
            
            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || 'Server error')
            }
            
            if (!response.body) {
                throw new Error('No response stream available')
            }
            
            // Get reader from the response body stream
            const reader = response.body.getReader()
            const decoder = new TextDecoder()
            
            // Start streaming
            setLoading(false)
            
            // Process the stream
            while (true) {
                const { done, value } = await reader.read()
                
                if (done) {
                    break
                }
                
                // Decode the received chunk
                const chunk = decoder.decode(value, { stream: true })
                
                // Split by newlines in case multiple JSON objects are in one chunk
                const jsonStrings = chunk.split('\n').filter(str => str.trim())
                
                for (const jsonString of jsonStrings) {
                    try {
                        const data = JSON.parse(jsonString)
                        
                        if (data.error) {
                            throw new Error(data.error)
                        }
                        
                        setTranslationResponse(data)
                        
                        // If the server indicates we're done, we can exit
                        if (data.done === true) {
                            break
                        }
                    } catch (jsonError) {
                        console.error('Error parsing JSON from stream:', jsonError)
                    }
                }
            }
        } catch (error: any) {
            console.error('Translation streaming error:', error)
            setTranslationResponse(error)
            setLoading(false)
        }
    }, [debouncedText])
    
    // Handle translation using debounced text
    useEffect(() => {
        if (debouncedText.trim()) {
            fetchTranslation()
        } else {
            setTranslationResponse(null)
        }
    }, [debouncedText, fetchTranslation])
    
    const onExampleClick = useCallback((example: string) => {
        setText(example)
        updateUrl(example)
        window.scrollTo({ top: 0, behavior: "smooth" })
    }, [updateUrl])

    return (
        <div className="max-w-full">
            <div className="flex max-w-4xl flex-col items-start rounded-lg border border-gray-800 shadow-lg md:flex-row">
                <TextAreaWithClearButton
                    ref={textareaRef}
                    value={text}
                    placeholder={t("translator.type_to_translate")}
                    onChange={handleInputChange}
                    onClear={() => { setText(''); updateUrl(''); }}
                />
                <div className="h-px w-full bg-gray-800 md:h-96 md:w-px" />
                <TranslationPanel
                    translationResponse={translationResponse}
                    loading={loading}
                    onRetry={fetchTranslation}
                />
            </div>
            <Examples onExampleClick={onExampleClick} />
        </div>
    )
}
