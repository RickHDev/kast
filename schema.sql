-- ============================================================
-- Kastbouwer - Cloudflare D1 schema
-- Toepassen:  wrangler d1 execute kast --remote --file=schema.sql
-- ============================================================

CREATE TABLE IF NOT EXISTS kast_ontwerpen (
  id          TEXT PRIMARY KEY,
  name        TEXT NOT NULL DEFAULT 'Mijn kast',
  data        TEXT NOT NULL,                       -- JSON
  created_at  TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS kast_sjablonen (
  id          TEXT PRIMARY KEY,
  name        TEXT NOT NULL,
  data        TEXT NOT NULL,                       -- JSON (alleen de indeling)
  created_at  TEXT NOT NULL DEFAULT (datetime('now'))
);
