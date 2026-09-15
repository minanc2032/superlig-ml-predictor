import { Suspense } from "react"
import { BarChart3, CalendarDays, Target, Users } from "lucide-react"
import { KpiCard } from "@/components/kpi-card"
import { PredictionTable } from "@/components/prediction-table"
import { RankingChart } from "@/components/ranking-chart"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { predictions, modelMeta } from "@/lib/predictions"

function TableSkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 10 }).map((_, i) => (
        <Skeleton key={i} className="h-10 w-full rounded" />
      ))}
    </div>
  )
}

export default function PredictionsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground tracking-tight">
          2025/26 Predictions
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Trained on {modelMeta.trainedOn} · {modelMeta.algorithm} ·{" "}
          <span className="font-mono">MAE {modelMeta.mae} positions</span>
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <KpiCard title="Season" value={modelMeta.season} Icon={CalendarDays} />
        <KpiCard
          title="Clubs"
          value={modelMeta.teams}
          sub="18 teams in 2025/26"
          Icon={Users}
        />
        <KpiCard
          title="Held-out MAE"
          value={`${modelMeta.mae}`}
          sub="positions off on held-out set"
          Icon={Target}
          accent
        />
        <KpiCard
          title="Algorithm"
          value="RF"
          sub="Random Forest Classifier"
          Icon={BarChart3}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">
            Confidence Score by Club
          </CardTitle>
          <p className="text-xs text-muted-foreground font-mono">
            Derived from expected finishing position · colour = predicted zone
          </p>
        </CardHeader>
        <CardContent className="pt-0">
          <Suspense fallback={<Skeleton className="h-[420px] w-full rounded-lg" />}>
            <RankingChart data={predictions} />
          </Suspense>
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-3 text-xs font-mono">
        {[
          { color: "bg-[#1E40AF]", label: "UCL (Top 4)" },
          { color: "bg-[#D97706]", label: "UEL (5th)" },
          { color: "bg-[#059669]", label: "UECL (6th)" },
          { color: "bg-slate-400", label: "Safe" },
          { color: "bg-orange-500", label: "Playoff" },
          { color: "bg-[#DC2626]", label: "Relegated" },
        ].map(({ color, label }) => (
          <span key={label} className="flex items-center gap-1.5">
            <span className={`inline-block h-3 w-3 rounded-sm ${color}`} />
            {label}
          </span>
        ))}
      </div>

      <div>
        <h2 className="text-xl font-semibold text-foreground mb-3">
          Full Predicted Table
        </h2>
        <p className="text-xs text-muted-foreground mb-4 font-mono">
          Click column headers to sort · Pts and GD are projected for a 38-match season
        </p>
        <Suspense fallback={<TableSkeleton />}>
          <PredictionTable data={predictions} />
        </Suspense>
      </div>

      <p className="text-xs text-muted-foreground font-mono border-t border-border pt-4">
        Toy model — not betting advice. Promoted clubs receive the mean feature
        vector of relegated sides. No injuries, transfers, xG, or schedule
        strength modelled.
      </p>
    </div>
  )
}
