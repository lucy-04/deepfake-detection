"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ImageIcon, ArrowRight, ShieldCheck, Gauge, ScanFace } from "lucide-react"

const highlights = [
  { icon: ScanFace, text: "Detects AI-generated & manipulated faces" },
  { icon: Gauge, text: "Confidence score + risk classification" },
  { icon: ShieldCheck, text: "Your image is analyzed, never stored" },
]

export function DetectionCardsSection() {
  return (
    <section className="relative py-20 md:py-28">
      <div className="mx-auto max-w-3xl px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl text-balance">
            Image Deepfake Detection
          </h2>
          <p className="mt-4 text-muted-foreground text-lg max-w-xl mx-auto">
            Upload a photo and let the model check it for synthetic and manipulated signatures.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Link
            href="/detect/image"
            className="group relative flex flex-col gap-6 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-xl p-8 transition-all duration-300 hover:border-primary/30 hover:glow-cyan"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 transition-colors group-hover:bg-primary/20">
              <ImageIcon className="h-7 w-7 text-primary" />
            </div>

            <div className="flex flex-col gap-4">
              {highlights.map((h) => (
                <div key={h.text} className="flex items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <h.icon className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-sm text-muted-foreground">{h.text}</span>
                </div>
              ))}
            </div>

            <div className="mt-2 flex items-center gap-2 text-sm font-medium text-primary transition-all group-hover:translate-x-1">
              Analyze an image
              <ArrowRight className="h-4 w-4" />
            </div>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
