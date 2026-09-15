from __future__ import annotations

import argparse
from pathlib import Path

from superlig_predictor.data_io import DEFAULT_SEASON_FILES, data_dir
from superlig_predictor.model import (
    build_model,
    build_season_summaries,
    held_out_mae,
    latest_features_for_next_season,
    prepare_training_data,
    predict_table,
)


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(
        description="Predict the next Turkish Süper Lig table with RandomForest."
    )
    parser.add_argument(
        "--data-dir",
        type=Path,
        default=None,
        help="Directory with T1_*.csv files (default: ./data)",
    )
    args = parser.parse_args(argv)

    ddir = args.data_dir or data_dir()
    paths = [ddir / name for name in DEFAULT_SEASON_FILES]
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

    print("Predicted Süper Lig 2025/26 table (1 = champion)")
    print("(toy portfolio model — not betting advice)\n")
    for _, row in table.iterrows():
        print(
            f"{int(row['predicted_rank']):2d}. {row['team']:<16} "
            f"(expected pos {row['expected_position']:.2f})"
        )
    if mae is not None:
        print(f"\nHeld-out MAE (2023/24 features → 2024/25 ranks): {mae:.2f} positions")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
