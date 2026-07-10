# 🔍 Blockchain AI Deepfake Detection

A state-of-the-art web application built to analyze and detect AI-manipulated media (image, video, and audio) while utilizing Web3 technology to ensure tamper-proof verification and immutable authenticity tracking.

## ✨ Features

- **🖼️ Image Deepfake Detection**: Analyze photos and images for AI-generated manipulations, face swaps, and synthetic artifacts.
- **🎥 Video Deepfake Detection**: Frame-by-frame analysis of video content to identify temporal inconsistencies and deepfake patterns.
- **🎙️ Audio Deepfake Detection**: Detect voice cloning, speech synthesis, and audio manipulation with advanced waveform analysis.
- **🔗 Web3 Blockchain Verification**: Immutable and tamper-proof verification of media analysis results, ensuring absolute authenticity tracking on the blockchain.
- **🎨 Modern UI/UX**: Premium, responsive interface built with Framer Motion, Tailwind CSS, and Radix UI components, bringing a fully dynamic and "glassmorphism" inspired visual style to cybersecurity operations.

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (React 18)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animation**: [Framer Motion](https://www.framer.com/motion/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/) & [Lucide React](https://lucide.dev/)
- **Blockchain**: Custom Web3 verification layers.

## 🚀 Getting Started

Follow these instructions to set up the project locally.

### Prerequisites

- [Node.js](https://nodejs.org/en) (Version 18.x or higher recommended)
- `npm`, `yarn`, or `pnpm` installed

### Installation

1. **Clone the repository** (if you haven't already):
   ```bash
   git clone <your-repository-url>
   cd Blockchain_AI_Deepfake_Detetction/DeepfakeDetection
   ```

2. **Install dependencies**:
   ```bash
   npm install
   # or
   pnpm install
   # or
   yarn install
   ```

3. **Environment Setup (Python API)**:
   This project ships with a FastAPI service that functions as the deep learning wrapper.
   ```bash
   cd ../backend
   python3 -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   pip install -r requirements.txt
   uvicorn main:app --reload --port 8000
   ```
   *Leave this terminal running in the background.*

4. **Start the development server (Next.js)**:
   In a new terminal window:
   ```bash
   cd ../DeepfakeDetection
   npm run dev
   # or
   pnpm dev
   # or
   yarn dev
   ```

4. **Open in browser**:
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application in action.

## 📂 Project Structure

- `app/` - Next.js App Router endpoints, including `detect/` pathways for image, video, and audio.
- `components/` - Reusable React components including the `landing/` page sections and atomic UI primitives.
- `lib/` - Utility functions, API connectors, and configuration helpers.
- `hooks/` - Custom React hooks for business logic and UI state.
- `styles/` - Global styling configurations and CSS root variables.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 🛡️ License

This project is licensed under the [MIT License](LICENSE).