/*
  Add core founder features:
  - connections
  - conversations, conversation_members, messages
  - pitch_materials (pitch_decks, pitch_videos)
  - funding_requests
  - investor_views
  - notifications
  - plans & subscriptions (basic)

  This migration creates tables and basic RLS policies so the frontend can operate
  against Supabase safely. Adjust RLS and indexes as needed for your security model.
*/

-- Create connections table (bi-directional connection requests)
create table if not exists public.connections (
  id uuid primary key default gen_random_uuid(),
  requester_id uuid not null references public.profiles(id) on delete cascade,
  target_id uuid not null references public.profiles(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending','accepted','rejected','blocked')),
  message text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  constraint single_request_per_pair unique (requester_id, target_id)
);

alter table public.connections enable row level security;

create policy "Connections: requester can manage"
  on public.connections
  for all
  using (requester_id = auth.uid())
  with check (requester_id = auth.uid());

create policy "Connections: target can view received"
  on public.connections
  for select
  using (target_id = auth.uid() or requester_id = auth.uid());

-- Conversations and messages for chat
create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  title text,
  is_group boolean default false,
  metadata jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.conversation_members (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  role text default 'member',
  joined_at timestamptz default now(),
  unique (conversation_id, profile_id)
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender_id uuid not null references public.profiles(id) on delete cascade,
  content text,
  metadata jsonb,
  created_at timestamptz default now(),
  edited_at timestamptz,
  deleted boolean default false
);

alter table public.conversations enable row level security;
alter table public.conversation_members enable row level security;
alter table public.messages enable row level security;

create policy "Conversations: member can view"
  on public.conversations
  for select
  using (exists (select 1 from public.conversation_members cm where cm.conversation_id = public.conversations.id and cm.profile_id = auth.uid()));

create policy "ConversationMembers: member access"
  on public.conversation_members
  for all
  using (profile_id = auth.uid())
  with check (profile_id = auth.uid());

create policy "Messages: members can select"
  on public.messages
  for select
  using (
    exists (
      select 1
      from public.conversation_members cm
      where cm.conversation_id = public.messages.conversation_id
        and cm.profile_id = auth.uid()
    )
  );

create policy "Messages: members can insert"
  on public.messages
  for insert
  with check (
    sender_id = auth.uid()
    and exists (
      select 1
      from public.conversation_members cm
      where cm.conversation_id = public.messages.conversation_id
        and cm.profile_id = auth.uid()
    )
  );

-- Pitch materials table (metadata only) - actual files kept in Supabase Storage buckets
create table if not exists public.pitch_materials (
  id uuid primary key default gen_random_uuid(),
  owner_profile_id uuid not null references public.profiles(id) on delete cascade,
  type text not null check (type in ('deck','video')),
  filename text,
  storage_path text,
  url text,
  pages int,
  duration_seconds int,
  visibility text default 'private' check (visibility in ('public','private')),
  reviewed boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.pitch_materials enable row level security;

create policy "PitchMaterials: owner access"
  on public.pitch_materials
  for all
  using (owner_profile_id = auth.uid())
  with check (owner_profile_id = auth.uid());

create policy "PitchMaterials: public view"
  on public.pitch_materials
  for select
  using (visibility = 'public' or owner_profile_id = auth.uid());

-- Funding requests (founder submits request to investors)
create table if not exists public.funding_requests (
  id uuid primary key default gen_random_uuid(),
  startup_id uuid not null references public.startup_profiles(id) on delete cascade,
  founder_id uuid not null references public.profiles(id) on delete cascade,
  title text,
  amount_requested numeric,
  currency text default 'USD',
  status text default 'pending' check (status in ('pending','reviewed','interested','meeting_scheduled','funded','declined')),
  pitch_material_id uuid references public.pitch_materials(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.funding_requests enable row level security;

create policy "FundingRequests: founder manage"
  on public.funding_requests
  for all
  using (founder_id = auth.uid())
  with check (founder_id = auth.uid());

create policy "FundingRequests: investors view public"
  on public.funding_requests
  for select
  using (exists (select 1 from public.pitch_materials pm where pm.id = public.funding_requests.pitch_material_id and pm.visibility = 'public') or founder_id = auth.uid());

-- Investor views: track who viewed which pitch
create table if not exists public.investor_views (
  id uuid primary key default gen_random_uuid(),
  investor_profile_id uuid not null references public.profiles(id) on delete cascade,
  pitch_material_id uuid not null references public.pitch_materials(id) on delete cascade,
  viewed_at timestamptz default now(),
  unique (investor_profile_id, pitch_material_id)
);

alter table public.investor_views enable row level security;

create policy "InvestorViews: can insert own"
  on public.investor_views
  for insert
  with check (investor_profile_id = auth.uid());

create policy "InvestorViews: can select own"
  on public.investor_views
  for select
  using (investor_profile_id = auth.uid());

-- Notifications table
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  type text not null,
  title text,
  body text,
  read boolean default false,
  data jsonb,
  created_at timestamptz default now()
);

alter table public.notifications enable row level security;

create policy "Notifications: users can manage own"
  on public.notifications
  for all
  using (profile_id = auth.uid())
  with check (profile_id = auth.uid());

-- Plans and subscriptions (minimal)
create table if not exists public.plans (
  id serial primary key,
  key text not null unique,
  name text not null,
  description text,
  monthly_price numeric,
  annual_price numeric
);

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  plan_key text not null references public.plans(key),
  status text default 'active' check (status in ('active','past_due','cancelled','trial')),
  started_at timestamptz default now(),
  ends_at timestamptz
);

alter table public.subscriptions enable row level security;

create policy "Subscriptions: owner access"
  on public.subscriptions
  for all
  using (profile_id = auth.uid())
  with check (profile_id = auth.uid());

-- Indexes to speed up lookups
create index if not exists idx_connections_requester on public.connections(requester_id);
create index if not exists idx_connections_target on public.connections(target_id);
create index if not exists idx_conversation_members_profile on public.conversation_members(profile_id);
create index if not exists idx_messages_conversation on public.messages(conversation_id, created_at desc);
create index if not exists idx_pitch_owner on public.pitch_materials(owner_profile_id);
create index if not exists idx_funding_startup on public.funding_requests(startup_id);
create index if not exists idx_notifications_profile on public.notifications(profile_id, created_at desc);

-- Insert plan definitions
insert into public.plans (key, name, description, monthly_price, annual_price)
values 
  ('free', 'Free', 'Basic access with limited features', 0, 0),
  ('basic', 'Basic', 'Essential features for startups', 29, 290),
  ('pro', 'Pro', 'Advanced features including pitch materials', 79, 790),
  ('premium', 'Premium', 'Full access to all features', 149, 1490)
on conflict (key) do nothing;

-- Function to auto-assign Free plan to new users
create or replace function public.handle_new_user_subscription()
returns trigger as $$
begin
  -- Check if user already has a subscription
  if not exists (select 1 from public.subscriptions where profile_id = new.id) then
    insert into public.subscriptions (profile_id, plan_key, status)
    values (new.id, 'free', 'active');
  end if;
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to auto-assign Free plan when new profile is created
drop trigger if exists on_profile_created_assign_plan on public.profiles;
create trigger on_profile_created_assign_plan
  after insert on public.profiles
  for each row
  execute function public.handle_new_user_subscription();

-- Set specific test user to Pro plan
-- First, find the profile ID for the email neelkayasth2645@gmail.com
do $$
declare
  v_profile_id uuid;
begin
  -- Get profile_id from auth.users table via email
  select p.id into v_profile_id
  from public.profiles p
  inner join auth.users u on u.id = p.id
  where u.email = 'neelkayasth2645@gmail.com';

  -- If profile exists, update or create Pro subscription
  if v_profile_id is not null then
    -- Delete existing subscription if any
    delete from public.subscriptions where profile_id = v_profile_id;
    
    -- Insert Pro subscription
    insert into public.subscriptions (profile_id, plan_key, status)
    values (v_profile_id, 'pro', 'active');
    
    raise notice 'Pro plan assigned to user: neelkayasth2645@gmail.com';
  else
    raise notice 'User neelkayasth2645@gmail.com not found in profiles table yet';
  end if;
end $$;

-- Helper function to count investor views for a founder
create or replace function public.count_investor_views_for_founder(founder_profile_id uuid)
returns bigint as $$
declare
  view_count bigint;
begin
  select count(distinct iv.id) into view_count
  from public.investor_views iv
  inner join public.pitch_materials pm on pm.id = iv.pitch_material_id
  where pm.owner_profile_id = founder_profile_id;
  
  return coalesce(view_count, 0);
end;
$$ language plpgsql security definer;

/* Done */
