"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"

interface RevealProps {
  children: React.ReactNode
  className?: string
  trigger?: "mount" | "inview"
}

// Animates its direct children in with a stagger fade/slide, only when the
// viewer hasn't asked for reduced motion. With reduced motion, children
// simply render in their final state — no animation runs, no layout shift.
export function Reveal({ children, className, trigger = "mount" }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const mm = gsap.matchMedia()
    let observer: IntersectionObserver | undefined

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const animate = () =>
        gsap.from(el.children, {
          y: 16,
          opacity: 0,
          duration: 0.6,
          stagger: 0.08,
          ease: "power2.out",
        })

      if (trigger === "inview") {
        observer = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              animate()
              observer?.disconnect()
            }
          },
          { threshold: 0.3 }
        )
        observer.observe(el)
      } else {
        animate()
      }
    })

    return () => {
      observer?.disconnect()
      mm.revert()
    }
  }, [trigger])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
