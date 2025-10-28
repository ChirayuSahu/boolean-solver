"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

interface WebsiteInputProps {
    onEvaluate: (websiteName: string) => Promise<void>
}

export function WebsiteInput({ onEvaluate }: WebsiteInputProps) {
    const [websiteName, setWebsiteName] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!websiteName.trim()) return

        setIsLoading(true)
        try {
            await onEvaluate(websiteName)
        } catch (error) {
            console.error("Error evaluating website:", error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            <Input
                type="text"
                id="website"
                placeholder="Enter website name"
                value={websiteName}
                onChange={(e) => setWebsiteName(e.target.value)}
                className="bg-white/90"
                disabled={isLoading}
            />
            <Button
                type="submit"
                disabled={isLoading || !websiteName.trim()}
                className="min-w-[100px]"
            >
                {isLoading ? "Evaluating..." : "Evaluate"}
            </Button>
        </>
    )
}
