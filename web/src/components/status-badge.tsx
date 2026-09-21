import { Badge } from "@/components/ui/badge"
import type { Zone } from "@/lib/zones"
import { zoneLabel } from "@/lib/zones"

// bg/border use the theme tokens directly; europe's text uses the derived
// --accent-text token (raw --accent fails WCAG AA at badge-label text size).
const light: Record<Zone, string> = {
  title: "bg-primary/10 text-primary border-primary/20",
  europe: "bg-accent/10 text-[var(--accent-text)] border-accent/20",
  mid: "bg-muted text-muted-foreground border-border",
  relegation: "bg-destructive/10 text-destructive border-destructive/20",
}

// For use on the always-dark "night" surfaces.
const dark: Record<Zone, string> = {
  title: "bg-secondary/20 text-blue-200 border-secondary/40",
  europe: "bg-accent/20 text-amber-200 border-accent/40",
  mid: "bg-white/10 text-white/75 border-white/15",
  relegation: "bg-destructive/25 text-red-200 border-destructive/45",
}

export function StatusBadge({ zone, tone = "light" }: { zone: Zone; tone?: "light" | "dark" }) {
  const variants = tone === "dark" ? dark : light
  return (
    <Badge variant="outline" className={`text-xs font-mono font-medium ${variants[zone]}`}>
      {zoneLabel[zone]}
    </Badge>
  )
}
