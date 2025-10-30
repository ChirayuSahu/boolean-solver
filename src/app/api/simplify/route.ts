import { NextResponse } from "next/server"
import Groq from "groq-sdk"
import prompts, { model } from "@/lib/prompts"

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
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
          steps: [{ statement: "No expression provided.", rule: "Error" }],
        },
        { status: 400 }
      )
    }

    const finalPrompt = `
You are a logic reasoning and Boolean simplification engine.

You can handle:
1. Boolean algebra expressions with logical symbols (¬, ∧, ∨, →, ↔, etc.).
2. Natural language logical statements like "If it rains, the ground gets wet."

Your job:
- Interpret what kind of statement it is.
- If it's symbolic: simplify it step-by-step using Boolean algebra laws only.
- If it's natural language: translate into logic form, reason about it, and derive the logical conclusion.

Return valid JSON only in this exact structure:
{
  "expression": string,
  "valid": boolean,
  "result": string | null,
  "steps": [{"statement": string, "rule": string}]
}

Rules:
- Never use or mention truth tables.
- Each step must explain what rule or reasoning was applied.
- Use Boolean symbols (¬, ∧, ∨) when simplifying.
- For natural language logic, use clear reasoning laws (Modus Ponens, Contrapositive, etc.) in "rule".
- Never output anything outside JSON.
- If the input makes no logical sense, set valid=false.

Input: ${expression}
`

    const completion = await groq.chat.completions.create({
      model,
      messages: [{ role: "user", content: finalPrompt }],
      temperature: 0.3,
    })

    const raw = completion.choices?.[0]?.message?.content?.trim() || ""

    let parsed
    try {
      parsed = JSON.parse(raw)
    } catch (err) {
      console.error("Invalid JSON from model:", raw)
      parsed = {
        expression,
        valid: false,
        result: null,
        steps: [{ statement: "Model returned invalid JSON.", rule: "Error" }],
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
        steps: [{ statement: "Malformed response from model.", rule: "Error" }],
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
        steps: [{ statement: "Server error while simplifying expression.", rule: "Error" }],
      },
      { status: 500 }
    )
  }
}
