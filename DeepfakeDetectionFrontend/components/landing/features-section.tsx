"use client"

import { motion } from "framer-motion"
import { Brain, Gauge, Zap } from "lucide-react"

const features = [
  {
    title: "Transfer Learning",
    description:
      "A ResNet18 pretrained on ImageNet, fine-tuned to separate real photos from AI-generated faces. Transfer learning gives strong accuracy without needing a huge dataset.",
    icon: Brain,
  },
  {
    title: "Confidence & Risk Scoring",
    description:
      "Instead of a bare yes/no, the model returns a softmax confidence and buckets it into a Low / Medium / High risk classification you can actually reason about.",
    icon: Gauge,
  },
  {
    title: "Fast Inference",
    description:
      "Served through a lightweight FastAPI endpoint. ResNet18 is small, so upload-to-result latency stays low — usually under a second.",
    icon: Zap,
  },
]

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

export function FeaturesSection() {
  return (
    <section id="features" className="relative py-20 md:py-28">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute left-1/2 top-0 h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-primary/3 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-14 text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl text-balance">
            Why DeepShield?
          </h2>
          <p className="mt-4 text-muted-foreground text-lg max-w-xl mx-auto">
            Built with the latest advances in deep learning and computer vision.
          </p>
        </motion.div>

        {/* Features grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid gap-6 md:grid-cols-3"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              className="relative flex flex-col gap-5 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-xl p-8"
            >
              {/* Decorative corner glow */}
              <div className="pointer-events-none absolute -top-px -left-px h-20 w-20 rounded-tl-2xl bg-primary/10 blur-xl" aria-hidden="true" />

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 border border-primary/20">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
