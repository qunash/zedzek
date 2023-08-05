export async function POST(req: Request): Promise<Response> {
    let { text } = await req.json();

    text = text.charAt(0).toLowerCase() + text.slice(1) // TODO: remove this hack

    const response = await fetch("https://anzorq-zedzek.hf.space/api/predict", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: [text.trim(), 4, 4] }),
    })

    if (!response.ok) {
        return new Response(JSON.stringify({error: `HTTP error! status: ${response.status}`}), {status: response.status});
    }
  
    const json = await response.json();
    console.debug("API response: ", json)

    const translations = JSON.parse(json.data[1].replace(/'/g, '"'))
    return new Response(JSON.stringify({
        text: json.data[0],
        translations,
        duration: json.duration,
    }), {status: 200, headers: {"Content-Type": "application/json"}});
}
