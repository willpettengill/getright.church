-- Migration 009: Bills catalog table + extend votes

CREATE TABLE IF NOT EXISTS public.bills (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bill_id             text UNIQUE NOT NULL,
  name                text NOT NULL,
  description         text,
  policy_category     text NOT NULL,
  chamber             text NOT NULL CHECK (chamber IN ('house','senate','joint')),
  congress            integer,
  introduced_date     date,
  vote_date           date,
  party_position_dem  text CHECK (party_position_dem IN ('yea','nay','split','none')),
  party_position_rep  text CHECK (party_position_rep IN ('yea','nay','split','none')),
  is_bipartisan       boolean DEFAULT false,
  created_at          timestamptz NOT NULL DEFAULT now()
);

alter table public.bills enable row level security;
create policy "bills_public_read" on public.bills for select using (true);
create policy "bills_admin_all" on public.bills for all
  using (exists (select 1 from public.users where id = auth.uid() and role = 'admin'))
  with check (exists (select 1 from public.users where id = auth.uid() and role = 'admin'));

ALTER TABLE public.votes
  ADD COLUMN IF NOT EXISTS bill_uuid  uuid REFERENCES public.bills(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS party_vote text;
