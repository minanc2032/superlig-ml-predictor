export type Zone = "title" | "europe" | "mid" | "relegation"

// UI zones derived from predicted rank only — not a model output. Süper Lig
// has no relegation playoff, so this is a flat 4-tier scheme (bottom 3 = direct
// relegation); league size has historically varied, hence the totalTeams param.
export function zoneForRank(rank: number, totalTeams = 18): Zone {
  if (rank <= 1) return "title"
  if (rank <= 4) return "europe"
  if (rank > totalTeams - 3) return "relegation"
  return "mid"
}

export const zoneLabel: Record<Zone, string> = {
  title: "Title race",
  europe: "Europe",
  mid: "Safe",
  relegation: "Relegation",
}
