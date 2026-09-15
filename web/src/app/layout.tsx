import type { Metadata } from "next"
import { Fira_Code, Fira_Sans } from "next/font/google"
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
    "Random Forest predictions for the 2025/26 Turkish Süper Lig season — toy model, not betting advice.",
}

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
        <footer className="border-t border-border py-6 text-center text-sm text-muted-foreground font-mono">
          Toy model · Not betting advice ·{" "}
          <a
            href="https://www.football-data.co.uk/"
            className="underline underline-offset-4 hover:text-foreground transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            Data: football-data.co.uk
          </a>
        </footer>
      </body>
    </html>
  )
}
