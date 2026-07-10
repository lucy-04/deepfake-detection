"use client"

import { motion } from "framer-motion"
import { CheckCircle2, XCircle, AlertTriangle, Download, RotateCcw } from "lucide-react"
import type { AnalysisResult } from "@/lib/api"

interface ResultCardProps {
  result: AnalysisResult
  onReset: () => void
}

export function ResultCard({ result, onReset }: ResultCardProps) {
  const isReal = result.verdict === "ORIGINAL"

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col gap-8"
    >
      {/* Verdict Card */}
      <div
        className={`relative rounded-2xl border p-8 backdrop-blur-xl overflow-hidden ${
          isReal
            ? "border-success/30 bg-success/5 glow-green"
            : "border-destructive/30 bg-destructive/5 glow-red"
        }`}
      >
        <div className="flex flex-col items-center gap-6 text-center">
          {/* Verdict Badge */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
            className={`flex h-20 w-20 items-center justify-center rounded-full ${
              isReal ? "bg-success/20" : "bg-destructive/20"
            }`}
          >
            {isReal ? (
              <CheckCircle2 className="h-10 w-10 text-success" />
            ) : (
              <XCircle className="h-10 w-10 text-destructive" />
            )}
          </motion.div>

          <div className="flex flex-col gap-2">
            <motion.h3
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className={`text-3xl font-bold ${isReal ? "text-success" : "text-destructive"}`}
            >
              {result.verdict}
            </motion.h3>
            <p className="text-sm text-muted-foreground">
              {isReal
                ? "This media appears to be authentic"
                : "This media shows signs of manipulation"}
            </p>
          </div>

          {/* Confidence Circle */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="relative flex h-32 w-32 items-center justify-center"
          >
            <svg className="absolute h-full w-full -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke="hsl(var(--secondary))"
                strokeWidth="6"
              />
              <motion.circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke={isReal ? "hsl(var(--success))" : "hsl(var(--destructive))"}
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 42}`}
                initial={{ strokeDashoffset: 2 * Math.PI * 42 }}
                animate={{
                  strokeDashoffset: 2 * Math.PI * 42 * (1 - result.confidence / 100),
                }}
                transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
              />
            </svg>
            <div className="flex flex-col items-center">
              <span className={`text-2xl font-bold ${isReal ? "text-success" : "text-destructive"}`}>
                {result.confidence}%
              </span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Confidence</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Analysis Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-xl p-6"
      >
        <h4 className="text-lg font-semibold text-foreground mb-6">AI Analysis Breakdown</h4>

        <div className="flex flex-col gap-4">
          {result.breakdown.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 + index * 0.1 }}
              className="flex items-start gap-3 rounded-xl bg-secondary/30 p-4"
            >
              <div className="mt-0.5">
                {item.detected ? (
                  <AlertTriangle className="h-4 w-4 text-destructive" />
                ) : (
                  <CheckCircle2 className="h-4 w-4 text-success" />
                )}
              </div>
              <div className="flex flex-col gap-1 flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">{item.label}</span>
                  <span
                    className={`text-xs font-mono px-2 py-0.5 rounded ${
                      item.detected
                        ? "bg-destructive/10 text-destructive"
                        : "bg-success/10 text-success"
                    }`}
                  >
                    {item.detected ? "DETECTED" : "CLEAR"}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{item.detail}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Risk Level */}
        <div className="mt-6 flex items-center justify-between rounded-xl bg-secondary/30 p-4">
          <span className="text-sm font-medium text-foreground">Risk Level</span>
          <span
            className={`text-sm font-semibold px-3 py-1 rounded-lg ${
              result.riskLevel === "High"
                ? "bg-destructive/10 text-destructive"
                : result.riskLevel === "Medium"
                ? "bg-chart-4/10 text-chart-4"
                : "bg-success/10 text-success"
            }`}
          >
            {result.riskLevel}
          </span>
        </div>

        {/* Analysis time */}
        <p className="mt-4 text-xs text-muted-foreground text-center">
          Analysis completed in {result.analysisTime}
        </p>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="flex flex-col gap-3 sm:flex-row sm:justify-center"
      >
        <button
          onClick={onReset}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-border/60 bg-secondary/50 px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
        >
          <RotateCcw className="h-4 w-4" />
          Analyze Another
        </button>
        <button
          onClick={() => {
            // Mock download
            const blob = new Blob([JSON.stringify(result, null, 2)], { type: "application/json" })
            const url = URL.createObjectURL(blob)
            const a = document.createElement("a")
            a.href = url
            a.download = `deepshield-report-${Date.now()}.json`
            a.click()
            URL.revokeObjectURL(url)
          }}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-all hover:brightness-110 hover:glow-cyan"
        >
          <Download className="h-4 w-4" />
          Download Report
        </button>
      </motion.div>
    </motion.div>
  )
}
