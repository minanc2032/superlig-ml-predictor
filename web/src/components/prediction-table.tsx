"use client"

import { useState, useMemo } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { StatusBadge } from "@/components/status-badge"
import type { TeamPrediction } from "@/lib/predictions"
import { ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react"

type SortKey = keyof Pick<
  TeamPrediction,
  "rank" | "club" | "won" | "drawn" | "lost" | "gf" | "ga" | "gd" | "pts"
>

interface SortState {
  key: SortKey
  dir: "asc" | "desc"
}

const columns: { key: SortKey; label: string }[] = [
  { key: "rank", label: "#" },
  { key: "club", label: "Club" },
  { key: "won", label: "W" },
  { key: "drawn", label: "D" },
  { key: "lost", label: "L" },
  { key: "gf", label: "GF" },
  { key: "ga", label: "GA" },
  { key: "gd", label: "GD" },
  { key: "pts", label: "Pts" },
]

const zoneRow: Record<string, string> = {
  ucl: "bg-blue-50/60 dark:bg-blue-950/20",
  uel: "bg-amber-50/60 dark:bg-amber-950/20",
  uecl: "bg-emerald-50/40 dark:bg-emerald-950/20",
  safe: "",
  playoff: "bg-orange-50/40 dark:bg-orange-950/20",
  relegated: "bg-red-50/60 dark:bg-red-950/20",
}

function SortIcon({ active, dir }: { active: boolean; dir: "asc" | "desc" }) {
  if (!active) return <ChevronsUpDown className="h-3 w-3 ml-1 inline opacity-40" />
  if (dir === "asc") return <ChevronUp className="h-3 w-3 ml-1 inline" />
  return <ChevronDown className="h-3 w-3 ml-1 inline" />
}

export function PredictionTable({ data }: { data: TeamPrediction[] }) {
  const [sort, setSort] = useState<SortState>({ key: "rank", dir: "asc" })

  function toggle(key: SortKey) {
    setSort((prev) =>
      prev.key === key
        ? { key, dir: prev.dir === "asc" ? "desc" : "asc" }
        : { key, dir: key === "club" ? "asc" : "desc" }
    )
  }

  const sorted = useMemo(
    () =>
      [...data].sort((a, b) => {
        const av = a[sort.key]
        const bv = b[sort.key]
        const cmp =
          typeof av === "string"
            ? av.localeCompare(bv as string)
            : (av as number) - (bv as number)
        return sort.dir === "asc" ? cmp : -cmp
      }),
    [data, sort]
  )

  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50">
            {columns.map(({ key, label }) => (
              <TableHead
                key={key}
                onClick={() => toggle(key)}
                className="text-xs font-semibold uppercase tracking-wide text-muted-foreground cursor-pointer select-none hover:text-foreground transition-colors"
              >
                {label}
                <SortIcon active={sort.key === key} dir={sort.dir} />
              </TableHead>
            ))}
            <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Status
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sorted.map((team) => (
            <TableRow
              key={team.club}
              className={`transition-colors hover:bg-muted/60 ${zoneRow[team.status]}`}
            >
              <TableCell className="py-2.5 font-mono text-muted-foreground text-right w-10">
                {team.rank}
              </TableCell>
              <TableCell className="py-2.5 font-medium text-foreground">
                {team.club}
              </TableCell>
              <TableCell className="py-2.5 font-mono tabular-nums">{team.won}</TableCell>
              <TableCell className="py-2.5 font-mono tabular-nums">{team.drawn}</TableCell>
              <TableCell className="py-2.5 font-mono tabular-nums">{team.lost}</TableCell>
              <TableCell className="py-2.5 font-mono tabular-nums">{team.gf}</TableCell>
              <TableCell className="py-2.5 font-mono tabular-nums">{team.ga}</TableCell>
              <TableCell className="py-2.5">
                <span
                  className={`font-mono tabular-nums ${team.gd > 0 ? "text-emerald-600 dark:text-emerald-400" : team.gd < 0 ? "text-red-600 dark:text-red-400" : ""}`}
                >
                  {team.gd > 0 ? `+${team.gd}` : team.gd}
                </span>
              </TableCell>
              <TableCell className="py-2.5 font-mono font-bold tabular-nums text-primary">
                {team.pts}
              </TableCell>
              <TableCell className="py-2.5">
                <StatusBadge status={team.status} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
