# Kastbouwer

Single-file teken-/calculatietool voor kasten (OSB), met opslag op **Cloudflare D1**
via Pages Functions. Geen build-stap.

## Wat de tool kan
- Buitenmaat, diepte, plaatdikte, sokkel instellen
- Rijen/kolommen: open vak, vakkenkast, vak met deur, apparaatvak
- Live tekening op schaal met maatvoering + waarschuwingen
- Zaaglijst met CSV-export en ruwe OSB-kostenschatting
- Meerdere ontwerpen en eigen sjablonen opslaan (cloud, gedeeld tussen apparaten)

## Structuur
```
public/index.html          de tool (frontend)
functions/api/[[path]].js  API op Cloudflare D1
schema.sql                 databaseschema
wrangler.toml              Pages-config + D1-binding (DB)
```

## Deploy (Cloudflare Pages, gekoppeld aan deze repo)
- Pages-project gekoppeld aan `RickHDev/kast`. Elke push naar `main` deployt.
- Build command: leeg. Output directory: `public` (uit `wrangler.toml`).
- D1-binding `DB` -> database `kast` (zit in `wrangler.toml`).

## Lokaal draaien
```bash
npx wrangler pages dev public
```

## Schema (her)toepassen
```bash
npx wrangler d1 execute kast --remote --file=schema.sql
```
