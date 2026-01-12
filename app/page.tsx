"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, Mail, AlertTriangle, CheckCircle2, Loader2, BarChart3 } from "lucide-react"
import GaugeChart from "./components/gauge-chart"
import WordImportance from "./components/word-importance"
import ConfusionMatrix from "./components/confusion-matrix"
import PerformanceMetrics from "./components/performance-metrics"
import ProbabilityBarChart from "./components/probability-bar-chart"

export default function SpamDetector() {
  const [emailContent, setEmailContent] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState("")
  const [modelMetrics, setModelMetrics] = useState<any>(null)
  const [showMetrics, setShowMetrics] = useState(false)

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://your-render-backend.onrender.com"

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch(`${API_URL}/api/metrics`)
        if (response.ok) {
          const data = await response.json()
          setModelMetrics(data)
        }
      } catch (err) {
        console.log("Could not load model metrics:", err)
      }
    }
    fetchMetrics()
  }, [API_URL])

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      const text = await file.text()
      setEmailContent(text)
      setError("")
    } catch (err) {
      setError("Error reading file. Please try again.")
    }
  }

  const analyzeEmail = async () => {
    if (!emailContent.trim()) {
      setError("Please provide email content to analyze")
      return
    }

    setLoading(true)
    setError("")
    setResult(null)

    try {
      const response = await fetch(`${API_URL}/api/predict`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email_content: emailContent,
        }),
      })

      if (!response.ok) {
        throw new Error(`Server error: ${response.statusText}`)
      }

      const data = await response.json()
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to analyze email. Please check your connection.")
    } finally {
      setLoading(false)
    }
  }

  const spamProbability = result?.spam_probability ?? 0
  const hamProbability = 1 - spamProbability
  const isSpam = spamProbability > 0.5

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Mail className="h-12 w-12 text-blue-600" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Detector de Spam
            </h1>
          </div>
          <p className="text-slate-600 text-lg">Análisis avanzado de correos electrónicos usando Machine Learning</p>

          {modelMetrics && (
            <Button variant="outline" onClick={() => setShowMetrics(!showMetrics)} className="mt-4">
              <BarChart3 className="mr-2 h-4 w-4" />
              {showMetrics ? "Ocultar" : "Ver"} Rendimiento del Modelo
            </Button>
          )}
        </div>

        {showMetrics && modelMetrics && (
          <div className="mb-8 space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {modelMetrics.confusion_matrix && (
                <ConfusionMatrix
                  trueNegative={modelMetrics.confusion_matrix.true_negative}
                  falsePositive={modelMetrics.confusion_matrix.false_positive}
                  falseNegative={modelMetrics.confusion_matrix.false_negative}
                  truePositive={modelMetrics.confusion_matrix.true_positive}
                />
              )}
              {modelMetrics.performance_metrics && (
                <PerformanceMetrics
                  accuracy={modelMetrics.performance_metrics.accuracy}
                  precision={modelMetrics.performance_metrics.precision}
                  recall={modelMetrics.performance_metrics.recall}
                  f1Score={modelMetrics.performance_metrics.f1_score}
                  specificity={modelMetrics.performance_metrics.specificity}
                />
              )}
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          {/* Input Section */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Entrada de Correo
              </CardTitle>
              <CardDescription>Sube un archivo de correo o pega el contenido del correo</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label htmlFor="file-upload" className="cursor-pointer">
                  <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 hover:border-blue-500 transition-colors text-center">
                    <Upload className="h-10 w-10 mx-auto mb-2 text-slate-400" />
                    <p className="text-sm text-slate-600">Haz clic para subir archivo de correo (.txt, .eml)</p>
                  </div>
                  <input
                    id="file-upload"
                    type="file"
                    accept=".txt,.eml"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                </label>
              </div>

              <div className="relative">
                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center">
                  <div className="flex-1 border-t border-slate-300"></div>
                  <span className="px-3 text-sm text-slate-500 bg-white">o pega el contenido</span>
                  <div className="flex-1 border-t border-slate-300"></div>
                </div>
              </div>

              <Textarea
                placeholder="Pega el contenido del correo aquí..."
                value={emailContent}
                onChange={(e) => setEmailContent(e.target.value)}
                className="min-h-[200px] font-mono text-sm"
              />

              <Button onClick={analyzeEmail} disabled={loading || !emailContent.trim()} className="w-full" size="lg">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analizando...
                  </>
                ) : (
                  <>
                    <Mail className="mr-2 h-4 w-4" />
                    Analizar Correo
                  </>
                )}
              </Button>

              {error && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Result Section */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {result &&
                  (isSpam ? (
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                  ) : (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  ))}
                Resultado de Detección
              </CardTitle>
              <CardDescription>Probabilidad de spam y nivel de confianza</CardDescription>
            </CardHeader>
            <CardContent>
              {!result ? (
                <div className="flex flex-col items-center justify-center h-[300px] text-center">
                  <Mail className="h-16 w-16 text-slate-300 mb-4" />
                  <p className="text-slate-500">Sube o pega un correo para ver los resultados del análisis</p>
                </div>
              ) : (
                <div className="space-y-6">
                  <GaugeChart probability={spamProbability} />

                  <Alert className={isSpam ? "border-red-500 bg-red-50" : "border-green-500 bg-green-50"}>
                    <div className="flex items-center gap-3">
                      {isSpam ? (
                        <AlertTriangle className="h-5 w-5 text-red-600" />
                      ) : (
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                      )}
                      <div className="flex-1">
                        <h3 className={`font-semibold ${isSpam ? "text-red-900" : "text-green-900"}`}>
                          {isSpam ? "SPAM Detectado" : "Correo Legítimo (HAM)"}
                        </h3>
                        <p className={`text-sm ${isSpam ? "text-red-700" : "text-green-700"}`}>
                          {isSpam
                            ? `Este correo tiene un ${(spamProbability * 100).toFixed(1)}% de probabilidad de ser spam`
                            : `Este correo tiene un ${((1 - spamProbability) * 100).toFixed(1)}% de probabilidad de ser legítimo`}
                        </p>
                      </div>
                    </div>
                  </Alert>

                  {result.model_info && (
                    <div className="text-xs text-slate-600 bg-slate-50 p-4 rounded border border-slate-200 space-y-2">
                      <h4 className="font-semibold text-sm text-slate-800 mb-2">Información del Modelo</h4>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <span className="font-medium">Tipo de Modelo:</span> {result.model_info.model_type}
                        </div>
                        <div>
                          <span className="font-medium">Características:</span>{" "}
                          {result.model_info.n_features.toLocaleString()}
                        </div>
                        <div>
                          <span className="font-medium">Clases:</span> {result.model_info.classes.join(", ")}
                        </div>
                        <div>
                          <span className="font-medium">Tokens Procesados:</span>{" "}
                          {result.parsed_tokens_count.subject + result.parsed_tokens_count.body}
                        </div>
                      </div>
                      <div className="mt-2 pt-2 border-t border-slate-200">
                        <div>
                          <span className="font-medium">Probabilidad de Spam:</span>{" "}
                          {(spamProbability * 100).toFixed(2)}%
                        </div>
                        <div>
                          <span className="font-medium">Probabilidad de Ham:</span>{" "}
                          {((1 - spamProbability) * 100).toFixed(2)}%
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Analysis Details */}
        {result && (
          <>
            <div className="grid lg:grid-cols-2 gap-6 mb-6">
              <ProbabilityBarChart spamProbability={spamProbability} hamProbability={hamProbability} />
              <WordImportance words={result.important_words || []} />
            </div>
          </>
        )}
      </div>
    </div>
  )
}
