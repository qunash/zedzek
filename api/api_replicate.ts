import Replicate from "replicate"

export type TranslationResponse = {
    input: string
    translations: string[]
    duration: number
}

type ReplicateResponse = {
    input: {
        text: string
        num_beams: number
        num_translations: number
        max_new_tokens: number
    }
    metrics: {
        predict_time: number
    }
    output: string[]
}

const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
})

const translate = async (text: string): Promise<TranslationResponse> => {
    text = text.charAt(0).toLowerCase() + text.slice(1) // TODO: remove this hack

    const response = await replicate.run(
        "qunash/m2m100-ru-kbd:6f3375b7237836953c0f75ac757ce7aed19777acc6ffb1d3b5b0bc759174d756",
        {
            input: {
                text: text,
                num_beams: 4,
                num_translations: 4,
                max_new_tokens: 50,
            },
        }
    ) as ReplicateResponse

    return {
        input: response.input.text,
        translations: response.output,
        duration: response.metrics.predict_time,
    }
}

export default translate