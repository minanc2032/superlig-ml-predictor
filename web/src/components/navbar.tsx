"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ArrowRight, TrendingUp } from "lucide-react"

const links = [
  { href: "/", label: "Home" },
  { href: "/predictions", label: "Predictions" },
  { href: "/explore", label: "Explore" },
]

export function Navbar() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-night/85 text-night-foreground backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-4 py-2 sm:px-6">
        <Link href="/" className="flex min-h-11 items-center gap-2.5 font-semibold transition-opacity hover:opacity-85">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-black">
            <TrendingUp className="h-4 w-4" />
          </span>
          <span className="hidden sm:inline">Süper Lig ML</span>
          <span className="sm:hidden">SL ML</span>
        </Link>

        <div className="flex items-center gap-1 sm:gap-2">
          <ul className="flex items-center gap-0.5">
            {links.map(({ href, label }) => {
              const active = pathname === href
              return (
                <li key={href}>
                  <Link
                    href={href}
                    aria-current={active ? "page" : undefined}
                    className={`relative inline-flex min-h-11 items-center rounded-md px-3 text-sm font-medium transition-colors ${
                      active ? "text-white" : "text-night-muted hover:text-white"
                    }`}
                  >
                    {label}
                    {active && (
                      <span className="absolute inset-x-3 bottom-1.5 h-0.5 rounded-full bg-accent" aria-hidden />
                    )}
                  </Link>
                </li>
              )
            })}
          </ul>
          <Link
            href="/predictions"
            className="ml-1 hidden min-h-11 items-center gap-1.5 rounded-full bg-accent px-4 text-sm font-semibold text-black transition-colors hover:bg-amber-400 md:inline-flex"
          >
            See predictions <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </nav>
    </header>
  )
}
