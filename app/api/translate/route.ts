import { Client } from "@gradio/client";

const createJsonResponse = (data: any, status: number = 200): Response => {
    return new Response(JSON.stringify(data), {
        status,
        headers: { "Content-Type": "application/json" }
    })
}

const isJsonResponse = (response: Response): boolean => {
    const contentType = response.headers.get("content-type")
    return !!contentType && contentType.includes("application/json")
}

export async function POST(req: Request): Promise<Response> {
    try {
        const { text } = await req.json()
        const processedText = text.toLowerCase()

        const startTime = performance.now();
        const client = await Client.connect("anzorq/zedzek");
        const result = await client.predict("/predict", {
            text: processedText.trim(),
            num_beams: 4,
            num_return_sequences: 4,
        }) as { data: [string, string] };
        const endTime = performance.now();
        const durationInSeconds = (endTime - startTime) / 1000;

        if (!result.data) {
            throw new Error('No data received from the model')
        }

        const translations = parseTranslations({ data: [result.data[0], result.data[1]] });

        return createJsonResponse({
            text: result.data[0],
            translations,
            duration: Number(durationInSeconds.toFixed(2)) // Convert to seconds and round to 2 decimal places
        })
    } catch (error: any) {
        return createJsonResponse({ error: error.message || 'Unknown error' }, error.status || 500)
    }
}

const parseTranslations = (json: any) => {
    return JSON.parse(json.data[1].replace(/'/g, '"'))
}
