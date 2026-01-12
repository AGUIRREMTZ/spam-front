"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface ProbabilityBarChartProps {
  spamProbability: number
  hamProbability: number
}

export default function ProbabilityBarChart({ spamProbability, hamProbability }: ProbabilityBarChartProps) {
  const spamPercentage = (spamProbability * 100).toFixed(1)
  const hamPercentage = (hamProbability * 100).toFixed(1)

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Distribución de Probabilidades</CardTitle>
        <CardDescription>Porcentaje de Spam vs Ham detectado en este correo</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Spam Bar */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-700">SPAM</span>
              <span className="text-sm font-bold text-red-600">{spamPercentage}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-8 overflow-hidden">
              <div
                className="bg-gradient-to-r from-red-500 to-red-600 h-full rounded-full transition-all duration-1000 ease-out flex items-center justify-end pr-3"
                style={{ width: `${spamPercentage}%` }}
              >
                {spamProbability > 0.15 && <span className="text-white text-xs font-semibold">{spamPercentage}%</span>}
              </div>
            </div>
          </div>

          {/* Ham Bar */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-700">HAM (Legítimo)</span>
              <span className="text-sm font-bold text-green-600">{hamPercentage}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-8 overflow-hidden">
              <div
                className="bg-gradient-to-r from-green-500 to-green-600 h-full rounded-full transition-all duration-1000 ease-out flex items-center justify-end pr-3"
                style={{ width: `${hamPercentage}%` }}
              >
                {hamProbability > 0.15 && <span className="text-white text-xs font-semibold">{hamPercentage}%</span>}
              </div>
            </div>
          </div>

          {/* Visual comparison */}
          <div className="pt-4 border-t border-slate-200">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                <div className="text-3xl font-bold text-red-600">{spamPercentage}%</div>
                <div className="text-xs text-red-700 mt-1">Probabilidad SPAM</div>
              </div>
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="text-3xl font-bold text-green-600">{hamPercentage}%</div>
                <div className="text-xs text-green-700 mt-1">Probabilidad HAM</div>
              </div>
            </div>
          </div>

          {/* Interpretation */}
          <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded border border-slate-200">
            <p className="font-semibold mb-1">💡 Interpretación:</p>
            <p>
              {spamProbability > hamProbability
                ? `El modelo está ${spamPercentage}% seguro de que este correo es SPAM. `
                : `El modelo está ${hamPercentage}% seguro de que este correo es legítimo (HAM). `}
              {Math.abs(spamProbability - hamProbability) < 0.2
                ? "La diferencia es pequeña, lo que indica cierta incertidumbre en la clasificación."
                : "La diferencia es significativa, lo que indica alta confianza en la clasificación."}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
