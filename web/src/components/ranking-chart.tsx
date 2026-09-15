"use client"

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
import type { Status, TeamPrediction } from "@/lib/predictions"

const barColor: Record<Status, string> = {
  ucl: "#1E40AF",
  uel: "#D97706",
  uecl: "#059669",
  safe: "#94a3b8",
  playoff: "#ea580c",
  relegated: "#DC2626",
}

interface Props {
  data: TeamPrediction[]
}

export function RankingChart({ data }: Props) {
  const chartData = [...data]
    .sort((a, b) => b.confidence - a.confidence)
    .map((t) => ({
      club: t.club,
      confidence: t.confidence,
      status: t.status,
      rank: t.rank,
    }))

  return (
    <ResponsiveContainer width="100%" height={420}>
      <BarChart
        data={chartData}
        layout="vertical"
        margin={{ top: 4, right: 24, left: 0, bottom: 4 }}
      >
        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border))" />
        <XAxis
          type="number"
          domain={[0, 100]}
          tickFormatter={(v) => `${v}%`}
          tick={{ fontSize: 11, fontFamily: "var(--font-fira-code)" }}
          stroke="hsl(var(--muted-foreground))"
        />
        <YAxis
          dataKey="club"
          type="category"
          width={110}
          tick={{ fontSize: 12, fontFamily: "var(--font-fira-sans)" }}
          stroke="hsl(var(--muted-foreground))"
        />
        <Tooltip
          cursor={{ fill: "hsl(var(--muted))" }}
          content={({ active, payload }) => {
            if (!active || !payload?.length) return null
            const d = payload[0].payload
            return (
              <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-md text-sm">
                <p className="font-semibold text-foreground">
                  #{d.rank} {d.club}
                </p>
                <p className="font-mono text-muted-foreground">
                  Confidence: {d.confidence}%
                </p>
              </div>
            )
          }}
        />
        <Bar dataKey="confidence" radius={[0, 3, 3, 0]} maxBarSize={22}>
          {chartData.map((entry) => (
            <Cell key={entry.club} fill={barColor[entry.status]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
