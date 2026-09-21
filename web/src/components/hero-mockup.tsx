import Image from "next/image"
import type { TeamPrediction } from "@/lib/predictions"
import { logoSrc } from "@/lib/predictions"
import { zoneForRank } from "@/lib/zones"
import type { Zone } from "@/lib/zones"
import { StatusBadge } from "@/components/status-badge"

const bar: Record<Zone, string> = {
  title: "bg-secondary",
  europe: "bg-accent",
  mid: "bg-white/40",
  relegation: "bg-destructive",
}

interface Props {
  rows: TeamPrediction[]
  totalTeams: number
  season: string
  mae: number
}

// Longer bar = better predicted finish. Purely visual: bar length is derived from expected_position.
const barPct = (expected: number, total: number) => Math.max(8, ((total + 1 - expected) / total) * 100)

export function HeroMockup({ rows, totalTeams, season, mae }: Props) {
  return (
    <div className="relative mx-auto w-full max-w-5xl">
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-x-10 -top-10 bottom-10 rounded-full opacity-70 blur-3xl"
        style={{ background: "radial-gradient(60% 60% at 50% 40%, oklch(0.62 0.19 260 / 0.35), transparent 70%)" }}
      />

      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-night-2 shadow-2xl shadow-black/50 ring-1 ring-white/5">
        <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
          </div>
          <p className="truncate font-mono text-xs text-night-muted">{season} forecast · Random Forest</p>
          <span className="hidden shrink-0 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 font-mono text-[11px] text-night-muted sm:inline">
            held-out MAE {mae}
          </span>
        </div>

        <div className="px-3 pb-3 pt-2 sm:px-5 sm:pb-5">
          <div className="grid grid-cols-[2rem_minmax(0,1fr)_3rem] items-center gap-x-3 px-2 py-2 font-mono text-[11px] uppercase tracking-wider text-night-muted sm:grid-cols-[2rem_minmax(0,1.1fr)_minmax(0,1.6fr)_3rem_5.5rem]">
            <span>#</span>
            <span>Club</span>
            <span className="hidden sm:block">Expected position</span>
            <span className="text-right">Exp.</span>
            <span className="hidden text-right sm:block">Zone</span>
          </div>

          <ul>
            {rows.map((t, i) => {
              const zone = zoneForRank(t.predictedRank, totalTeams)
              return (
                <li
                  key={t.team}
                  className="anim-fade-up grid grid-cols-[2rem_minmax(0,1fr)_3rem] items-center gap-x-3 rounded-lg border-t border-white/5 px-2 py-2.5 first:border-t-0 sm:grid-cols-[2rem_minmax(0,1.1fr)_minmax(0,1.6fr)_3rem_5.5rem]"
                  style={{ "--d": `${450 + i * 90}ms` } as React.CSSProperties}
                >
                  <span className="font-mono text-sm text-night-muted">{t.predictedRank}</span>
                  <span className="flex min-w-0 items-center gap-2.5">
                    <span className="relative h-7 w-7 shrink-0">
                      <Image src={logoSrc(t.logoSlug)} alt="" fill sizes="28px" className="object-contain" />
                    </span>
                    <span className="truncate text-sm font-medium text-night-foreground">{t.team}</span>
                  </span>
                  <span className="hidden h-2 overflow-hidden rounded-full bg-white/10 sm:block">
                    <span
                      className={`anim-grow-x block h-full rounded-full ${bar[zone]}`}
                      style={{ width: `${barPct(t.expectedPosition, totalTeams)}%`, "--d": `${700 + i * 90}ms` } as React.CSSProperties}
                    />
                  </span>
                  <span className="text-right font-mono text-sm text-night-foreground">{t.expectedPosition.toFixed(2)}</span>
                  <span className="hidden justify-self-end sm:block">
                    <StatusBadge zone={zone} tone="dark" />
                  </span>
                </li>
              )
            })}
          </ul>
        </div>
      </div>

      <div
        className="anim-float absolute -right-2 -top-11 hidden rounded-xl border border-white/10 bg-night-2/95 px-3.5 py-2.5 shadow-xl shadow-black/40 backdrop-blur lg:block"
        style={{ "--d": "0ms" } as React.CSSProperties}
      >
        <p className="font-mono text-[10px] uppercase tracking-wider text-night-muted">Model output</p>
        <p className="mt-1 font-mono text-xs text-night-foreground">predicted_rank · team · expected_position</p>
      </div>
      <div
        className="anim-float absolute -bottom-4 -left-2 hidden rounded-xl border border-white/10 bg-night-2/95 px-3.5 py-2.5 shadow-xl shadow-black/40 backdrop-blur lg:block"
        style={{ "--d": "1200ms" } as React.CSSProperties}
      >
        <p className="font-mono text-[10px] uppercase tracking-wider text-night-muted">Not modelled</p>
        <p className="mt-1 font-mono text-xs text-night-foreground">points · W/D/L · goals</p>
      </div>
    </div>
  )
}
