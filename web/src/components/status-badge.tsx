import { Badge } from "@/components/ui/badge"
import type { Zone } from "@/lib/zones"
import { zoneLabel } from "@/lib/zones"

// bg/border use the theme tokens directly; europe's text uses the derived
// --accent-text token (raw --accent fails WCAG AA at badge-label text size).
const variants: Record<Zone, string> = {
  title: "bg-primary/10 text-primary border-primary/20",
  europe: "bg-accent/10 text-[var(--accent-text)] border-accent/20",
  mid: "bg-muted text-muted-foreground border-border",
  relegation: "bg-destructive/10 text-destructive border-destructive/20",
}

export function StatusBadge({ zone }: { zone: Zone }) {
  return (
    <Badge variant="outline" className={`text-xs font-mono font-medium ${variants[zone]}`}>
      {zoneLabel[zone]}
    </Badge>
  )
}
