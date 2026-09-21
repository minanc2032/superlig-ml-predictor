import Image from "next/image"
import { ArrowDown, ArrowRight, ArrowUp, Minus } from "lucide-react"
import type { TeamPrediction } from "@/lib/predictions"
import { logoSrc } from "@/lib/predictions"

// Real 2024/25 finishing position (left) beside the model's 2025/26 forecast (right).
export function StoryCompare({ rows }: { rows: TeamPrediction[] }) {
  return (
    <div className="grid items-stretch gap-4 lg:grid-cols-[1fr_auto_1fr]">
      <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
        <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">2024/25 · what happened</p>
        <p className="mt-1 text-lg font-semibold">Real final positions</p>
        <ul className="mt-4 divide-y divide-border">
          {rows.map((t) => (
            <li key={t.team} className="flex min-h-12 items-center gap-3 py-2">
              <span className="w-9 font-mono text-2xl font-semibold tabular-nums text-muted-foreground">
                {t.lastSeasonPosition ?? "–"}
              </span>
              <span className="relative h-7 w-7 shrink-0">
                <Image src={logoSrc(t.logoSlug)} alt="" fill sizes="28px" className="object-contain" />
              </span>
              <span className="truncate text-sm font-medium">{t.team}</span>
              {t.lastSeasonPosition === null && (
                <span className="ml-auto rounded-full bg-muted px-2 py-0.5 font-mono text-xs text-muted-foreground">Promoted</span>
              )}
            </li>
          ))}
        </ul>
      </div>

      <div className="hidden items-center justify-center lg:flex">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-night text-night-foreground shadow-lg">
          <ArrowRight className="h-5 w-5" />
        </span>
      </div>

      <div className="rounded-2xl border border-primary/30 bg-night p-5 text-night-foreground shadow-xl shadow-primary/10 sm:p-6">
        <p className="font-mono text-xs uppercase tracking-wider text-night-muted">2025/26 · what the model expects</p>
        <p className="mt-1 text-lg font-semibold">Forecast positions</p>
        <ul className="mt-4 divide-y divide-white/10">
          {rows.map((t) => {
            const delta = t.lastSeasonPosition === null ? null : t.lastSeasonPosition - t.predictedRank
            return (
              <li key={t.team} className="flex min-h-12 items-center gap-3 py-2">
                <span className="w-9 font-mono text-2xl font-semibold tabular-nums text-accent">{t.predictedRank}</span>
                <span className="truncate text-sm font-medium">{t.team}</span>
                <span className="ml-auto flex items-center gap-3 font-mono text-xs">
                  <span className="text-night-muted">exp. {t.expectedPosition.toFixed(2)}</span>
                  {delta === null ? (
                    <span className="text-night-muted">new</span>
                  ) : delta === 0 ? (
                    <span className="inline-flex items-center gap-0.5 text-night-muted">
                      <Minus className="h-3 w-3" /> 0
                    </span>
                  ) : delta > 0 ? (
                    <span className="inline-flex items-center gap-0.5 text-emerald-300">
                      <ArrowUp className="h-3 w-3" /> {delta}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-0.5 text-red-300">
                      <ArrowDown className="h-3 w-3" /> {Math.abs(delta)}
                    </span>
                  )}
                </span>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
