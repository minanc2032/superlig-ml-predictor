# Süper Lig ML Predictor

Predict the next Turkish Süper Lig table with a Random Forest — same *idea* as [PL2025_ML_Predictor](https://github.com/Erik-Cupsa/PL2025_ML_Predictor), adapted for Turkey.

![Python](https://img.shields.io/badge/python-3.11%2B-blue)

## What it does

1. Loads historical Süper Lig match CSVs from [football-data.co.uk](https://www.football-data.co.uk/) (`T1.csv`)
2. Builds each season’s table (points, W/D/L, GF/GA, GD, played)
3. Trains a `RandomForestClassifier`: **season n stats → season n+1 finishing position**
4. Predicts 2025/26 using 2024/25 features + promoted/relegated club assumptions
5. Ranks clubs by **expected position** from `predict_proba`

This is a **toy / portfolio model**, not betting advice.

## Quickstart

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python predict_season.py
```

Refresh match data:

```bash
python scripts/download_data.py
```

## Web frontend

The Next.js site in [`web/`](web/) reads `web/public/data/predictions.json`. Regenerate it after retraining:

```bash
python scripts/export_predictions.py
```

A sample JSON is committed, so `cd web && npm i && npm run dev` works without Python. On Vercel, set the project **Root Directory to `web`**. See [`web/README.md`](web/README.md).

## 2025/26 squad assumptions

From the 2024/25 file (`T1_2425.csv`):

- **Relegated:** Ad. Demirspor, Hatayspor, Sivasspor, Bodrumspor
- **Promoted:** Kocaelispor, Genclerbirligi, Karagumruk  
  (promoted sides get the mean feature vector of the four relegated clubs)

League size varies historically (18–21); the model does not hardcode 20 like the PL script.

## Data

CSVs live in `data/` (committed for offline runs). Schema uses `HomeTeam`, `AwayTeam`, `FTHG`, `FTAG` — not the PL `Team 1` / `FT` string format.

## Limits

- Finishing position is noisy; held-out MAE is often several places
- Promoted clubs are poorly identified (shared default features)
- No injuries, transfers, xG, or schedule strength

## Layout

```text
predict_season.py
superlig_predictor/   # parse, season stats, model, CLI
scripts/download_data.py
data/T1_*.csv
```
