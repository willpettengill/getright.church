-- Seed: 006_seed_issues.sql
-- Seeds 8 political issues, politician positions on each issue,
-- and anonymous community vote distributions.
-- Safe to re-run (ON CONFLICT DO UPDATE / DELETE+INSERT patterns).

-- ===========================================================================
-- ISSUES
-- ===========================================================================

INSERT INTO public.issues (slug, title, description, category)
VALUES
  ('gun-rights',   'Gun Rights & Safety',
   'Second Amendment rights, background checks, assault weapons regulations',
   'civil-rights'),

  ('immigration',  'Immigration & Border Policy',
   'Border security, pathways to citizenship, asylum processes, immigration enforcement',
   'civil-rights'),

  ('healthcare',   'Healthcare Access',
   'Universal coverage, Medicare expansion, pharmaceutical pricing, insurance reform',
   'healthcare'),

  ('climate',      'Climate & Environment',
   'Climate legislation, fossil fuel regulation, clean energy investment, environmental protections',
   'environment'),

  ('corruption',   'Anti-Corruption & Transparency',
   'Campaign finance reform, lobbying regulations, government transparency, ethics enforcement',
   'civil-rights'),

  ('taxes',        'Tax Policy',
   'Progressive vs. flat taxation, corporate tax rates, wealth taxes, fiscal policy',
   'economy'),

  ('abortion',     'Reproductive Rights',
   'Abortion access, Roe v. Wade, state-level restrictions, reproductive healthcare',
   'civil-rights'),

  ('trade',        'Trade & Economic Policy',
   'Free trade agreements, tariffs, domestic manufacturing, worker protections in trade',
   'economy')

ON CONFLICT (slug) DO UPDATE SET
  title       = EXCLUDED.title,
  description = EXCLUDED.description,
  category    = EXCLUDED.category;

-- ===========================================================================
-- POLITICIAN ISSUE POSITIONS
-- Clear existing seed data then re-insert for full idempotency.
-- ===========================================================================

DELETE FROM public.politician_issue_positions
WHERE politician_id IN (
  SELECT id FROM public.politicians
  WHERE slug IN (
    'jane-doe', 'richard-cox', 'maya-reyes', 'bill-harris',
    'sarah-chen', 'marcus-webb', 'diane-okafor', 'tomas-rivera',
    'patricia-holloway', 'andre-jackson', 'linda-fujimoto', 'greg-perkins'
  )
)
AND issue_id IN (
  SELECT id FROM public.issues
  WHERE slug IN (
    'gun-rights', 'immigration', 'healthcare', 'climate',
    'corruption', 'taxes', 'abortion', 'trade'
  )
);

-- ---------------------------------------------------------------------------
-- jane-doe
-- ---------------------------------------------------------------------------
INSERT INTO public.politician_issue_positions (politician_id, issue_id, position)
SELECT p.id, i.id, 'neutral'
FROM public.politicians p, public.issues i
WHERE p.slug = 'jane-doe' AND i.slug = 'gun-rights'
ON CONFLICT (politician_id, issue_id) DO UPDATE SET position = EXCLUDED.position;

INSERT INTO public.politician_issue_positions (politician_id, issue_id, position)
SELECT p.id, i.id, 'support'
FROM public.politicians p, public.issues i
WHERE p.slug = 'jane-doe' AND i.slug = 'immigration'
ON CONFLICT (politician_id, issue_id) DO UPDATE SET position = EXCLUDED.position;

INSERT INTO public.politician_issue_positions (politician_id, issue_id, position)
SELECT p.id, i.id, 'support'
FROM public.politicians p, public.issues i
WHERE p.slug = 'jane-doe' AND i.slug = 'healthcare'
ON CONFLICT (politician_id, issue_id) DO UPDATE SET position = EXCLUDED.position;

INSERT INTO public.politician_issue_positions (politician_id, issue_id, position)
SELECT p.id, i.id, 'support'
FROM public.politicians p, public.issues i
WHERE p.slug = 'jane-doe' AND i.slug = 'climate'
ON CONFLICT (politician_id, issue_id) DO UPDATE SET position = EXCLUDED.position;

INSERT INTO public.politician_issue_positions (politician_id, issue_id, position)
SELECT p.id, i.id, 'support'
FROM public.politicians p, public.issues i
WHERE p.slug = 'jane-doe' AND i.slug = 'corruption'
ON CONFLICT (politician_id, issue_id) DO UPDATE SET position = EXCLUDED.position;

INSERT INTO public.politician_issue_positions (politician_id, issue_id, position)
SELECT p.id, i.id, 'support'
FROM public.politicians p, public.issues i
WHERE p.slug = 'jane-doe' AND i.slug = 'taxes'
ON CONFLICT (politician_id, issue_id) DO UPDATE SET position = EXCLUDED.position;

INSERT INTO public.politician_issue_positions (politician_id, issue_id, position)
SELECT p.id, i.id, 'support'
FROM public.politicians p, public.issues i
WHERE p.slug = 'jane-doe' AND i.slug = 'abortion'
ON CONFLICT (politician_id, issue_id) DO UPDATE SET position = EXCLUDED.position;

INSERT INTO public.politician_issue_positions (politician_id, issue_id, position)
SELECT p.id, i.id, 'neutral'
FROM public.politicians p, public.issues i
WHERE p.slug = 'jane-doe' AND i.slug = 'trade'
ON CONFLICT (politician_id, issue_id) DO UPDATE SET position = EXCLUDED.position;

