-- Migration: add score columns to politicians, relax comments FK
-- Apply in Supabase dashboard or CLI before running npm run gen:types

ALTER TABLE public.politicians
  ADD COLUMN IF NOT EXISTS epstein_score numeric(5,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS blunch boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS is_squid boolean DEFAULT false;

-- Allow anonymous / seeded comments (drop NOT NULL on user_id)
ALTER TABLE public.comments ALTER COLUMN user_id DROP NOT NULL;

-- Update RLS policy to handle null user_id gracefully
DROP POLICY IF EXISTS comments_member_insert ON public.comments;
CREATE POLICY comments_member_insert ON public.comments
  FOR INSERT
  WITH CHECK (
    user_id IS NULL
    OR user_id = auth.uid()
  );
