import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function POST(req: NextRequest) {
  const { text } = await req.json()

  try {
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20240620',
      max_tokens: 100,
      temperature: 0.7,
      system: "You are a translator. Translate the given text to Kabardian (Circassian). Provide only the translation, without any additional explanations or notes.",
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: text
            }
          ]
        }
      ],
    })

    // const translation = response.content[0].text
    const translation = (response.content[0] as Anthropic.TextBlock).text

    return NextResponse.json({ translation })
  } catch (error) {
    console.error('Error calling Anthropic API:', error)
    return NextResponse.json({ error: 'Failed to translate text' }, { status: 500 })
  }
}

export const runtime = "edge"