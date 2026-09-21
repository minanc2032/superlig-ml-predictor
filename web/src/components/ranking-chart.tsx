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
import type { TeamPrediction } from "@/lib/predictions"
import type { Zone } from "@/lib/zones"
import { zoneForRank } from "@/lib/zones"

const barColor: Record<Zone, string> = {
  title: "var(--primary)",
  europe: "var(--accent)",
  mid: "var(--muted-foreground)",
  relegation: "var(--destructive)",
}

interface Props {
  data: TeamPrediction[]
}

export function RankingChart({ data }: Props) {
  const chartData = [...data]
    .sort((a, b) => a.expectedPosition - b.expectedPosition)
    .map((t) => ({
      club: t.team,
      expectedPosition: t.expectedPosition,
      zone: zoneForRank(t.predictedRank, data.length),
      rank: t.predictedRank,
    }))

  return (
    <ResponsiveContainer width="100%" height={420}>
      <BarChart
        data={chartData}
        layout="vertical"
        margin={{ top: 4, right: 24, left: 0, bottom: 4 }}
      >
        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--border)" />
        <XAxis
          type="number"
          domain={[0, data.length]}
          tick={{ fontSize: 11, fontFamily: "var(--font-fira-code)" }}
          stroke="var(--muted-foreground)"
        />
        <YAxis
          dataKey="club"
          type="category"
          width={110}
          tick={{ fontSize: 12, fontFamily: "var(--font-fira-sans)" }}
          stroke="var(--muted-foreground)"
        />
        <Tooltip
          cursor={{ fill: "var(--muted)" }}
          content={({ active, payload }) => {
            if (!active || !payload?.length) return null
            const d = payload[0].payload
            return (
              <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-md text-sm">
                <p className="font-semibold text-foreground">
                  #{d.rank} {d.club}
                </p>
                <p className="font-mono text-muted-foreground">
                  Expected position: {d.expectedPosition.toFixed(2)}
                </p>
              </div>
            )
          }}
        />
        <Bar dataKey="expectedPosition" radius={[0, 3, 3, 0]} maxBarSize={22}>
          {chartData.map((entry) => (
            <Cell key={entry.club} fill={barColor[entry.zone]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
