"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { ScanEye } from "lucide-react"

export function AnalysisProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval)
          return 95
        }
        return prev + Math.random() * 8 + 2
      })
    }, 200)

    return () => clearInterval(interval)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center gap-8 py-12"
    >
      {/* Scanning animation */}
      <div className="relative">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="flex h-24 w-24 items-center justify-center rounded-full border-2 border-primary/30"
        >
          <div className="absolute h-full w-full rounded-full border-t-2 border-primary" />
          <ScanEye className="h-10 w-10 text-primary animate-pulse-glow" />
        </motion.div>
      </div>

      {/* Status text */}
      <div className="flex flex-col items-center gap-2 text-center">
        <p className="text-lg font-semibold text-foreground">Analyzing media using AI neural networks...</p>
        <p className="text-sm text-muted-foreground">Running multi-layer detection algorithms</p>
      </div>

      {/* Progress bar */}
      <div className="w-full max-w-md">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-muted-foreground">Analysis Progress</span>
          <span className="text-xs font-mono text-primary">{Math.min(Math.round(progress), 95)}%</span>
        </div>
        <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-primary"
            initial={{ width: "0%" }}
            animate={{ width: `${Math.min(progress, 95)}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Grid animation */}
      <div className="grid grid-cols-8 gap-1" aria-hidden="true">
        {Array.from({ length: 32 }).map((_, i) => (
          <motion.div
            key={i}
            className="h-2 w-2 rounded-sm bg-primary/20"
            animate={{
              opacity: [0.2, 1, 0.2],
              backgroundColor: [
                "hsl(185 80% 55% / 0.2)",
                "hsl(185 80% 55% / 0.6)",
                "hsl(185 80% 55% / 0.2)",
              ],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.05,
            }}
          />
        ))}
      </div>
    </motion.div>
  )
}