-- ---------------------------------------------------------------------------
-- richard-cox
-- ---------------------------------------------------------------------------
INSERT INTO public.politician_issue_positions (politician_id, issue_id, position)
SELECT p.id, i.id, 'support'
FROM public.politicians p, public.issues i
WHERE p.slug = 'richard-cox' AND i.slug = 'gun-rights'
ON CONFLICT (politician_id, issue_id) DO UPDATE SET position = EXCLUDED.position;

INSERT INTO public.politician_issue_positions (politician_id, issue_id, position)
SELECT p.id, i.id, 'oppose'
FROM public.politicians p, public.issues i
WHERE p.slug = 'richard-cox' AND i.slug = 'immigration'
ON CONFLICT (politician_id, issue_id) DO UPDATE SET position = EXCLUDED.position;

INSERT INTO public.politician_issue_positions (politician_id, issue_id, position)
SELECT p.id, i.id, 'oppose'
FROM public.politicians p, public.issues i
WHERE p.slug = 'richard-cox' AND i.slug = 'healthcare'
ON CONFLICT (politician_id, issue_id) DO UPDATE SET position = EXCLUDED.position;

INSERT INTO public.politician_issue_positions (politician_id, issue_id, position)
SELECT p.id, i.id, 'oppose'
FROM public.politicians p, public.issues i
WHERE p.slug = 'richard-cox' AND i.slug = 'climate'
ON CONFLICT (politician_id, issue_id) DO UPDATE SET position = EXCLUDED.position;

INSERT INTO public.politician_issue_positions (politician_id, issue_id, position)
SELECT p.id, i.id, 'oppose'
FROM public.politicians p, public.issues i
WHERE p.slug = 'richard-cox' AND i.slug = 'corruption'
ON CONFLICT (politician_id, issue_id) DO UPDATE SET position = EXCLUDED.position;

INSERT INTO public.politician_issue_positions (politician_id, issue_id, position)
SELECT p.id, i.id, 'oppose'
FROM public.politicians p, public.issues i
WHERE p.slug = 'richard-cox' AND i.slug = 'taxes'
ON CONFLICT (politician_id, issue_id) DO UPDATE SET position = EXCLUDED.position;

INSERT INTO public.politician_issue_positions (politician_id, issue_id, position)
SELECT p.id, i.id, 'oppose'
FROM public.politicians p, public.issues i
WHERE p.slug = 'richard-cox' AND i.slug = 'abortion'
ON CONFLICT (politician_id, issue_id) DO UPDATE SET position = EXCLUDED.position;

INSERT INTO public.politician_issue_positions (politician_id, issue_id, position)
SELECT p.id, i.id, 'neutral'
FROM public.politicians p, public.issues i
WHERE p.slug = 'richard-cox' AND i.slug = 'trade'
ON CONFLICT (politician_id, issue_id) DO UPDATE SET position = EXCLUDED.position;

-- ---------------------------------------------------------------------------
-- maya-reyes
-- ---------------------------------------------------------------------------
INSERT INTO public.politician_issue_positions (politician_id, issue_id, position)
SELECT p.id, i.id, 'oppose'
FROM public.politicians p, public.issues i
WHERE p.slug = 'maya-reyes' AND i.slug = 'gun-rights'
ON CONFLICT (politician_id, issue_id) DO UPDATE SET position = EXCLUDED.position;

INSERT INTO public.politician_issue_positions (politician_id, issue_id, position)
SELECT p.id, i.id, 'support'
FROM public.politicians p, public.issues i
WHERE p.slug = 'maya-reyes' AND i.slug = 'immigration'
ON CONFLICT (politician_id, issue_id) DO UPDATE SET position = EXCLUDED.position;

INSERT INTO public.politician_issue_positions (politician_id, issue_id, position)
SELECT p.id, i.id, 'support'
FROM public.politicians p, public.issues i
WHERE p.slug = 'maya-reyes' AND i.slug = 'healthcare'
ON CONFLICT (politician_id, issue_id) DO UPDATE SET position = EXCLUDED.position;

INSERT INTO public.politician_issue_positions (politician_id, issue_id, position)
SELECT p.id, i.id, 'support'
FROM public.politicians p, public.issues i
WHERE p.slug = 'maya-reyes' AND i.slug = 'climate'
ON CONFLICT (politician_id, issue_id) DO UPDATE SET position = EXCLUDED.position;

INSERT INTO public.politician_issue_positions (politician_id, issue_id, position)
SELECT p.id, i.id, 'support'
FROM public.politicians p, public.issues i
WHERE p.slug = 'maya-reyes' AND i.slug = 'corruption'
ON CONFLICT (politician_id, issue_id) DO UPDATE SET position = EXCLUDED.position;

INSERT INTO public.politician_issue_positions (politician_id, issue_id, position)
SELECT p.id, i.id, 'support'
FROM public.politicians p, public.issues i
WHERE p.slug = 'maya-reyes' AND i.slug = 'taxes'
ON CONFLICT (politician_id, issue_id) DO UPDATE SET position = EXCLUDED.position;

