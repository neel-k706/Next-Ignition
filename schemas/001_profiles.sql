-- profiles schema
-- mirrors the Supabase migration to ensure local visibility

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  role text check (role in ('founder','cofounder','investor','expert','admin')),
  full_name text,
  location text,
  bio text,
  linkedin_url text,
  twitter_url text,
  website_url text,
  venture_name text,
  venture_description text,
  venture_industry text,
  venture_stage text,
  investment_focus text,
  investment_range text,
  portfolio_size text,
  expertise_areas text[],
  years_experience int,
  hourly_rate numeric,
  skills jsonb,
  onboarding_completed boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "Profiles are viewable by owner"
  on public.profiles
  for select
  using (auth.uid() = id);

create policy "Profiles are insertable by owner"
  on public.profiles
  for insert
  with check (auth.uid() = id);

create policy "Profiles are updatable by owner"
  on public.profiles
  for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- auto-create profile rows whenever a new auth user is registered
create or replace function public.handle_new_user()
returns trigger
security definer
set search_path = public
language plpgsql
as $$
begin
  insert into public.profiles (id, email, created_at, updated_at)
  values (new.id, new.email, now(), now())
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

