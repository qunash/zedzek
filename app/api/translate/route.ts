import { VertexAI } from '@google-cloud/vertexai';

const createJsonResponse = (data: any, status: number = 200): Response => {
    return new Response(JSON.stringify(data), {
        status,
        headers: { "Content-Type": "application/json" }
    })
}

export async function POST(req: Request): Promise<Response> {
    try {
        const { text, sourceLanguage, targetLanguage } = await req.json();
        const processedText = text.trim();
        
        // Extract default language settings from the input or use defaults
        const source = sourceLanguage || 'Russian';
        const target = targetLanguage || 'Circassian (Kabardian)';
        
        const startTime = performance.now();
        
        // Create auth options with credentials from environment variables
        // The private key needs special handling to preserve newlines
        const authOptions = {
            credentials: {
                client_email: process.env.GOOGLE_CLIENT_EMAIL || '',
                private_key: (process.env.GOOGLE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
                project_id: process.env.GOOGLE_CLOUD_PROJECT_ID || ''
            }
        };
        
        // Initialize Vertex AI with auth options
        const vertexAI = new VertexAI({
            project: process.env.GOOGLE_CLOUD_PROJECT_ID || '',
            location: 'us-central1',
            googleAuthOptions: authOptions
        });
        
        // Get your fine-tuned model
        const generativeModel = vertexAI.getGenerativeModel({
            model: process.env.VERTEX_AI_MODEL_ID || '',
            generationConfig: {
                temperature: 0.1,
            }
        });
        
        // Prepare the request for translation
        const request = {
            contents: [
                {
                    role: 'user',
                    parts: [
                        {
                            text: `Translate this text from ${source} to ${target}:\n\`\`\`\n${processedText}\n\`\`\``,
                        },
                    ],
                },
            ],
        };
        
        // Request the translation
        const response = await generativeModel.generateContent(request);
        const result = await response.response;
        
        const endTime = performance.now();
        const durationInSeconds = (endTime - startTime) / 1000;
        
        if (!result || !result.candidates || result.candidates.length === 0) {
            throw new Error('No translation received from the model');
        }
        
        // Extract the translation from the model response
        const translation = result.candidates[0].content.parts[0].text;
        
        return createJsonResponse({
            text: processedText,
            translations: [translation],
            duration: Number(durationInSeconds.toFixed(2))
        });
    } catch (error: any) {
        console.error('Translation error:', error);
        return createJsonResponse({ error: error.message || 'Unknown error' }, error.status || 500);
    }
}