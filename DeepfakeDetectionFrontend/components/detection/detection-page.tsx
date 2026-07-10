"use client"

import { useState, useCallback } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowLeft, Shield, Zap } from "lucide-react"
import { UploadZone } from "./upload-zone"
import { AnalysisProgress } from "./analysis-progress"
import { ResultCard } from "./result-card"
import { analyzeDeepfake, type AnalysisResult } from "@/lib/api"

interface DetectionPageProps {
  mediaType: "image" | "video" | "audio"
  title: string
  description: string
}

type Phase = "upload" | "analyzing" | "result"

export function DetectionPage({ mediaType, title, description }: DetectionPageProps) {
  const [file, setFile] = useState<File | null>(null)
  const [phase, setPhase] = useState<Phase>("upload")
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)

  const handleFileSelect = useCallback((f: File | null) => {
    setFile(f)
    if (f) {
      // Simulate upload progress
      setUploadProgress(0)
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval)
            return 100
          }
          return prev + Math.random() * 15 + 5
        })
      }, 100)
    } else {
      setUploadProgress(0)
    }
  }, [])

  const handleCheck = useCallback(async () => {
  if (!file) {
    console.error("No file selected")
    return
  }

  setPhase("analyzing")
  try {
    const analysisResult = await analyzeDeepfake(file, mediaType)
    setResult(analysisResult)
    setPhase("result")
  } catch (error) {
    console.error("Error:", error)
    setPhase("upload")
  }
}, [file, mediaType])

  const handleReset = useCallback(() => {
    setFile(null)
    setResult(null)
    setPhase("upload")
    setUploadProgress(0)
  }, [])

  return (
    <div className="relative min-h-[calc(100vh-4rem)]">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute left-1/2 top-0 h-[500px] w-[600px] -translate-x-1/2 rounded-full bg-primary/3 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-3xl px-4 py-12 lg:px-8 lg:py-16">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>

          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 border border-primary/20">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground md:text-3xl">{title}</h1>
          </div>
          <p className="text-muted-foreground leading-relaxed">{description}</p>
        </motion.div>

        {/* Upload Phase */}
        {phase === "upload" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-6"
          >
            <UploadZone
              mediaType={mediaType}
              file={file}
              onFileSelect={handleFileSelect}
            />

            {/* Upload progress bar */}
            {file && uploadProgress < 100 && (
              <div className="w-full">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-muted-foreground">Uploading...</span>
                  <span className="text-xs font-mono text-primary">{Math.min(Math.round(uploadProgress), 100)}%</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-secondary overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-primary"
                    initial={{ width: "0%" }}
                    animate={{ width: `${Math.min(uploadProgress, 100)}%` }}
                    transition={{ duration: 0.2 }}
                  />
                </div>
              </div>
            )}

            {/* Check button */}
            <motion.button
              onClick={handleCheck}
              disabled={!file || uploadProgress < 100}
              className="group relative w-full rounded-2xl py-4 text-sm font-bold uppercase tracking-wider transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              whileHover={file && uploadProgress >= 100 ? { scale: 1.01 } : {}}
              whileTap={file && uploadProgress >= 100 ? { scale: 0.99 } : {}}
            >
              {/* Animated border */}
              <div className="absolute inset-0 rounded-2xl bg-primary/80 transition-all group-hover:glow-cyan group-disabled:bg-secondary" />
              <div className="absolute inset-[1px] rounded-2xl bg-background" />
              <span className="relative flex items-center justify-center gap-2 text-primary group-disabled:text-muted-foreground">
                <Zap className="h-4 w-4" />
                Check for Deepfake
              </span>
            </motion.button>
          </motion.div>
        )}

        {/* Analyzing Phase */}
        {phase === "analyzing" && <AnalysisProgress />}

        {/* Result Phase */}
        {phase === "result" && result && (
          <ResultCard result={result} onReset={handleReset} />
        )}
      </div>
    </div>
  )
}
