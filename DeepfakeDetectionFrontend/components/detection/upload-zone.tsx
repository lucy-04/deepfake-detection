"use client"

import { useCallback, useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Upload, X, FileImage, FileVideo, FileAudio } from "lucide-react"

interface UploadZoneProps {
  mediaType: "image" | "video" | "audio"
  file: File | null
  onFileSelect: (file: File | null) => void
  disabled?: boolean
}

const acceptMap: Record<string, string> = {
  image: "image/png, image/jpeg, image/webp, image/gif",
  video: "video/mp4, video/webm, video/avi, video/mov",
  audio: "audio/mp3, audio/wav, audio/ogg, audio/mpeg, audio/flac",
}

const iconMap = {
  image: FileImage,
  video: FileVideo,
  audio: FileAudio,
}

export function UploadZone({ mediaType, file, onFileSelect, disabled }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const Icon = iconMap[mediaType]

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    if (!disabled) setIsDragging(true)
  }, [disabled])

  const handleDragLeave = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      if (disabled) return
      const dropped = e.dataTransfer.files[0]
      if (dropped) onFileSelect(dropped)
    },
    [disabled, onFileSelect]
  )

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selected = e.target.files?.[0]
      if (selected) onFileSelect(selected)
    },
    [onFileSelect]
  )

  const previewUrl = file && mediaType === "image" ? URL.createObjectURL(file) : null

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {!file ? (
          <motion.div
            key="dropzone"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            className={`relative flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed p-12 md:p-16 cursor-pointer transition-all duration-300 ${
              isDragging
                ? "border-primary bg-primary/5 glow-cyan"
                : "border-border/60 bg-card/30 hover:border-primary/40 hover:bg-card/50"
            } ${disabled ? "pointer-events-none opacity-50" : ""}`}
            role="button"
            tabIndex={0}
            aria-label={`Upload ${mediaType} file`}
          >
            <div className={`flex h-16 w-16 items-center justify-center rounded-2xl transition-colors ${
              isDragging ? "bg-primary/20" : "bg-secondary"
            }`}>
              <Upload className={`h-7 w-7 transition-colors ${isDragging ? "text-primary" : "text-muted-foreground"}`} />
            </div>
            <div className="flex flex-col items-center gap-1.5 text-center">
              <p className="text-sm font-medium text-foreground">
                {isDragging ? "Drop your file here" : "Drag & drop your file here"}
              </p>
              <p className="text-xs text-muted-foreground">
                or click to browse
              </p>
            </div>
            <div className="rounded-lg bg-secondary/60 px-3 py-1.5">
              <p className="text-xs text-muted-foreground font-mono">
                {mediaType === "image" && "PNG, JPG, WebP, GIF"}
                {mediaType === "video" && "MP4, WebM, AVI, MOV"}
                {mediaType === "audio" && "MP3, WAV, OGG, FLAC"}
              </p>
            </div>
            <input
              ref={inputRef}
              type="file"
              accept={acceptMap[mediaType]}
              onChange={handleInputChange}
              className="sr-only"
              aria-label={`Select ${mediaType} file`}
            />
          </motion.div>
        ) : (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="relative rounded-2xl border border-border/50 bg-card/50 backdrop-blur-xl overflow-hidden"
          >
            {/* Remove button */}
            <button
              onClick={() => onFileSelect(null)}
              disabled={disabled}
              className="absolute top-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-lg bg-background/80 backdrop-blur-sm border border-border/50 text-muted-foreground hover:text-foreground hover:bg-background transition-colors disabled:opacity-50"
              aria-label="Remove file"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Preview content */}
            <div className="p-6">
              {mediaType === "image" && previewUrl && (
                <div className="flex justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={previewUrl}
                    alt="Uploaded preview"
                    className="max-h-72 rounded-xl object-contain"
                  />
                </div>
              )}

              {mediaType === "video" && (
                <div className="flex justify-center">
                  <video
                    src={URL.createObjectURL(file)}
                    controls
                    className="max-h-72 rounded-xl"
                  />
                </div>
              )}

              {mediaType === "audio" && (
                <div className="flex flex-col items-center gap-4">
                  <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20">
                    <FileAudio className="h-10 w-10 text-primary" />
                  </div>
                  <audio
                    src={URL.createObjectURL(file)}
                    controls
                    className="w-full max-w-md"
                  />
                </div>
              )}

              {/* File info */}
              <div className="mt-4 flex items-center justify-center gap-3">
                <Icon className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground truncate max-w-xs">{file.name}</p>
                <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-md">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