INSERT INTO public.politician_issue_positions (politician_id, issue_id, position)
SELECT p.id, i.id, 'support'
FROM public.politicians p, public.issues i
WHERE p.slug = 'maya-reyes' AND i.slug = 'abortion'
ON CONFLICT (politician_id, issue_id) DO UPDATE SET position = EXCLUDED.position;

INSERT INTO public.politician_issue_positions (politician_id, issue_id, position)
SELECT p.id, i.id, 'neutral'
FROM public.politicians p, public.issues i
WHERE p.slug = 'maya-reyes' AND i.slug = 'trade'
ON CONFLICT (politician_id, issue_id) DO UPDATE SET position = EXCLUDED.position;

-- ---------------------------------------------------------------------------
-- bill-harris
-- ---------------------------------------------------------------------------
INSERT INTO public.politician_issue_positions (politician_id, issue_id, position)
SELECT p.id, i.id, 'support'
FROM public.politicians p, public.issues i
WHERE p.slug = 'bill-harris' AND i.slug = 'gun-rights'
ON CONFLICT (politician_id, issue_id) DO UPDATE SET position = EXCLUDED.position;

INSERT INTO public.politician_issue_positions (politician_id, issue_id, position)
SELECT p.id, i.id, 'neutral'
FROM public.politicians p, public.issues i
WHERE p.slug = 'bill-harris' AND i.slug = 'immigration'
ON CONFLICT (politician_id, issue_id) DO UPDATE SET position = EXCLUDED.position;

INSERT INTO public.politician_issue_positions (politician_id, issue_id, position)
SELECT p.id, i.id, 'oppose'
FROM public.politicians p, public.issues i
WHERE p.slug = 'bill-harris' AND i.slug = 'healthcare'
ON CONFLICT (politician_id, issue_id) DO UPDATE SET position = EXCLUDED.position;

INSERT INTO public.politician_issue_positions (politician_id, issue_id, position)
SELECT p.id, i.id, 'neutral'
FROM public.politicians p, public.issues i
WHERE p.slug = 'bill-harris' AND i.slug = 'climate'
ON CONFLICT (politician_id, issue_id) DO UPDATE SET position = EXCLUDED.position;

INSERT INTO public.politician_issue_positions (politician_id, issue_id, position)
SELECT p.id, i.id, 'neutral'
FROM public.politicians p, public.issues i
WHERE p.slug = 'bill-harris' AND i.slug = 'corruption'
ON CONFLICT (politician_id, issue_id) DO UPDATE SET position = EXCLUDED.position;

INSERT INTO public.politician_issue_positions (politician_id, issue_id, position)
SELECT p.id, i.id, 'oppose'
FROM public.politicians p, public.issues i
WHERE p.slug = 'bill-harris' AND i.slug = 'taxes'
ON CONFLICT (politician_id, issue_id) DO UPDATE SET position = EXCLUDED.position;

INSERT INTO public.politician_issue_positions (politician_id, issue_id, position)
SELECT p.id, i.id, 'oppose'
FROM public.politicians p, public.issues i
WHERE p.slug = 'bill-harris' AND i.slug = 'abortion'
ON CONFLICT (politician_id, issue_id) DO UPDATE SET position = EXCLUDED.position;

INSERT INTO public.politician_issue_positions (politician_id, issue_id, position)
SELECT p.id, i.id, 'neutral'
FROM public.politicians p, public.issues i
WHERE p.slug = 'bill-harris' AND i.slug = 'trade'
ON CONFLICT (politician_id, issue_id) DO UPDATE SET position = EXCLUDED.position;

-- ---------------------------------------------------------------------------
-- sarah-chen
-- ---------------------------------------------------------------------------
INSERT INTO public.politician_issue_positions (politician_id, issue_id, position)
SELECT p.id, i.id, 'oppose'
FROM public.politicians p, public.issues i
WHERE p.slug = 'sarah-chen' AND i.slug = 'gun-rights'
ON CONFLICT (politician_id, issue_id) DO UPDATE SET position = EXCLUDED.position;

INSERT INTO public.politician_issue_positions (politician_id, issue_id, position)
SELECT p.id, i.id, 'support'
FROM public.politicians p, public.issues i
WHERE p.slug = 'sarah-chen' AND i.slug = 'immigration'
ON CONFLICT (politician_id, issue_id) DO UPDATE SET position = EXCLUDED.position;

INSERT INTO public.politician_issue_positions (politician_id, issue_id, position)
SELECT p.id, i.id, 'support'
FROM public.politicians p, public.issues i
WHERE p.slug = 'sarah-chen' AND i.slug = 'healthcare'
ON CONFLICT (politician_id, issue_id) DO UPDATE SET position = EXCLUDED.position;

INSERT INTO public.politician_issue_positions (politician_id, issue_id, position)
SELECT p.id, i.id, 'support'
FROM public.politicians p, public.issues i
WHERE p.slug = 'sarah-chen' AND i.slug = 'climate'
ON CONFLICT (politician_id, issue_id) DO UPDATE SET position = EXCLUDED.position;

INSERT INTO public.politician_issue_positions (politician_id, issue_id, position)
SELECT p.id, i.id, 'support'
FROM public.politicians p, public.issues i
WHERE p.slug = 'sarah-chen' AND i.slug = 'corruption'
ON CONFLICT (politician_id, issue_id) DO UPDATE SET position = EXCLUDED.position;

