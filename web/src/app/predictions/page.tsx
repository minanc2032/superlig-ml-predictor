import { Suspense } from "react"
import { CalendarDays, Target, Users } from "lucide-react"
import { KpiCard } from "@/components/kpi-card"
import { PredictionTable } from "@/components/prediction-table"
import { RankingChart } from "@/components/ranking-chart"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { predictions, modelMeta } from "@/lib/predictions"

export default function PredictionsPage() {
  return (
    <div>
      <section className="relative overflow-hidden bg-night text-night-foreground">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(60% 90% at 15% 0%, oklch(0.5 0.19 262 / 0.4), transparent 70%), radial-gradient(35% 60% at 90% 100%, oklch(0.66 0.16 58 / 0.12), transparent 70%)",
          }}
        />
        <div className="relative mx-auto max-w-6xl px-4 pb-12 pt-14 sm:px-6 sm:pt-20">
          <p className="anim-fade-up font-mono text-xs uppercase tracking-[0.18em] text-amber-300">The forecast</p>
          <h1
            className="anim-fade-up mt-3 text-4xl font-bold tracking-tight sm:text-6xl"
            style={{ "--d": "80ms" } as React.CSSProperties}
          >
            {modelMeta.season} Predictions
          </h1>
          <p
            className="anim-fade-up mt-3 max-w-2xl text-lg text-night-muted"
            style={{ "--d": "160ms" } as React.CSSProperties}
          >
            Trained on {modelMeta.trainedOn} · {modelMeta.algorithm}
          </p>

          <div
            className="anim-fade-up mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3"
            style={{ "--d": "240ms" } as React.CSSProperties}
          >
            <KpiCard dark title="Season" value={modelMeta.season} Icon={CalendarDays} />
            <KpiCard dark title="Teams" value={modelMeta.teams} sub="clubs predicted" Icon={Users} />
            <KpiCard
              dark
              accent
              title="Held-out MAE"
              value={modelMeta.mae}
              sub="positions · toy-model error"
              Icon={Target}
            />
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl space-y-12 px-4 py-12 sm:px-6">
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Expected position</CardTitle>
            <p className="text-xs text-muted-foreground font-mono">
              Lower is better · colour = UI zone by predicted rank
            </p>
          </CardHeader>
          <CardContent className="pt-0">
            <Suspense fallback={<Skeleton className="h-[420px] w-full rounded-lg" />}>
              <RankingChart data={predictions} />
            </Suspense>
          </CardContent>
        </Card>

        <div>
          <h2 className="mb-4 text-2xl font-bold tracking-tight">Predicted table</h2>
          <PredictionTable data={predictions} />
        </div>

        <p className="border-t border-border pt-4 font-mono text-xs text-muted-foreground">
          Toy model — not betting advice. Promoted clubs received the mean feature vector of the
          relegated sides they replace, so they may tie on expected position. Status badges are UI
          zones derived from predicted rank, not model labels. No injuries, transfers, xG, or
          schedule strength modelled.
        </p>
      </div>
    </div>
  )
}
