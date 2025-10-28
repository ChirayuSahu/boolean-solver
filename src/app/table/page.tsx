"use client"
import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useExpressionStore } from "@/lib/store/expressionStore"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"

interface TruthTableRow {
  [variable: string]: string | number
}

interface TruthTableResponse {
  expression: string
  valid: boolean
  variables: string[]
  rows: TruthTableRow[]
}

const TruthTable: React.FC = () => {
  const router = useRouter()
  const { expression } = useExpressionStore()

  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [tableData, setTableData] = useState<TruthTableResponse>({
    expression: "",
    valid: true,
    variables: [],
    rows: [],
  })

  useEffect(() => {
    if (!expression.trim()) {
      router.replace("/")
      return
    }

    const generateTable = async () => {
      setLoading(true)
      setTableData({ expression: "", valid: true, variables: [], rows: [] })

      try {
        const res = await fetch("/api/table", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ expression }),
        })

        const data: TruthTableResponse = await res.json()
        console.log("Truth table response:", data)

        if (!res.ok) throw new Error("Failed to generate truth table")

        setTableData(data)
      } catch (err) {
        console.error(err)
        setTableData({
          expression,
          valid: false,
          variables: [],
          rows: [],
        })
      } finally {
        setLoading(false)
      }
    }

    generateTable()
  }, [expression, router])

  const handleCopy = () => {
    const tableText = JSON.stringify(tableData, null, 2)
    navigator.clipboard.writeText(tableText)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-400 to-blue-800 py-10"
    >
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-5xl space-y-6 p-6 rounded-lg"
      >
        {/* Header */}
        <div className="space-y-1.5">
          <h2 className="text-5xl font-semibold text-white italic">Truth Table</h2>
          <p className="text-md text-white/80">
            Logical truth table for your Boolean expression.
          </p>
        </div>

        {/* Expression */}
        <motion.div
          className="rounded-md bg-white/90 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="mb-2 text-sm text-slate-700">Input expression</div>
          <div className="whitespace-pre-wrap text-lg text-slate-900">
            {loading ? "Generating..." : tableData.expression}
          </div>
        </motion.div>

        {/* Truth Table */}
        <AnimatePresence>
          {tableData.valid && tableData.rows.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3 }}
              className="rounded-xl bg-white/80 p-4 shadow-sm backdrop-blur-sm"
            >
              <div className="mb-3 text-sm text-slate-700 font-medium tracking-wide">
                Generated Truth Table
              </div>

              <div className="overflow-x-auto custom-scrollbar">
                <table className="min-w-full text-sm border-separate border-spacing-0">
                  <thead>
                    <tr className="text-slate-500 uppercase text-xs tracking-wide border-b border-slate-200">
                      {tableData.variables.map((v) => (
                        <th key={v} className="py-2 px-3 text-center font-medium whitespace-nowrap">
                          {v}
                        </th>
                      ))}
                      <th className="py-2 px-3 text-center font-medium whitespace-nowrap">
                        Result
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableData.rows.map((row, i) => (
                      <tr key={i} className="">
                        {tableData.variables.map((v) => (
                          <td
                            key={v}
                            className="py-2 px-3 text-slate-900 text-center whitespace-nowrap"
                          >
                            {row[v]}
                          </td>
                        ))}
                        <td className="py-2 px-3 text-slate-800 text-center font-medium">
                          {row.result}
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
          {tableData.valid && !loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-3"
            >
              <Button
                size="lg"
                variant="secondary"
                onClick={handleCopy}
                className="cursor-pointer relative overflow-hidden"
              >
                {copied ? "Copied!" : "Copy Table"}
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

export default TruthTable
