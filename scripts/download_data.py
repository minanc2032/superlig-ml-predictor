#!/usr/bin/env python3
"""Download Süper Lig match CSVs from football-data.co.uk into data/."""

from __future__ import annotations

import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "data"

SEASONS = {
    "1819": "https://www.football-data.co.uk/mmz4281/1819/T1.csv",
    "1920": "https://www.football-data.co.uk/mmz4281/1920/T1.csv",
    "2021": "https://www.football-data.co.uk/mmz4281/2021/T1.csv",
    "2122": "https://www.football-data.co.uk/mmz4281/2122/T1.csv",
    "2223": "https://www.football-data.co.uk/mmz4281/2223/T1.csv",
    "2324": "https://www.football-data.co.uk/mmz4281/2324/T1.csv",
    "2425": "https://www.football-data.co.uk/mmz4281/2425/T1.csv",
}


def main() -> None:
    DATA.mkdir(parents=True, exist_ok=True)
    for code, url in SEASONS.items():
        dest = DATA / f"T1_{code}.csv"
        print(f"Fetching {url} -> {dest.name}")
        urllib.request.urlretrieve(url, dest)
        print(f"  wrote {dest.stat().st_size} bytes")


if __name__ == "__main__":
    main()
