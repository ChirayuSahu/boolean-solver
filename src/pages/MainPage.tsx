"use client"
import React from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { useExpressionStore } from "@/lib/store/expressionStore"

export default function MainPage() {
    const { expression, setExpression } = useExpressionStore()
    const router = useRouter()

    const buttonContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15 },
        },
    }

    const buttonItem = {
        hidden: { opacity: 0, y: -10 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-linear-to-br from-blue-400 to-blue-800 px-4 sm:px-6">
            <div className="w-full max-w-lg space-y-6 p-6">
                {/* Header */}
                <div className="space-y-2 text-center sm:text-left">
                    <h2 className="text-5xl sm:text-6xl md:text-7xl font-semibold text-white font-script tracking-tight">
                        LogiTrace
                    </h2>
                    <p className="text-base sm:text-lg text-white/80 leading-snug">
                        Enter any Boolean expression to analyze or convert into canonical forms.
                    </p>
                </div>

                {/* Input */}
                <Input
                    type="text"
                    placeholder="Enter Boolean expression (e.g., (A ∨ ¬B) ∧ C)"
                    onChange={(e) => setExpression(e.target.value)}
                    value={expression}
                    className="bg-white/90 text-slate-900 text-base sm:text-lg rounded-md p-3 w-full"
                />

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row sm:flex-wrap items-center justify-start gap-3 w-full">
                    <AnimatePresence mode="wait">
                        {expression && (
                            <motion.div
                                key="buttons"
                                variants={buttonContainer}
                                initial="hidden"
                                animate="visible"
                                exit="hidden"
                                className="flex flex-row flex-wrap gap-3 w-full justify-start"
                            >
                                <motion.div variants={buttonItem} className="w-full sm:w-auto">
                                    <Button
                                        size="lg"
                                        className="w-full sm:w-auto text-base px-6"
                                    >
                                        Truth Table
                                    </Button>
                                </motion.div>

                                <motion.div variants={buttonItem} className="w-full sm:w-auto">
                                    <Button
                                        onClick={() => router.push("/pcnf")}
                                        size="lg"
                                        className="w-full sm:w-auto text-base px-6"
                                    >
                                        Convert to PCNF
                                    </Button>
                                </motion.div>

                                <motion.div variants={buttonItem} className="w-full sm:w-auto">
                                    <Button
                                        onClick={() => router.push("/pdnf")}
                                        size="lg"
                                        className="w-full sm:w-auto text-base px-6"
                                    >
                                        Convert to PDNF
                                    </Button>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    )
}
