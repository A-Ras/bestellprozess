-- supabase/migrations/001_initial_schema.sql

-- =========================================================
-- Tabelle: bestellungen
-- =========================================================
create table public.bestellungen (
  id uuid primary key default gen_random_uuid(),

  kundenname text,
  artikelnummer text,
  menge integer,

  bestelldatum date,
  lieferadresse text,

  status text not null default 'neu'
    check (status in (
      'neu',
      'in_pruefung',
      'fehlerhaft',
      'uebermittelt'
    )),

  fehlergrund text,
  erp_id text,
  rohdaten jsonb,

  erstellt_am timestamptz not null default now(),
  aktualisiert_am timestamptz not null default now(),

  -- Fehlergrund nur zulässig, wenn Status 'fehlerhaft'
  constraint chk_fehler_nur_bei_fehlerhaft
    check (fehlergrund is null or status = 'fehlerhaft'),

  -- Pflichtfelder nur erzwingen, wenn Status NICHT 'fehlerhaft' ist
  -- (so können unvollständige/ungültige Extraktionen sauber als 'fehlerhaft' protokolliert werden)
  constraint chk_vollstaendig_wenn_nicht_fehlerhaft
    check (
      status = 'fehlerhaft'
      or (
        kundenname is not null and length(trim(kundenname)) > 0
        and artikelnummer is not null and length(trim(artikelnummer)) > 0
        and menge is not null and menge > 0
        and bestelldatum is not null
      )
    )
);

-- =========================================================
-- Indizes für Dashboard-Abfragen
-- =========================================================
create index idx_bestellungen_status
  on public.bestellungen (status);

create index idx_bestellungen_erstellt_am
  on public.bestellungen (erstellt_am desc);

-- =========================================================
-- Trigger: aktualisiert_am automatisch setzen
-- =========================================================
create or replace function public.set_aktualisiert_am()
returns trigger
language plpgsql
as $$
begin
  new.aktualisiert_am = now();
  return new;
end;
$$;

create trigger trg_bestellungen_updated
before update on public.bestellungen
for each row
execute function public.set_aktualisiert_am();

-- =========================================================
-- Row Level Security
-- =========================================================
-- Schreiben erfolgt serverseitig über den Admin-/Service-Role-Client.
-- Authentifizierte Nutzer dürfen lesen (Dashboard).

alter table public.bestellungen enable row level security;

create policy "authenticated read"
  on public.bestellungen
  for select
  to authenticated
  using (true);

grant usage on schema public to authenticated, service_role;
grant select on table public.bestellungen to authenticated;
grant all on table public.bestellungen to service_role;  