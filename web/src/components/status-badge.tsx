import { Badge } from "@/components/ui/badge"
import type { Status } from "@/lib/predictions"
import { statusLabel } from "@/lib/predictions"

const variants: Record<Status, string> = {
  ucl: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300",
  uel: "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300",
  uecl: "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300",
  safe: "bg-muted text-muted-foreground border-border",
  playoff: "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300",
  relegated:
    "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300",
}

export function StatusBadge({ status }: { status: Status }) {
  return (
    <Badge
      variant="outline"
      className={`text-xs font-mono font-medium ${variants[status]}`}
    >
      {statusLabel[status]}
    </Badge>
  )
}