INSERT INTO public.politician_issue_positions (politician_id, issue_id, position)
SELECT p.id, i.id, 'support'
FROM public.politicians p, public.issues i
WHERE p.slug = 'sarah-chen' AND i.slug = 'taxes'
ON CONFLICT (politician_id, issue_id) DO UPDATE SET position = EXCLUDED.position;

INSERT INTO public.politician_issue_positions (politician_id, issue_id, position)
SELECT p.id, i.id, 'support'
FROM public.politicians p, public.issues i
WHERE p.slug = 'sarah-chen' AND i.slug = 'abortion'
ON CONFLICT (politician_id, issue_id) DO UPDATE SET position = EXCLUDED.position;

INSERT INTO public.politician_issue_positions (politician_id, issue_id, position)
SELECT p.id, i.id, 'neutral'
FROM public.politicians p, public.issues i
WHERE p.slug = 'sarah-chen' AND i.slug = 'trade'
ON CONFLICT (politician_id, issue_id) DO UPDATE SET position = EXCLUDED.position;

-- ---------------------------------------------------------------------------
-- marcus-webb
-- ---------------------------------------------------------------------------
INSERT INTO public.politician_issue_positions (politician_id, issue_id, position)
SELECT p.id, i.id, 'support'
FROM public.politicians p, public.issues i
WHERE p.slug = 'marcus-webb' AND i.slug = 'gun-rights'
ON CONFLICT (politician_id, issue_id) DO UPDATE SET position = EXCLUDED.position;

INSERT INTO public.politician_issue_positions (politician_id, issue_id, position)
SELECT p.id, i.id, 'oppose'
FROM public.politicians p, public.issues i
WHERE p.slug = 'marcus-webb' AND i.slug = 'immigration'
ON CONFLICT (politician_id, issue_id) DO UPDATE SET position = EXCLUDED.position;

INSERT INTO public.politician_issue_positions (politician_id, issue_id, position)
SELECT p.id, i.id, 'oppose'
FROM public.politicians p, public.issues i
WHERE p.slug = 'marcus-webb' AND i.slug = 'healthcare'
ON CONFLICT (politician_id, issue_id) DO UPDATE SET position = EXCLUDED.position;

INSERT INTO public.politician_issue_positions (politician_id, issue_id, position)
SELECT p.id, i.id, 'oppose'
FROM public.politicians p, public.issues i
WHERE p.slug = 'marcus-webb' AND i.slug = 'climate'
ON CONFLICT (politician_id, issue_id) DO UPDATE SET position = EXCLUDED.position;

INSERT INTO public.politician_issue_positions (politician_id, issue_id, position)
SELECT p.id, i.id, 'neutral'
FROM public.politicians p, public.issues i
WHERE p.slug = 'marcus-webb' AND i.slug = 'corruption'
ON CONFLICT (politician_id, issue_id) DO UPDATE SET position = EXCLUDED.position;

INSERT INTO public.politician_issue_positions (politician_id, issue_id, position)
SELECT p.id, i.id, 'oppose'
FROM public.politicians p, public.issues i
WHERE p.slug = 'marcus-webb' AND i.slug = 'taxes'
ON CONFLICT (politician_id, issue_id) DO UPDATE SET position = EXCLUDED.position;

INSERT INTO public.politician_issue_positions (politician_id, issue_id, position)
SELECT p.id, i.id, 'oppose'
FROM public.politicians p, public.issues i
WHERE p.slug = 'marcus-webb' AND i.slug = 'abortion'
ON CONFLICT (politician_id, issue_id) DO UPDATE SET position = EXCLUDED.position;

INSERT INTO public.politician_issue_positions (politician_id, issue_id, position)
SELECT p.id, i.id, 'support'
FROM public.politicians p, public.issues i
WHERE p.slug = 'marcus-webb' AND i.slug = 'trade'
ON CONFLICT (politician_id, issue_id) DO UPDATE SET position = EXCLUDED.position;

-- ---------------------------------------------------------------------------
-- diane-okafor
-- ---------------------------------------------------------------------------
INSERT INTO public.politician_issue_positions (politician_id, issue_id, position)
SELECT p.id, i.id, 'oppose'
FROM public.politicians p, public.issues i
WHERE p.slug = 'diane-okafor' AND i.slug = 'gun-rights'
ON CONFLICT (politician_id, issue_id) DO UPDATE SET position = EXCLUDED.position;

INSERT INTO public.politician_issue_positions (politician_id, issue_id, position)
SELECT p.id, i.id, 'support'
FROM public.politicians p, public.issues i
WHERE p.slug = 'diane-okafor' AND i.slug = 'immigration'
ON CONFLICT (politician_id, issue_id) DO UPDATE SET position = EXCLUDED.position;

INSERT INTO public.politician_issue_positions (politician_id, issue_id, position)
SELECT p.id, i.id, 'support'
FROM public.politicians p, public.issues i
WHERE p.slug = 'diane-okafor' AND i.slug = 'healthcare'
ON CONFLICT (politician_id, issue_id) DO UPDATE SET position = EXCLUDED.position;

INSERT INTO public.politician_issue_positions (politician_id, issue_id, position)
SELECT p.id, i.id, 'support'
FROM public.politicians p, public.issues i
WHERE p.slug = 'diane-okafor' AND i.slug = 'climate'
ON CONFLICT (politician_id, issue_id) DO UPDATE SET position = EXCLUDED.position;

