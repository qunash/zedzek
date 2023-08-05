import Replicate, { Prediction } from "replicate"
import packageData from "../../../package.json"


const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN!,
    userAgent: `${packageData.name}/${packageData.version}`,
})

export default async function handler(req: { body: { text: any } }, res: any) {

    console.log("handler, req.body.text", req.body.text)
    let text = req.body.text
    text = text.charAt(0).toLowerCase() + text.slice(1) // TODO: remove this hack

    const prediction: Prediction = await replicate.predictions.create({
        version: "1a3fe5bf0087208d4f03f5ef0521cd4b8d76a2b1d61700e2866ba01b47a2c547",
        input: {
            text: text,
            num_beams: 4,
            num_translations: 4,
            max_new_tokens: 200,
        },
    })

    // if (prediction?.error) {
    //     res.statusCode = 500;
    //     res.end(JSON.stringify({ detail: prediction.error }));
    //     return;
    // }

    res.statusCode = 201;
    res.end(JSON.stringify(prediction));
}