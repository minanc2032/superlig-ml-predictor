import Image from "next/image"
import type { TeamPrediction } from "@/lib/predictions"
import { logoSrc } from "@/lib/predictions"
import { zoneForRank } from "@/lib/zones"
import { StatusBadge } from "@/components/status-badge"

const SIZES = {
  sm: { logo: 24, text: "text-sm", gap: "gap-2" },
  md: { logo: 32, text: "text-base", gap: "gap-3" },
  lg: { logo: 44, text: "text-lg", gap: "gap-3" },
} as const

interface TeamChipProps {
  team: TeamPrediction
  size?: keyof typeof SIZES
  showRank?: boolean
  showZoneBadge?: boolean
  totalTeams?: number
}

export function TeamChip({ team, size = "md", showRank = true, showZoneBadge = true, totalTeams = 18 }: TeamChipProps) {
  const { logo, text, gap } = SIZES[size]
  return (
    <div className={`flex items-center ${gap} min-w-0`}>
      {showRank && (
        <span className="font-mono text-muted-foreground text-sm w-6 text-right shrink-0">
          {team.predictedRank}
        </span>
      )}
      <div className="relative shrink-0" style={{ width: logo, height: logo }}>
        <Image src={logoSrc(team.logoSlug)} alt={team.team} fill className="object-contain" sizes={`${logo}px`} />
      </div>
      <span className={`font-medium text-foreground truncate ${text}`}>{team.team}</span>
      {showZoneBadge && (
        <span className="ml-auto shrink-0">
          <StatusBadge zone={zoneForRank(team.predictedRank, totalTeams)} />
        </span>
      )}
    </div>
  )
}
