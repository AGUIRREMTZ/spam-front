"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Hash } from "lucide-react"

interface WordImportanceProps {
  words: Array<{ word: string; weight: number }>
}

export default function WordImportance({ words }: WordImportanceProps) {
  if (!words || words.length === 0) {
    return null
  }

  const maxWeight = Math.max(...words.map((w) => Math.abs(w.weight)))

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Hash className="h-5 w-5" />
          Important Words
        </CardTitle>
        <CardDescription>Words with highest influence on the classification decision</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {words.map((item, index) => {
            const intensity = Math.abs(item.weight) / maxWeight
            const isSpamIndicator = item.weight > 0

            return (
              <Badge
                key={index}
                variant="secondary"
                className="text-sm px-3 py-1"
                style={{
                  backgroundColor: isSpamIndicator
                    ? `rgba(239, 68, 68, ${0.2 + intensity * 0.5})`
                    : `rgba(16, 185, 129, ${0.2 + intensity * 0.5})`,
                  color: isSpamIndicator ? "#991b1b" : "#065f46",
                  fontWeight: intensity > 0.7 ? "600" : "400",
                }}
              >
                {item.word}
                <span className="ml-1 text-xs opacity-70">
                  ({item.weight > 0 ? "+" : ""}
                  {item.weight.toFixed(2)})
                </span>
              </Badge>
            )
          })}
        </div>
        <div className="mt-4 p-3 bg-slate-50 rounded-lg">
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: "rgba(239, 68, 68, 0.6)" }}></div>
              <span className="text-slate-700">Spam indicators</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: "rgba(16, 185, 129, 0.6)" }}></div>
              <span className="text-slate-700">Ham indicators</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
