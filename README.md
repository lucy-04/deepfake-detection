# DeepShield — AI Deepfake Image Detection

> Upload an image and find out whether it's AI-generated. Instead of a bare yes/no, you get a **confidence score** and a **risk classification** (likely real / likely fake), backed by a **ResNet18 fine-tuned to 97.9% test accuracy**.

![Status](https://img.shields.io/badge/status-portfolio_project-blue) ![Model](https://img.shields.io/badge/model-ResNet18-orange) ![Framework](https://img.shields.io/badge/PyTorch-EE4C2C?logo=pytorch&logoColor=white) ![Backend](https://img.shields.io/badge/FastAPI-009688?logo=fastapi&logoColor=white) ![Frontend](https://img.shields.io/badge/Next.js-000000?logo=nextdotjs&logoColor=white) ![Accuracy](https://img.shields.io/badge/test_accuracy-97.9%25-success)

---

## Table of contents

- [DeepShield — AI Deepfake Image Detection](#deepshield--ai-deepfake-image-detection)
  - [Table of contents](#table-of-contents)
  - [The problem](#the-problem)
  - [Demo \& screenshots](#demo--screenshots)
  - [Key features](#key-features)
  - [Results](#results)
  - [How it works](#how-it-works)
  - [Model \& training](#model--training)
  - [API reference](#api-reference)
    - [`POST /analyze`](#post-analyze)
    - [`GET /metrics`](#get-metrics)
    - [`GET /health`](#get-health)
  - [Project structure](#project-structure)
  - [Setup \& run (from a clean clone)](#setup--run-from-a-clean-clone)
    - [Prerequisites](#prerequisites)
    - [1. Backend](#1-backend)
    - [2. Frontend](#2-frontend)
    - [Environment variables](#environment-variables)
    - [(Optional) retrain the model](#optional-retrain-the-model)
  - [Design \& engineering decisions](#design--engineering-decisions)
  - [Known limitations / what I'd add next](#known-limitations--what-id-add-next)
  - [Author](#author)

---

## The problem

AI-generated imagery is getting hard to spot by eye. I wanted a tool that returns a **defensible confidence score and risk classification** — not just a binary answer — so you can actually reason about *how* trustworthy an image is instead of trusting a single flashing label.

So I fine-tuned an image classifier to tell real photos apart from AI-generated faces, wrapped it in a small inference API, and built a front-end where you can drop in an image and get an explained result.

---

## Demo & screenshots

> _Screenshots coming soon — run it locally (see [Setup & run](#setup--run-from-a-clean-clone)) to see the full flow._

| Landing page | Upload flow | Result card |
|--------------|-------------|-------------|
| _(public/LandingPage.png)_ | _(public/UploadFlow.png)_ | _(public/ResultCard.png)_ |

<!-- To add: drop images in a docs/ folder and reference them here, e.g. ![Landing](docs/landing.png) -->

---

## Key features

- 🧠 **Fine-tuned ResNet18** — transfer learning from ImageNet, retargeted to a real-vs-fake classifier.
- 📊 **Confidence + risk classification** — a softmax confidence score bucketed into Low / Medium / High risk, not just a label.
- ⚡ **Fast FastAPI inference** — upload to result in well under a second on CPU.
- 🎨 **Polished React front-end** — drag-and-drop upload with an animated, explained result breakdown.
- 🔁 **Reproducible training & evaluation** — the full PyTorch pipeline (`train.py`, `evaluate.py`) lives in the repo, and every metric below was actually measured.

---

## Results

Measured by `evaluate.py` on **4,000 held-out test images** the model never saw during training:

| Metric | Score |
|-----------|--------|
| Accuracy | **97.9%** |
| Precision | **98.5%** |
| Recall | **97.2%** |
| F1 score | **97.8%** |

**Confusion matrix** (FAKE treated as the positive class, 4,000 images):

|                    | Predicted FAKE | Predicted REAL |
|--------------------|:--------------:|:--------------:|
| **Actual FAKE**    | 1,926 ✅        | 55 ❌ (missed)  |
| **Actual REAL**    | 30 ❌ (false alarm) | 1,989 ✅   |

Reading it plainly: of the fakes, it caught 1,926 and missed 55; of the real images, it correctly passed 1,989 and only false-alarmed on 30. **High precision (98.5%)** means when it says "fake," it's almost always right; **high recall (97.2%)** means it rarely lets a fake slip through.

---

## How it works

```
        ┌──────────────┐   image upload    ┌───────────────────┐   tensor    ┌──────────────┐
  User →│  Next.js UI  │ ───────────────▶ │  FastAPI /analyze  │ ─────────▶ │   ResNet18   │
        │ (upload zone)│                   │     (main.py)      │            │  (model.py)  │
        └──────────────┘ ◀─────────────── └───────────────────┘ ◀───────── └──────────────┘
                          verdict + confidence + risk + breakdown (JSON)
```

1. The user uploads an image in the React front-end.
2. The frontend POSTs it as `multipart/form-data` to the FastAPI `/analyze` endpoint.
3. The image is resized to **224×224**, normalised with **ImageNet mean/std**, and run through the fine-tuned ResNet18.
4. A **softmax** turns the two output logits into probabilities; the top one becomes the **confidence score**, which is bucketed into a **risk level**.
5. The API returns a JSON verdict + breakdown, which the UI animates into a result card.

---

## Model & training

The model is a **ResNet18 pretrained on ImageNet**, fine-tuned to separate real photos from AI-generated faces. Full pipeline in `train.py`.

**Dataset:** [140k Real and Fake Faces](https://www.kaggle.com/datasets/xhlulu/140k-real-and-fake-faces) — real photos vs **StyleGAN-generated** faces. It ships with its own `train/ valid/ test/` split (each holding `real/` and `fake/` folders), so I use those official splits directly rather than doing my own random split. Classes are read alphabetically, so `fake → 0`, `real → 1`.

**Approach — transfer learning:** I start from ImageNet weights and swap the final fully-connected layer for a **2-class** output (`model.fc = Linear(in_features, 2)`), then fine-tune. I didn't train from scratch — with a task like this, ImageNet's learned low-level features (edges, textures, colour patterns) transfer well and get you good accuracy without needing huge data or compute.

**Augmentation** (training images only — val/test stay untouched so scores stay honest):

- `RandomHorizontalFlip`
- `RandomRotation(10)`
- `ColorJitter(brightness=0.2, contrast=0.2)`

**Hyperparameters:**

| Setting | Value |
|---------|-------|
| Backbone | ResNet18 (ImageNet pretrained) |
| Input size | 224 × 224 |
| Optimizer | Adam |
| Learning rate | 1e-4 |
| Loss | Cross-entropy |
| Batch size | 32 |
| Epochs | 5 |
| Train images (capped for speed) | 20,000 |
| Eval images (capped for speed) | 4,000 |

Training is meant to run on a GPU (I used Google Colab). `train.py` optionally downloads the dataset via `kagglehub`, fine-tunes, and saves `models/deepfake_model.pth`. `evaluate.py` then loads those weights, runs them on the untouched **test** split, builds the confusion matrix by hand, and writes `metrics.json` — the exact numbers in the [Results](#results) table.

---

## API reference

Base URL (local): `http://127.0.0.1:8000`

### `POST /analyze`

Analyze a single image.

**Request** — `multipart/form-data`:

| Field | Type | Description |
|-------|------|-------------|
| `file` | file | The image to analyze (required) |
| `mediaType` | string | Always `"image"` (kept for the frontend) |

```bash
curl -X POST http://127.0.0.1:8000/analyze \
  -F "file=@some_image.jpg" \
  -F "mediaType=image"
```

**Response** — `200 OK`:

```json
{
  "verdict": "ORIGINAL",
  "confidence": 98.4,
  "riskLevel": "Low",
  "breakdown": [
    { "label": "Face Manipulation", "detected": false, "detail": "No facial manipulation detected" },
    { "label": "GAN Artifacts", "detected": false, "detail": "No GAN artifacts found" },
    { "label": "Inconsistent Lighting", "detected": false, "detail": "Lighting appears consistent" },
    { "label": "Compression Analysis", "detected": false, "detail": "Compression patterns appear normal" }
  ],
  "analysisTime": "0.12s"
}
```

> **Honest note on `breakdown`:** these are **not** four separate detectors. The model produces a single real-vs-fake confidence score; the breakdown is a human-readable expansion of that one score against a few thresholds, so the UI can show *something* interpretable rather than a lone number. I'd rather be upfront about that than pretend it's a multi-signal forensic pipeline.

**Error responses:** `400` for an empty or non-image file, `503` if the model weights failed to load on the server.

### `GET /metrics`

Returns the measured test-set metrics (`metrics.json`) — accuracy, precision, recall, F1, and the confusion matrix.

### `GET /health`

Simple health check: `{ "status": "ok", "modelLoaded": true }`.

---

## Project structure

```
deepfake-detection/
├─ deepfakedetectionbackend/      # FastAPI + PyTorch
│  ├─ main.py                     # /analyze, /metrics, /health endpoints
│  ├─ model.py                    # DeepfakeDetector: loads weights, predicts
│  ├─ train.py                    # fine-tuning pipeline (run on Colab/GPU)
│  ├─ evaluate.py                 # computes metrics on the test split
│  ├─ metrics.json                # measured test-set metrics
│  ├─ models/deepfake_model.pth   # trained weights (~44 MB)
│  └─ requirements.txt
└─ DeepfakeDetectionFrontend/     # Next.js front-end
   ├─ app/                        # routes: / , /detect/image , /about
   ├─ components/                 # landing, detection and UI components
   └─ lib/api.ts                  # talks to the backend
```

---

## Setup & run (from a clean clone)

### Prerequisites
- Python 3.9+
- Node.js 18+
- The trained weights at `deepfakedetectionbackend/models/deepfake_model.pth` (included)

### 1. Backend

```bash
cd deepfakedetectionbackend
python -m venv .venv && source .venv/bin/activate    # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload                            # runs on http://127.0.0.1:8000
```

Quick check: open http://127.0.0.1:8000/health — it should report `"modelLoaded": true`.

> **Tip:** activate the virtualenv (`source .venv/bin/activate`) and run `uvicorn` **from inside** `deepfakedetectionbackend/`, so the `model` import and the weights path resolve correctly.

### 2. Frontend

```bash
cd DeepfakeDetectionFrontend
npm install
cp .env.example .env.local        # optional: defaults to the local backend
npm run dev                        # runs on http://localhost:3000
```

Open http://localhost:3000 and upload an image.

### Environment variables

| Variable | Where | Default | Purpose |
|----------|-------|---------|---------|
| `NEXT_PUBLIC_API_BASE_URL` | frontend | `http://127.0.0.1:8000` | Base URL of the FastAPI backend |

### (Optional) retrain the model

Training is meant to run on a GPU (e.g. Google Colab):

```bash
python train.py      # downloads data, fine-tunes, saves models/deepfake_model.pth
python evaluate.py   # runs on the test split, prints + saves metrics.json
```

---

## Design & engineering decisions

A few choices I made and *why* — the reasoning matters more than the code here:

- **Fine-tune, don't train from scratch.** Training a CNN from scratch needs a lot of data and compute and overfits easily on a smaller set. Transfer learning from ImageNet reuses strong general visual features and gets good accuracy cheaply — the right call for a single-GPU/Colab project.
- **ResNet18 over bigger backbones.** It's the smallest ResNet: fast to train, fast at inference (keeps upload→result latency low), and small enough to ship. ResNet50/EfficientNet would want more data and compute to justify.
- **Confidence + risk, not a binary label.** A tool you can trust should tell you *how sure* it is. I take the softmax probability as confidence and bucket it into Low/Medium/High risk so the output is interpretable.
- **Score the model honestly.** Augmentation is applied to training images only; validation and test images are left untouched, so the reported numbers reflect real performance rather than being flattered by augmentation.
- **Fail gracefully, don't 500.** The API returns clear `400`/`503` errors for empty files, non-images, or a missing model, instead of crashing.
- **Keep the response honest.** The `breakdown` is presented as an expansion of one score, not faked as multiple independent detectors (see the note under [`/analyze`](#post-analyze)).

---

## Known limitations / what I'd add next

- The model is trained on a **face** dataset (real photos vs **StyleGAN** faces), so it's strongest on AI-generated *faces*. Images from other generators (Midjourney, DALL·E, Stable Diffusion) or non-face images fall outside its training distribution and can be misclassified — sometimes confidently. It's a strong signal, not a guarantee.
- Heavy compression or resizing can wash out the generator "fingerprint" the model relies on and lower accuracy.
- **What's next:**
  - A **Grad-CAM heatmap** to show *where* the model thinks an image is fake.
  - A larger, more diverse multi-generator dataset to improve generalization.
  - Trying a stronger backbone (e.g. EfficientNet) or an ensemble.

---

## Author

Built by **Lakshay Tuteja** — [GitHub @lucy-04](https://github.com/lucy-04) · lakshay.tuteja004@gmail.com
