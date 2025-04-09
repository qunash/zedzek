import { TargetLanguage } from "@/components/languageSelector";
import { TranslationResponse } from "@/types/translation-response";
import { useState, useEffect, useRef, useCallback } from "react";

interface UseTranslationProps {
    text: string; // Debounced text
    targetLanguage: TargetLanguage;
    onComplete?: (response: TranslationResponse) => void; // Callback when streaming finishes
}

export function useTranslation({
    text,
    targetLanguage,
    onComplete
}: UseTranslationProps) {
    const [data, setData] = useState<TranslationResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);

    // Refs to manage fetch lifecycle and prevent duplicate/stale requests
    const abortControllerRef = useRef<AbortController | null>(null);
    const lastRequestIdRef = useRef<number>(0);
    const lastSubmittedTextRef = useRef<string>("");
    const lastSubmittedLangRef = useRef<TargetLanguage | null>(null);

    // Memoize onComplete callback
    const stableOnComplete = useCallback(onComplete || (() => {}), [onComplete]);

    // The core fetch logic
    const fetchTranslation = useCallback(async (currentText: string, currentLang: TargetLanguage, requestId: number) => {
        // Abort previous request if any
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        abortControllerRef.current = new AbortController();
        const signal = abortControllerRef.current.signal;

        setLoading(true);
        setError(null);
        setData(null); // Clear previous data on new request

        // Optimistically set initial part of response for better UX
        setData({
            text: currentText,
            translations: [""], // Start with empty translation
            duration: 0
        });

        try {
            const response = await fetch("/api/translate", {
                method: "POST",
                body: JSON.stringify({
                    text: currentText,
                    targetLanguage: currentLang,
                    requestId // Include requestId
                }),
                headers: {
                    "Content-Type": "application/json",
                },
                signal
            });

            // Check if request was superseded *after* fetch promise resolved but *before* processing body
             if (lastRequestIdRef.current !== requestId) {
                console.log(`Request ${requestId} superseded after fetch, ignoring response.`);
                // Don't reset loading/error here, let the newer request handle it
                return;
            }

            if (!response.ok) {
                let errorMsg = 'Server error';
                try {
                    const errorData = await response.json();
                    errorMsg = errorData.error || errorMsg;
                } catch (e) { /* Ignore parsing error, use default */ }
                throw new Error(errorMsg);
            }

            if (!response.body) {
                throw new Error('No response stream available');
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let streamingDone = false;
            let finalResponseData: TranslationResponse | null = null;

            setLoading(false); // Start showing streamed content

            while (true) {
                // Check if request was superseded during streaming
                if (lastRequestIdRef.current !== requestId) {
                    console.log(`Request ${requestId} superseded during streaming, cancelling reader.`);
                    reader.cancel(); // Attempt to cancel the reader
                    // Don't reset state, let the newer request handle it
                    return; // Exit processing loop
                }

                const { done, value } = await reader.read();

                if (done) {
                    streamingDone = true;
                    break; // Exit loop when stream ends
                }

                const chunk = decoder.decode(value, { stream: true });
                const jsonStrings = chunk.split('\n').filter(str => str.trim());

                for (const jsonString of jsonStrings) {
                    try {
                        const parsedData = JSON.parse(jsonString);

                        if (parsedData.error) {
                            throw new Error(parsedData.error);
                        }

                        // Update state only if it's still the current request
                         if (lastRequestIdRef.current === requestId) {
                            setData(parsedData); // Update with the latest streamed data
                            finalResponseData = parsedData; // Keep track of the last valid data chunk
                            if (parsedData.done === true) {
                                streamingDone = true;
                                break; // Exit inner loop if server signals done
                            }
                        }
                    } catch (jsonError: any) {                       
                        // If streaming stops abruptly or JSON is malformed, we might end here
                        // Only treat as critical error if it happens for the *current* request
                         if (lastRequestIdRef.current === requestId) {
                            console.error('Error parsing JSON from stream:', jsonError);
                             // Consider setting an error state if this is critical
                             // setError(new Error('Streaming data error'));
                             // setData(null); // Optionally clear partial data
                         }
                         // Don't break the outer loop, try reading next chunk
                    }
                }
                 if (streamingDone) break; // Exit outer loop if inner loop broke due to done flag
            }

            // Ensure stream closure is handled gracefully, even if cancelled early
             try {
                if (!reader.closed) {
                    await reader.cancel();
                }
            } catch (cancelError) {
                 console.warn('Error cancelling reader:', cancelError);
             }

             // If streaming finished normally for the current request, call onComplete
            if (streamingDone && lastRequestIdRef.current === requestId && finalResponseData) {
                 stableOnComplete(finalResponseData);
            }

        } catch (error: any) {
            // Only update state if this error belongs to the latest request
            // and it's not an AbortError (which is expected on cancellation)
            if (lastRequestIdRef.current === requestId && error.name !== 'AbortError') {
                console.error('Translation fetch/stream error:', error);
                setError(error);
                setData(null); // Clear any partial data on error
                setLoading(false);
            }
        } finally {
            // Clean up controller ref *only if* this was the last request
            if (lastRequestIdRef.current === requestId) {
                abortControllerRef.current = null;
            }
        }

    }, [stableOnComplete]); // Dependency on the stable callback

    // Effect to trigger translation when debounced text or language changes
    useEffect(() => {
        const trimmedText = text.trim();

        // Condition 1: Text is empty
        if (!trimmedText) {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort(); // Cancel ongoing request
                abortControllerRef.current = null;
            }
            setData(null);
            setLoading(false);
            setError(null);
            lastSubmittedTextRef.current = ""; // Reset submission tracking
            lastSubmittedLangRef.current = null;
            return;
        }

        // Condition 2: Text and language are the same as the last *successful* or *in-progress* submission
        // This prevents re-fetching for whitespace changes or re-renders
        if (trimmedText === lastSubmittedTextRef.current && targetLanguage === lastSubmittedLangRef.current) {
            return;
        }

        // Proceed with new fetch
        const newRequestId = Date.now();
        lastRequestIdRef.current = newRequestId;
        lastSubmittedTextRef.current = trimmedText; // Track submission *before* fetch
        lastSubmittedLangRef.current = targetLanguage;

        fetchTranslation(trimmedText, targetLanguage, newRequestId);

        // Cleanup function to abort request if component unmounts or deps change *before* fetch completes
        return () => {
            // Check if the request associated with *this specific effect instance* is still the latest one
             if (lastRequestIdRef.current === newRequestId) {
                // If it is, and we are cleaning up, it means we should cancel it.
                 if (abortControllerRef.current) {
                    console.log(`Cancelling request ${newRequestId} due to effect cleanup.`);
                    abortControllerRef.current.abort();
                    abortControllerRef.current = null;
                }
            }
        };

    }, [text, targetLanguage, fetchTranslation]); // Re-run when text, language, or fetch function changes

    // Manual retry function
    const retry = useCallback(() => {
        const trimmedText = lastSubmittedTextRef.current; // Retry last submitted text
        const lastLang = lastSubmittedLangRef.current;

        if (!trimmedText || !lastLang) {
            console.warn("Retry called with no previous text/language.");
            return; // Cannot retry if nothing was submitted
        }

         // Generate a new ID for the retry attempt
         const newRequestId = Date.now();
         lastRequestIdRef.current = newRequestId;
        
        // Reset error before retrying
        setError(null);

        fetchTranslation(trimmedText, lastLang, newRequestId);

    }, [fetchTranslation]);

    return { data, loading, error, retry };
} 