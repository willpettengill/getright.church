-- get-right.church full schema migration
-- Run this once against the connected Supabase project

-- ──────────────────────────────────────────
-- EXTENSIONS
-- ──────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ──────────────────────────────────────────
-- GEOGRAPHIES
-- ──────────────────────────────────────────
create table if not exists public.geographies (
  id            uuid primary key default gen_random_uuid(),
  slug          text unique not null,
  name          text not null,
  type          text not null check (type in ('federal', 'state', 'local')),
  parent_id     uuid references public.geographies(id) on delete set null,
  boundary_geojson jsonb,
  created_at    timestamptz default now()
);

-- ──────────────────────────────────────────
-- POLITICIANS
-- ──────────────────────────────────────────
create table if not exists public.politicians (
  id                  uuid primary key default gen_random_uuid(),
  slug                text unique not null,
  name                text not null,
  title               text,
  party               text,
  bio                 text,
  endorsement_status  text not null default 'watching'
                      check (endorsement_status in ('endorsed', 'anti-endorsed', 'watching')),
  geography_id        uuid references public.geographies(id) on delete set null,
  portrait_url        text,
  portrait_style      text default 'pixar-3d',
  office_held         text,
  years_in_office     int,
  geography_level     text check (geography_level in ('federal', 'state', 'local')),
  aggregate_sentiment numeric(5,2) default 0,
  policy_alignment    jsonb default '{}',
  created_at          timestamptz default now(),
  updated_at          timestamptz default now()
);

-- ──────────────────────────────────────────
-- POSTS (The Pulse)
-- ──────────────────────────────────────────
create table if not exists public.posts (
  id                  uuid primary key default gen_random_uuid(),
  source_platform     text not null,
  source_url          text,
  content_text        text,
  content_embed_html  text,
  sentiment_score     numeric(5,2) default 0,
  politician_ids      uuid[] default '{}',
  geography_id        uuid references public.geographies(id) on delete set null,
  approved            boolean default false,
  created_at          timestamptz default now()
);

-- ──────────────────────────────────────────
-- VOTES (Voting Record)
-- ──────────────────────────────────────────
create table if not exists public.votes (
  id              uuid primary key default gen_random_uuid(),
  politician_id   uuid not null references public.politicians(id) on delete cascade,
  bill_name       text not null,
  bill_id         text,
  vote_date       date,
  vote_result     text not null check (vote_result in ('yea', 'nay', 'abstain')),
  policy_category text,
  source_url      text,
  created_at      timestamptz default now()
);

-- ──────────────────────────────────────────
-- USERS (mirrors auth.users)
-- ──────────────────────────────────────────
create table if not exists public.users (
  id          uuid primary key references auth.users(id) on delete cascade,
  username    text unique,
  role        text not null default 'viewer' check (role in ('admin', 'member', 'viewer')),
  created_at  timestamptz default now()
);

-- ──────────────────────────────────────────
-- COMMENTS (The Talk)
-- ──────────────────────────────────────────
create table if not exists public.comments (
  id            uuid primary key default gen_random_uuid(),
  politician_id uuid not null references public.politicians(id) on delete cascade,
  user_id       uuid not null references public.users(id) on delete cascade,
  body          text not null,
  parent_id     uuid references public.comments(id) on delete cascade,
  upvotes       int default 0,
  downvotes     int default 0,
  flagged       boolean default false,
  created_at    timestamptz default now()
);

-- ──────────────────────────────────────────
-- ENTITIES (Network graph — donors, orgs, PACs)
-- ──────────────────────────────────────────
create table if not exists public.entities (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  type          text not null,
  description   text,
  external_url  text,
  created_at    timestamptz default now()
);

-- ──────────────────────────────────────────
-- RELATIONSHIPS (Network graph edges)
-- ──────────────────────────────────────────
create table if not exists public.relationships (
  id                uuid primary key default gen_random_uuid(),
  entity_a_id       uuid not null,
  entity_a_type     text not null,
  entity_b_id       uuid not null,
  entity_b_type     text not null,
  relationship_type text not null,
  weight            numeric(5,2) default 1,
  metadata_json     jsonb default '{}',
  created_at        timestamptz default now()
);

-- ──────────────────────────────────────────
-- ENDORSEMENT LOG
-- ──────────────────────────────────────────
create table if not exists public.endorsement_log (
  id                uuid primary key default gen_random_uuid(),
  politician_id     uuid not null references public.politicians(id) on delete cascade,
  previous_status   text,
  new_status        text not null,
  reason            text,
  changed_by        uuid references public.users(id) on delete set null,
  created_at        timestamptz default now()
);

