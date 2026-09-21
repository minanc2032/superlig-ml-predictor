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
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 space-y-10">
      <div>
        <h1 className="text-3xl font-bold text-foreground tracking-tight">
          {modelMeta.season} Predictions
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Trained on {modelMeta.trainedOn} · {modelMeta.algorithm}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <KpiCard title="Season" value={modelMeta.season} Icon={CalendarDays} />
        <KpiCard title="Teams" value={modelMeta.teams} sub="clubs predicted" Icon={Users} />
        <KpiCard
          title="Held-out MAE"
          value={modelMeta.mae}
          sub="positions · toy-model error"
          Icon={Target}
          accent
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Expected position</CardTitle>
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
        <h2 className="text-xl font-semibold text-foreground mb-4">Predicted table</h2>
        <PredictionTable data={predictions} />
      </div>

      <p className="text-xs text-muted-foreground font-mono border-t border-border pt-4">
        Toy model — not betting advice. Promoted clubs received the mean feature vector of the
        relegated sides they replace, so they may tie on expected position. Status badges are UI
        zones derived from predicted rank, not model labels. No injuries, transfers, xG, or
        schedule strength modelled.
      </p>
    </div>
  )
}
