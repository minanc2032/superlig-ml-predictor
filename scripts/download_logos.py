"""Download Süper Lig team logos from Wikipedia."""
import urllib.request
import urllib.parse
import json
import os
import time

OUT_DIR = os.path.join(os.path.dirname(__file__), "../web/public/logos")
os.makedirs(OUT_DIR, exist_ok=True)

TEAMS = {
    "galatasaray":    "Galatasaray_S.K._(football)",
    "fenerbahce":     "Fenerbahçe_S.K._(football)",
    "besiktas":       "Beşiktaş_J.K._(football)",
    "trabzonspor":    "Trabzonspor",
    "basaksehir":     "İstanbul_Başakşehir_FK",
    "samsunspor":     "Samsunspor",
    "goztepe":        "Göztepe_S.K._(football)",
    "eyupspor":       "Eyüpspor_(football)",
    "konyaspor":      "Konyaspor",
    "rizespor":       "Çaykur_Rizespor",
    "alanyaspor":     "Alanyaspor",
    "gaziantep":      "Gaziantep_FK",
    "genclerbirligi": "Gençlerbirliği_S.K.",
    "kocaelispor":    "Kocaelispor",
    "karagumruk":     "Fatih_Karagümrük_SK",
    "kayserispor":    "Kayserispor",
    "antalyaspor":    "Antalyaspor",
    "kasimpasa":      "Kasımpaşa_S.K._(football)",
}

HEADERS = {"User-Agent": "SuperligLogoBot/1.0 (educational project)"}

def get_logo_url(wiki_title: str) -> str | None:
    params = urllib.parse.urlencode({
        "action": "query",
        "titles": wiki_title,
        "prop": "pageimages",
        "format": "json",
        "pithumbsize": 200,
        "pilimit": 1,
    })
    api_url = f"https://en.wikipedia.org/w/api.php?{params}"
    req = urllib.request.Request(api_url, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=10) as resp:
        data = json.loads(resp.read())
    pages = data.get("query", {}).get("pages", {})
    for page in pages.values():
        thumb = page.get("thumbnail", {})
        if thumb.get("source"):
            return thumb["source"]
    return None

def download(url: str, dest: str) -> bool:
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=15) as resp:
        data = resp.read()
    if len(data) < 500:
        return False
    with open(dest, "wb") as f:
        f.write(data)
    return True

for slug, wiki_title in TEAMS.items():
    dest = os.path.join(OUT_DIR, f"{slug}.png")
    if os.path.exists(dest) and os.path.getsize(dest) > 500:
        print(f"  skip  {slug} (cached)")
        continue
    try:
        logo_url = get_logo_url(wiki_title)
        if not logo_url:
            print(f"  miss  {slug} — no image found on Wikipedia")
            continue
        ok = download(logo_url, dest)
        status = "  ok  " if ok else "  tiny "
        print(f"{status} {slug} <- {logo_url}")
    except Exception as e:
        print(f"  err  {slug}: {e}")
    time.sleep(0.4)

print("\nDone. Logos saved to:", OUT_DIR)
