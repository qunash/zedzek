"use client"

import { getI18nCLient } from '@/app/locales/client'
import '@/styles/globals.css'
import { TranslationResponse } from '@/types/translation-response'
import { useDebounce } from "@uidotdev/usehooks"
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from "react"
import Examples from './examples'
import LanguageSelector, { TargetLanguage } from './languageSelector'
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
    const isUserInput = useRef<boolean>(false)
    
    const [translationResponse, setTranslationResponse] = useState<TranslationResponse | Error | null>(null)
    const [loading, setLoading] = useState(false)
    const [text, setText] = useState('')
    const [fontSize, setFontSize] = useState<'text-3xl' | 'text-2xl' | 'text-xl'>('text-3xl')
    const [targetLanguage, setTargetLanguage] = useState<TargetLanguage>('kbd')
    const debouncedText = useDebounce(text, 500)
    
    // Function to determine font size based on text length
    const updateFontSizeForText = useCallback((text: string) => {
        if (text.length > 40) {
            setFontSize('text-xl')
        } else if (text.length > 20) {
            setFontSize('text-2xl')
        } else {
            setFontSize('text-3xl')
        }
    }, [])
    
    // Initialize from URL on first load only
    useEffect(() => {
        const initialText = searchParams.get("text") || ""
        const initialTargetLang = searchParams.get("lang") as TargetLanguage || "kbd"
        setText(initialText)
        setTargetLanguage(initialTargetLang)
        lastUrlText.current = initialText
        
        const textarea = textareaRef.current
        textarea?.focus()
        
        updateFontSizeForText(initialText)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    
    // Safe URL update function with throttling
    const updateUrl = useCallback((newText: string, newTargetLang: TargetLanguage) => {
        // Skip URL updates if not from user input
        if (!isUserInput.current) return
        
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
            
            // Build new URL with text and target language
            const params = new URLSearchParams()
            
            // Include only first 2048 characters in URL to prevent 431 errors
            const MAX_URL_TEXT_LENGTH = 2048
            if (newText.trim()) {
                if (newText.length <= MAX_URL_TEXT_LENGTH) {
                    // Use full text if it's under the limit
                    params.set("text", newText)
                } else {
                    // For longer texts, include only the first 2048 chars in URL
                    // The full text will still be used for translation
                    params.set("text", newText.substring(0, MAX_URL_TEXT_LENGTH))
                    
                    // Add a flag to indicate truncation
                    params.set("truncated", "true")
                }
            }
            
            params.set("lang", newTargetLang)
            const query = params.toString() ? `?${params.toString()}` : ""
            
            // Use push to update URL without full page reload
            router.push(`${pathname}${query}`, { scroll: false })
            urlUpdateTimeoutRef.current = null
        }, 100)
    }, [pathname, router])
    
    // Handle input text change
    const handleInputChange = useCallback((event: React.FormEvent<HTMLTextAreaElement>) => {
        const newText = event.currentTarget.value
        isUserInput.current = true
        setText(newText)
        updateUrl(newText, targetLanguage)
        
        // Update font size based on text length
        updateFontSizeForText(newText)
    }, [updateUrl, updateFontSizeForText, targetLanguage])
    
    // Handle target language change
    const handleTargetLanguageChange = useCallback((newTargetLang: TargetLanguage) => {
        isUserInput.current = true;
        setTargetLanguage(newTargetLang);
        updateUrl(text, newTargetLang);
    }, [text, updateUrl])
    
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
                body: JSON.stringify({ 
                    text: debouncedText,
                    targetLanguage: targetLanguage
                }),
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
    }, [debouncedText, targetLanguage])
    
    // Handle translation using debounced text
    useEffect(() => {
        if (debouncedText.trim()) {
            fetchTranslation()
        } else {
            setTranslationResponse(null)
        }
    }, [debouncedText, fetchTranslation])
    
    // Handle example click
    const onExampleClick = useCallback((example: string) => {
        isUserInput.current = true
        setText(example)
        // Set loading state immediately to provide visual feedback
        setLoading(true)
        // Clear previous translation while waiting for the new one
        setTranslationResponse({
            text: example,
            translations: [""],
            duration: 0
        })
        updateUrl(example, targetLanguage)
        updateFontSizeForText(example)
        window.scrollTo({ top: 0, behavior: "smooth" })
    }, [updateUrl, updateFontSizeForText, targetLanguage])

    return (
        <div className="mx-auto w-full max-w-4xl md:max-w-5xl lg:max-w-6xl">
            {/* Translation panels */}
            <div className="flex flex-col space-y-2 md:flex-row md:items-end md:space-x-4 md:space-y-0">
                <div className="flex w-full flex-col space-y-2 md:space-y-3">
                    <div className="w-full overflow-hidden rounded-lg shadow-md">
                        <LanguageSelector 
                            targetLanguage={targetLanguage}
                            onLanguageChange={handleTargetLanguageChange}
                        />
                        
                        {/* Input field */}
                        <div className="w-full bg-white dark:bg-zinc-800">
                            <TextAreaWithClearButton
                                ref={textareaRef}
                                value={text}
                                placeholder={t("translator.type_to_translate")}
                                onChange={handleInputChange}
                                onClear={() => { 
                                    isUserInput.current = true;
                                    setText(''); 
                                    setTranslationResponse(null); 
                                    updateUrl('', targetLanguage); 
                                    setFontSize('text-3xl'); 
                                }}
                                fontSize={fontSize}
                            />
                        </div>
                    </div>
                </div>
                
                {/* Translation panel container */}
                <div className={`w-full transition-all duration-300 ease-in-out ${text.trim() === '' ? 'h-0 overflow-hidden opacity-0 md:h-auto md:overflow-visible md:opacity-100' : 'opacity-100'}`}>
                    <div className="w-full overflow-hidden rounded-lg shadow-md">
                        <div className="w-full bg-white dark:bg-zinc-800">
                            <TranslationPanel
                                translationResponse={translationResponse}
                                loading={loading}
                                onRetry={fetchTranslation}
                                fontSize={fontSize}
                            />
                        </div>
                    </div>
                </div>
            </div>
            {/* Use transition for disclaimer text */}
            <div className={`mb-1 mt-2 pr-2 text-right text-sm text-gray-500 transition-all duration-300 ease-in-out ${text.trim() === '' ? 'h-0 overflow-hidden opacity-0 md:h-auto md:overflow-visible md:opacity-100' : 'opacity-100'}`}>
                <span dangerouslySetInnerHTML={{ __html: t("index.info") }} />
            </div>
            <Examples onExampleClick={onExampleClick} />
        </div>
    )
}
