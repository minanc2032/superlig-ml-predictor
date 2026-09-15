"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { TrendingUp } from "lucide-react"

const links = [
  { href: "/", label: "Home" },
  { href: "/predictions", label: "Predictions" },
  { href: "/explore", label: "Explore" },
]

export function Navbar() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-sm">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold text-primary hover:opacity-80 transition-opacity"
        >
          <TrendingUp className="h-5 w-5" />
          <span className="hidden sm:inline">Süper Lig ML</span>
          <span className="sm:hidden">SL ML</span>
        </Link>

        <ul className="flex items-center gap-1">
          {links.map(({ href, label }) => {
            const active = pathname === href
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors cursor-pointer ${
                    active
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  {label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </header>
  )
}
