"use client"

import { useState } from "react"
import Image from "next/image"
import type { TeamPrediction } from "@/lib/predictions"
import { logoSrc } from "@/lib/predictions"
import { zoneForRank, zoneLabel } from "@/lib/zones"
import type { Zone } from "@/lib/zones"

const ORDER: Zone[] = ["title", "europe", "mid", "relegation"]

const blurb: Record<Zone, string> = {
  title: "Rank 1: the club the model expects to finish on top.",
  europe: "Ranks 2 to 4: the projected European places.",
  mid: "Ranks 5 to 15: clear of the bottom three by predicted rank.",
  relegation: "The bottom three by predicted rank.",
}

const barColor: Record<Zone, string> = {
  title: "bg-primary",
  europe: "bg-accent",
  mid: "bg-muted-foreground/60",
  relegation: "bg-destructive",
}

export function ZoneTabs({ predictions }: { predictions: TeamPrediction[] }) {
  const total = predictions.length
  const [active, setActive] = useState<Zone>("title")

  const byZone = Object.fromEntries(
    ORDER.map((z) => [z, predictions.filter((p) => zoneForRank(p.predictedRank, total) === z)])
  ) as Record<Zone, TeamPrediction[]>

  function onKeyDown(e: React.KeyboardEvent, i: number) {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return
    e.preventDefault()
    const next = ORDER[(i + (e.key === "ArrowRight" ? 1 : ORDER.length - 1)) % ORDER.length]
    setActive(next)
    document.getElementById(`zone-tab-${next}`)?.focus()
  }

  return (
    <div>
      <div role="tablist" aria-label="Forecast by zone" className="flex flex-wrap gap-2">
        {ORDER.map((z, i) => {
          const selected = z === active
          return (
            <button
              key={z}
              id={`zone-tab-${z}`}
              role="tab"
              type="button"
              aria-selected={selected}
              aria-controls={`zone-panel-${z}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(z)}
              onKeyDown={(e) => onKeyDown(e, i)}
              className={`inline-flex min-h-11 items-center gap-2 rounded-full border px-4 text-sm font-medium transition-colors ${
                selected
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-muted-foreground hover:text-foreground"
              }`}
            >
              {zoneLabel[z]}
              <span
                className={`rounded-full px-1.5 font-mono text-xs ${selected ? "bg-white/20" : "bg-muted"}`}
              >
                {byZone[z].length}
              </span>
            </button>
          )
        })}
      </div>

      <div
        key={active}
        id={`zone-panel-${active}`}
        role="tabpanel"
        aria-labelledby={`zone-tab-${active}`}
        className="anim-fade-up mt-5 overflow-hidden rounded-2xl border border-border bg-card"
        style={{ "--d": "0ms" } as React.CSSProperties}
      >
        <p className="border-b border-border px-5 py-3 text-sm text-muted-foreground">
          {blurb[active]} <span className="font-mono text-xs">Zones come from predicted rank, not from the model.</span>
        </p>
        <ul>
          {byZone[active].map((t, i) => (
            <li
              key={t.team}
              className="grid grid-cols-[2rem_minmax(0,1fr)_3.5rem] items-center gap-x-3 border-t border-border px-5 py-3 first:border-t-0 sm:grid-cols-[2rem_minmax(0,1fr)_minmax(0,1.4fr)_3.5rem]"
            >
              <span className="font-mono text-sm text-muted-foreground">{t.predictedRank}</span>
              <span className="flex min-w-0 items-center gap-3">
                <span className="relative h-8 w-8 shrink-0">
                  <Image src={logoSrc(t.logoSlug)} alt="" fill sizes="32px" className="object-contain" />
                </span>
                <span className="truncate font-medium">{t.team}</span>
              </span>
              <span className="hidden h-2 overflow-hidden rounded-full bg-muted sm:block">
                <span
                  className={`anim-grow-x block h-full rounded-full ${barColor[active]}`}
                  style={{
                    width: `${Math.max(8, ((total + 1 - t.expectedPosition) / total) * 100)}%`,
                    "--d": `${i * 70}ms`,
                  } as React.CSSProperties}
                />
              </span>
              <span className="text-right font-mono text-sm">{t.expectedPosition.toFixed(2)}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
