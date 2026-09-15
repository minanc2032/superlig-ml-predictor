"use client"

import { useState } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { StatusBadge } from "@/components/status-badge"
import { predictions, getHeadToHead } from "@/lib/predictions"
import { Swords } from "lucide-react"

const TEAM_NAMES = predictions.map((t) => t.club)
const BAR_COLORS = ["#1E40AF", "#94a3b8", "#DC2626"]

export default function ExplorePage() {
  const [homeTeam, setHomeTeam] = useState("")
  const [awayTeam, setAwayTeam] = useState("")

  const h2h =
    homeTeam && awayTeam && homeTeam !== awayTeam
      ? getHeadToHead(homeTeam, awayTeam)
      : null

  const chartData = h2h
    ? [
        { label: `${homeTeam} Win`, value: h2h.homeWin, color: BAR_COLORS[0] },
        { label: "Draw", value: h2h.draw, color: BAR_COLORS[1] },
        { label: `${awayTeam} Win`, value: h2h.awayWin, color: BAR_COLORS[2] },
      ]
    : []

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground tracking-tight">
          Match Explorer
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Select two clubs to see a model-derived head-to-head probability breakdown
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="grid gap-4 sm:grid-cols-[1fr_auto_1fr]">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Home Team
              </label>
              <Select
                value={homeTeam || undefined}
                onValueChange={(v) => setHomeTeam(v ?? "")}
              >
                <SelectTrigger className="w-full cursor-pointer">
                  <SelectValue placeholder="Select home team…" />
                </SelectTrigger>
                <SelectContent>
                  {TEAM_NAMES.map((name) => (
                    <SelectItem
                      key={name}
                      value={name}
                      disabled={name === awayTeam}
                      className="cursor-pointer"
                    >
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end justify-center pb-0.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
                <Swords className="h-4 w-4 text-muted-foreground" />
              </span>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Away Team
              </label>
              <Select
                value={awayTeam || undefined}
                onValueChange={(v) => setAwayTeam(v ?? "")}
              >
                <SelectTrigger className="w-full cursor-pointer">
                  <SelectValue placeholder="Select away team…" />
                </SelectTrigger>
                <SelectContent>
                  {TEAM_NAMES.map((name) => (
                    <SelectItem
                      key={name}
                      value={name}
                      disabled={name === homeTeam}
                      className="cursor-pointer"
                    >
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {h2h && (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            {([
              { label: "Home", team: h2h.home },
              { label: "Away", team: h2h.away },
            ] as const).map(({ label, team }) => (
              <Card key={label}>
                <CardHeader className="pb-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {label}
                  </p>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{team.club}</CardTitle>
                    <StatusBadge status={team.status} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-4 gap-2 text-center text-xs font-mono">
                    {[
                      { l: "Rank", v: `#${team.rank}` },
                      { l: "Pts", v: String(team.pts) },
                      { l: "GD", v: team.gd > 0 ? `+${team.gd}` : String(team.gd) },
                      { l: "Conf", v: `${team.confidence}%` },
                    ].map(({ l, v }) => (
                      <div key={l} className="space-y-0.5">
                        <p className="text-muted-foreground uppercase tracking-wide">{l}</p>
                        <p className="text-sm font-bold text-foreground">{v}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">
                Outcome Probability
              </CardTitle>
              <p className="text-xs text-muted-foreground font-mono">
                Derived from predicted league ranks · rough heuristic only
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 text-center mb-6">
                {chartData.map(({ label, value, color }) => (
                  <div key={label}>
                    <p className="text-3xl font-bold font-mono" style={{ color }}>
                      {value}%
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 leading-snug">
                      {label}
                    </p>
                  </div>
                ))}
              </div>

              <ResponsiveContainer width="100%" height={80}>
                <BarChart
                  data={chartData}
                  layout="vertical"
                  margin={{ top: 0, right: 8, left: 0, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    horizontal={false}
                    stroke="hsl(var(--border))"
                  />
                  <XAxis
                    type="number"
                    domain={[0, 100]}
                    tickFormatter={(v: number) => `${v}%`}
                    tick={{ fontSize: 10, fontFamily: "var(--font-fira-code)" }}
                    stroke="hsl(var(--muted-foreground))"
                  />
                  <YAxis
                    dataKey="label"
                    type="category"
                    width={90}
                    tick={{ fontSize: 11, fontFamily: "var(--font-fira-sans)" }}
                    stroke="hsl(var(--muted-foreground))"
                  />
                  <Tooltip
                    cursor={{ fill: "hsl(var(--muted))" }}
                    formatter={(value) => [`${value ?? 0}%`, "Probability"]}
                  />
                  <Bar dataKey="value" radius={[0, 3, 3, 0]} maxBarSize={18}>
                    {chartData.map((entry) => (
                      <Cell key={entry.label} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </>
      )}

      {!homeTeam && !awayTeam && (
        <div className="rounded-lg border border-dashed border-border py-16 text-center text-muted-foreground text-sm">
          Select two clubs above to see the head-to-head breakdown
        </div>
      )}
    </div>
  )
}
