import Replicate from "replicate"
import packageData from "../../../package.json"

const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
    userAgent: `${packageData.name}/${packageData.version}`,
})

export default async function handler(req, res) {
    const prediction = await replicate.predictions.get(req.query.id)

    res.end(JSON.stringify(prediction))
}
