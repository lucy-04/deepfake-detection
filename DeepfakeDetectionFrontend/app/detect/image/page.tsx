"use client"

import { DetectionPage } from "@/components/detection/detection-page"

export default function ImageDetectionPage() {
  return (
    <DetectionPage
      mediaType="image"
      title="Image Deepfake Detection"
      description="Upload an image to analyze it for AI-generated manipulations, face swaps, GAN artifacts, and other synthetic signatures."
    />
  )
}
