"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, Mail, AlertTriangle, CheckCircle2, Loader2 } from "lucide-react"
import GaugeChart from "./components/gauge-chart"
import TechnicalAnalysis from "./components/technical-analysis"
import WordImportance from "./components/word-importance"

export default function SpamDetector() {
  const [emailContent, setEmailContent] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState("")

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://your-render-backend.onrender.com"

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

  const isSpam = result?.prediction === "spam" || result?.prediction === "1"
  const spamProbability = result?.spam_probability || 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Mail className="h-12 w-12 text-blue-600" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Spam Detector
            </h1>
          </div>
          <p className="text-slate-600 text-lg">Advanced email analysis using Machine Learning</p>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          {/* Input Section */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Email Input
              </CardTitle>
              <CardDescription>Upload an email file or paste the email content</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label htmlFor="file-upload" className="cursor-pointer">
                  <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 hover:border-blue-500 transition-colors text-center">
                    <Upload className="h-10 w-10 mx-auto mb-2 text-slate-400" />
                    <p className="text-sm text-slate-600">Click to upload email file (.txt, .eml)</p>
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
                  <span className="px-3 text-sm text-slate-500 bg-white">or paste content</span>
                  <div className="flex-1 border-t border-slate-300"></div>
                </div>
              </div>

              <Textarea
                placeholder="Paste email content here..."
                value={emailContent}
                onChange={(e) => setEmailContent(e.target.value)}
                className="min-h-[200px] font-mono text-sm"
              />

              <Button onClick={analyzeEmail} disabled={loading || !emailContent.trim()} className="w-full" size="lg">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Mail className="mr-2 h-4 w-4" />
                    Analyze Email
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
                Detection Result
              </CardTitle>
              <CardDescription>Spam probability and confidence level</CardDescription>
            </CardHeader>
            <CardContent>
              {!result ? (
                <div className="flex flex-col items-center justify-center h-[300px] text-center">
                  <Mail className="h-16 w-16 text-slate-300 mb-4" />
                  <p className="text-slate-500">Upload or paste an email to see analysis results</p>
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
                          {isSpam ? "SPAM Detected" : "Legitimate Email (HAM)"}
                        </h3>
                        <p className={`text-sm ${isSpam ? "text-red-700" : "text-green-700"}`}>
                          Confidence: {(spamProbability * 100).toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  </Alert>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Analysis Details */}
        {result && (
          <>
            <TechnicalAnalysis />
            <WordImportance words={result.important_words || []} />
          </>
        )}
      </div>
    </div>
  )
}
