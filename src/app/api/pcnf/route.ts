import { NextResponse } from "next/server"
import Groq from "groq-sdk"
import prompts, { model } from "@/lib/prompts"

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY, // ✅ keep this server-only
})

export async function POST(req: Request) {
  try {
    const { expression } = await req.json()

    if (!expression || typeof expression !== "string") {
      return NextResponse.json(
        {
          expression: expression || "",
          valid: false,
          result: null,
          steps: ["No expression provided."],
        },
        { status: 400 }
      )
    }

    const finalPrompt = `
${prompts.pcnf}

Expression: ${expression}
Return your response strictly as a JSON object with:
{
  "expression": string,
  "valid": boolean,
  "result": string | null,
  "steps": string[]
}
  change the expression with valid symbols and not english words.
  Do not include any step about replacing English operators (like "and", "or", "not") with symbols. 
Assume the input expression already uses logical symbols (∧, ∨, ¬) or equivalent parentheses.
Never mention converting text operators.

    `

    const completion = await groq.chat.completions.create({
      model,
      messages: [{ role: "user", content: finalPrompt }],
      temperature: 0.3,
    })

    const raw = completion.choices?.[0]?.message?.content?.trim() || ""

    // ✅ Attempt to parse model output as JSON
    let parsed
    try {
      parsed = JSON.parse(raw)
    } catch (err) {
      console.error("Invalid JSON from model:", raw)
      parsed = {
        expression,
        valid: false,
        result: null,
        steps: ["Model returned invalid JSON format."],
      }
    }

    // ✅ Validate essential keys
    if (
      typeof parsed.expression !== "string" ||
      typeof parsed.valid !== "boolean" ||
      (typeof parsed.result !== "string" && parsed.result !== null) ||
      !Array.isArray(parsed.steps)
    ) {
      parsed = {
        expression,
        valid: false,
        result: null,
        steps: ["Malformed response received from model."],
      }
    }

    return NextResponse.json(parsed)
  } catch (err) {
    console.error("PDNF API error:", err)
    return NextResponse.json(
      {
        expression: "",
        valid: false,
        result: null,
        steps: ["Server error while generating PDNF."],
      },
      { status: 500 }
    )
  }
}
