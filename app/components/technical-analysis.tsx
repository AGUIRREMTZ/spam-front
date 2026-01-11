"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, TrendingUp } from "lucide-react"

export default function TechnicalAnalysis() {
  // Mock data based on the evaluation metrics from the Jupyter notebooks
  const metrics = {
    accuracy: 0.9801,
    precision: 0.9798,
    recall: 0.9585,
    f1Score: 0.9691,
    confusionMatrix: {
      truePositive: 11886,
      falsePositive: 249,
      falseNegative: 517,
      trueNegative: 12543,
    },
  }

  const total =
    metrics.confusionMatrix.truePositive +
    metrics.confusionMatrix.falsePositive +
    metrics.confusionMatrix.falseNegative +
    metrics.confusionMatrix.trueNegative

  return (
    <Card className="shadow-lg mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Technical Analysis
        </CardTitle>
        <CardDescription>Model performance metrics and reliability information</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Performance Metrics */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-blue-600" />
              Performance Metrics
            </h3>
            <div className="space-y-3">
              <MetricBar label="Accuracy" value={metrics.accuracy} color="blue" />
              <MetricBar label="Precision" value={metrics.precision} color="green" />
              <MetricBar label="Recall" value={metrics.recall} color="purple" />
              <MetricBar label="F1-Score" value={metrics.f1Score} color="indigo" />
            </div>
          </div>

          {/* Confusion Matrix */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Confusion Matrix</h3>
            <div className="bg-slate-50 p-4 rounded-lg">
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-green-100 p-4 rounded text-center border-2 border-green-300">
                  <div className="text-2xl font-bold text-green-800">
                    {metrics.confusionMatrix.trueNegative.toLocaleString()}
                  </div>
                  <div className="text-xs text-green-700 mt-1">True Negatives</div>
                  <div className="text-xs text-green-600">
                    {((metrics.confusionMatrix.trueNegative / total) * 100).toFixed(1)}%
                  </div>
                </div>
                <div className="bg-red-100 p-4 rounded text-center border-2 border-red-300">
                  <div className="text-2xl font-bold text-red-800">
                    {metrics.confusionMatrix.falsePositive.toLocaleString()}
                  </div>
                  <div className="text-xs text-red-700 mt-1">False Positives</div>
                  <div className="text-xs text-red-600">
                    {((metrics.confusionMatrix.falsePositive / total) * 100).toFixed(1)}%
                  </div>
                </div>
                <div className="bg-red-100 p-4 rounded text-center border-2 border-red-300">
                  <div className="text-2xl font-bold text-red-800">
                    {metrics.confusionMatrix.falseNegative.toLocaleString()}
                  </div>
                  <div className="text-xs text-red-700 mt-1">False Negatives</div>
                  <div className="text-xs text-red-600">
                    {((metrics.confusionMatrix.falseNegative / total) * 100).toFixed(1)}%
                  </div>
                </div>
                <div className="bg-green-100 p-4 rounded text-center border-2 border-green-300">
                  <div className="text-2xl font-bold text-green-800">
                    {metrics.confusionMatrix.truePositive.toLocaleString()}
                  </div>
                  <div className="text-xs text-green-700 mt-1">True Positives</div>
                  <div className="text-xs text-green-600">
                    {((metrics.confusionMatrix.truePositive / total) * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function MetricBar({ label, value, color }: { label: string; value: number; color: string }) {
  const percentage = Math.round(value * 100)
  const colorClasses = {
    blue: "bg-blue-500",
    green: "bg-green-500",
    purple: "bg-purple-500",
    indigo: "bg-indigo-500",
  }

  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium text-slate-700">{label}</span>
        <span className="text-sm font-semibold text-slate-900">{percentage}%</span>
      </div>
      <div className="w-full bg-slate-200 rounded-full h-2.5">
        <div
          className={`h-2.5 rounded-full ${colorClasses[color as keyof typeof colorClasses]} transition-all duration-1000`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  )
}
