"use client"

import {
  createColumnHelper,
  tableFeatures,
  useTable,
  rowSortingFeature,
  createSortedRowModel,
  sortFn_alphanumeric,
  sortFn_basic,
} from "@tanstack/react-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { StatusBadge } from "@/components/status-badge"
import { TeamChip } from "@/components/team-chip"
import type { TeamPrediction } from "@/lib/predictions"
import { zoneForRank } from "@/lib/zones"
import { ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react"

const features = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns: { alphanumeric: sortFn_alphanumeric, basic: sortFn_basic },
})

const helper = createColumnHelper<typeof features, TeamPrediction>()

function SortIcon({ sorted }: { sorted: false | "asc" | "desc" }) {
  if (!sorted) return <ChevronsUpDown className="h-3 w-3 ml-1 inline opacity-40" />
  if (sorted === "asc") return <ChevronUp className="h-3 w-3 ml-1 inline" />
  return <ChevronDown className="h-3 w-3 ml-1 inline" />
}

export function PredictionTable({ data }: { data: TeamPrediction[] }) {
  const totalTeams = data.length

  const columns = helper.columns([
    helper.accessor("predictedRank", {
      id: "predictedRank",
      header: "#",
      sortFn: "basic",
      cell: (ctx) => (
        <span className="font-mono text-muted-foreground text-right block w-6">
          {ctx.getValue()}
        </span>
      ),
    }),
    helper.accessor("team", {
      id: "team",
      header: "Club",
      sortFn: "alphanumeric",
      cell: (ctx) => <TeamChip team={ctx.row.original} showRank={false} showZoneBadge={false} size="sm" />,
    }),
    helper.accessor("expectedPosition", {
      id: "expectedPosition",
      header: "Expected Position",
      sortFn: "basic",
      cell: (ctx) => <span className="font-mono tabular-nums">{ctx.getValue().toFixed(2)}</span>,
    }),
    helper.accessor("lastSeasonPosition", {
      id: "lastSeasonPosition",
      header: "Last Season",
      sortFn: "basic",
      cell: (ctx) => (
        <span className="font-mono tabular-nums text-muted-foreground">
          {ctx.getValue() ?? "—"}
        </span>
      ),
    }),
    helper.display({
      id: "status",
      header: "Status",
      cell: (ctx) => <StatusBadge zone={zoneForRank(ctx.row.original.predictedRank, totalTeams)} />,
    }),
  ])

  const table = useTable({
    features,
    columns,
    data,
    initialState: { sorting: [{ id: "predictedRank", desc: false }] },
  })

  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((group) => (
            <TableRow key={group.id} className="bg-muted/50 hover:bg-muted/50">
              {group.headers.map((header) => {
                const canSort = header.column.getCanSort()
                return (
                  <TableHead
                    key={header.id}
                    onClick={canSort ? header.column.getToggleSortingHandler() : undefined}
                    className={`text-xs font-semibold uppercase tracking-wide text-muted-foreground select-none transition-colors ${canSort ? "cursor-pointer hover:text-foreground" : ""}`}
                  >
                    {header.isPlaceholder ? null : <table.FlexRender header={header} />}
                    {canSort && <SortIcon sorted={header.column.getIsSorted()} />}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id} className="transition-colors hover:bg-muted/60">
              {row.getAllCells().map((cell) => (
                <TableCell key={cell.id} className="py-2.5">
                  <table.FlexRender cell={cell} />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
