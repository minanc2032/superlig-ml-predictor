import Link from "next/link"
import { ArrowRight, Database, Brain, Trophy, ShieldAlert } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { TeamChip } from "@/components/team-chip"
import { Reveal } from "@/components/reveal"
import { predictions, modelMeta } from "@/lib/predictions"

const steps = [
  {
    icon: Database,
    title: "Load Data",
    desc: "Historical Süper Lig match CSVs from football-data.co.uk — seasons 2018/19 through 2024/25.",
  },
  {
    icon: Brain,
    title: "Train",
    desc: "A Random Forest Classifier maps season-n table stats to season-n+1 finishing positions.",
  },
  {
    icon: Trophy,
    title: "Predict",
    desc: "Ranks 18 clubs by expected finishing position for the 2025/26 season.",
  },
]

const stack = ["Python", "scikit-learn", "Next.js", "Vercel"]

function ordinal(n: number): string {
  const s = ["th", "st", "nd", "rd"]
  const v = n % 100
  return `${n}${s[(v - 20) % 10] ?? s[v] ?? s[0]}`
}

export default function Home() {
  const top4 = predictions.slice(0, 4)
  const story = predictions.slice(0, 3)
  const top5 = predictions.slice(0, 5)

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary to-[oklch(0.48_0.18_264)] py-24 px-4 text-center text-white">
        <Reveal className="mx-auto max-w-2xl">
          <p className="mb-3 font-mono text-sm tracking-widest text-blue-200 uppercase">
            2025 / 26 Season · Forecast
          </p>
          <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
            The season,
            <br />
            <span className="text-amber-300">forecasted.</span>
          </h1>
          <p className="mt-5 text-lg text-blue-100 leading-relaxed max-w-lg mx-auto">
            A Random Forest trained on {modelMeta.seasonsUsed} seasons of Süper Lig results predicts
            the 2025/26 final table before a ball is kicked.
          </p>
          <div className="mt-8">
            <Button
              render={<Link href="/predictions" />}
              size="lg"
              className="bg-amber-500 hover:bg-amber-400 text-black font-semibold cursor-pointer"
            >
              View predictions <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          <div className="mt-10 flex flex-wrap justify-center gap-x-6 gap-y-3">
            {top4.map((team) => (
              <TeamChip key={team.team} team={team} size="sm" showZoneBadge={false} />
            ))}
          </div>
        </Reveal>
        <div aria-hidden className="pointer-events-none absolute -bottom-16 left-1/2 -translate-x-1/2 h-48 w-96 rounded-full bg-blue-400/20 blur-3xl" />
      </section>

      {/* Story: top clubs with expected rank */}
      <section className="mx-auto w-full max-w-5xl px-4 py-16 sm:px-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">Who the model likes</h2>
        <p className="text-muted-foreground mb-8 text-sm">
          The model&apos;s top three, with real last-season context
        </p>
        <div className="grid gap-4 sm:grid-cols-3">
          {story.map((team) => (
            <Card key={team.team}>
              <CardContent className="pt-6">
                <TeamChip team={team} size="lg" showZoneBadge />
                <p className="text-xs text-muted-foreground font-mono mt-4">
                  {team.lastSeasonPosition
                    ? `Finished ${ordinal(team.lastSeasonPosition)} last season`
                    : "Promoted club — uses relegated-club average features"}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Separator />

      {/* How it works */}
      <section className="mx-auto w-full max-w-5xl px-4 py-16 sm:px-6">
        <h2 className="text-center text-2xl font-bold text-foreground mb-2">How it works</h2>
        <p className="text-center text-muted-foreground mb-10 text-sm">
          Three steps from raw CSV to predicted table
        </p>
        <div className="grid gap-6 sm:grid-cols-3">
          {steps.map(({ icon: Icon, title, desc }, i) => (
            <Card key={title}>
              <CardContent className="pt-6">
                <div className="mb-4 flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="font-mono text-xs text-muted-foreground">Step {i + 1}</span>
                </div>
                <h3 className="font-semibold text-foreground mb-1">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Numbers strip */}
      <section className="bg-muted/50 border-t border-b border-border">
        <Reveal trigger="inview" className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
          <div className="grid grid-cols-3 gap-6 text-center">
            {[
              { label: "Seasons used", value: modelMeta.seasonsUsed },
              { label: "Clubs predicted", value: modelMeta.teams },
              { label: "Held-out MAE (toy-model error)", value: `${modelMeta.mae} pos` },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="font-mono text-xl font-bold text-primary">{value}</p>
                <p className="text-xs text-muted-foreground mt-1 uppercase tracking-wide">{label}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* Table teaser */}
      <section className="mx-auto w-full max-w-5xl px-4 py-16 sm:px-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Top 5</h2>
            <p className="text-sm text-muted-foreground mt-1">Predicted 2025/26 finish</p>
          </div>
          <Button render={<Link href="/predictions" />} variant="outline" size="sm" className="cursor-pointer">
            Open full predictions <ArrowRight className="ml-1 h-3 w-3" />
          </Button>
        </div>
        <div className="rounded-xl border border-border overflow-hidden">
          {top5.map((team, i) => (
            <div
              key={team.team}
              className={`px-4 py-3 transition-colors hover:bg-muted/60 ${i < top5.length - 1 ? "border-b border-border" : ""}`}
            >
              <TeamChip team={team} size="md" showZoneBadge />
            </div>
          ))}
        </div>
      </section>

      {/* Honesty */}
      <section className="mx-auto w-full max-w-3xl px-4 pb-16 sm:px-6">
        <Card className="border-dashed">
          <CardContent className="pt-6 flex gap-3">
            <ShieldAlert className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-foreground">
                Portfolio ML demo — not betting advice. No injuries, transfers, or xG.
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Promoted clubs share the mean feature vector of the relegated sides they replace, since
                they have no top-flight history to train on.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Stack callout */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 flex flex-wrap items-center justify-center gap-3">
          {stack.map((s) => (
            <span
              key={s}
              className="rounded-full border border-border bg-card px-4 py-1.5 text-xs font-mono text-muted-foreground"
            >
              {s}
            </span>
          ))}
        </div>
      </section>
    </div>
  )
}
