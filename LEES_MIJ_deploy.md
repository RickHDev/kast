# Kastbouwer - installeren en deployen

Single-file tool (`index.html`), vanilla JS, Supabase voor opslag. Geen build-stap.

## 1. Supabase klaarzetten (eenmalig)

1. Ga naar je Supabase project (of maak een nieuw gratis project).
2. Open **SQL Editor > New query**, plak de inhoud van `supabase_setup.sql`, klik **Run**.
3. Ga naar **Project Settings > API** en kopieer:
   - **Project URL** (bv `https://abcd1234.supabase.co`)
   - **anon public** key

## 2. Keys invullen in index.html

Bovenin het bestand, in het CONFIG-blok:

```js
const SUPABASE_URL = "https://abcd1234.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGci...jouw_anon_key...";
```

Opslaan. Zonder deze twee waarden werkt de tekenfunctie nog wel, maar opslaan/laden niet.

## 3a. Deployen via Cloudflare Pages - direct upload (snelst)

1. Cloudflare dashboard > **Workers & Pages > Create > Pages > Upload assets**.
2. Sleep `index.html` erin (of een mapje met alleen dit bestand).
3. Deploy. Je krijgt een `*.pages.dev` URL. Klaar.

## 3b. Deployen via GitHub (jouw gewone flow)

In een nieuwe of bestaande repo (bv een `kast` repo onder `RickHDev`):

```bash
# nieuwe repo lokaal
mkdir kast && cd kast
git init
# zet index.html in deze map
git add index.html
git commit -m "Kastbouwer tool"
git branch -M main
git remote add origin https://github.com/RickHDev/kast.git
git push -u origin main
```

Daarna in Cloudflare Pages: **Create > Pages > Connect to Git**, kies de `kast` repo.
Build settings: framework preset **None**, build command leeg laten, output directory `/` (root).
Elke `git push` deployt automatisch.

## Let op: anon key staat in de client

De anon key is publiek leesbaar in de browser. Dat is normaal bij Supabase, maar betekent:
iedereen die je URL kent kan ontwerpen lezen/schrijven (met OPTIE 1 policy).
Voor een prive tool thuis is dat prima. Wil je echte afscherming met login, vraag me om
OPTIE 2 (Supabase Auth) uit te werken.

## Wat de tool kan

- Buitenmaat, diepte, plaatdikte, sokkel instellen
- Rijen toevoegen/verwijderen, hoogte per rij (0 = vult resterende ruimte)
- Per rij kolommen: open vak, vakkenkast met meerdere planken, vak met deur, apparaatvak
- Kolombreedte vast of 0 = "rest" (verdeelt automatisch)
- Live tekening op schaal met maatvoering
- Waarschuwingen (apparaatvak te smal/laag, kolommen breder dan kast)
- Zaaglijst met aantallen, CSV-export
- Ruwe OSB-kostenschatting (oppervlak + 15% zaagverlies)
- Meerdere ontwerpen opslaan en terughalen via Supabase
