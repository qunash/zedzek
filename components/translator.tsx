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
import VirtualCircassianKeyboard from './ui/virtual-keyboard'
import { useTranslation } from '@/hooks/useTranslation'
import { buttonVariants } from './ui/button'
import { Icons } from './icons'

export default function Translator() {
    const t = getI18nCLient()
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams();

    const textareaRef = useRef<HTMLTextAreaElement | null>(null)
    const lastUrlText = useRef<string>("")
    const urlUpdateTimeoutRef = useRef<NodeJS.Timeout | null>(null)
    const internalNavigationRef = useRef(false);
    const lastUrlLang = useRef<TargetLanguage | null>(null); // Added ref for last URL language

    const [text, setText] = useState('')
    const [fontSize, setFontSize] = useState<'text-3xl' | 'text-2xl' | 'text-xl'>('text-3xl')
    const [targetLanguage, setTargetLanguage] = useState<TargetLanguage>('kbd')
    const debouncedText = useDebounce(text, 500)

    // Virtual keyboard visibility
    const [keyboardVisible, setKeyboardVisible] = useState(false)

    const toggleKeyboard = useCallback(() => {
        setKeyboardVisible((prev) => !prev)
        // Only focus on desktop to avoid mobile keyboard popup
        if (window.innerWidth >= 1024) {
            textareaRef.current?.focus()
        }
    }, [keyboardVisible])

    // Function to determine font size based on text length
    const updateFontSizeForText = useCallback((inputText: string) => {
        if (inputText.length > 40) {
            setFontSize('text-xl')
        } else if (inputText.length > 20) {
            setFontSize('text-2xl')
        } else {
            setFontSize('text-3xl')
        }
    }, [])

    // Handle virtual keyboard key presses
    const handleVirtualKeyPress = useCallback((button: string) => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        // Get current selection/cursor position
        const selStart = textarea.selectionStart;
        const selEnd = textarea.selectionEnd;
        const currentValue = textarea.value;
        
        let newText = currentValue;
        let newCursorPos = selStart;

        if (button === "{bksp}") {
            // Handle backspace with selection or at a position
            if (selStart === selEnd) {
                if (selStart > 0) {
                    // Delete previous character if no selection
                    newText = currentValue.substring(0, selStart - 1) + currentValue.substring(selEnd);
                    newCursorPos = selStart - 1;
                }
            } else {
                // Delete selected text
                newText = currentValue.substring(0, selStart) + currentValue.substring(selEnd);
                newCursorPos = selStart;
            }
        } else if (button === "{space}") {
            // Insert space at cursor or replace selection
            newText = currentValue.substring(0, selStart) + " " + currentValue.substring(selEnd);
            newCursorPos = selStart + 1;
        } else if (button === "{enter}") {
            // Insert newline at cursor or replace selection
            newText = currentValue.substring(0, selStart) + "\n" + currentValue.substring(selEnd);
            newCursorPos = selStart + 1;
        } else {
            // Insert regular character at cursor or replace selection
            newText = currentValue.substring(0, selStart) + button + currentValue.substring(selEnd);
            newCursorPos = selStart + button.length;
        }
        
        // Update text state
        setText(newText);
        updateFontSizeForText(newText);

        // Use a setTimeout to ensure the textarea has been updated before setting the selection
        setTimeout(() => {
            if (textarea) {
                textarea.focus();
                textarea.setSelectionRange(newCursorPos, newCursorPos);
            }
        }, 0);
    }, [updateFontSizeForText])

    // Initialize state from URL (only on external navigation)
    useEffect(() => {
        if (internalNavigationRef.current) {
            internalNavigationRef.current = false;
            return; // Skip if triggered by internal router.push
        }

        const initialText = searchParams.get("text") || ""
        const initialTargetLang = searchParams.get("lang") as TargetLanguage || "kbd"

        // Only update if values have actually changed from current state
        // Prevents resetting text unnecessarily if only lang param changes via history
        if (initialText !== text) {
            setText(initialText)
            updateFontSizeForText(initialText)
        }
        if (initialTargetLang !== targetLanguage) {
            setTargetLanguage(initialTargetLang)
        }

        lastUrlText.current = initialText // Track last text *loaded* from URL
        lastUrlLang.current = initialTargetLang // Track last lang *loaded* from URL
    }, [searchParams]);

    // URL Update Logic
    const updateUrl = useCallback((newText: string, newTargetLang: TargetLanguage) => {
        const trimmedText = newText.trim()

        // Only update if text OR language has changed from the last URL update
        if (trimmedText === lastUrlText.current.trim() && newTargetLang === lastUrlLang.current) {
            return
        }

        if (urlUpdateTimeoutRef.current) {
            clearTimeout(urlUpdateTimeoutRef.current)
        }

        urlUpdateTimeoutRef.current = setTimeout(() => {
            lastUrlText.current = trimmedText
            lastUrlLang.current = newTargetLang
            const params = new URLSearchParams()
            const MAX_URL_TEXT_LENGTH = 2048
            if (trimmedText) {
                if (trimmedText.length <= MAX_URL_TEXT_LENGTH) {
                    params.set("text", trimmedText)
                } else {
                    params.set("text", trimmedText.substring(0, MAX_URL_TEXT_LENGTH))
                    params.set("truncated", "true")
                }
            }
            params.set("lang", newTargetLang)
            const query = params.toString() ? `?${params.toString()}` : ""

            internalNavigationRef.current = true; // Signal internal navigation
            router.push(`${pathname}${query}`, { scroll: false })
            // Update refs *after* successful push is scheduled
            urlUpdateTimeoutRef.current = null
        }, 100) // Keep small delay to batch potential rapid calls
    }, [pathname, router])

    // Callback for when translation completes successfully (passed to hook)
    const handleTranslationComplete = useCallback((response: TranslationResponse) => {
        // Use the text from the successful response to update the URL
        // This ensures the URL matches the text that was *actually* translated
        updateUrl(response.text, targetLanguage)
    }, [targetLanguage, updateUrl])

    // Use the translation hook
    const { data: translationResponse, loading, error, retry: fetchTranslation } = useTranslation({
        text: debouncedText,
        targetLanguage: targetLanguage,
        onComplete: handleTranslationComplete,
    });

    // Handle input text change
    const handleInputChange = useCallback((event: React.FormEvent<HTMLTextAreaElement>) => {
        const newText = event.currentTarget.value
        setText(newText)
        updateFontSizeForText(newText)
        // Don't need to manage shouldUpdateUrl here; hook handles triggering
    }, [updateFontSizeForText])

    // Handle target language change
    const handleTargetLanguageChange = useCallback((newTargetLang: TargetLanguage) => {
        setTargetLanguage(newTargetLang);
        // Hook will automatically trigger refetch due to targetLanguage dependency change
    }, [])

    // Handle example click
    const onExampleClick = useCallback((example: string, targetLang: TargetLanguage) => {
        setText(example) // Update text immediately
        setTargetLanguage(targetLang)
        updateFontSizeForText(example)
        window.scrollTo({ top: 0, behavior: "smooth" })
        // No need to manually set loading or clear response; hook handles this
        // No need to reset lastSubmitted...; hook handles this
        // Clear any pending URL update from previous state
        if (urlUpdateTimeoutRef.current) {
            clearTimeout(urlUpdateTimeoutRef.current)
            urlUpdateTimeoutRef.current = null;
        }
    }, [updateFontSizeForText])

    // Clear function
    const handleClear = useCallback(() => {
        setText('');
        updateFontSizeForText('');
        // Hook will cancel fetch & clear state when debouncedText becomes empty

        // Clear any pending URL update
        if (urlUpdateTimeoutRef.current) {
            clearTimeout(urlUpdateTimeoutRef.current)
            urlUpdateTimeoutRef.current = null;
        }
        // Update URL immediately to clear text parameter
        updateUrl('', targetLanguage);
    }, [targetLanguage, updateUrl, updateFontSizeForText])

    // Combine translation data and error for TranslationPanel
    // Prioritize showing error message if one exists
    const displayResponse = error ? error : translationResponse;

    return (
        <>
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
                        <div className="w-full bg-white dark:bg-zinc-800 relative">
                            <TextAreaWithClearButton
                                ref={textareaRef}
                                value={text}
                                placeholder={t("translator.type_to_translate")}
                                onChange={handleInputChange}
                                onClear={handleClear}
                                fontSize={fontSize}
                            />
                            
                            {/* Keyboard toggle button in lower right corner */}
                            <div className="absolute bottom-4 right-4 hidden lg:block">
                                <div
                                    className={buttonVariants({
                                        size: "sm",
                                        variant: keyboardVisible ? "secondary" : "ghost",
                                        className: "cursor-pointer text-slate-700 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-zinc-700"
                                    })}
                                    onClick={toggleKeyboard}
                                    aria-label="Toggle Virtual Keyboard"
                                >
                                    <Icons.keyboard className="h-5 w-5" />
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Virtual Keyboard removed from here */}
                </div>

                {/* Translation panel container */}
                <div className={`w-full transition-all duration-300 ease-in-out ${text.trim() === '' ? 'h-0 overflow-hidden opacity-0 md:h-auto md:overflow-visible md:opacity-100' : 'opacity-100'}`}>
                    <div className="w-full overflow-hidden rounded-lg shadow-md">
                        <div className="w-full bg-white dark:bg-zinc-800">
                            <TranslationPanel
                                translationResponse={displayResponse}
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
        {/* Fixed virtual keyboard at bottom of screen, centered on desktop */}
        {keyboardVisible && (
            <VirtualCircassianKeyboard
                onKeyPress={handleVirtualKeyPress}
                isVisible={keyboardVisible}
                textareaRef={textareaRef}
                onClose={() => setKeyboardVisible(false)}
            />
        )}
        </>
    )
}
