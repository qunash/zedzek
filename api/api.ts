export type TranslationResponse = {
    input: string
    translations: string[]
    duration: number
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const translate = async (text: string): Promise<TranslationResponse> => {

    const response = await fetch("/api/translate", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            text: text,
        }),
    })

    let prediction = await response.json()

    if (response.status !== 201) {
        throw new Error(prediction.detail)
    }

    while (prediction.status !== "succeeded" && prediction.status !== "failed") {
        await sleep(100)
        const response = await fetch("/api/translate/" + prediction.id)
        prediction = await response.json()
        if (response.status !== 200) {
            throw new Error(prediction.detail)
        }
    }

    if (prediction?.error) {
        throw new Error(prediction.error)
    }

    return {
        input: prediction.input.text,
        translations: prediction.output,
        duration: prediction.metrics.predict_time,
    }
}

export default translate
