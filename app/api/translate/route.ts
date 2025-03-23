import { VertexAI } from '@google-cloud/vertexai';

export async function POST(req: Request): Promise<Response> {
    try {
        const { text, targetLanguage } = await req.json();
        const processedText = text.trim();
        
        // Map the targetLanguage from the frontend to the appropriate Vertex AI model parameter
        let target_lang = "Circassian (Kabardian)";
        
        if (targetLanguage === "kbd") {
            target_lang = "Circassian (Kabardian)";
        } else if (targetLanguage === "ady") {
            target_lang = "Circassian (Adyghe)";
        } else if (targetLanguage === "ru") {
            target_lang = "Russian";
        }
        
        const startTime = performance.now();
        
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
        
        const generativeModel = vertexAI.getGenerativeModel({
            model: process.env.VERTEX_AI_MODEL_ID || '',
            generationConfig: {
                temperature: 0.1,
                maxOutputTokens: 512,
            }
        });
        
        const request = {
            contents: [
                {
                    role: 'user',
                    parts: [
                        {
                            text: `Translate this text to ${target_lang}:\n\`\`\`\n${processedText}\n\`\`\``,
                        },
                    ],
                },
            ],
        };
        
        // Create a streaming response
        const encoder = new TextEncoder();
        const stream = new TransformStream();
        const writer = stream.writable.getWriter();
        
        // Check if the request has a signal for cancellation
        const { signal } = req;
        let isCancelled = false;
        
        if (signal) {
            signal.addEventListener('abort', () => {
                isCancelled = true;
                writer.close().catch(() => {
                    // Ignore errors when closing an already closed writer
                    console.debug('Writer already closed due to client disconnect');
                });
            });
        }
        
        // Start the timer for performance tracking
        const streamStartTime = performance.now();
        
        // Process the stream in the background
        (async () => {
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
                
                // Check if request was cancelled before writing final payload
                if (!isCancelled) {
                    // Get the final duration
                    const endTime = performance.now();
                    const finalDuration = (endTime - streamStartTime) / 1000;
                    
                    // Send a final message with the done flag
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
                
                // Close the writer safely
                try {
                    await writer.close();
                } catch (closeError) {
                    console.debug('Error closing writer, may already be closed');
                }
                
            } catch (error: any) {
                console.error('Streaming translation error:', error);
                
                // Only try to write error if not cancelled
                if (!isCancelled) {
                    const errorPayload = JSON.stringify({ 
                        error: error && error.message ? error.message : 'Request cancelled or failed',
                        done: true
                    });
                    
                    try {
                        await writer.write(encoder.encode(errorPayload));
                    } catch (writeError) {
                        console.debug('Error writing error payload, client likely disconnected');
                    }
                }
                
                // Always try to close the writer
                try {
                    await writer.close();
                } catch (closeError) {
                    console.debug('Error closing writer after error, may already be closed');
                }
            }
        })().catch(error => {
            console.error('Unhandled error in stream processing:', error);
        });
        
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
            error: error && error.message ? error.message : 'Request cancelled or failed' 
        }), {
            status: error && error.status ? error.status : 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}