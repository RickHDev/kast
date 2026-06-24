-- ============================================================
-- Kastbouwer - Supabase setup
-- Draai dit een keer in de Supabase SQL Editor (project > SQL Editor > New query)
-- ============================================================

create table if not exists kast_ontwerpen (
  id          uuid primary key default gen_random_uuid(),
  name        text not null default 'Mijn kast',
  data        jsonb not null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Row Level Security aanzetten
alter table kast_ontwerpen enable row level security;

-- ============================================================
-- LET OP: keuze maken voor toegang
-- ============================================================

-- OPTIE 1 (simpel, voor prive gebruik thuis):
-- Iedereen met de anon key mag lezen en schrijven.
-- Prima voor een tool die alleen jij en je vrouw kennen via een niet-gedeelde URL.
create policy "anon volledige toegang"
  on kast_ontwerpen
  for all
  to anon
  using (true)
  with check (true);

-- OPTIE 2 (veiliger, met login):
-- Verwijder OPTIE 1 hierboven en gebruik Supabase Auth.
-- Voeg een kolom user_id toe en koppel rijen aan ingelogde gebruiker.
-- Vraag me om dit uit te werken als je login wilt.

-- ============================================================
-- updated_at automatisch bijwerken
-- ============================================================
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_updated_at on kast_ontwerpen;
create trigger trg_updated_at
  before update on kast_ontwerpen
  for each row execute function set_updated_at();

-- ============================================================
-- Eigen sjablonen (startvarianten die je zelf bewaart)
-- ============================================================
create table if not exists kast_sjablonen (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  data        jsonb not null,
  created_at  timestamptz not null default now()
);

alter table kast_sjablonen enable row level security;

-- Zelfde keuze als hierboven. Voor prive thuisgebruik (OPTIE 1):
create policy "anon volledige toegang sjablonen"
  on kast_sjablonen
  for all
  to anon
  using (true)
  with check (true);

