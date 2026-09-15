from __future__ import annotations

from pathlib import Path
from typing import Iterable, List, Sequence, Tuple

import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler

from superlig_predictor.data_io import (
    FEATURE_COLS,
    PROMOTED_2526,
    RELEGATED_2425,
    load_matches,
)
from superlig_predictor.season import summarise_season


def build_season_summaries(season_paths: Sequence[Path]) -> List[pd.DataFrame]:
    return [summarise_season(load_matches(path)) for path in season_paths]


def prepare_training_data(
    summaries: Sequence[pd.DataFrame],
) -> Tuple[pd.DataFrame, pd.Series]:
    """Use season n stats to predict season n+1 finishing position."""
    feature_rows = []
    targets = []
    for prev, curr in zip(summaries[:-1], summaries[1:]):
        prev_ix = prev.set_index("team")
        curr_ix = curr.set_index("team")
        bottom = prev_ix.sort_values(
            ["points", "goal_diff", "goals_for"], ascending=[True, True, True]
        ).head(3)
        default = bottom[FEATURE_COLS].mean().to_dict()
        for team, row in curr_ix.iterrows():
            if team in prev_ix.index:
                feats = prev_ix.loc[team, FEATURE_COLS].to_dict()
            else:
                feats = dict(default)
            feature_rows.append(feats)
            targets.append(int(row["position"]))
    return pd.DataFrame(feature_rows), pd.Series(targets, name="position")


def build_model() -> Pipeline:
    return Pipeline(
        [
            ("scaler", StandardScaler()),
            (
                "rf",
                RandomForestClassifier(
                    n_estimators=200,
                    max_depth=10,
                    random_state=42,
                    class_weight="balanced",
                ),
            ),
        ]
    )


def latest_features_for_next_season(latest: pd.DataFrame) -> pd.DataFrame:
    """Drop relegated sides; add promoted with mean features of relegated clubs."""
    latest_ix = latest.set_index("team")
    missing = [t for t in RELEGATED_2425 if t not in latest_ix.index]
    if missing:
        raise ValueError(f"Relegated teams not found in latest season CSV: {missing}")

    relegated_feats = latest_ix.loc[RELEGATED_2425, FEATURE_COLS]
    default = relegated_feats.mean().to_dict()

    keep = [t for t in latest_ix.index if t not in RELEGATED_2425]
    rows = []
    index = []
    for team in keep:
        rows.append(latest_ix.loc[team, FEATURE_COLS].to_dict())
        index.append(team)
    for team in PROMOTED_2526:
        rows.append(dict(default))
        index.append(team)
    return pd.DataFrame(rows, index=index)


def predict_table(model: Pipeline, features: pd.DataFrame) -> pd.DataFrame:
    probas = model.predict_proba(features)
    classes = model.named_steps["rf"].classes_
    expected = probas.dot(classes)
    out = pd.DataFrame(
        {
            "team": features.index,
            "expected_position": expected,
        }
    )
    out = out.sort_values("expected_position").reset_index(drop=True)
    out["predicted_rank"] = out.index + 1
    return out[["predicted_rank", "team", "expected_position"]]


def held_out_mae(summaries: Sequence[pd.DataFrame]) -> float | None:
    """Train on all but last transition; score last season positions."""
    if len(summaries) < 3:
        return None
    X, y = prepare_training_data(summaries[:-1])
    model = build_model()
    model.fit(X, y)
    prev, curr = summaries[-2], summaries[-1]
    prev_ix = prev.set_index("team")
    curr_ix = curr.set_index("team")
    bottom = prev_ix.sort_values(
        ["points", "goal_diff", "goals_for"], ascending=[True, True, True]
    ).head(3)
    default = bottom[FEATURE_COLS].mean().to_dict()
    rows = []
    actual = []
    teams = []
    for team, row in curr_ix.iterrows():
        feats = (
            prev_ix.loc[team, FEATURE_COLS].to_dict()
            if team in prev_ix.index
            else dict(default)
        )
        rows.append(feats)
        actual.append(int(row["position"]))
        teams.append(team)
    feats_df = pd.DataFrame(rows, index=teams)
    pred = predict_table(model, feats_df).set_index("team")
    err = 0.0
    for team, pos in zip(teams, actual):
        err += abs(float(pred.loc[team, "predicted_rank"]) - pos)
    return err / len(teams)
