"use client"
import React from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

import { motion, AnimatePresence } from "framer-motion"

import { useExpressionStore } from "@/lib/store/expressionStore"

export default function MainPage() {

        const { expression, setExpression } = useExpressionStore()
        const buttonContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
            },
        },
    }
    const buttonItem = {
        hidden: { opacity: 0, y: -10 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    }

    const router = useRouter();


    return (
        <div className="flex justify-center items-center min-h-screen bg-linear-to-br from-blue-400 to-blue-800">
            <div className="w-full max-w-md space-y-3 p-6">
                <div className="space-y-1.5">
                    <h2 className="text-7xl font-semibold text-white font-script">LogiTrace</h2>
                    <p className="text-lg text-white/80">
                        Enter any equation involving boolean variables to evaluate its satisfiability.
                    </p>
                </div>
                <Input
                    type="text"
                    id="website"
                    placeholder="Enter boolean expression"
                    onChange={(e) => setExpression(e.target.value)}
                    value={expression}
                    className="bg-white/90"
                />
                <div className="h-10 flex items-center justify-start gap-2 w-full">
                    <AnimatePresence mode="wait">
                        {expression && (
                            <motion.div
                                key="buttons"
                                variants={buttonContainer}
                                initial="hidden"
                                animate="visible"
                                exit="hidden"
                                className="flex items-center justify-start gap-2 w-full"
                            >
                                <motion.div variants={buttonItem}>
                                    <Button size={"lg"} type="submit" className="cursor-pointer w-fit-content">
                                        Truth Table
                                    </Button>
                                </motion.div>

                                <motion.div variants={buttonItem}>
                                    <Button onClick={() => router.push("/pcnf")} size={"lg"} type="submit" className="cursor-pointer w-fit-content">
                                        Convert to PCNF
                                    </Button>
                                </motion.div>
                                
                                <motion.div variants={buttonItem}>
                                    <Button onClick={() => router.push("/pdnf")} size={"lg"} type="submit" className="cursor-pointer w-fit-content">
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