INSERT INTO public.politician_issue_positions (politician_id, issue_id, position)
SELECT p.id, i.id, 'support'
FROM public.politicians p, public.issues i
WHERE p.slug = 'diane-okafor' AND i.slug = 'corruption'
ON CONFLICT (politician_id, issue_id) DO UPDATE SET position = EXCLUDED.position;

INSERT INTO public.politician_issue_positions (politician_id, issue_id, position)
SELECT p.id, i.id, 'support'
FROM public.politicians p, public.issues i
WHERE p.slug = 'diane-okafor' AND i.slug = 'taxes'
ON CONFLICT (politician_id, issue_id) DO UPDATE SET position = EXCLUDED.position;

INSERT INTO public.politician_issue_positions (politician_id, issue_id, position)
SELECT p.id, i.id, 'support'
FROM public.politicians p, public.issues i
WHERE p.slug = 'diane-okafor' AND i.slug = 'abortion'
ON CONFLICT (politician_id, issue_id) DO UPDATE SET position = EXCLUDED.position;

INSERT INTO public.politician_issue_positions (politician_id, issue_id, position)
SELECT p.id, i.id, 'neutral'
FROM public.politicians p, public.issues i
WHERE p.slug = 'diane-okafor' AND i.slug = 'trade'
ON CONFLICT (politician_id, issue_id) DO UPDATE SET position = EXCLUDED.position;

-- ---------------------------------------------------------------------------
-- tomas-rivera
-- ---------------------------------------------------------------------------
INSERT INTO public.politician_issue_positions (politician_id, issue_id, position)
SELECT p.id, i.id, 'neutral'
FROM public.politicians p, public.issues i
WHERE p.slug = 'tomas-rivera' AND i.slug = 'gun-rights'
ON CONFLICT (politician_id, issue_id) DO UPDATE SET position = EXCLUDED.position;

INSERT INTO public.politician_issue_positions (politician_id, issue_id, position)
SELECT p.id, i.id, 'support'
FROM public.politicians p, public.issues i
WHERE p.slug = 'tomas-rivera' AND i.slug = 'immigration'
ON CONFLICT (politician_id, issue_id) DO UPDATE SET position = EXCLUDED.position;

INSERT INTO public.politician_issue_positions (politician_id, issue_id, position)
SELECT p.id, i.id, 'support'
FROM public.politicians p, public.issues i
WHERE p.slug = 'tomas-rivera' AND i.slug = 'healthcare'
ON CONFLICT (politician_id, issue_id) DO UPDATE SET position = EXCLUDED.position;

INSERT INTO public.politician_issue_positions (politician_id, issue_id, position)
SELECT p.id, i.id, 'support'
FROM public.politicians p, public.issues i
WHERE p.slug = 'tomas-rivera' AND i.slug = 'climate'
ON CONFLICT (politician_id, issue_id) DO UPDATE SET position = EXCLUDED.position;

INSERT INTO public.politician_issue_positions (politician_id, issue_id, position)
SELECT p.id, i.id, 'support'
FROM public.politicians p, public.issues i
WHERE p.slug = 'tomas-rivera' AND i.slug = 'corruption'
ON CONFLICT (politician_id, issue_id) DO UPDATE SET position = EXCLUDED.position;

INSERT INTO public.politician_issue_positions (politician_id, issue_id, position)
SELECT p.id, i.id, 'support'
FROM public.politicians p, public.issues i
WHERE p.slug = 'tomas-rivera' AND i.slug = 'taxes'
ON CONFLICT (politician_id, issue_id) DO UPDATE SET position = EXCLUDED.position;

INSERT INTO public.politician_issue_positions (politician_id, issue_id, position)
SELECT p.id, i.id, 'support'
FROM public.politicians p, public.issues i
WHERE p.slug = 'tomas-rivera' AND i.slug = 'abortion'
ON CONFLICT (politician_id, issue_id) DO UPDATE SET position = EXCLUDED.position;

INSERT INTO public.politician_issue_positions (politician_id, issue_id, position)
SELECT p.id, i.id, 'neutral'
FROM public.politicians p, public.issues i
WHERE p.slug = 'tomas-rivera' AND i.slug = 'trade'
ON CONFLICT (politician_id, issue_id) DO UPDATE SET position = EXCLUDED.position;

-- ---------------------------------------------------------------------------
-- patricia-holloway
-- ---------------------------------------------------------------------------
INSERT INTO public.politician_issue_positions (politician_id, issue_id, position)
SELECT p.id, i.id, 'support'
FROM public.politicians p, public.issues i
WHERE p.slug = 'patricia-holloway' AND i.slug = 'gun-rights'
ON CONFLICT (politician_id, issue_id) DO UPDATE SET position = EXCLUDED.position;

INSERT INTO public.politician_issue_positions (politician_id, issue_id, position)
SELECT p.id, i.id, 'oppose'
FROM public.politicians p, public.issues i
WHERE p.slug = 'patricia-holloway' AND i.slug = 'immigration'
ON CONFLICT (politician_id, issue_id) DO UPDATE SET position = EXCLUDED.position;

