import type { Metadata } from "next"
import Link from "next/link"
import { Fira_Code, Fira_Sans } from "next/font/google"
import { TrendingUp } from "lucide-react"
import "./globals.css"
import { Navbar } from "@/components/navbar"

const firaSans = Fira_Sans({
  variable: "--font-fira-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
})

const firaCode = Fira_Code({
  variable: "--font-fira-code",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: "Süper Lig ML Predictor",
  description:
    "Random Forest predictions for the Turkish Süper Lig table — toy model, not betting advice.",
}

const footerLink =
  "inline-flex min-h-8 items-center text-night-muted underline-offset-4 transition-colors hover:text-white hover:underline"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${firaSans.variable} ${firaCode.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Navbar />
        <main className="flex-1">{children}</main>
        <footer className="bg-night text-night-foreground">
          <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
            <div>
              <Link href="/" className="inline-flex items-center gap-2.5 font-semibold">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-black">
                  <TrendingUp className="h-4 w-4" />
                </span>
                Süper Lig ML
              </Link>
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-night-muted">
                A Random Forest that forecasts the Turkish Süper Lig table. Portfolio demo — not betting advice.
              </p>
            </div>
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-night-muted">Project</p>
              <ul className="mt-4 space-y-1 text-sm">
                <li><Link href="/predictions" className={footerLink}>Predictions</Link></li>
                <li><Link href="/explore" className={footerLink}>Explore</Link></li>
                <li>
                  <a
                    href="https://github.com/minanc2032/superlig-ml-predictor"
                    className={footerLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Source on GitHub
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-night-muted">Data</p>
              <ul className="mt-4 space-y-1 text-sm">
                <li>
                  <a
                    href="https://www.football-data.co.uk/"
                    className={footerLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    football-data.co.uk
                  </a>
                </li>
                <li className="text-night-muted">No injuries, transfers, or xG</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10">
            <p className="mx-auto max-w-6xl px-4 py-5 font-mono text-xs text-night-muted sm:px-6">
              Toy model · Not betting advice
            </p>
          </div>
        </footer>
      </body>
    </html>
  )
}
