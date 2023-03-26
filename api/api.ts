const translate = async (text: string, options?: { signal?: AbortSignal }) => {
  try {
    text = text.charAt(0).toLowerCase() + text.slice(1) // TODO: remove this hack
    const response = await fetch("https://anzorq-zedzek.hf.space/api/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data: [text.trim(), 4, 4] }),
      signal: options?.signal
    })
    const json = await response.json()
    console.debug("API response: ", json)
    return {
      data: json.data[0],
      duration: json.duration,
    }
  } catch (error) {
    console.error(error)
    throw error
  }
}

export default translate
