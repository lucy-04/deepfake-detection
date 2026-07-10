"use client"

import { motion } from "framer-motion"
import { Shield, Brain, Gauge, Server, Database, Github, Mail } from "lucide-react"
import Link from "next/link"
import { MetricsSection } from "@/components/landing/metrics-section"

const steps = [
  {
    title: "Dataset",
    description:
      "Trained on the '140k Real and Fake Faces' dataset (real photos vs StyleGAN-generated faces), using its official train / validation / test splits.",
    icon: Database,
  },
  {
    title: "Fine-tuned ResNet18",
    description:
      "Started from a ResNet18 pretrained on ImageNet and replaced the final layer for two classes (real / fake). Light augmentation (flips, small rotations, colour jitter) helps it generalise.",
    icon: Brain,
  },
  {
    title: "FastAPI inference",
    description:
      "The trained model is served behind a FastAPI endpoint that accepts an image upload and returns a verdict, a confidence score and a risk level.",
    icon: Server,
  },
  {
    title: "Confidence + risk",
    description:
      "Rather than a bare yes/no, the API turns the softmax probability into a Low / Medium / High risk classification so the result is interpretable.",
    icon: Gauge,
  },
]

const limitations = [
  "Trained on a specific dataset of faces, so it's strongest on AI-generated faces and may be less reliable on other kinds of images.",
  "Heavy compression, resizing or unseen generators can reduce accuracy — like any single model, it isn't a guarantee.",
  "Image-only by design. Video and audio detection are out of scope for this project.",
]

export default function AboutPage() {
  return (
    <div className="relative min-h-[calc(100vh-4rem)]">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute left-1/2 top-1/4 h-[500px] w-[600px] -translate-x-1/2 rounded-full bg-primary/3 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-4xl px-4 py-16 lg:px-8 lg:py-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5">
            <Shield className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-medium text-primary">About this project</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-5xl text-balance">
            A defensible deepfake image detector
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg text-muted-foreground leading-relaxed">
            AI-generated imagery is getting hard to spot by eye. I wanted a tool that returns a
            defensible confidence score and a risk classification — not just a binary yes or no.
          </p>
        </motion.div>

        {/* The approach */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="rounded-2xl border border-primary/20 bg-primary/5 p-8 md:p-10 mb-16 text-center"
        >
          <h2 className="text-xl font-semibold text-foreground mb-4">The approach</h2>
          <p className="text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            I fine-tuned a ResNet18 on a labelled dataset of real and AI-generated images, then served
            it through a FastAPI inference endpoint with a React (Next.js) front-end for upload and
            results. I chose to fine-tune rather than train from scratch because transfer learning
            reaches strong accuracy with a modest dataset and far less compute.
          </p>
        </motion.div>

        {/* How it works */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="mb-4"
        >
          <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl text-center mb-10">
            How it works
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            {steps.map((step) => (
              <div
                key={step.title}
                className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-xl p-6"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 mb-4">
                  <step.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Metrics */}
        <MetricsSection />

        {/* Limitations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-xl p-8 mb-16"
        >
          <h2 className="text-lg font-semibold text-foreground mb-5">Honest limitations</h2>
          <ul className="flex flex-col gap-3">
            {limitations.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                <span className="text-sm text-muted-foreground leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Contact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col items-center gap-6 text-center"
        >
          <h2 className="text-lg font-semibold text-foreground">Built by Lakshay Tuteja</h2>
          <div className="flex gap-4">
            <a
              href="https://github.com/lucy-04/deepfake-detection"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-border/60 bg-secondary/50 px-5 py-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
            >
              <Github className="h-4 w-4" />
              GitHub
            </a>
            <a
              href="mailto:lakshay.tuteja004@gmail.com"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-all hover:brightness-110 hover:glow-cyan"
            >
              <Mail className="h-4 w-4" />
              Contact
            </a>
          </div>
          <Link
            href="/detect/image"
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            Or try the detector now
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
