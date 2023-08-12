import { postRequest } from "@/lib/get-post-requests"

const createJsonResponse = (data: any, status: number = 200): Response => {
    return new Response(JSON.stringify(data), {
        status,
        headers: { "Content-Type": "application/json" }
    })
}

export async function POST(req: Request): Promise<Response> {
    try {
        const { text } = await req.json()

        const processedText = text.charAt(0).toLowerCase() + text.slice(1) // TODO: remove this hack

        const response = await postRequest(
            "https://anzorq-zedzek.hf.space/api/predict",
            { data: [processedText.trim(), 4, 4] }
        )

        if (!response.ok) {
            const errorMessage = await response.text()
            return createJsonResponse({ error: errorMessage }, response.status)
        }

        const json = await response.json()
        const translations = JSON.parse(json.data[1].replace(/'/g, '"'))

        return createJsonResponse({
            text: json.data[0],
            translations,
            duration: json.duration
        })

    } catch (error: any) {
        return createJsonResponse({ error: error.message }, 500)
    }
}