-- ──────────────────────────────────────────
-- UPDATED_AT TRIGGER
-- ──────────────────────────────────────────
create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists politicians_updated_at on public.politicians;
create trigger politicians_updated_at
  before update on public.politicians
  for each row execute function public.handle_updated_at();

-- ──────────────────────────────────────────
-- AUTO-CREATE USER PROFILE ON SIGNUP
-- ──────────────────────────────────────────
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.users (id, username, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'username', split_part(new.email, '@', 1)),
    'viewer'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ──────────────────────────────────────────
-- ROW LEVEL SECURITY
-- ──────────────────────────────────────────

-- geographies: public read
alter table public.geographies enable row level security;
create policy "geographies_public_read" on public.geographies for select using (true);

-- politicians: public read
alter table public.politicians enable row level security;
create policy "politicians_public_read" on public.politicians for select using (true);
create policy "politicians_admin_all" on public.politicians for all
  using (exists (select 1 from public.users where id = auth.uid() and role = 'admin'))
  with check (exists (select 1 from public.users where id = auth.uid() and role = 'admin'));

-- posts: approved public read; admin all
alter table public.posts enable row level security;
create policy "posts_public_read" on public.posts for select using (approved = true);
create policy "posts_admin_all" on public.posts for all
  using (exists (select 1 from public.users where id = auth.uid() and role = 'admin'))
  with check (exists (select 1 from public.users where id = auth.uid() and role = 'admin'));

-- votes: public read
alter table public.votes enable row level security;
create policy "votes_public_read" on public.votes for select using (true);
create policy "votes_admin_all" on public.votes for all
  using (exists (select 1 from public.users where id = auth.uid() and role = 'admin'))
  with check (exists (select 1 from public.users where id = auth.uid() and role = 'admin'));

-- users: own profile read/update
alter table public.users enable row level security;
create policy "users_select_own" on public.users for select using (auth.uid() = id);
create policy "users_update_own" on public.users for update using (auth.uid() = id);
create policy "users_admin_all" on public.users for all
  using (exists (select 1 from public.users where id = auth.uid() and role = 'admin'))
  with check (exists (select 1 from public.users where id = auth.uid() and role = 'admin'));

-- comments: public read, members insert own, admin all
alter table public.comments enable row level security;
create policy "comments_public_read" on public.comments for select using (true);
create policy "comments_member_insert" on public.comments for insert
  with check (
    auth.uid() = user_id and
    exists (select 1 from public.users where id = auth.uid() and role in ('member', 'admin'))
  );
create policy "comments_own_update" on public.comments for update using (auth.uid() = user_id);
create policy "comments_own_delete" on public.comments for delete using (auth.uid() = user_id);
create policy "comments_admin_all" on public.comments for all
  using (exists (select 1 from public.users where id = auth.uid() and role = 'admin'))
  with check (exists (select 1 from public.users where id = auth.uid() and role = 'admin'));

-- entities: public read, admin write
alter table public.entities enable row level security;
create policy "entities_public_read" on public.entities for select using (true);
create policy "entities_admin_all" on public.entities for all
  using (exists (select 1 from public.users where id = auth.uid() and role = 'admin'))
  with check (exists (select 1 from public.users where id = auth.uid() and role = 'admin'));

-- relationships: public read, admin write
alter table public.relationships enable row level security;
create policy "relationships_public_read" on public.relationships for select using (true);
create policy "relationships_admin_all" on public.relationships for all
  using (exists (select 1 from public.users where id = auth.uid() and role = 'admin'))
  with check (exists (select 1 from public.users where id = auth.uid() and role = 'admin'));

-- endorsement_log: public read, admin write
alter table public.endorsement_log enable row level security;
create policy "endorsement_log_public_read" on public.endorsement_log for select using (true);
create policy "endorsement_log_admin_all" on public.endorsement_log for all
  using (exists (select 1 from public.users where id = auth.uid() and role = 'admin'))
  with check (exists (select 1 from public.users where id = auth.uid() and role = 'admin'));

-- ──────────────────────────────────────────
-- SEED DATA (demo)
-- ──────────────────────────────────────────
insert into public.geographies (slug, name, type) values
  ('us-federal', 'United States', 'federal'),
  ('ca', 'California', 'state'),
  ('tx', 'Texas', 'state'),
  ('ny', 'New York', 'state'),
  ('fl', 'Florida', 'state')
