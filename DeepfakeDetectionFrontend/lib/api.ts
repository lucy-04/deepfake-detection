export interface AnalysisResult {
  verdict: "ORIGINAL" | "FAKE"
  confidence: number
  riskLevel: "Low" | "Medium" | "High"
  breakdown: {
    label: string
    detected: boolean
    detail: string
  }[]
  analysisTime: string
}

// Backend base URL - override with NEXT_PUBLIC_API_BASE_URL in production (e.g. the Hugging Face Space URL)
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000"
const API_URL = `${API_BASE}/analyze`
export async function analyzeDeepfake(
  file: File,
  mediaType: "image" | "video" | "audio"
): Promise<AnalysisResult> {
  const formData = new FormData()
  formData.append("file", file)
  formData.append("mediaType", mediaType)


  try {
    const response = await fetch(API_URL, {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.detail || "Failed to analyze media")
    }

    const data = await response.json()
    return data as AnalysisResult
  } catch (error) {
    console.error("Analysis Error:", error)
    throw error
  }
}
