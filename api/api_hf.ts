import { TranslationResponse } from "@/types/translation-response"

const translate = async (text: string): Promise<TranslationResponse> => {
  try {
    text = text.charAt(0).toLowerCase() + text.slice(1) // TODO: remove this hack
    const response = await fetch("https://anzorq-zedzek.hf.space/api/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data: [text.trim(), 4, 4] }),
    })
    const json = await response.json()
    // console.debug("API response: ", json)
    const translations = JSON.parse(json.data[1].replace(/'/g, '"'))
    return {
      text: json.data[0],
      translations,
      duration: json.duration,
    }
  } catch (error) {
    // console.error(error)
    throw error
  }
}

export default translate
