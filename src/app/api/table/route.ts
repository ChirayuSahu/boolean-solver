import { NextResponse } from "next/server"
import Groq from "groq-sdk"

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
          variables: [],
          rows: [],
        },
        { status: 400 }
      )
    }

    // 🧠 The prompt for truth table generation
    const prompt = `
You are a Boolean logic assistant.
Given a Boolean expression using logical symbols (¬, ∧, ∨, →, ↔),
generate its **truth table**.

Return a valid JSON object:
{
  "expression": string,
  "valid": boolean,
  "variables": string[],
  "rows": [
    { "A": 0, "B": 0, ..., "result": 1 },
    ...
  ]
}

Rules:
1. Do NOT explain. Only return JSON.
2. Use 0 and 1 for false and true.
3. Ensure the number of rows = 2^(number of variables).
4. Use "result" as the column name for output.
5. Use symbols, not words like AND, OR, NOT.
Expression: ${expression}
`

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
    })

    // right before JSON.parse()
    let raw = completion.choices?.[0]?.message?.content?.trim() || ""

    // 🧹 remove ```json or ``` fences if present
    raw = raw.replace(/^```(?:json)?\n?/i, "").replace(/```$/, "").trim()

    let parsed
    try {
      parsed = JSON.parse(raw)
    } catch (err) {
      console.error("Invalid JSON from model:", raw)
      parsed = {
        expression,
        valid: false,
        variables: [],
        rows: [],
      }
    }

    if (
      typeof parsed.expression !== "string" ||
      typeof parsed.valid !== "boolean" ||
      !Array.isArray(parsed.variables) ||
      !Array.isArray(parsed.rows)
    ) {
      parsed = {
        expression,
        valid: false,
        variables: [],
        rows: [],
      }
    }

    return NextResponse.json(parsed)
  } catch (err) {
    console.error("Truth Table API error:", err)
    return NextResponse.json(
      {
        expression: "",
        valid: false,
        variables: [],
        rows: [],
      },
      { status: 500 }
    )
  }
}
