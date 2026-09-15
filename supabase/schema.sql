-- Схема базы данных дашборда.
-- Выполнить целиком в Supabase: Project -> SQL Editor -> New query -> вставить -> Run.

create extension if not exists "pgcrypto";

create table if not exists offers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  network text not null check (network in ('leon', '1xbet')),
  cabinet_url text,
  start_date date not null default current_date,
  status text not null default 'active' check (status in ('active', 'archived')),
  created_at timestamptz not null default now(),
  archived_at timestamptz
);

create table if not exists stats_snapshots (
  id uuid primary key default gen_random_uuid(),
  offer_id uuid not null references offers (id) on delete cascade,
  snapshot_date date not null,
  clicks integer not null default 0,
  registrations integer not null default 0,
  ftd_count integer not null default 0,
  ftd_amount numeric(12, 2) not null default 0,
  revenue numeric(12, 2) not null default 0,
  created_at timestamptz not null default now(),
  unique (offer_id, snapshot_date)
);

create index if not exists stats_snapshots_offer_date_idx
  on stats_snapshots (offer_id, snapshot_date);

-- RLS включена, публичных политик нет: доступ только через service role key,
-- который используется исключительно на сервере (Next.js API), никогда в браузере.
alter table offers enable row level security;
alter table stats_snapshots enable row level security;
