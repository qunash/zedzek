export type TranslationResponse = {
  input: string
  translations: string[]
  duration: number
}

const translate = async (text: string): Promise<TranslationResponse> => {
  try {
    text = text.charAt(0).toLowerCase() + text.slice(1); // TODO: remove this hack
    const response = await fetch("https://anzorq-zedzek.hf.space/api/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data: [text.trim(), 4, 4] }),
    })
    const json = await response.json()
    console.debug("API response: ", json)

    const jsonString = json.data[0].replace(/'/g, '"')
    const parsedData = JSON.parse(jsonString)

    return {
      input: parsedData.input,
      translations: parsedData.translations,
      duration: json.duration,
    }
  } catch (error) {
    console.error(error)
    throw error
  }
}

export default translate
