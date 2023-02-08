const translate = async (input: string) => {
    try {
        const response = await fetch('https://anzorq-zedzek.hf.space/api/predict', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ data: [input, 4, 4] })
        })
        const json = await response.json()
        console.debug("API response: ", json)
        return {
            data: json.data[0],
            duration: json.duration
        }
    } catch (error) {
        console.error(error)
        throw error
    }
}

export default translate