on conflict (slug) do nothing;

insert into public.politicians (slug, name, title, party, bio, endorsement_status, geography_level, office_held, years_in_office, aggregate_sentiment)
values
  ('jane-doe', 'Jane Doe', 'U.S. Senator', 'Independent', 'A fierce advocate for the people with a no-BS record on corporate accountability.', 'endorsed', 'federal', 'U.S. Senate', 6, 78),
  ('richard-cox', 'Richard Cox', 'U.S. Representative', 'Republican', 'Three-term congressman with a documented history of voting against working-class interests.', 'anti-endorsed', 'federal', 'U.S. House', 8, -62),
  ('maya-reyes', 'Maya Reyes', 'State Senator', 'Democrat', 'Rising voice in state politics. Watching her record closely.', 'watching', 'state', 'State Senate', 2, 12),
  ('bill-harris', 'Bill Harris', 'Mayor', 'Republican', 'Longtime incumbent. Mixed record on housing and transit.', 'watching', 'local', 'Mayor', 12, -8),
  ('sarah-chen', 'Sarah Chen', 'U.S. Representative', 'Democrat', 'One of the most progressive voices in Congress with a consistent record on climate and labor.', 'endorsed', 'federal', 'U.S. House', 4, 85)
on conflict (slug) do nothing;

insert into public.votes (politician_id, bill_name, bill_id, vote_date, vote_result, policy_category)
select p.id, v.bill_name, v.bill_id, v.vote_date::date, v.vote_result, v.policy_category
from public.politicians p
cross join (values
  ('Clean Energy Jobs Act', 'HR-1201', '2024-03-15', 'yea', 'climate'),
  ('Corporate Tax Reform', 'HR-2341', '2024-01-22', 'yea', 'economy'),
  ('Healthcare Expansion Act', 'S-891', '2023-11-10', 'yea', 'healthcare'),
  ('Housing for All Act', 'HR-3302', '2023-08-05', 'yea', 'housing'),
  ('Military Budget Amendment', 'S-441', '2023-05-18', 'nay', 'defense')
) as v(bill_name, bill_id, vote_date, vote_result, policy_category)
where p.slug = 'jane-doe'
on conflict do nothing;

insert into public.votes (politician_id, bill_name, bill_id, vote_date, vote_result, policy_category)
select p.id, v.bill_name, v.bill_id, v.vote_date::date, v.vote_result, v.policy_category
from public.politicians p
cross join (values
  ('Clean Energy Jobs Act', 'HR-1201', '2024-03-15', 'nay', 'climate'),
  ('Corporate Tax Reform', 'HR-2341', '2024-01-22', 'nay', 'economy'),
  ('Healthcare Expansion Act', 'S-891', '2023-11-10', 'nay', 'healthcare'),
  ('Deregulation Omnibus', 'HR-5501', '2023-09-12', 'yea', 'economy'),
  ('Voter ID Expansion', 'S-229', '2023-06-30', 'yea', 'rights')
) as v(bill_name, bill_id, vote_date, vote_result, policy_category)
where p.slug = 'richard-cox'
on conflict do nothing;

insert into public.posts (source_platform, source_url, content_text, sentiment_score, politician_ids, approved)
select
  platform,
  url,
  content,
  score,
  array[p.id],
  true
from public.politicians p
cross join (values
  ('tiktok', 'https://tiktok.com/@user/video/1', 'Jane Doe absolutely bodied that committee hearing. Nobody is checking for her like that.', 82),
  ('twitter', 'https://twitter.com/user/status/1', 'Sen. Doe just introduced the most comprehensive climate bill we''ve seen in a decade. This is real.', 75)
) as v(platform, url, content, score)
where p.slug = 'jane-doe'
on conflict do nothing;

insert into public.posts (source_platform, source_url, content_text, sentiment_score, politician_ids, approved)
select
  platform,
  url,
  content,
  score,
  array[p.id],
  true
from public.politicians p
cross join (values
  ('twitter', 'https://twitter.com/user/status/2', 'Rep. Cox voted NO on healthcare expansion for the 5th time. Who is he representing?', -70),
  ('tiktok', 'https://tiktok.com/@user/video/2', 'This is why we call him out. Look at this voting record. Criminal.', -80)
) as v(platform, url, content, score)
where p.slug = 'richard-cox'
on conflict do nothing;
