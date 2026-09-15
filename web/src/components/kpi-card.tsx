import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { LucideIcon } from "lucide-react"

interface KpiCardProps {
  title: string
  value: string | number
  sub?: string
  Icon: LucideIcon
  accent?: boolean
}

export function KpiCard({ title, value, sub, Icon, accent }: KpiCardProps) {
  return (
    <Card className="flex flex-col gap-1">
      <CardHeader className="flex flex-row items-center justify-between pb-1 space-y-0">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon
          className={`h-4 w-4 ${accent ? "text-accent" : "text-muted-foreground"}`}
        />
      </CardHeader>
      <CardContent>
        <p
          className={`text-2xl font-bold font-mono tracking-tight ${accent ? "text-accent" : "text-foreground"}`}
        >
          {value}
        </p>
        {sub && (
          <p className="text-xs text-muted-foreground mt-1 font-mono">{sub}</p>
        )}
      </CardContent>
    </Card>
  )
}
