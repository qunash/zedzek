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
        const processedText = text.trim()

        const BASE_URL = "https://anzorq-vits-kbd-male.hf.space"
        const response = await fetch(`${BASE_URL}/api/predict`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ data: [processedText, "Male"] })
        })

        if (!response.ok) {
            const errorMessage = isJsonResponse(response) ? (await response.json()).error : await response.text()
            throw new Error(errorMessage)
        }

        const responseBody = await response.json()

        if (!responseBody.data || !responseBody.data[0].name) {
            throw new Error('Unexpected response format')
        }

        const audioName = responseBody.data[0].name
        const audioUrl = `${BASE_URL}/file=${audioName}`

        return createJsonResponse({ audioUrl })
    } catch (error: any) {
        return createJsonResponse({ error: error.message || 'Unknown error' }, error.status || 500)
    }
}
