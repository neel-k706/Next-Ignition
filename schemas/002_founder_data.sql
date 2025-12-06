-- founder data schema: startup profile + meetings + activity feed

create extension if not exists "pgcrypto";

create table if not exists public.startup_profiles (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  description text,
  industry text,
  stage text,
  website text,
  is_public boolean default true,
  pitch_deck_url text,
  pitch_deck_uploaded_at timestamptz,
  pitch_video_url text,
  pitch_video_uploaded_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  constraint startup_profiles_owner_unique unique(owner_id)
);

alter table public.startup_profiles enable row level security;

create policy "Founders can view their startup profile"
  on public.startup_profiles
  for select
  using (owner_id = auth.uid());

create policy "Founders can upsert their startup profile"
  on public.startup_profiles
  for all
  using (owner_id = auth.uid())
  with check (owner_id = auth.uid());

create table if not exists public.founder_meetings (
  id uuid primary key default gen_random_uuid(),
  founder_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  participant_name text,
  scheduled_for timestamptz not null,
  duration_minutes integer,
  status text default 'scheduled' check (status in ('scheduled','accepted','completed','cancelled')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists founder_meetings_founder_idx on public.founder_meetings(founder_id, scheduled_for);

alter table public.founder_meetings enable row level security;

create policy "Founders can read their meetings"
  on public.founder_meetings
  for select
  using (founder_id = auth.uid());

create policy "Founders can manage their meetings"
  on public.founder_meetings
  for all
  using (founder_id = auth.uid())
  with check (founder_id = auth.uid());

create table if not exists public.founder_activities (
  id uuid primary key default gen_random_uuid(),
  founder_id uuid not null references public.profiles(id) on delete cascade,
  type text not null check (type in ('connection_request','message','investment_opp','system')),
  title text not null,
  subtitle text,
  created_at timestamptz default now()
);

create index if not exists founder_activities_founder_idx on public.founder_activities(founder_id, created_at desc);

alter table public.founder_activities enable row level security;

create policy "Founders can read their activities"
  on public.founder_activities
  for select
  using (founder_id = auth.uid());

create policy "Founders can insert their activities"
  on public.founder_activities
  for insert
  with check (founder_id = auth.uid());

