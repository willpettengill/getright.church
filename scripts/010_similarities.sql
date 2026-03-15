-- Migration 010: Pairwise politician vote similarity

CREATE TABLE IF NOT EXISTS public.politician_similarities (
  politician_a_id uuid NOT NULL REFERENCES public.politicians(id) ON DELETE CASCADE,
  politician_b_id uuid NOT NULL REFERENCES public.politicians(id) ON DELETE CASCADE,
  similarity      numeric(5,4) NOT NULL,
  shared_votes    integer NOT NULL DEFAULT 0,
  computed_at     timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (politician_a_id, politician_b_id),
  CHECK (politician_a_id < politician_b_id)
);

alter table public.politician_similarities enable row level security;
create policy "politician_similarities_public_read" on public.politician_similarities for select using (true);
create policy "politician_similarities_admin_all" on public.politician_similarities for all
  using (exists (select 1 from public.users where id = auth.uid() and role = 'admin'))
  with check (exists (select 1 from public.users where id = auth.uid() and role = 'admin'));
