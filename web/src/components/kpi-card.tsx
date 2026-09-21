import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { LucideIcon } from "lucide-react"

interface KpiCardProps {
  title: string
  value: string | number
  sub?: string
  Icon: LucideIcon
  accent?: boolean
  dark?: boolean
}

export function KpiCard({ title, value, sub, Icon, accent, dark }: KpiCardProps) {
  if (dark) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-night-muted">{title}</p>
          <Icon className={`h-4 w-4 ${accent ? "text-accent" : "text-night-muted"}`} />
        </div>
        <p className={`mt-3 font-mono text-4xl font-semibold tracking-tight ${accent ? "text-accent" : "text-night-foreground"}`}>
          {value}
        </p>
        {sub && <p className="mt-1.5 font-mono text-xs text-night-muted">{sub}</p>}
      </div>
    )
  }

  return (
    <Card className="flex flex-col gap-1">
      <CardHeader className="flex flex-row items-center justify-between pb-1 space-y-0">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className={`h-4 w-4 ${accent ? "text-accent" : "text-muted-foreground"}`} />
      </CardHeader>
      <CardContent>
        <p className={`text-2xl font-bold font-mono tracking-tight ${accent ? "text-accent" : "text-foreground"}`}>
          {value}
        </p>
        {sub && <p className="text-xs text-muted-foreground mt-1 font-mono">{sub}</p>}
      </CardContent>
    </Card>
  )
}
