"use client"
import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useExpressionStore } from "@/lib/store/expressionStore"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"

interface Step {
  statement: string
  rule: string
}

interface SimplifyResponse {
  expression: string
  valid: boolean
  result: string | null
  steps: Step[]
}

const Simplify: React.FC = () => {
  const router = useRouter()
  const { expression } = useExpressionStore()

  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [data, setData] = useState<SimplifyResponse>({
    expression: "",
    valid: true,
    result: "",
    steps: [],
  })

  useEffect(() => {
    if (!expression.trim()) {
      router.replace("/")
      return
    }

    const simplifyExpression = async () => {
      setLoading(true)
      try {
        const res = await fetch("/api/simplify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ expression }),
        })

        const json: SimplifyResponse = await res.json()

        if (!res.ok) throw new Error("Failed to simplify expression")

        setData({
          expression: json.expression,
          valid: json.valid,
          result: json.result || "No simplification generated.",
          steps: json.steps || [],
        })
      } catch {
        setData({
          expression,
          valid: false,
          result: "Error simplifying expression. Please try again.",
          steps: [],
        })
      } finally {
        setLoading(false)
      }
    }

    simplifyExpression()
  }, [expression, router])

  const handleCopy = () => {
    if (!data.result) return
    navigator.clipboard.writeText(data.result)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex justify-center items-center min-h-screen bg-linear-to-br from-blue-400 to-blue-800 py-10"
    >
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-3xl space-y-4 p-6 rounded-lg"
      >
        {/* Header */}
        <div className="space-y-1.5">
          <motion.h2
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl font-semibold text-white italic"
          >
            Simplify
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-md text-white/80"
          >
            Simplified version of your Boolean expression using algebraic rules.
          </motion.p>
        </div>

        {/* Input Expression */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="rounded-md bg-white/90 p-4"
        >
          <div className="mb-2 text-sm text-slate-700">Input Expression</div>
          <div className="wrap-break-words text-lg text-slate-900">
            {loading ? expression : data.expression}
          </div>
        </motion.div>

        {/* Result */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className={`rounded-md p-4 ${
            data.valid ? "bg-white/90" : "bg-red-100"
          }`}
        >
          <div className="mb-2 text-sm text-slate-700">Simplified Expression</div>
          <div className="wrap-break-words text-lg text-slate-900">
            {loading ? "Simplifying..." : data.result || "No simplification generated."}
          </div>
        </motion.div>

        {/* Steps */}
        <AnimatePresence>
          {data.steps.length > 0 && data.valid && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3 }}
              className="rounded-xl bg-white/80 p-4 shadow-sm backdrop-blur-sm"
            >
              <div className="mb-3 text-sm text-slate-700 font-medium tracking-wide">
                Simplification Steps
              </div>

              <div className="overflow-x-auto custom-scrollbar">
                <table className="min-w-full text-sm border-separate border-spacing-0">
                  <thead>
                    <tr className="text-slate-500 uppercase text-xs tracking-wide border-b border-slate-200">
                      <th className="py-2 pr-3 text-left w-10 font-medium">#</th>
                      <th className="py-2 px-3 text-left font-medium whitespace-nowrap">
                        Statement
                      </th>
                      <th className="py-2 px-3 text-left font-medium whitespace-nowrap">
                        Rule
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.steps.map((s, i) => (
                      <tr key={i}>
                        <td className="py-2 pr-3 text-slate-700 font-medium align-top">
                          {i + 1}
                        </td>
                        <td className="py-2 px-3 text-slate-900 wrap-break-words">
                          {s.statement}
                        </td>
                        <td className="py-2 px-3 text-slate-600 italic">
                          {s.rule}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Buttons */}
        <AnimatePresence>
          {!loading && data.valid && data.result && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-3"
            >
              <Button
                size="lg"
                variant="secondary"
                onClick={handleCopy}
                className="cursor-pointer"
              >
                <AnimatePresence mode="wait">
                  {copied ? (
                    <motion.span
                      key="copied"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.1 }}
                    >
                      Copied!
                    </motion.span>
                  ) : (
                    <motion.span
                      key="copy"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.1 }}
                    >
                      Copy Simplified
                    </motion.span>
                  )}
                </AnimatePresence>
              </Button>

              <Button
                size="lg"
                variant="outline"
                onClick={() => router.push("/")}
                className="cursor-pointer"
              >
                Back Home
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
}

export default Simplify
