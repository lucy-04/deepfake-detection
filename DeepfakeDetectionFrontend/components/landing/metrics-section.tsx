"use client"

import { motion } from "framer-motion"

// Real numbers from evaluate.py on the held-out test split (4,000 images,
// xhlulu/140k-real-and-fake-faces). Hardcoded so the page always shows them,
// even when the backend demo is asleep.
const metrics = [
  { label: "Accuracy", value: "97.9%" },
  { label: "Precision", value: "98.5%" },
  { label: "Recall", value: "97.2%" },
  { label: "F1 Score", value: "97.8%" },
]

export function MetricsSection() {
  return (
    <section className="relative py-20 md:py-28">
      <div className="mx-auto max-w-5xl px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl text-balance">
            How accurate is it?
          </h2>
          <p className="mt-4 text-muted-foreground text-lg max-w-xl mx-auto">
            Measured on 4,000 held-out test images the model never saw during training.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-2 gap-4 md:grid-cols-4"
        >
          {metrics.map((m) => (
            <div
              key={m.label}
              className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-xl p-6 text-center"
            >
              <p className="font-mono text-3xl font-bold text-primary md:text-4xl">{m.value}</p>
              <p className="mt-2 text-xs uppercase tracking-wider text-muted-foreground">{m.label}</p>
            </div>
          ))}
        </motion.div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Out of 4,000 test images: 55 fakes missed and 30 false alarms.
        </p>
      </div>
    </section>
  )
}
