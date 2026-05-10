-- =====================================================================
-- nik volt — Supabase schema + RLS + Storage
-- Paste this into: Supabase dashboard → SQL Editor → New query → Run
-- Safe to re-run (uses IF NOT EXISTS / drop-and-recreate where needed).
-- =====================================================================

create extension if not exists "pgcrypto";

-- ---------- Enums ----------
do $$ begin
  create type submission_status as enum ('new', 'reviewing', 'quoted', 'scheduled', 'done', 'spam');
exception when duplicate_object then null; end $$;

do $$ begin
  create type submission_urgency as enum ('not-urgent', 'today', 'urgent');
exception when duplicate_object then null; end $$;

do $$ begin
  create type submission_property as enum ('apartment', 'house', 'shop', 'office');
exception when duplicate_object then null; end $$;

do $$ begin
  create type submission_category as enum (
    'no-power', 'fuse-trip', 'new-install', 'short-circuit', 'panel-replacement', 'other'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type risk_level as enum ('low', 'medium', 'high');
exception when duplicate_object then null; end $$;

-- ---------- submissions table ----------
create table if not exists public.submissions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  status submission_status not null default 'new',

  -- contact
  name text not null,
  phone text not null,

  -- problem
  location text not null,
  property_type submission_property not null,
  category submission_category not null,
  urgency submission_urgency not null,
  description text,
  burning_smell boolean not null default false,
  hot_panel boolean not null default false,
  sparking boolean not null default false,

  -- attachments (paths within the 'submissions' Storage bucket)
  photo_paths text[] not null default array[]::text[],

  -- client-computed risk (from src/lib/risk.ts)
  risk_level risk_level,
  risk_callout text,

  -- admin workflow
  admin_notes text,
  estimated_price_min int,
  estimated_price_max int,

  -- audit
  user_agent text,
  ip_hash text
);

create index if not exists submissions_created_at_idx on public.submissions (created_at desc);
create index if not exists submissions_status_idx     on public.submissions (status);
create index if not exists submissions_urgency_idx    on public.submissions (urgency);

-- ---------- Row Level Security ----------
alter table public.submissions enable row level security;

-- No anon access. Inserts go through /api/submissions which uses service_role.
-- Authenticated admins (anyone signed into Supabase Auth) get full access.

drop policy if exists "authenticated all" on public.submissions;
create policy "authenticated all" on public.submissions
  for all
  to authenticated
  using (true)
  with check (true);

-- ---------- Storage bucket ----------
insert into storage.buckets (id, name, public)
values ('submissions', 'submissions', false)
on conflict (id) do nothing;

-- Storage RLS: only authenticated users can read; uploads go through service_role.
drop policy if exists "authenticated read submissions bucket" on storage.objects;
create policy "authenticated read submissions bucket" on storage.objects
  for select
  to authenticated
  using (bucket_id = 'submissions');

-- ---------- Updated-at trigger (optional but useful) ----------
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.created_at = coalesce(new.created_at, now());
  return new;
end
$$ language plpgsql;

-- =====================================================================
-- After running this:
-- 1) Create your admin user manually:
--    Supabase dashboard → Authentication → Users → Add user → Create new user
--    Use your real email + a strong password. Confirm = true.
-- 2) That user is the only one who can sign into /uvid.
-- =====================================================================
