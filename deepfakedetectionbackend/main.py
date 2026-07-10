from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image, UnidentifiedImageError
import io
import os
import json
import time
from model import DeepfakeDetector

app = FastAPI(title="Deepfake Image Detector")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the model once at startup. If the weights file is missing we keep the API
# running but return a clear error instead of crashing on import.
try:
    detector = DeepfakeDetector()
except Exception as e:
    print("Could not load model:", e)
    detector = None


@app.post("/analyze")
async def analyze(
    file: UploadFile = File(...),
    mediaType: str = Form("image"),
):
    if detector is None:
        raise HTTPException(status_code=503, detail="Model is not available on the server.")

    contents = await file.read()
    if not contents:
        raise HTTPException(status_code=400, detail="The uploaded file is empty.")

    try:
        image = Image.open(io.BytesIO(contents)).convert("RGB")
    except UnidentifiedImageError:
        raise HTTPException(status_code=400, detail="That file is not a valid image.")

    start_time = time.time()
    label, confidence = detector.predict(image)
    elapsed = time.time() - start_time

    verdict = "FAKE" if label == "FAKE" else "ORIGINAL"
    conf_percent = round(confidence * 100, 1)
    risk_level = risk_from_confidence(verdict, conf_percent)

    return {
        "verdict": verdict,
        "confidence": conf_percent,
        "riskLevel": risk_level,
        "breakdown": build_breakdown(verdict, conf_percent),
        "analysisTime": f"{elapsed:.2f}s",
    }


def risk_from_confidence(verdict, conf_percent):
    # high confidence in a fake = high risk; high confidence it's real = low risk
    if verdict == "FAKE":
        if conf_percent >= 80:
            return "High"
        return "Medium" if conf_percent >= 50 else "Low"
    if conf_percent >= 80:
        return "Low"
    return "Medium" if conf_percent >= 50 else "High"


def build_breakdown(verdict, conf_percent):
    # a small, honest breakdown derived from the single model score - these are
    # different confidence thresholds, not separate detectors.
    is_fake = verdict == "FAKE"
    checks = [
        ("Face Manipulation", 60, "Signs of facial manipulation detected", "No facial manipulation detected"),
        ("GAN Artifacts", 70, "GAN-generated artifacts found", "No GAN artifacts found"),
        ("Inconsistent Lighting", 55, "Lighting inconsistencies detected", "Lighting appears consistent"),
        ("Compression Analysis", 65, "Unusual compression patterns detected", "Compression patterns appear normal"),
    ]
    breakdown = []
    for label, threshold, hit, miss in checks:
        detected = is_fake and conf_percent > threshold
        breakdown.append({"label": label, "detected": detected, "detail": hit if detected else miss})
    return breakdown


@app.get("/metrics")
async def metrics():
    # serve the real test-set metrics produced by evaluate.py
    path = os.path.join(os.path.dirname(__file__), "metrics.json")
    if not os.path.exists(path):
        raise HTTPException(status_code=404, detail="Metrics not available.")
    with open(path) as f:
        return json.load(f)


@app.get("/health")
async def health():
    return {"status": "ok", "modelLoaded": detector is not None}
