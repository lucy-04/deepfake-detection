import { Shield } from "lucide-react"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-card/30">
      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Brand */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 border border-primary/20">
                <Shield className="h-4 w-4 text-primary" />
              </div>
              <span className="text-lg font-semibold text-foreground">
                Deep<span className="text-primary">Shield</span> AI
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              AI deepfake image detection powered by a fine-tuned ResNet18 model.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold text-foreground">Platform</h3>
            <nav className="flex flex-col gap-2">
              <Link href="/detect/image" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Image Detection
              </Link>
              <Link href="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                How It Works
              </Link>
            </nav>
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold text-foreground">Project</h3>
            <p className="text-sm text-muted-foreground">Built by Lakshay Tuteja</p>
            <a
              href="https://github.com/lucy-04/deepfake-detection"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              GitHub Repository
            </a>
            <a
              href="mailto:lakshay.tuteja004@gmail.com"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              lakshay.tuteja004@gmail.com
            </a>
          </div>
        </div>

        <div className="mt-10 border-t border-border/40 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} DeepShield. Built by Lakshay Tuteja.
          </p>
          <p className="text-xs text-muted-foreground">
            Powered by a fine-tuned ResNet18
          </p>
        </div>
      </div>
    </footer>
  )
}
