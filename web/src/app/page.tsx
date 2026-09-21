import Link from "next/link"
import {
  ArrowRight,
  Boxes,
  Brain,
  Database,
  Globe,
  ShieldAlert,
  Terminal,
  Trophy,
  Triangle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { CountUp } from "@/components/count-up"
import { HeroMockup } from "@/components/hero-mockup"
import { Reveal } from "@/components/reveal"
import { StoryCompare } from "@/components/story-compare"
import { TeamChip } from "@/components/team-chip"
import { ZoneTabs } from "@/components/zone-tabs"
import { predictions, modelMeta } from "@/lib/predictions"

const stack = [
  { name: "Python", icon: Terminal },
  { name: "scikit-learn", icon: Brain },
  { name: "Next.js", icon: Globe },
  { name: "Vercel", icon: Triangle },
]

function Eyebrow({ children, dark }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <p className={`font-mono text-xs uppercase tracking-[0.18em] ${dark ? "text-amber-300" : "text-accent-text"}`}>
      {children}
    </p>
  )
}

export default function Home() {
  const top6 = predictions.slice(0, 6)
  const top5 = predictions.slice(0, 5)
  // Story: the eight clubs the model puts highest, beside where they really finished last season.
  const story = predictions.slice(0, 8)
  const total = modelMeta.teams
  const first = predictions[0]

  const steps = [
    {
      n: "01",
      icon: Database,
      title: "Load the T1 data",
      desc: `${modelMeta.seasonsUsed} seasons of Süper Lig results from football-data.co.uk, ${modelMeta.trainedOn}.`,
      snippet: ["files    T1_*.csv", `seasons  ${modelMeta.seasonsUsed}`, "columns  HomeTeam AwayTeam FTHG FTAG"],
    },
    {
      n: "02",
      icon: Brain,
      title: "Train: season n → n+1",
      desc: "A Random Forest learns how a club's final table stats map to its finishing position the next season.",
      snippet: ["X  season n table stats", "y  season n+1 position", "RandomForestClassifier(200 trees)"],
    },
    {
      n: "03",
      icon: Trophy,
      title: `Predict ${modelMeta.season}`,
      desc: `Every club gets an expected position; sorting them gives the ${total}-club table.`,
      snippet: [
        "predicted_rank  team  expected_position",
        `${first.predictedRank}  ${first.team}  ${first.expectedPosition.toFixed(2)}`,
      ],
    },
  ]

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-x-clip bg-night pb-0 pt-16 text-night-foreground sm:pt-24">
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(70% 55% at 50% 0%, oklch(0.5 0.19 262 / 0.45), transparent 70%), radial-gradient(40% 35% at 85% 30%, oklch(0.66 0.16 58 / 0.14), transparent 70%)",
            }}
          />
          <div
            className="absolute inset-0 opacity-[0.35]"
            style={{
              backgroundImage: "radial-gradient(oklch(1 0 0 / 0.09) 1px, transparent 1px)",
              backgroundSize: "28px 28px",
              maskImage: "radial-gradient(70% 60% at 50% 25%, black, transparent)",
            }}
          />
        </div>

        <div className="relative mx-auto max-w-6xl px-4 text-center sm:px-6">
          <p
            className="anim-fade-up mx-auto inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 font-mono text-xs text-night-muted"
            style={{ "--d": "0ms" } as React.CSSProperties}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            {modelMeta.season} season · Random Forest forecast
          </p>
          <h1
            className="anim-fade-up mx-auto mt-6 max-w-4xl text-5xl font-bold leading-[1.02] tracking-tight sm:text-7xl lg:text-8xl"
            style={{ "--d": "90ms" } as React.CSSProperties}
          >
            The season, <span className="text-accent">forecasted.</span>
          </h1>
          <p
            className="anim-fade-up mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-night-muted sm:text-xl"
            style={{ "--d": "180ms" } as React.CSSProperties}
          >
            Trained on {modelMeta.seasonsUsed} seasons of Süper Lig results. One model, one question: where does every club finish?
          </p>
          <div
            className="anim-fade-up mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
            style={{ "--d": "270ms" } as React.CSSProperties}
          >
            <Button
              render={<Link href="/predictions" />}
              nativeButton={false}
              size="lg"
              className="h-12 rounded-full bg-accent px-7 text-base font-semibold text-black hover:bg-amber-400"
            >
              See the predictions <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <a
              href="#how-it-works"
              className="inline-flex min-h-12 items-center rounded-full px-5 text-base font-medium text-night-muted transition-colors hover:text-white"
            >
              How it works
            </a>
          </div>
        </div>

        <div className="relative mx-auto mt-14 max-w-6xl px-4 sm:mt-16 sm:px-6">
          <div className="-mb-20 sm:-mb-28">
            <HeroMockup rows={top6} totalTeams={total} season={modelMeta.season} mae={modelMeta.mae} />
          </div>
        </div>
      </section>

      {/* Story: last season vs forecast */}
      <section className="mx-auto w-full max-w-6xl px-4 pb-20 pt-40 sm:px-6 sm:pt-52">
        <div className="max-w-2xl">
          <Eyebrow>The story</Eyebrow>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Last season, then the forecast.</h2>
          <p className="mt-3 text-lg text-muted-foreground">
            On the left, where these clubs really finished in the last season we have data for. On the right, where the model expects them next.
          </p>
        </div>
        <Reveal trigger="inview" className="mt-10">
          <StoryCompare rows={story} />
        </Reveal>
      </section>

      {/* Tabs by zone */}
      <section className="border-y border-border bg-muted/40">
        <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6">
          <div className="max-w-2xl">
            <Eyebrow>Explore the table</Eyebrow>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Four zones, one forecast.</h2>
            <p className="mt-3 text-lg text-muted-foreground">Switch tabs to see who lands where. Bar length shows the expected position.</p>
          </div>
          <div className="mt-8">
            <ZoneTabs predictions={predictions} />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="mx-auto w-full max-w-6xl scroll-mt-20 px-4 py-20 sm:px-6">
        <div className="max-w-2xl">
          <Eyebrow>How it works</Eyebrow>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Three steps from CSV to table.</h2>
        </div>
        <Reveal trigger="inview" className="mt-10 grid gap-5 md:grid-cols-3">
          {steps.map(({ n, icon: Icon, title, desc, snippet }) => (
            <div key={n} className="flex flex-col rounded-2xl border border-border bg-card p-6">
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm text-muted-foreground">{n}</span>
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Icon className="h-4 w-4" />
                </span>
              </div>
              <h3 className="mt-5 text-lg font-semibold">{title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{desc}</p>
              <pre className="mt-5 overflow-x-auto rounded-xl bg-night p-4 font-mono text-xs leading-relaxed text-night-foreground">
                {snippet.join("\n")}
              </pre>
            </div>
          ))}
        </Reveal>
      </section>

      {/* Numbers strip */}
      <section className="bg-night text-night-foreground">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 text-center sm:grid-cols-3 sm:px-6">
          {[
            { label: "Seasons used", node: <CountUp value={modelMeta.seasonsUsed} />, note: modelMeta.trainedOn },
            { label: "Clubs predicted", node: <CountUp value={total} />, note: `for ${modelMeta.season}` },
            {
              label: "Held-out MAE",
              node: <CountUp value={modelMeta.mae} decimals={2} />,
              note: "toy-model error: average places off",
            },
          ].map(({ label, node, note }) => (
            <div key={label}>
              <p className="font-mono text-6xl font-semibold tracking-tight text-accent sm:text-7xl">{node}</p>
              <p className="mt-3 text-sm font-medium uppercase tracking-wider">{label}</p>
              <p className="mt-1 font-mono text-xs text-night-muted">{note}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Table teaser */}
      <section className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <Eyebrow>Top of the table</Eyebrow>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">The model&apos;s top five.</h2>
          </div>
          <Button
            render={<Link href="/predictions" />}
            nativeButton={false}
            size="lg"
            className="h-11 rounded-full px-6"
          >
            Open full predictions <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
        <div className="mt-8 overflow-hidden rounded-2xl border border-border bg-card">
          {top5.map((team, i) => (
            <div
              key={team.team}
              className={`px-5 py-3.5 transition-colors hover:bg-muted/60 ${i < top5.length - 1 ? "border-b border-border" : ""}`}
            >
              <TeamChip team={team} size="md" showZoneBadge totalTeams={total} />
            </div>
          ))}
        </div>
      </section>

      {/* Honesty + stack */}
      <section className="border-t border-border">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.4fr_1fr]">
          <div className="flex gap-4 rounded-2xl border border-dashed border-border bg-card p-6">
            <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-accent-text" />
            <div>
              <p className="font-semibold">Portfolio ML demo — not betting advice. No injuries, transfers, or xG.</p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Promoted clubs have no top-flight history, so they share the average of the relegated sides they replace and can tie on expected position.
              </p>
            </div>
          </div>
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">Built with</p>
            <div className="mt-4 flex flex-wrap gap-2.5">
              {stack.map(({ name, icon: Icon }) => (
                <span
                  key={name}
                  className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border bg-card px-4 text-sm font-medium"
                >
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  {name}
                </span>
              ))}
              <span className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border bg-card px-4 text-sm font-medium">
                <Boxes className="h-4 w-4 text-muted-foreground" />
                Recharts
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
