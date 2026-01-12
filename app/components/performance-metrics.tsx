"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, Target, AlertCircle, CheckCircle } from "lucide-react"

interface PerformanceMetricsProps {
  accuracy: number
  precision: number
  recall: number
  f1Score: number
  specificity?: number
}

export default function PerformanceMetrics({
  accuracy,
  precision,
  recall,
  f1Score,
  specificity,
}: PerformanceMetricsProps) {
  const metrics = [
    {
      name: "Precisión (Accuracy)",
      value: accuracy,
      icon: Target,
      description: "Exactitud general del modelo",
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      name: "Precisión (Precision)",
      value: precision,
      icon: CheckCircle,
      description: "Exactitud de las predicciones de spam",
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      name: "Exhaustividad (Recall)",
      value: recall,
      icon: AlertCircle,
      description: "Porcentaje de spam detectado",
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
    {
      name: "F1-Score",
      value: f1Score,
      icon: TrendingUp,
      description: "Balance entre precisión y exhaustividad",
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
  ]

  if (specificity !== undefined) {
    metrics.push({
      name: "Especificidad",
      value: specificity,
      icon: CheckCircle,
      description: "Porcentaje de ham identificado correctamente",
      color: "text-teal-600",
      bgColor: "bg-teal-100",
    })
  }

  const getScoreColor = (value: number) => {
    if (value >= 0.9) return "text-green-600"
    if (value >= 0.8) return "text-lime-600"
    if (value >= 0.7) return "text-yellow-600"
    if (value >= 0.6) return "text-orange-600"
    return "text-red-600"
  }

  const getProgressColor = (value: number) => {
    if (value >= 0.9) return "bg-green-500"
    if (value >= 0.8) return "bg-lime-500"
    if (value >= 0.7) return "bg-yellow-500"
    if (value >= 0.6) return "bg-orange-500"
    return "bg-red-500"
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Métricas de Rendimiento</CardTitle>
        <CardDescription>Evaluación del modelo en el conjunto de prueba</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {metrics.map((metric) => {
            const Icon = metric.icon
            const percentage = metric.value * 100

            return (
              <div key={metric.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                      <Icon className={`h-5 w-5 ${metric.color}`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">{metric.name}</h3>
                      <p className="text-xs text-slate-500">{metric.description}</p>
                    </div>
                  </div>
                  <div className={`text-2xl font-bold ${getScoreColor(metric.value)}`}>{percentage.toFixed(1)}%</div>
                </div>
                <div className="relative">
                  <Progress value={percentage} className="h-3" />
                  <div
                    className={`absolute inset-0 h-3 rounded-full transition-all ${getProgressColor(metric.value)}`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-6 pt-6 border-t border-slate-200">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-1">
              <h4 className="font-semibold text-slate-700">¿Qué es el F1-Score?</h4>
              <p className="text-slate-600">
                Media armónica entre precisión y exhaustividad. Un F1-score alto indica que el modelo es preciso y
                confiable.
              </p>
            </div>
            <div className="space-y-1">
              <h4 className="font-semibold text-slate-700">Por qué importa</h4>
              <p className="text-slate-600">
                Valores más altos significan menos correos legítimos en la carpeta de spam y menos spam en tu bandeja de
                entrada.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
