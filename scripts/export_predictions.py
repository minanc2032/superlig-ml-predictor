"""Export the 2025/26 Süper Lig prediction table as JSON for the web frontend.

Run from the repo root:
    python scripts/export_predictions.py

Writes web/public/data/predictions.json. Regenerate after retraining so the
frontend (which reads this file at build time, no Python at runtime) stays
in sync.
"""
from __future__ import annotations

import json
import sys
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from superlig_predictor.data_io import DEFAULT_SEASON_FILES, data_dir
from superlig_predictor.model import (
    build_model,
    build_season_summaries,
    held_out_mae,
    latest_features_for_next_season,
    predict_table,
    prepare_training_data,
)

OUT_PATH = ROOT / "web" / "public" / "data" / "predictions.json"

# raw CSV team name -> (display name, logo slug). Mirrors scripts/download_logos.py's
# TEAMS dict keys (slugs) and web/public/logos/*.png filenames. Kept as a local,
# manually-synced constant because download_logos.py performs live network calls
# at import time and is intentionally left untouched by this script.
TEAM_META: dict[str, tuple[str, str]] = {
    "Galatasaray": ("Galatasaray", "galatasaray"),
    "Fenerbahce": ("Fenerbahce", "fenerbahce"),
    "Besiktas": ("Besiktas", "besiktas"),
    "Trabzonspor": ("Trabzonspor", "trabzonspor"),
    "Buyuksehyr": ("Basaksehir", "basaksehir"),
    "Samsunspor": ("Samsunspor", "samsunspor"),
    "Goztep": ("Goztepe", "goztepe"),
    "Eyupspor": ("Eyupspor", "eyupspor"),
    "Konyaspor": ("Konyaspor", "konyaspor"),
    "Rizespor": ("Rizespor", "rizespor"),
    "Alanyaspor": ("Alanyaspor", "alanyaspor"),
    "Gaziantep": ("Gaziantep FK", "gaziantep"),
    "Genclerbirligi": ("Genclerbirligi", "genclerbirligi"),
    "Kocaelispor": ("Kocaelispor", "kocaelispor"),
    "Karagumruk": ("Karagumruk", "karagumruk"),
    "Kayserispor": ("Kayserispor", "kayserispor"),
    "Antalyaspor": ("Antalyaspor", "antalyaspor"),
    "Kasimpasa": ("Kasimpasa", "kasimpasa"),
}


def main() -> int:
    paths = [data_dir() / name for name in DEFAULT_SEASON_FILES]
    missing = [p for p in paths if not p.exists()]
    if missing:
        names = ", ".join(p.name for p in missing)
        raise SystemExit(
            f"Missing data files: {names}. Run: python scripts/download_data.py"
        )

    summaries = build_season_summaries(paths)
    X, y = prepare_training_data(summaries)
    model = build_model()
    model.fit(X, y)

    features = latest_features_for_next_season(summaries[-1])
    table = predict_table(model, features)
    mae = held_out_mae(summaries)

    last_season_position = summaries[-1].set_index("team")["position"].to_dict()

    predictions = []
    for _, row in table.iterrows():
        raw_name = row["team"]
        display_name, logo_slug = TEAM_META[raw_name]
        predictions.append(
            {
                "predicted_rank": int(row["predicted_rank"]),
                "team": display_name,
                "expected_position": round(float(row["expected_position"]), 2),
                "logo_slug": logo_slug,
                "last_season_position": last_season_position.get(raw_name),
            }
        )

    payload = {
        "meta": {
            "season": "2025/26",
            "teams": len(predictions),
            "mae": round(float(mae), 2) if mae is not None else None,
            "seasons_used": len(DEFAULT_SEASON_FILES),
            "trained_on": "2018/19-2024/25",
            "algorithm": "Random Forest Classifier",
            "generated_at": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        },
        "predictions": predictions,
    }

    OUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUT_PATH.write_text(json.dumps(payload, indent=2, ensure_ascii=False) + "\n")
    print(f"Wrote {OUT_PATH.relative_to(ROOT)} ({len(predictions)} teams, MAE {payload['meta']['mae']})")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
