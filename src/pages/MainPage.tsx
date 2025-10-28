"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function MainPage() {
    return (
        <div className="flex justify-center items-center min-h-screen bg-linear-to-br from-blue-400 to-blue-800">
            <div className="w-full max-w-md space-y-3 p-6">
                <div className="space-y-1.5">
                    <h2 className="text-2xl font-semibold text-white">Boolean Solver</h2>
                    <p className="text-sm text-white/80">
                        Enter any equation involving boolean variables to evaluate its satisfiability.
                    </p>
                </div>
                <Input
                    type="text"
                    id="website"
                    placeholder="Enter boolean expression"
                    className="bg-white/90"
                />
                <div className="flex items-center justify-start gap-2 w-full">
                    <Button
                        type="submit"
                        className="cursor-pointer w-fit-content"
                    >
                        Evaluate
                    </Button>
                    <Button
                        type="button"
                        className="cursor-pointer w-fit-content"
                        onClick={() => console.log("Reset")}
                    >
                        Reset
                    </Button>
                </div>
            </div>
        </div>
    )
}