INSERT INTO public.politician_issue_positions (politician_id, issue_id, position)
SELECT p.id, i.id, 'oppose'
FROM public.politicians p, public.issues i
WHERE p.slug = 'patricia-holloway' AND i.slug = 'healthcare'
ON CONFLICT (politician_id, issue_id) DO UPDATE SET position = EXCLUDED.position;

INSERT INTO public.politician_issue_positions (politician_id, issue_id, position)
SELECT p.id, i.id, 'oppose'
FROM public.politicians p, public.issues i
WHERE p.slug = 'patricia-holloway' AND i.slug = 'climate'
ON CONFLICT (politician_id, issue_id) DO UPDATE SET position = EXCLUDED.position;

INSERT INTO public.politician_issue_positions (politician_id, issue_id, position)
SELECT p.id, i.id, 'neutral'
FROM public.politicians p, public.issues i
WHERE p.slug = 'patricia-holloway' AND i.slug = 'corruption'
ON CONFLICT (politician_id, issue_id) DO UPDATE SET position = EXCLUDED.position;

INSERT INTO public.politician_issue_positions (politician_id, issue_id, position)
SELECT p.id, i.id, 'oppose'
FROM public.politicians p, public.issues i
WHERE p.slug = 'patricia-holloway' AND i.slug = 'taxes'
ON CONFLICT (politician_id, issue_id) DO UPDATE SET position = EXCLUDED.position;

INSERT INTO public.politician_issue_positions (politician_id, issue_id, position)
SELECT p.id, i.id, 'oppose'
FROM public.politicians p, public.issues i
WHERE p.slug = 'patricia-holloway' AND i.slug = 'abortion'
ON CONFLICT (politician_id, issue_id) DO UPDATE SET position = EXCLUDED.position;

INSERT INTO public.politician_issue_positions (politician_id, issue_id, position)
SELECT p.id, i.id, 'neutral'
FROM public.politicians p, public.issues i
WHERE p.slug = 'patricia-holloway' AND i.slug = 'trade'
ON CONFLICT (politician_id, issue_id) DO UPDATE SET position = EXCLUDED.position;

-- ---------------------------------------------------------------------------
-- andre-jackson
-- ---------------------------------------------------------------------------
INSERT INTO public.politician_issue_positions (politician_id, issue_id, position)
SELECT p.id, i.id, 'oppose'
FROM public.politicians p, public.issues i
WHERE p.slug = 'andre-jackson' AND i.slug = 'gun-rights'
ON CONFLICT (politician_id, issue_id) DO UPDATE SET position = EXCLUDED.position;

INSERT INTO public.politician_issue_positions (politician_id, issue_id, position)
SELECT p.id, i.id, 'support'
FROM public.politicians p, public.issues i
WHERE p.slug = 'andre-jackson' AND i.slug = 'immigration'
ON CONFLICT (politician_id, issue_id) DO UPDATE SET position = EXCLUDED.position;

INSERT INTO public.politician_issue_positions (politician_id, issue_id, position)
SELECT p.id, i.id, 'support'
FROM public.politicians p, public.issues i
WHERE p.slug = 'andre-jackson' AND i.slug = 'healthcare'
ON CONFLICT (politician_id, issue_id) DO UPDATE SET position = EXCLUDED.position;

INSERT INTO public.politician_issue_positions (politician_id, issue_id, position)
SELECT p.id, i.id, 'support'
FROM public.politicians p, public.issues i
WHERE p.slug = 'andre-jackson' AND i.slug = 'climate'
ON CONFLICT (politician_id, issue_id) DO UPDATE SET position = EXCLUDED.position;

INSERT INTO public.politician_issue_positions (politician_id, issue_id, position)
SELECT p.id, i.id, 'support'
FROM public.politicians p, public.issues i
WHERE p.slug = 'andre-jackson' AND i.slug = 'corruption'
ON CONFLICT (politician_id, issue_id) DO UPDATE SET position = EXCLUDED.position;

INSERT INTO public.politician_issue_positions (politician_id, issue_id, position)
SELECT p.id, i.id, 'support'
FROM public.politicians p, public.issues i
WHERE p.slug = 'andre-jackson' AND i.slug = 'taxes'
ON CONFLICT (politician_id, issue_id) DO UPDATE SET position = EXCLUDED.position;

INSERT INTO public.politician_issue_positions (politician_id, issue_id, position)
SELECT p.id, i.id, 'support'
FROM public.politicians p, public.issues i
WHERE p.slug = 'andre-jackson' AND i.slug = 'abortion'
ON CONFLICT (politician_id, issue_id) DO UPDATE SET position = EXCLUDED.position;

INSERT INTO public.politician_issue_positions (politician_id, issue_id, position)
SELECT p.id, i.id, 'neutral'
FROM public.politicians p, public.issues i
WHERE p.slug = 'andre-jackson' AND i.slug = 'trade'
ON CONFLICT (politician_id, issue_id) DO UPDATE SET position = EXCLUDED.position;

-- ---------------------------------------------------------------------------
-- linda-fujimoto
-- ---------------------------------------------------------------------------
INSERT INTO public.politician_issue_positions (politician_id, issue_id, position)
SELECT p.id, i.id, 'oppose'
FROM public.politicians p, public.issues i
WHERE p.slug = 'linda-fujimoto' AND i.slug = 'gun-rights'
ON CONFLICT (politician_id, issue_id) DO UPDATE SET position = EXCLUDED.position;

