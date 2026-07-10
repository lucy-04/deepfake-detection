"use client"

import { AnimatedBackground } from "@/components/animated-background"
import { HeroSection } from "@/components/landing/hero-section"
import { DetectionCardsSection } from "@/components/landing/detection-cards-section"
import { MetricsSection } from "@/components/landing/metrics-section"
import { FeaturesSection } from "@/components/landing/features-section"

export default function HomePage() {
  return (
    <>
      <AnimatedBackground />
      <div className="relative z-10">
        <HeroSection />
        <DetectionCardsSection />
        <MetricsSection />
        <FeaturesSection />
      </div>
    </>
  )
}
