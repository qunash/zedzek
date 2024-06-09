import { Client } from "@gradio/client"

interface PredictionResult {
    data: {
        name: string
        url: string
    }[]
}

const createJsonResponse = (data: any, status: number = 200): Response => {
    return new Response(JSON.stringify(data), {
        status,
        headers: { "Content-Type": "application/json" }
    })
}

export async function POST(req: Request): Promise<Response> {
    try {
        const { text } = await req.json()
        const processedText = text.trim()

        const client = await Client.connect("anzorq/vits-kbd-male")
        const result = await client.predict("/predict", {
            text: processedText,
            voice: "Male",
            use_onnx: true
        }) as PredictionResult

        const audioUrl = result.data[0].url

        return createJsonResponse({ audioUrl })
    } catch (error: any) {
        return createJsonResponse({ error: error.message || 'Unknown error' }, error.status || 500)
    }
}