INSERT INTO public.politician_issue_positions (politician_id, issue_id, position)
SELECT p.id, i.id, 'support'
FROM public.politicians p, public.issues i
WHERE p.slug = 'linda-fujimoto' AND i.slug = 'immigration'
ON CONFLICT (politician_id, issue_id) DO UPDATE SET position = EXCLUDED.position;

INSERT INTO public.politician_issue_positions (politician_id, issue_id, position)
SELECT p.id, i.id, 'support'
FROM public.politicians p, public.issues i
WHERE p.slug = 'linda-fujimoto' AND i.slug = 'healthcare'
ON CONFLICT (politician_id, issue_id) DO UPDATE SET position = EXCLUDED.position;

INSERT INTO public.politician_issue_positions (politician_id, issue_id, position)
SELECT p.id, i.id, 'support'
FROM public.politicians p, public.issues i
WHERE p.slug = 'linda-fujimoto' AND i.slug = 'climate'
ON CONFLICT (politician_id, issue_id) DO UPDATE SET position = EXCLUDED.position;

INSERT INTO public.politician_issue_positions (politician_id, issue_id, position)
SELECT p.id, i.id, 'support'
FROM public.politicians p, public.issues i
WHERE p.slug = 'linda-fujimoto' AND i.slug = 'corruption'
ON CONFLICT (politician_id, issue_id) DO UPDATE SET position = EXCLUDED.position;

INSERT INTO public.politician_issue_positions (politician_id, issue_id, position)
SELECT p.id, i.id, 'support'
FROM public.politicians p, public.issues i
WHERE p.slug = 'linda-fujimoto' AND i.slug = 'taxes'
ON CONFLICT (politician_id, issue_id) DO UPDATE SET position = EXCLUDED.position;

INSERT INTO public.politician_issue_positions (politician_id, issue_id, position)
SELECT p.id, i.id, 'support'
FROM public.politicians p, public.issues i
WHERE p.slug = 'linda-fujimoto' AND i.slug = 'abortion'
ON CONFLICT (politician_id, issue_id) DO UPDATE SET position = EXCLUDED.position;

INSERT INTO public.politician_issue_positions (politician_id, issue_id, position)
SELECT p.id, i.id, 'neutral'
FROM public.politicians p, public.issues i
WHERE p.slug = 'linda-fujimoto' AND i.slug = 'trade'
ON CONFLICT (politician_id, issue_id) DO UPDATE SET position = EXCLUDED.position;

-- ---------------------------------------------------------------------------
-- greg-perkins
-- ---------------------------------------------------------------------------
INSERT INTO public.politician_issue_positions (politician_id, issue_id, position)
SELECT p.id, i.id, 'support'
FROM public.politicians p, public.issues i
WHERE p.slug = 'greg-perkins' AND i.slug = 'gun-rights'
ON CONFLICT (politician_id, issue_id) DO UPDATE SET position = EXCLUDED.position;

INSERT INTO public.politician_issue_positions (politician_id, issue_id, position)
SELECT p.id, i.id, 'oppose'
FROM public.politicians p, public.issues i
WHERE p.slug = 'greg-perkins' AND i.slug = 'immigration'
ON CONFLICT (politician_id, issue_id) DO UPDATE SET position = EXCLUDED.position;

INSERT INTO public.politician_issue_positions (politician_id, issue_id, position)
SELECT p.id, i.id, 'oppose'
FROM public.politicians p, public.issues i
WHERE p.slug = 'greg-perkins' AND i.slug = 'healthcare'
ON CONFLICT (politician_id, issue_id) DO UPDATE SET position = EXCLUDED.position;

INSERT INTO public.politician_issue_positions (politician_id, issue_id, position)
SELECT p.id, i.id, 'oppose'
FROM public.politicians p, public.issues i
WHERE p.slug = 'greg-perkins' AND i.slug = 'climate'
ON CONFLICT (politician_id, issue_id) DO UPDATE SET position = EXCLUDED.position;

INSERT INTO public.politician_issue_positions (politician_id, issue_id, position)
SELECT p.id, i.id, 'oppose'
FROM public.politicians p, public.issues i
WHERE p.slug = 'greg-perkins' AND i.slug = 'corruption'
ON CONFLICT (politician_id, issue_id) DO UPDATE SET position = EXCLUDED.position;

INSERT INTO public.politician_issue_positions (politician_id, issue_id, position)
SELECT p.id, i.id, 'oppose'
FROM public.politicians p, public.issues i
WHERE p.slug = 'greg-perkins' AND i.slug = 'taxes'
ON CONFLICT (politician_id, issue_id) DO UPDATE SET position = EXCLUDED.position;

INSERT INTO public.politician_issue_positions (politician_id, issue_id, position)
SELECT p.id, i.id, 'oppose'
FROM public.politicians p, public.issues i
WHERE p.slug = 'greg-perkins' AND i.slug = 'abortion'
ON CONFLICT (politician_id, issue_id) DO UPDATE SET position = EXCLUDED.position;

INSERT INTO public.politician_issue_positions (politician_id, issue_id, position)
SELECT p.id, i.id, 'support'
FROM public.politicians p, public.issues i
WHERE p.slug = 'greg-perkins' AND i.slug = 'trade'
ON CONFLICT (politician_id, issue_id) DO UPDATE SET position = EXCLUDED.position;

