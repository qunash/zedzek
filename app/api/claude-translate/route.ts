import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function POST(req: NextRequest) {
  const { text } = await req.json()

  try {
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 100,
      temperature: 0.3,
      system: "Ты профессиональный переводчик с кабардинского на русский язык. Твоя задача – при получении предложения на кабардинском возвращать его перевод на русский и ничего более, без каких бы то ни было пояснений или дополнений.",
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