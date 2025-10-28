import { NextResponse } from "next/server"
import Groq from "groq-sdk"
import prompts, { model } from "@/lib/prompts"

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY, // ✅ server-only key
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
${prompts.simplify}

Expression: ${expression}

Do not include any step about replacing English operators like "and", "or", "not" with symbols.
Assume the input expression already uses logical symbols (∧, ∨, ¬) or equivalent parentheses.
Never mention operator conversion or truth tables.
Focus purely on algebraic simplification steps (distribution, absorption, etc.).
    `

    const completion = await groq.chat.completions.create({
      model,
      messages: [{ role: "user", content: finalPrompt }],
      temperature: 0.3,
    })

    const raw = completion.choices?.[0]?.message?.content?.trim() || ""

    // ✅ Try parsing JSON
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

    // ✅ Validate structure
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
    console.error("Simplify API error:", err)
    return NextResponse.json(
      {
        expression: "",
        valid: false,
        result: null,
        steps: ["Server error while simplifying expression."],
      },
      { status: 500 }
    )
  }
}
