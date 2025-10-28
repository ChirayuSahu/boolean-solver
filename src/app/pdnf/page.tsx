"use client"
import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useExpressionStore } from "@/lib/store/expressionStore"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"

interface PDNFResponse {
  expression: string
  valid: boolean
  result: string | null
  steps: string[]
}

interface PDNFState {
  expression: string
  valid: boolean
  result: string
  steps: string[]
}

const PDNF: React.FC = () => {
  const router = useRouter()
  const { expression } = useExpressionStore()

  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [pdnfData, setPdnfData] = useState<PDNFState>({
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

    const generatePDNF = async () => {
      setLoading(true)
      setPdnfData({ expression: "", valid: true, result: "", steps: [] })

      try {
        const res = await fetch("/api/pdnf", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ expression }),
        })

        const data: PDNFResponse = await res.json()

        if (!res.ok) throw new Error("Failed to generate PDNF")

        setPdnfData({
          expression: data.expression,
          valid: data.valid,
          result: data.result || "No output generated.",
          steps: data.steps || [],
        })
      } catch {
        setPdnfData({
          expression: expression,
          valid: false,
          result: "Error generating PDNF. Please try again.",
          steps: [],
        })
      } finally {
        setLoading(false)
      }
    }

    generatePDNF()
  }, [expression, router])

  const handleCopy = () => {
    navigator.clipboard.writeText(pdnfData.result)
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
        <div className="space-y-1.5">
          <motion.h2
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl font-semibold text-white italic"
          >
            PDNF
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-md text-white/80"
          >
            Principal Disjunctive Normal Form for the current expression.
          </motion.p>
        </div>

        {/* Expression */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="rounded-md bg-white/90 p-4"
        >
          <div className="mb-2 text-sm text-slate-700">Input expression</div>
          <div className="whitespace-pre-wrap wrap-break-word text-lg text-slate-900">
            {loading ? expression : pdnfData.expression}
          </div>
        </motion.div>

        {/* PDNF Result */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className={`rounded-md p-4 ${pdnfData.valid ? "bg-white/90" : "bg-red-100"
            }`}
        >
          <div className="mb-2 text-sm text-slate-700">PDNF</div>
          <div className="whitespace-pre-wrap wrap-break-word text-lg text-slate-900">
            {loading
              ? "Generating..."
              : pdnfData.result || "No output generated."}
          </div>
        </motion.div>

        {/* Steps */}
        <AnimatePresence>
          {pdnfData.steps.length > 0 && pdnfData.valid && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3 }}
              className="rounded-md bg-white/80 p-4"
            >
              <div className="mb-2 text-sm text-slate-700">Steps</div>
              <ul className="list-disc pl-5 space-y-1 text-slate-800">
                {pdnfData.steps.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Copy Button */}
        {/* Action Buttons */}
        <AnimatePresence>
          {pdnfData.valid && pdnfData.result && !loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-3"
            >
              {/* Copy button */}
              <Button
                size="lg"
                variant="secondary"
                onClick={handleCopy}
                className="cursor-pointer relative overflow-hidden"
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
                      Copy PDNF
                    </motion.span>
                  )}
                </AnimatePresence>
              </Button>

              {/* Navigate to PDNF */}
              <Button
                size="lg"
                variant="outline"
                onClick={() => router.push("/pcnf")}
                className="cursor-pointer"
              >
                Go to PCNF
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

      </motion.div>
    </motion.div>
  )
}

export default PDNF
