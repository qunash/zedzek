
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
        const processedText = text//.charAt(0).toLowerCase() + text.slice(1)

        const response = await fetch("https://anzorq-zedzek.hf.space/api/predict", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ data: [processedText.trim(), 4, 4] })
        })

        if (!response.ok) {
            const errorMessage = isJsonResponse(response) ? (await response.json()).error : await response.text()
            throw new Error(errorMessage)
        }

        const json = await response.json()
        const translations = parseTranslations(json)

        return createJsonResponse({
            text: json.data[0],
            translations,
            duration: json.duration
        })
    } catch (error: any) {
        return createJsonResponse({ error: error.message || 'Unknown error' }, error.status || 500)
    }
}

const parseTranslations = (json: any) => {
    return JSON.parse(json.data[1].replace(/'/g, '"'))
}
