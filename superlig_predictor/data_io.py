from __future__ import annotations

from pathlib import Path

import pandas as pd

FEATURE_COLS = [
    "points",
    "wins",
    "draws",
    "losses",
    "goals_for",
    "goals_against",
    "goal_diff",
    "played",
]

# Chronological season files (football-data.co.uk T1).
DEFAULT_SEASON_FILES = [
    "T1_1819.csv",
    "T1_1920.csv",
    "T1_2021.csv",
    "T1_2122.csv",
    "T1_2223.csv",
    "T1_2324.csv",
    "T1_2425.csv",
]

# 2025/26 assumptions from 2024/25 (names as in football-data CSVs).
RELEGATED_2425 = ["Ad. Demirspor", "Hatayspor", "Sivasspor", "Bodrumspor"]
PROMOTED_2526 = ["Kocaelispor", "Genclerbirligi", "Karagumruk"]


def project_root() -> Path:
    return Path(__file__).resolve().parents[1]


def data_dir() -> Path:
    return project_root() / "data"


def load_matches(path: Path) -> pd.DataFrame:
    df = pd.read_csv(path)
    required = {"HomeTeam", "AwayTeam", "FTHG", "FTAG"}
    missing = required - set(df.columns)
    if missing:
        raise ValueError(f"{path.name} missing columns: {sorted(missing)}")
    out = df.copy()
    out["home_goals"] = out["FTHG"].astype(int)
    out["away_goals"] = out["FTAG"].astype(int)
    return out
