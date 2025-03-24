import { VertexAI } from '@google-cloud/vertexai';
import { RateLimiterMemory, RateLimiterRes } from 'rate-limiter-flexible';

// Create a rate limiter instance - adjust these values based on your needs
const apiLimiter = new RateLimiterMemory({
    points: 60,         // Number of requests allowed
    duration: 60,       // Per minute (60 seconds)
    blockDuration: 60,  // Block for 1 minute if exceeded
});

/**
 * Replace palochka-like characters with the proper Circassian palochka
 * when they appear adjacent to Cyrillic characters
 */
function replacePalochkaLikeChars(text: string): string {
    return text.replace(/(?<=[а-яА-Я])[1Il|іӏ]|[1Il|іӏ](?=[а-яА-Я])/g, 'Ӏ');
}

/**
 * Apply rate limiting based on client IP
 * @returns Error response if rate limit exceeded, null otherwise
 */
async function applyRateLimit(ip: string): Promise<Response | null> {
    try {
        await apiLimiter.consume(ip);
        return null;
    } catch (error) {
        // Rate limit exceeded
        const rateLimitError = error as RateLimiterRes;
        console.warn(`Rate limit exceeded for IP: ${ip}`);
        
        const retryAfter = Math.floor(rateLimitError.msBeforeNext / 1000) || 60;
        return new Response(JSON.stringify({ 
            error: 'Too many requests. Please try again later.',
            retryAfter
        }), {
            status: 429,
            headers: { 
                'Content-Type': 'application/json',
                'Retry-After': String(retryAfter)
            }
        });
    }
}

/**
 * Initialize and configure the VertexAI client
 */
function initializeVertexAI() {
    const authOptions = {
        credentials: {
            client_email: process.env.GOOGLE_CLIENT_EMAIL || '',
            private_key: (process.env.GOOGLE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
            project_id: process.env.GOOGLE_CLOUD_PROJECT_ID || ''
        }
    };
    
    const vertexAI = new VertexAI({
        project: process.env.GOOGLE_CLOUD_PROJECT_ID || '',
        location: 'us-central1',
        googleAuthOptions: authOptions
    });
    
    return vertexAI.getGenerativeModel({
        model: process.env.VERTEX_AI_MODEL_ID || '',
        generationConfig: {
            temperature: 0.1,
            maxOutputTokens: 512,
        }
    });
}

/**
 * Map UI language code to Vertex AI supported language name
 */
function mapTargetLanguage(targetLanguage: string): string {
    switch (targetLanguage) {
        case "kbd": return "Circassian (Kabardian)";
        case "ady": return "Circassian (Adyghe)";
        case "ru": return "Russian";
        default: return "Circassian (Kabardian)";
    }
}

/**
 * Create translation request for VertexAI
 */
function createTranslationRequest(text: string, targetLang: string) {
    return {
        contents: [
            {
                role: 'user',
                parts: [
                    {
                        text: `Translate this text to ${targetLang}:\n\`\`\`\n${text}\n\`\`\``,
                    },
                ],
            },
        ],
    };
}

/**
 * Process the translation stream and write chunks to the response stream
 */
async function processTranslationStream(
    generativeModel: any, 
    request: any, 
    writer: WritableStreamDefaultWriter<Uint8Array>,
    processedText: string,
    signal?: AbortSignal
) {
    const encoder = new TextEncoder();
    let isCancelled = false;
    
    // Set up cancellation handling
    if (signal) {
        signal.addEventListener('abort', () => {
            isCancelled = true;
            writer.close().catch(() => {
                console.debug('Writer already closed due to client disconnect');
            });
        });
    }
    
    // Start the timer for performance tracking
    const streamStartTime = performance.now();
    
    try {
        // Use generateContentStream for streaming
        const streamingResponse = await generativeModel.generateContentStream(request);
        
        let accumulatedText = '';
        
        // Process each chunk as it arrives
        for await (const chunk of streamingResponse.stream) {
            // Check if request was cancelled
            if (isCancelled) {
                console.debug('Request cancelled, stopping stream processing');
                break;
            }
            
            if (chunk.candidates && chunk.candidates.length > 0 && 
                chunk.candidates[0].content.parts && 
                chunk.candidates[0].content.parts.length > 0) {
                
                const textChunk = chunk.candidates[0].content.parts[0].text || '';
                accumulatedText += textChunk;
                
                // Calculate current duration
                const currentTime = performance.now();
                const currentDuration = (currentTime - streamStartTime) / 1000;
                
                // Send the chunk to the client
                const payload = JSON.stringify({
                    text: processedText,
                    translations: [accumulatedText],
                    duration: Number(currentDuration.toFixed(2)),
                    done: false
                });
                
                try {
                    // Check if request was cancelled before writing
                    if (isCancelled) {
                        console.debug('Request cancelled before writing chunk');
                        break;
                    }
                    await writer.write(encoder.encode(payload + '\n'));
                } catch (writeError) {
                    console.debug('Error writing to stream, client likely disconnected');
                    break;
                }
            }
        }
        
        // Send final payload if not cancelled
        if (!isCancelled) {
            const endTime = performance.now();
            const finalDuration = (endTime - streamStartTime) / 1000;
            
            const finalPayload = JSON.stringify({
                text: processedText,
                translations: [accumulatedText],
                duration: Number(finalDuration.toFixed(2)),
                done: true
            });
            
            try {
                await writer.write(encoder.encode(finalPayload));
            } catch (writeError) {
                console.debug('Error writing final payload, client likely disconnected');
            }
        }
    } catch (error: any) {
        console.error('Streaming translation error:', error);
        
        // Only try to write error if not cancelled
        if (!isCancelled) {
            const errorPayload = JSON.stringify({ 
                error: error?.message || 'Request cancelled or failed',
                done: true
            });
            
            try {
                await writer.write(encoder.encode(errorPayload));
            } catch (writeError) {
                console.debug('Error writing error payload, client likely disconnected');
            }
        }
    } finally {
        // Always try to close the writer
        try {
            await writer.close();
        } catch (closeError) {
            console.debug('Error closing writer, may already be closed');
        }
    }
}

/**
 * Handle translation API requests
 */
export async function POST(req: Request): Promise<Response> {
    try {
        // Get client IP for rate limiting
        const ip = req.headers.get('x-forwarded-for') || 
                  req.headers.get('x-real-ip') || 
                  'unknown';
        
        // Apply rate limiting
        const rateLimitResponse = await applyRateLimit(ip);
        if (rateLimitResponse) return rateLimitResponse;
        
        // Parse request data
        const { text, targetLanguage } = await req.json();
        const processedText = replacePalochkaLikeChars(text.trim());
        const targetLang = mapTargetLanguage(targetLanguage);
        
        // Initialize VertexAI model
        const generativeModel = initializeVertexAI();
        
        // Create translation request
        const request = createTranslationRequest(processedText, targetLang);
        
        // Create streaming response
        const stream = new TransformStream();
        const writer = stream.writable.getWriter();
        
        // Process the stream in the background
        processTranslationStream(
            generativeModel, 
            request, 
            writer, 
            processedText, 
            req.signal
        ).catch(error => {
            console.error('Unhandled error in stream processing:', error);
        });
        
        // Return the readable stream as the response
        return new Response(stream.readable, {
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive'
            }
        });
        
    } catch (error: any) {
        console.error('Translation error:', error);
        return new Response(JSON.stringify({ 
            error: error?.message || 'Request cancelled or failed' 
        }), {
            status: error?.status || 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}
