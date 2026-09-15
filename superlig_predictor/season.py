from __future__ import annotations

from collections import defaultdict
from typing import Dict

import pandas as pd


def summarise_season(matches: pd.DataFrame) -> pd.DataFrame:
    """Per-team table stats + final ranking for one season."""
    teams: Dict[str, Dict[str, int]] = defaultdict(
        lambda: {
            "points": 0,
            "wins": 0,
            "draws": 0,
            "losses": 0,
            "goals_for": 0,
            "goals_against": 0,
            "played": 0,
        }
    )
    for _, row in matches.iterrows():
        home, away = row["HomeTeam"], row["AwayTeam"]
        hg, ag = int(row["home_goals"]), int(row["away_goals"])
        for team in (home, away):
            teams[team]["played"] += 1
        teams[home]["goals_for"] += hg
        teams[home]["goals_against"] += ag
        teams[away]["goals_for"] += ag
        teams[away]["goals_against"] += hg
        if hg > ag:
            teams[home]["points"] += 3
            teams[home]["wins"] += 1
            teams[away]["losses"] += 1
        elif hg < ag:
            teams[away]["points"] += 3
            teams[away]["wins"] += 1
            teams[home]["losses"] += 1
        else:
            teams[home]["points"] += 1
            teams[away]["points"] += 1
            teams[home]["draws"] += 1
            teams[away]["draws"] += 1

    rows = []
    for team, stats in teams.items():
        rows.append(
            {
                "team": team,
                **stats,
                "goal_diff": stats["goals_for"] - stats["goals_against"],
            }
        )
    summary = pd.DataFrame(rows)
    summary = summary.sort_values(
        ["points", "goal_diff", "goals_for"], ascending=[False, False, False]
    ).reset_index(drop=True)
    summary["position"] = summary.index + 1
    return summary
