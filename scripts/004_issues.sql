-- Migration: 004_issues.sql
-- Creates tables for political issues, politician positions on issues,
-- and community votes on issues.
-- Safe to re-run (IF NOT EXISTS guards throughout).

-- ---------------------------------------------------------------------------
-- issues
-- Political topics like gun-rights, climate, etc.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.issues (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        text        UNIQUE NOT NULL,
  title       text        NOT NULL,
  description text,
  category    text        NOT NULL,  -- 'civil-rights', 'economy', 'environment', 'healthcare', 'foreign-policy'
  created_at  timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.issues ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS issues_public_read ON public.issues;
CREATE POLICY issues_public_read ON public.issues
  FOR SELECT USING (true);

-- ---------------------------------------------------------------------------
-- politician_issue_positions
-- Tracks each politician's stated position on each issue.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.politician_issue_positions (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  politician_id uuid        NOT NULL REFERENCES public.politicians(id) ON DELETE CASCADE,
  issue_id      uuid        NOT NULL REFERENCES public.issues(id)      ON DELETE CASCADE,
  position      text        NOT NULL CHECK (position IN ('support', 'oppose', 'neutral')),
  notes         text,
  created_at    timestamptz NOT NULL DEFAULT now(),
  UNIQUE (politician_id, issue_id)
);

ALTER TABLE public.politician_issue_positions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS pip_public_read ON public.politician_issue_positions;
CREATE POLICY pip_public_read ON public.politician_issue_positions
  FOR SELECT USING (true);

-- ---------------------------------------------------------------------------
-- issue_votes
-- Community votes on issues. Anonymous-friendly: user_id may be NULL.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.issue_votes (
  id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  issue_id   uuid        NOT NULL REFERENCES public.issues(id) ON DELETE CASCADE,
  user_id    uuid        REFERENCES public.users(id) ON DELETE SET NULL,
  vote       text        NOT NULL CHECK (vote IN ('support', 'oppose', 'neutral')),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.issue_votes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS iv_public_read ON public.issue_votes;
CREATE POLICY iv_public_read ON public.issue_votes
  FOR SELECT USING (true);

DROP POLICY IF EXISTS iv_public_insert ON public.issue_votes;
CREATE POLICY iv_public_insert ON public.issue_votes
  FOR INSERT WITH CHECK (user_id IS NULL OR user_id = auth.uid());
