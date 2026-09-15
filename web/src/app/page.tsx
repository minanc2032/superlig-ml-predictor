import Link from "next/link"
import { ArrowRight, Brain, Database, Trophy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { StatusBadge } from "@/components/status-badge"
import { Separator } from "@/components/ui/separator"
import { predictions, modelMeta } from "@/lib/predictions"

const steps = [
  {
    icon: Database,
    title: "Load Data",
    desc: "Historical Süper Lig match CSVs from football-data.co.uk — seasons 2018/19 through 2024/25.",
  },
  {
    icon: Brain,
    title: "Train Model",
    desc: "A Random Forest Classifier maps season-n table stats to season-n+1 finishing positions.",
  },
  {
    icon: Trophy,
    title: "Predict",
    desc: "2025/26 predictions rank 18 clubs by expected position derived from predict_proba scores.",
  },
]

export default function Home() {
  const top5 = predictions.slice(0, 5)

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary to-[oklch(0.48_0.18_264)] py-24 px-4 text-center text-white">
        <div className="mx-auto max-w-2xl">
          <p className="mb-3 font-mono text-sm tracking-widest text-blue-200 uppercase">
            2025 / 26 Season
          </p>
          <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
            Süper Lig
            <br />
            <span className="text-amber-300">ML Predictor</span>
          </h1>
          <p className="mt-5 text-lg text-blue-100 leading-relaxed max-w-lg mx-auto">
            Random Forest predictions for the Turkish top flight — built on seven
            seasons of match data. Toy model. Not betting advice.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              render={<Link href="/predictions" />}
              size="lg"
              className="bg-amber-500 hover:bg-amber-400 text-black font-semibold cursor-pointer"
            >
              View Predictions <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              render={<Link href="/explore" />}
              variant="outline"
              size="lg"
              className="border-white/30 text-white bg-white/10 hover:bg-white/20 cursor-pointer"
            >
              Explore Matches
            </Button>
          </div>
        </div>
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-16 left-1/2 -translate-x-1/2 h-48 w-96 rounded-full bg-blue-400/20 blur-3xl"
        />
      </section>

      {/* How it works */}
      <section className="mx-auto w-full max-w-5xl px-4 py-16 sm:px-6">
        <h2 className="text-center text-2xl font-bold text-foreground mb-2">
          How it works
        </h2>
        <p className="text-center text-muted-foreground mb-10 text-sm">
          Three steps from raw CSV to predicted table
        </p>
        <div className="grid gap-6 sm:grid-cols-3">
          {steps.map(({ icon: Icon, title, desc }, i) => (
            <Card key={title} className="relative overflow-hidden">
              <CardContent className="pt-6">
                <div className="mb-4 flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="font-mono text-xs text-muted-foreground">
                    Step {i + 1}
                  </span>
                </div>
                <h3 className="font-semibold text-foreground mb-1">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Separator />

      {/* Top 5 preview */}
      <section className="mx-auto w-full max-w-5xl px-4 py-16 sm:px-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Top 5 Predicted</h2>
            <p className="text-sm text-muted-foreground mt-1">
              {modelMeta.season} · MAE {modelMeta.mae} positions
            </p>
          </div>
          <Button
            render={<Link href="/predictions" />}
            variant="outline"
            size="sm"
            className="cursor-pointer"
          >
            Full table <ArrowRight className="ml-1 h-3 w-3" />
          </Button>
        </div>

        <div className="rounded-lg border border-border overflow-hidden">
          {top5.map((team, i) => (
            <div
              key={team.club}
              className={`flex items-center justify-between px-4 py-3 transition-colors hover:bg-muted/60 ${i < top5.length - 1 ? "border-b border-border" : ""}`}
            >
              <div className="flex items-center gap-4">
                <span className="w-6 text-right font-mono text-sm text-muted-foreground">
                  {team.rank}
                </span>
                <span className="font-medium text-foreground">{team.club}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-mono font-bold text-primary">{team.pts} pts</span>
                <StatusBadge status={team.status} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Model stats banner */}
      <section className="bg-muted/50 border-t border-border">
        <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 text-center">
            {[
              { label: "Season", value: modelMeta.season },
              { label: "Clubs", value: modelMeta.teams },
              { label: "Held-out MAE", value: `${modelMeta.mae} pos` },
              { label: "Algorithm", value: "Random Forest" },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="font-mono text-xl font-bold text-primary">{value}</p>
                <p className="text-xs text-muted-foreground mt-1 uppercase tracking-wide">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
