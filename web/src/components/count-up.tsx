"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"

interface Props {
  value: number
  decimals?: number
  suffix?: string
}

// Renders the final value on the server; counts up from 0 when scrolled into view.
// With prefers-reduced-motion the number is never touched.
export function CountUp({ value, decimals = 0, suffix = "" }: Props) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const mm = gsap.matchMedia()
    let observer: IntersectionObserver | undefined

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const state = { v: 0 }
      const render = () => {
        el.textContent = state.v.toFixed(decimals) + suffix
      }
      render()
      observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) return
          gsap.to(state, { v: value, duration: 1.4, ease: "power2.out", onUpdate: render })
          observer?.disconnect()
        },
        { threshold: 0.4 }
      )
      observer.observe(el)
    })

    return () => {
      observer?.disconnect()
      mm.revert()
    }
  }, [value, decimals, suffix])

  return (
    <span ref={ref}>
      {value.toFixed(decimals)}
      {suffix}
    </span>
  )
}
