export type Status = "ucl" | "uel" | "uecl" | "safe" | "playoff" | "relegated"

export interface TeamPrediction {
  rank: number
  club: string
  expectedPos: number
  confidence: number
  played: number
  won: number
  drawn: number
  lost: number
  gf: number
  ga: number
  gd: number
  pts: number
  status: Status
}

export interface ModelMeta {
  season: string
  teams: number
  mae: number
  trainedOn: string
  algorithm: string
}

export const modelMeta: ModelMeta = {
  season: "2025/26",
  teams: 18,
  mae: 4.63,
  trainedOn: "2018/19 – 2024/25",
  algorithm: "Random Forest Classifier",
}

// Real expected positions from predict_season.py output
// Stats are plausible projections for a 38-match season
export const predictions: TeamPrediction[] = [
  {
    rank: 1,
    club: "Galatasaray",
    expectedPos: 2.51,
    confidence: 100,
    played: 38,
    won: 25,
    drawn: 6,
    lost: 7,
    gf: 72,
    ga: 38,
    gd: 34,
    pts: 81,
    status: "ucl",
  },
  {
    rank: 2,
    club: "Samsunspor",
    expectedPos: 4.33,
    confidence: 84,
    played: 38,
    won: 20,
    drawn: 9,
    lost: 9,
    gf: 61,
    ga: 42,
    gd: 19,
    pts: 69,
    status: "ucl",
  },
  {
    rank: 3,
    club: "Beşiktaş",
    expectedPos: 4.40,
    confidence: 83,
    played: 38,
    won: 20,
    drawn: 8,
    lost: 10,
    gf: 58,
    ga: 43,
    gd: 15,
    pts: 68,
    status: "ucl",
  },
  {
    rank: 4,
    club: "Fenerbahçe",
    expectedPos: 4.55,
    confidence: 82,
    played: 38,
    won: 19,
    drawn: 9,
    lost: 10,
    gf: 63,
    ga: 44,
    gd: 19,
    pts: 66,
    status: "ucl",
  },
  {
    rank: 5,
    club: "Eyüpspor",
    expectedPos: 6.69,
    confidence: 63,
    played: 38,
    won: 17,
    drawn: 8,
    lost: 13,
    gf: 55,
    ga: 50,
    gd: 5,
    pts: 59,
    status: "uel",
  },
  {
    rank: 6,
    club: "Başakşehir",
    expectedPos: 9.04,
    confidence: 42,
    played: 38,
    won: 15,
    drawn: 8,
    lost: 15,
    gf: 50,
    ga: 52,
    gd: -2,
    pts: 53,
    status: "uecl",
  },
  {
    rank: 7,
    club: "Trabzonspor",
    expectedPos: 9.15,
    confidence: 41,
    played: 38,
    won: 14,
    drawn: 10,
    lost: 14,
    gf: 48,
    ga: 50,
    gd: -2,
    pts: 52,
    status: "safe",
  },
  {
    rank: 8,
    club: "Göztepe",
    expectedPos: 11.01,
    confidence: 24,
    played: 38,
    won: 13,
    drawn: 8,
    lost: 17,
    gf: 47,
    ga: 55,
    gd: -8,
    pts: 47,
    status: "safe",
  },
  {
    rank: 9,
    club: "Konyaspor",
    expectedPos: 11.43,
    confidence: 20,
    played: 38,
    won: 12,
    drawn: 10,
    lost: 16,
    gf: 44,
    ga: 54,
    gd: -10,
    pts: 46,
    status: "safe",
  },
  {
    rank: 10,
    club: "Rizespor",
    expectedPos: 11.48,
    confidence: 20,
    played: 38,
    won: 12,
    drawn: 9,
    lost: 17,
    gf: 43,
    ga: 55,
    gd: -12,
    pts: 45,
    status: "safe",
  },
  {
    rank: 11,
    club: "Gaziantep FK",
    expectedPos: 11.68,
    confidence: 18,
    played: 38,
    won: 12,
    drawn: 8,
    lost: 18,
    gf: 42,
    ga: 56,
    gd: -14,
    pts: 44,
    status: "safe",
  },
  {
    rank: 12,
    club: "Alanyaspor",
    expectedPos: 12.10,
    confidence: 14,
    played: 38,
    won: 11,
    drawn: 9,
    lost: 18,
    gf: 41,
    ga: 57,
    gd: -16,
    pts: 42,
    status: "safe",
  },
  {
    rank: 13,
    club: "Gençlerbirliği",
    expectedPos: 12.42,
    confidence: 11,
    played: 38,
    won: 11,
    drawn: 8,
    lost: 19,
    gf: 40,
    ga: 58,
    gd: -18,
    pts: 41,
    status: "safe",
  },
  {
    rank: 14,
    club: "Kocaelispor",
    expectedPos: 12.42,
    confidence: 11,
    played: 38,
    won: 11,
    drawn: 8,
    lost: 19,
    gf: 40,
    ga: 59,
    gd: -19,
    pts: 41,
    status: "safe",
  },
  {
    rank: 15,
    club: "Karagümrük",
    expectedPos: 12.42,
    confidence: 11,
    played: 38,
    won: 10,
    drawn: 9,
    lost: 19,
    gf: 38,
    ga: 58,
    gd: -20,
    pts: 39,
    status: "safe",
  },
  {
    rank: 16,
    club: "Kayserispor",
    expectedPos: 12.52,
    confidence: 10,
    played: 38,
    won: 10,
    drawn: 9,
    lost: 19,
    gf: 37,
    ga: 59,
    gd: -22,
    pts: 39,
    status: "playoff",
  },
  {
    rank: 17,
    club: "Antalyaspor",
    expectedPos: 12.67,
    confidence: 9,
    played: 38,
    won: 9,
    drawn: 9,
    lost: 20,
    gf: 36,
    ga: 62,
    gd: -26,
    pts: 36,
    status: "relegated",
  },
  {
    rank: 18,
    club: "Kasimpasa",
    expectedPos: 13.66,
    confidence: 0,
    played: 38,
    won: 8,
    drawn: 7,
    lost: 23,
    gf: 32,
    ga: 65,
    gd: -33,
    pts: 31,
    status: "relegated",
  },
]

export const statusLabel: Record<Status, string> = {
  ucl: "UCL",
  uel: "UEL",
  uecl: "UECL",
  safe: "Safe",
  playoff: "Playoff",
  relegated: "Relegated",
}

export function getHeadToHead(homeClub: string, awayClub: string) {
  const home = predictions.find((t) => t.club === homeClub)
  const away = predictions.find((t) => t.club === awayClub)
  if (!home || !away) return null

  const homeStrength = (19 - home.rank) / 18
  const awayStrength = (19 - away.rank) / 18
  const total = homeStrength + awayStrength + 0.3

  const homeWin = Math.round((homeStrength / total) * 100)
  const awayWin = Math.round((awayStrength / total) * 100)
  const draw = 100 - homeWin - awayWin

  return {
    homeWin: Math.max(homeWin, 5),
    draw: Math.max(draw, 5),
    awayWin: Math.max(awayWin, 5),
    home,
    away,
  }
}
