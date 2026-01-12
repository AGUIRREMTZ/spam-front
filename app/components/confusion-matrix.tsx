"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface ConfusionMatrixProps {
  trueNegative: number
  falsePositive: number
  falseNegative: number
  truePositive: number
}

export default function ConfusionMatrix({
  trueNegative,
  falsePositive,
  falseNegative,
  truePositive,
}: ConfusionMatrixProps) {
  const total = trueNegative + falsePositive + falseNegative + truePositive

  const getPercentage = (value: number) => {
    if (total === 0) return "0.0"
    return ((value / total) * 100).toFixed(1)
  }

  const getCellColor = (value: number, isCorrect: boolean) => {
    if (total === 0) return "bg-slate-100"
    const percentage = (value / total) * 100

    if (isCorrect) {
      // Green shades for correct predictions
      if (percentage > 40) return "bg-green-100 border-green-300"
      if (percentage > 20) return "bg-green-50 border-green-200"
      return "bg-green-50 border-green-100"
    } else {
      // Red shades for incorrect predictions
      if (percentage > 10) return "bg-red-100 border-red-300"
      if (percentage > 5) return "bg-red-50 border-red-200"
      return "bg-slate-50 border-slate-200"
    }
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Confusion Matrix</CardTitle>
        <CardDescription>Model classification performance breakdown</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-2 max-w-2xl mx-auto">
            {/* Header row */}
            <div className=""></div>
            <div className="text-center font-semibold text-sm p-2">
              <div className="text-slate-700">Predicted</div>
              <div className="text-green-600">HAM</div>
            </div>
            <div className="text-center font-semibold text-sm p-2">
              <div className="text-slate-700">Predicted</div>
              <div className="text-red-600">SPAM</div>
            </div>

            {/* First data row */}
            <div className="flex items-center justify-end font-semibold text-sm pr-2">
              <div className="text-right">
                <div className="text-slate-700">Actual</div>
                <div className="text-green-600">HAM</div>
              </div>
            </div>
            <div
              className={cn("border-2 rounded-lg p-4 text-center transition-colors", getCellColor(trueNegative, true))}
            >
              <div className="text-2xl font-bold text-slate-900">{trueNegative.toLocaleString()}</div>
              <div className="text-xs text-slate-600 mt-1">True Negative</div>
              <div className="text-xs font-semibold text-green-700 mt-1">{getPercentage(trueNegative)}%</div>
            </div>
            <div
              className={cn(
                "border-2 rounded-lg p-4 text-center transition-colors",
                getCellColor(falsePositive, false),
              )}
            >
              <div className="text-2xl font-bold text-slate-900">{falsePositive.toLocaleString()}</div>
              <div className="text-xs text-slate-600 mt-1">False Positive</div>
              <div className="text-xs font-semibold text-red-700 mt-1">{getPercentage(falsePositive)}%</div>
            </div>

            {/* Second data row */}
            <div className="flex items-center justify-end font-semibold text-sm pr-2">
              <div className="text-right">
                <div className="text-slate-700">Actual</div>
                <div className="text-red-600">SPAM</div>
              </div>
            </div>
            <div
              className={cn(
                "border-2 rounded-lg p-4 text-center transition-colors",
                getCellColor(falseNegative, false),
              )}
            >
              <div className="text-2xl font-bold text-slate-900">{falseNegative.toLocaleString()}</div>
              <div className="text-xs text-slate-600 mt-1">False Negative</div>
              <div className="text-xs font-semibold text-red-700 mt-1">{getPercentage(falseNegative)}%</div>
            </div>
            <div
              className={cn("border-2 rounded-lg p-4 text-center transition-colors", getCellColor(truePositive, true))}
            >
              <div className="text-2xl font-bold text-slate-900">{truePositive.toLocaleString()}</div>
              <div className="text-xs text-slate-600 mt-1">True Positive</div>
              <div className="text-xs font-semibold text-green-700 mt-1">{getPercentage(truePositive)}%</div>
            </div>
          </div>

          <div className="border-t pt-4 mt-4">
            <div className="grid grid-cols-2 gap-4 text-sm text-slate-600">
              <div>
                <span className="font-semibold text-green-700">True Negative (TN):</span> Legitimate emails correctly
                identified
              </div>
              <div>
                <span className="font-semibold text-red-700">False Positive (FP):</span> Legitimate emails incorrectly
                marked as spam
              </div>
              <div>
                <span className="font-semibold text-red-700">False Negative (FN):</span> Spam emails that passed through
              </div>
              <div>
                <span className="font-semibold text-green-700">True Positive (TP):</span> Spam emails correctly
                identified
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