-- ===========================================================================
-- COMMUNITY ISSUE VOTES (anonymous seed data)
-- Distributions reflect realistic polling patterns.
-- ===========================================================================

DELETE FROM public.issue_votes
WHERE user_id IS NULL
  AND issue_id IN (
    SELECT id FROM public.issues
    WHERE slug IN (
      'gun-rights', 'immigration', 'healthcare', 'climate',
      'corruption', 'taxes', 'abortion', 'trade'
    )
  );

-- gun-rights: 31 support, 55 oppose, 14 neutral (100 total)
INSERT INTO public.issue_votes (issue_id, vote)
SELECT i.id, 'support' FROM public.issues i, generate_series(1,31) WHERE i.slug = 'gun-rights';

INSERT INTO public.issue_votes (issue_id, vote)
SELECT i.id, 'oppose'  FROM public.issues i, generate_series(1,55) WHERE i.slug = 'gun-rights';

INSERT INTO public.issue_votes (issue_id, vote)
SELECT i.id, 'neutral' FROM public.issues i, generate_series(1,14) WHERE i.slug = 'gun-rights';

-- immigration: 52 support, 33 oppose, 15 neutral
INSERT INTO public.issue_votes (issue_id, vote)
SELECT i.id, 'support' FROM public.issues i, generate_series(1,52) WHERE i.slug = 'immigration';

INSERT INTO public.issue_votes (issue_id, vote)
SELECT i.id, 'oppose'  FROM public.issues i, generate_series(1,33) WHERE i.slug = 'immigration';

INSERT INTO public.issue_votes (issue_id, vote)
SELECT i.id, 'neutral' FROM public.issues i, generate_series(1,15) WHERE i.slug = 'immigration';

-- healthcare: 71 support, 18 oppose, 11 neutral
INSERT INTO public.issue_votes (issue_id, vote)
SELECT i.id, 'support' FROM public.issues i, generate_series(1,71) WHERE i.slug = 'healthcare';

INSERT INTO public.issue_votes (issue_id, vote)
SELECT i.id, 'oppose'  FROM public.issues i, generate_series(1,18) WHERE i.slug = 'healthcare';

INSERT INTO public.issue_votes (issue_id, vote)
SELECT i.id, 'neutral' FROM public.issues i, generate_series(1,11) WHERE i.slug = 'healthcare';

-- climate: 68 support, 22 oppose, 10 neutral
INSERT INTO public.issue_votes (issue_id, vote)
SELECT i.id, 'support' FROM public.issues i, generate_series(1,68) WHERE i.slug = 'climate';

INSERT INTO public.issue_votes (issue_id, vote)
SELECT i.id, 'oppose'  FROM public.issues i, generate_series(1,22) WHERE i.slug = 'climate';

INSERT INTO public.issue_votes (issue_id, vote)
SELECT i.id, 'neutral' FROM public.issues i, generate_series(1,10) WHERE i.slug = 'climate';

-- corruption: 82 support, 8 oppose, 10 neutral
INSERT INTO public.issue_votes (issue_id, vote)
SELECT i.id, 'support' FROM public.issues i, generate_series(1,82) WHERE i.slug = 'corruption';

INSERT INTO public.issue_votes (issue_id, vote)
SELECT i.id, 'oppose'  FROM public.issues i, generate_series(1, 8) WHERE i.slug = 'corruption';

INSERT INTO public.issue_votes (issue_id, vote)
SELECT i.id, 'neutral' FROM public.issues i, generate_series(1,10) WHERE i.slug = 'corruption';

-- taxes: 48 support, 38 oppose, 14 neutral
INSERT INTO public.issue_votes (issue_id, vote)
SELECT i.id, 'support' FROM public.issues i, generate_series(1,48) WHERE i.slug = 'taxes';

INSERT INTO public.issue_votes (issue_id, vote)
SELECT i.id, 'oppose'  FROM public.issues i, generate_series(1,38) WHERE i.slug = 'taxes';

INSERT INTO public.issue_votes (issue_id, vote)
SELECT i.id, 'neutral' FROM public.issues i, generate_series(1,14) WHERE i.slug = 'taxes';

-- abortion: 61 support, 29 oppose, 10 neutral
INSERT INTO public.issue_votes (issue_id, vote)
SELECT i.id, 'support' FROM public.issues i, generate_series(1,61) WHERE i.slug = 'abortion';

INSERT INTO public.issue_votes (issue_id, vote)
SELECT i.id, 'oppose'  FROM public.issues i, generate_series(1,29) WHERE i.slug = 'abortion';

INSERT INTO public.issue_votes (issue_id, vote)
SELECT i.id, 'neutral' FROM public.issues i, generate_series(1,10) WHERE i.slug = 'abortion';

-- trade: 38 support, 28 oppose, 34 neutral
INSERT INTO public.issue_votes (issue_id, vote)
SELECT i.id, 'support' FROM public.issues i, generate_series(1,38) WHERE i.slug = 'trade';

INSERT INTO public.issue_votes (issue_id, vote)
SELECT i.id, 'oppose'  FROM public.issues i, generate_series(1,28) WHERE i.slug = 'trade';

INSERT INTO public.issue_votes (issue_id, vote)
SELECT i.id, 'neutral' FROM public.issues i, generate_series(1,34) WHERE i.slug = 'trade';
