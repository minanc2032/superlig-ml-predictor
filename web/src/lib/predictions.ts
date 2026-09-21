import predictionsFile from "../../public/data/predictions.json"

interface RawTeamPrediction {
  predicted_rank: number
  team: string
  expected_position: number
  logo_slug: string
  last_season_position: number | null
}

interface RawMeta {
  season: string
  teams: number
  mae: number
  seasons_used: number
  trained_on: string
  algorithm: string
  generated_at: string
}

interface PredictionsFile {
  meta: RawMeta
  predictions: RawTeamPrediction[]
}

export interface TeamPrediction {
  predictedRank: number
  team: string
  expectedPosition: number
  logoSlug: string
  lastSeasonPosition: number | null
}

export interface ModelMeta {
  season: string
  teams: number
  mae: number
  seasonsUsed: number
  trainedOn: string
  algorithm: string
  generatedAt: string
}

const raw = predictionsFile as PredictionsFile

export const modelMeta: ModelMeta = {
  season: raw.meta.season,
  teams: raw.meta.teams,
  mae: raw.meta.mae,
  seasonsUsed: raw.meta.seasons_used,
  trainedOn: raw.meta.trained_on,
  algorithm: raw.meta.algorithm,
  generatedAt: raw.meta.generated_at,
}

export const predictions: TeamPrediction[] = raw.predictions.map((p) => ({
  predictedRank: p.predicted_rank,
  team: p.team,
  expectedPosition: p.expected_position,
  logoSlug: p.logo_slug,
  lastSeasonPosition: p.last_season_position,
}))

export function logoSrc(slug: string): string {
  return `/logos/${slug}.png`
}
