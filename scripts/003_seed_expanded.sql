-- Expanded seed data: 12 politicians, votes, posts, comments
-- Run AFTER 002_scores.sql is applied.
-- Uses ON CONFLICT DO UPDATE so it's safe to re-run.

-- ── Geographies ──────────────────────────────────────────────────────────────
INSERT INTO public.geographies (slug, name, type, parent_id) VALUES
  ('united-states', 'United States', 'federal', NULL)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type;

INSERT INTO public.geographies (slug, name, type, parent_id)
SELECT 'california', 'California', 'state', id FROM public.geographies WHERE slug = 'united-states'
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, parent_id = EXCLUDED.parent_id;

INSERT INTO public.geographies (slug, name, type, parent_id)
SELECT 'texas', 'Texas', 'state', id FROM public.geographies WHERE slug = 'united-states'
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, parent_id = EXCLUDED.parent_id;

INSERT INTO public.geographies (slug, name, type, parent_id)
SELECT 'new-york', 'New York', 'state', id FROM public.geographies WHERE slug = 'united-states'
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, parent_id = EXCLUDED.parent_id;

INSERT INTO public.geographies (slug, name, type, parent_id)
SELECT 'illinois', 'Illinois', 'state', id FROM public.geographies WHERE slug = 'united-states'
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, parent_id = EXCLUDED.parent_id;

INSERT INTO public.geographies (slug, name, type, parent_id)
SELECT 'washington', 'Washington', 'state', id FROM public.geographies WHERE slug = 'united-states'
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, parent_id = EXCLUDED.parent_id;

INSERT INTO public.geographies (slug, name, type, parent_id)
SELECT 'chicago', 'Chicago', 'local', id FROM public.geographies WHERE slug = 'illinois'
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, parent_id = EXCLUDED.parent_id;

INSERT INTO public.geographies (slug, name, type, parent_id)
SELECT 'los-angeles', 'Los Angeles', 'local', id FROM public.geographies WHERE slug = 'california'
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, parent_id = EXCLUDED.parent_id;

-- ── Politicians ───────────────────────────────────────────────────────────────
INSERT INTO public.politicians
  (slug, name, title, party, bio, endorsement_status, geography_id, geography_level,
   portrait_url, office_held, years_in_office, aggregate_sentiment,
   epstein_score, blunch, is_squid)
SELECT
  'jane-doe', 'Jane Doe',
  'U.S. Representative, District 7', 'Independent',
  'Jane Doe is a two-term independent congresswoman known for her cross-aisle climate legislation and fierce opposition to corporate lobbying. She is one of the few members without corporate PAC funding.',
  'endorsed', g.id, 'federal',
  'https://i.pravatar.cc/400?u=jane-doe', 'U.S. House', 6, 0.72,
  12.00, true, false
FROM public.geographies g WHERE g.slug = 'united-states'
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title, party = EXCLUDED.party, bio = EXCLUDED.bio,
  endorsement_status = EXCLUDED.endorsement_status, geography_id = EXCLUDED.geography_id,
  geography_level = EXCLUDED.geography_level, portrait_url = EXCLUDED.portrait_url,
  office_held = EXCLUDED.office_held, years_in_office = EXCLUDED.years_in_office,
  aggregate_sentiment = EXCLUDED.aggregate_sentiment, epstein_score = EXCLUDED.epstein_score,
  blunch = EXCLUDED.blunch, is_squid = EXCLUDED.is_squid, updated_at = now();

INSERT INTO public.politicians
  (slug, name, title, party, bio, endorsement_status, geography_id, geography_level,
   portrait_url, office_held, years_in_office, aggregate_sentiment,
   epstein_score, blunch, is_squid)
SELECT
  'richard-cox', 'Richard Cox',
  'U.S. Senator, Senior Member', 'Republican',
  'Richard Cox has served three Senate terms and chairs the Commerce Committee. Critics point to his consistent votes against consumer protection and his extensive ties to pharmaceutical donors.',
  'anti-endorsed', g.id, 'federal',
  'https://i.pravatar.cc/400?u=richard-cox', 'U.S. Senate', 18, -0.61,
  78.00, false, true
FROM public.geographies g WHERE g.slug = 'united-states'
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title, party = EXCLUDED.party, bio = EXCLUDED.bio,
  endorsement_status = EXCLUDED.endorsement_status, geography_id = EXCLUDED.geography_id,
  geography_level = EXCLUDED.geography_level, portrait_url = EXCLUDED.portrait_url,
  office_held = EXCLUDED.office_held, years_in_office = EXCLUDED.years_in_office,
  aggregate_sentiment = EXCLUDED.aggregate_sentiment, epstein_score = EXCLUDED.epstein_score,
  blunch = EXCLUDED.blunch, is_squid = EXCLUDED.is_squid, updated_at = now();

INSERT INTO public.politicians
  (slug, name, title, party, bio, endorsement_status, geography_id, geography_level,
   portrait_url, office_held, years_in_office, aggregate_sentiment,
   epstein_score, blunch, is_squid)
SELECT
  'maya-reyes', 'Maya Reyes',
  'State Senator, District 12', 'Democrat',
  'Maya Reyes has championed housing affordability and public transit during her two terms in the California Senate. She has a record of transparency and constituent engagement.',
  'watching', g.id, 'state',
  'https://i.pravatar.cc/400?u=maya-reyes', 'CA State Senate', 4, 0.31,
  34.00, true, false
FROM public.geographies g WHERE g.slug = 'california'
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title, party = EXCLUDED.party, bio = EXCLUDED.bio,
  endorsement_status = EXCLUDED.endorsement_status, geography_id = EXCLUDED.geography_id,
  geography_level = EXCLUDED.geography_level, portrait_url = EXCLUDED.portrait_url,
  office_held = EXCLUDED.office_held, years_in_office = EXCLUDED.years_in_office,
  aggregate_sentiment = EXCLUDED.aggregate_sentiment, epstein_score = EXCLUDED.epstein_score,
  blunch = EXCLUDED.blunch, is_squid = EXCLUDED.is_squid, updated_at = now();

INSERT INTO public.politicians
  (slug, name, title, party, bio, endorsement_status, geography_id, geography_level,
   portrait_url, office_held, years_in_office, aggregate_sentiment,
   epstein_score, blunch, is_squid)
SELECT
  'bill-harris', 'Bill Harris',
  'City Council Member, District 3', 'Republican',
  'Bill Harris has served on the Chicago City Council for a decade. While popular with business owners, housing advocates have raised concerns about his zoning votes.',
  'watching', g.id, 'local',
  'https://i.pravatar.cc/400?u=bill-harris', 'Chicago City Council', 10, -0.12,
  51.00, false, true
FROM public.geographies g WHERE g.slug = 'chicago'
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title, party = EXCLUDED.party, bio = EXCLUDED.bio,
  endorsement_status = EXCLUDED.endorsement_status, geography_id = EXCLUDED.geography_id,
  geography_level = EXCLUDED.geography_level, portrait_url = EXCLUDED.portrait_url,
  office_held = EXCLUDED.office_held, years_in_office = EXCLUDED.years_in_office,
  aggregate_sentiment = EXCLUDED.aggregate_sentiment, epstein_score = EXCLUDED.epstein_score,
  blunch = EXCLUDED.blunch, is_squid = EXCLUDED.is_squid, updated_at = now();

INSERT INTO public.politicians
  (slug, name, title, party, bio, endorsement_status, geography_id, geography_level,
   portrait_url, office_held, years_in_office, aggregate_sentiment,
   epstein_score, blunch, is_squid)
SELECT
  'sarah-chen', 'Sarah Chen',
  'U.S. Representative, District 14', 'Democrat',
  'Sarah Chen is a first-term congresswoman and former public defender. She has been outspoken on criminal justice reform, immigration policy, and healthcare access.',
  'endorsed', g.id, 'federal',
  'https://i.pravatar.cc/400?u=sarah-chen', 'U.S. House', 2, 0.65,
  8.00, true, false
FROM public.geographies g WHERE g.slug = 'united-states'
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title, party = EXCLUDED.party, bio = EXCLUDED.bio,
  endorsement_status = EXCLUDED.endorsement_status, geography_id = EXCLUDED.geography_id,
  geography_level = EXCLUDED.geography_level, portrait_url = EXCLUDED.portrait_url,
  office_held = EXCLUDED.office_held, years_in_office = EXCLUDED.years_in_office,
  aggregate_sentiment = EXCLUDED.aggregate_sentiment, epstein_score = EXCLUDED.epstein_score,
  blunch = EXCLUDED.blunch, is_squid = EXCLUDED.is_squid, updated_at = now();

INSERT INTO public.politicians
  (slug, name, title, party, bio, endorsement_status, geography_id, geography_level,
   portrait_url, office_held, years_in_office, aggregate_sentiment,
   epstein_score, blunch, is_squid)
SELECT
  'marcus-webb', 'Marcus Webb',
  'U.S. Senator, Junior Member', 'Republican',
  'Marcus Webb is a freshman senator and former hedge fund manager. His legislative record consists primarily of financial deregulation bills and deep cuts to social programs.',
  'anti-endorsed', g.id, 'federal',
  'https://i.pravatar.cc/400?u=marcus-webb', 'U.S. Senate', 2, -0.78,
  82.00, false, true
FROM public.geographies g WHERE g.slug = 'texas'
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title, party = EXCLUDED.party, bio = EXCLUDED.bio,
  endorsement_status = EXCLUDED.endorsement_status, geography_id = EXCLUDED.geography_id,
  geography_level = EXCLUDED.geography_level, portrait_url = EXCLUDED.portrait_url,
  office_held = EXCLUDED.office_held, years_in_office = EXCLUDED.years_in_office,
  aggregate_sentiment = EXCLUDED.aggregate_sentiment, epstein_score = EXCLUDED.epstein_score,
  blunch = EXCLUDED.blunch, is_squid = EXCLUDED.is_squid, updated_at = now();

INSERT INTO public.politicians
  (slug, name, title, party, bio, endorsement_status, geography_id, geography_level,
   portrait_url, office_held, years_in_office, aggregate_sentiment,
   epstein_score, blunch, is_squid)
SELECT
  'diane-okafor', 'Diane Okafor',
  'U.S. Representative, District 9', 'Democrat',
  'Diane Okafor is a three-term congresswoman and chair of the House Education subcommittee. She has authored major student debt relief legislation and expanded school lunch programs.',
  'endorsed', g.id, 'federal',
  'https://i.pravatar.cc/400?u=diane-okafor', 'U.S. House', 6, 0.58,
  15.00, true, false
FROM public.geographies g WHERE g.slug = 'new-york'
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title, party = EXCLUDED.party, bio = EXCLUDED.bio,
  endorsement_status = EXCLUDED.endorsement_status, geography_id = EXCLUDED.geography_id,
  geography_level = EXCLUDED.geography_level, portrait_url = EXCLUDED.portrait_url,
  office_held = EXCLUDED.office_held, years_in_office = EXCLUDED.years_in_office,
  aggregate_sentiment = EXCLUDED.aggregate_sentiment, epstein_score = EXCLUDED.epstein_score,
  blunch = EXCLUDED.blunch, is_squid = EXCLUDED.is_squid, updated_at = now();

INSERT INTO public.politicians
  (slug, name, title, party, bio, endorsement_status, geography_id, geography_level,
   portrait_url, office_held, years_in_office, aggregate_sentiment,
   epstein_score, blunch, is_squid)
SELECT
  'tomas-rivera', 'Tomás Rivera',
  'State Assemblymember, District 24', 'Democrat',
  'Tomás Rivera is in his second term in the Texas State Assembly. A labor organizer turned lawmaker, he has pushed for minimum wage increases and worker protections.',
  'watching', g.id, 'state',
  'https://i.pravatar.cc/400?u=tomas-rivera', 'TX State Assembly', 4, 0.22,
  41.00, true, false
FROM public.geographies g WHERE g.slug = 'texas'
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title, party = EXCLUDED.party, bio = EXCLUDED.bio,
  endorsement_status = EXCLUDED.endorsement_status, geography_id = EXCLUDED.geography_id,
  geography_level = EXCLUDED.geography_level, portrait_url = EXCLUDED.portrait_url,
  office_held = EXCLUDED.office_held, years_in_office = EXCLUDED.years_in_office,
  aggregate_sentiment = EXCLUDED.aggregate_sentiment, epstein_score = EXCLUDED.epstein_score,
  blunch = EXCLUDED.blunch, is_squid = EXCLUDED.is_squid, updated_at = now();

INSERT INTO public.politicians
  (slug, name, title, party, bio, endorsement_status, geography_id, geography_level,
   portrait_url, office_held, years_in_office, aggregate_sentiment,
   epstein_score, blunch, is_squid)
SELECT
  'patricia-holloway', 'Patricia Holloway',
  'State Senator, District 5', 'Republican',
  'Patricia Holloway is a veteran New York state senator who has opposed public transit funding and backed several controversial redistricting proposals.',
  'anti-endorsed', g.id, 'state',
  'https://i.pravatar.cc/400?u=patricia-holloway', 'NY State Senate', 12, -0.44,
  67.00, false, false
FROM public.geographies g WHERE g.slug = 'new-york'
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title, party = EXCLUDED.party, bio = EXCLUDED.bio,
  endorsement_status = EXCLUDED.endorsement_status, geography_id = EXCLUDED.geography_id,
  geography_level = EXCLUDED.geography_level, portrait_url = EXCLUDED.portrait_url,
  office_held = EXCLUDED.office_held, years_in_office = EXCLUDED.years_in_office,
  aggregate_sentiment = EXCLUDED.aggregate_sentiment, epstein_score = EXCLUDED.epstein_score,
  blunch = EXCLUDED.blunch, is_squid = EXCLUDED.is_squid, updated_at = now();

INSERT INTO public.politicians
  (slug, name, title, party, bio, endorsement_status, geography_id, geography_level,
   portrait_url, office_held, years_in_office, aggregate_sentiment,
   epstein_score, blunch, is_squid)
SELECT
  'andre-jackson', 'Andre Jackson',
  'City Council Member, District 11', 'Democrat',
  'Andre Jackson chairs the LA City Council Housing Committee and has delivered over 2,000 affordable units through innovative public-private partnerships.',
  'endorsed', g.id, 'local',
  'https://i.pravatar.cc/400?u=andre-jackson', 'LA City Council', 5, 0.54,
  22.00, true, false
FROM public.geographies g WHERE g.slug = 'los-angeles'
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title, party = EXCLUDED.party, bio = EXCLUDED.bio,
  endorsement_status = EXCLUDED.endorsement_status, geography_id = EXCLUDED.geography_id,
  geography_level = EXCLUDED.geography_level, portrait_url = EXCLUDED.portrait_url,
  office_held = EXCLUDED.office_held, years_in_office = EXCLUDED.years_in_office,
  aggregate_sentiment = EXCLUDED.aggregate_sentiment, epstein_score = EXCLUDED.epstein_score,
  blunch = EXCLUDED.blunch, is_squid = EXCLUDED.is_squid, updated_at = now();

INSERT INTO public.politicians
  (slug, name, title, party, bio, endorsement_status, geography_id, geography_level,
   portrait_url, office_held, years_in_office, aggregate_sentiment,
   epstein_score, blunch, is_squid)
SELECT
  'linda-fujimoto', 'Linda Fujimoto',
  'State Representative, District 8', 'Democrat',
  'Linda Fujimoto is a second-term Washington state representative focused on environmental justice and clean energy policy.',
  'endorsed', g.id, 'state',
  'https://i.pravatar.cc/400?u=linda-fujimoto', 'WA State House', 4, 0.67,
  9.00, true, false
FROM public.geographies g WHERE g.slug = 'washington'
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title, party = EXCLUDED.party, bio = EXCLUDED.bio,
  endorsement_status = EXCLUDED.endorsement_status, geography_id = EXCLUDED.geography_id,
  geography_level = EXCLUDED.geography_level, portrait_url = EXCLUDED.portrait_url,
  office_held = EXCLUDED.office_held, years_in_office = EXCLUDED.years_in_office,
  aggregate_sentiment = EXCLUDED.aggregate_sentiment, epstein_score = EXCLUDED.epstein_score,
  blunch = EXCLUDED.blunch, is_squid = EXCLUDED.is_squid, updated_at = now();

INSERT INTO public.politicians
  (slug, name, title, party, bio, endorsement_status, geography_id, geography_level,
   portrait_url, office_held, years_in_office, aggregate_sentiment,
   epstein_score, blunch, is_squid)
SELECT
  'greg-perkins', 'Greg Perkins',
  'U.S. Representative, District 2', 'Republican',
  'Greg Perkins is a six-term congressman and ranking member of the House Judiciary Committee. He has consistently voted against voting rights legislation and environmental protections.',
  'anti-endorsed', g.id, 'federal',
  'https://i.pravatar.cc/400?u=greg-perkins', 'U.S. House', 12, -0.83,
  91.00, false, true
FROM public.geographies g WHERE g.slug = 'texas'
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title, party = EXCLUDED.party, bio = EXCLUDED.bio,
  endorsement_status = EXCLUDED.endorsement_status, geography_id = EXCLUDED.geography_id,
  geography_level = EXCLUDED.geography_level, portrait_url = EXCLUDED.portrait_url,
  office_held = EXCLUDED.office_held, years_in_office = EXCLUDED.years_in_office,
  aggregate_sentiment = EXCLUDED.aggregate_sentiment, epstein_score = EXCLUDED.epstein_score,
  blunch = EXCLUDED.blunch, is_squid = EXCLUDED.is_squid, updated_at = now();

-- ── Votes ─────────────────────────────────────────────────────────────────────
-- Delete existing votes for these politicians to avoid duplicates on re-run
DELETE FROM public.votes WHERE politician_id IN (
  SELECT id FROM public.politicians WHERE slug IN (
    'jane-doe','richard-cox','sarah-chen','marcus-webb','diane-okafor',
    'greg-perkins','maya-reyes','patricia-holloway','linda-fujimoto',
    'bill-harris','tomas-rivera','andre-jackson'
  )
);

INSERT INTO public.votes (politician_id, bill_name, bill_id, vote_date, vote_result, policy_category)
SELECT p.id, v.bill_name, v.bill_id, v.vote_date::date, v.vote_result, v.policy_category
FROM public.politicians p
CROSS JOIN (VALUES
  ('Clean Future Act', 'H.R. 1024', '2024-03-15', 'yea', 'climate'),
  ('Corporate Transparency Act', 'H.R. 2210', '2024-01-20', 'yea', 'economy'),
  ('Affordable Housing Expansion Act', 'H.R. 3301', '2023-11-08', 'yea', 'housing'),
  ('Defense Authorization Act', 'H.R. 4500', '2023-09-14', 'nay', 'defense'),
  ('Voter Access Act', 'H.R. 5602', '2023-06-22', 'yea', 'rights')
) AS v(bill_name, bill_id, vote_date, vote_result, policy_category)
WHERE p.slug = 'jane-doe';

INSERT INTO public.votes (politician_id, bill_name, bill_id, vote_date, vote_result, policy_category)
SELECT p.id, v.bill_name, v.bill_id, v.vote_date::date, v.vote_result, v.policy_category
FROM public.politicians p
CROSS JOIN (VALUES
  ('Pharmaceutical Pricing Relief Act', 'S. 102', '2024-04-10', 'nay', 'healthcare'),
  ('Corporate Tax Overhaul', 'S. 450', '2024-02-18', 'yea', 'economy'),
  ('Voting Rights Restoration Act', 'S. 881', '2023-10-03', 'nay', 'rights'),
  ('Climate Adaptation Fund', 'S. 1200', '2023-07-19', 'nay', 'climate'),
  ('Defense Appropriations FY2024', 'S. 2100', '2023-05-11', 'yea', 'defense'),
  ('Medicare Expansion Act', 'S. 330', '2022-12-01', 'nay', 'healthcare')
) AS v(bill_name, bill_id, vote_date, vote_result, policy_category)
WHERE p.slug = 'richard-cox';

INSERT INTO public.votes (politician_id, bill_name, bill_id, vote_date, vote_result, policy_category)
SELECT p.id, v.bill_name, v.bill_id, v.vote_date::date, v.vote_result, v.policy_category
FROM public.politicians p
CROSS JOIN (VALUES
  ('Bail Reform Act', 'H.R. 712', '2024-05-06', 'yea', 'rights'),
  ('Medicare for All Amendment', 'H.R. 1115', '2024-03-22', 'yea', 'healthcare'),
  ('Asylum Process Reform Act', 'H.R. 2090', '2024-01-15', 'yea', 'rights'),
  ('Defense Authorization Act', 'H.R. 4500', '2023-09-14', 'nay', 'defense'),
  ('Green New Deal Resolution', 'H.Res. 109', '2023-04-08', 'yea', 'climate')
) AS v(bill_name, bill_id, vote_date, vote_result, policy_category)
WHERE p.slug = 'sarah-chen';

INSERT INTO public.votes (politician_id, bill_name, bill_id, vote_date, vote_result, policy_category)
SELECT p.id, v.bill_name, v.bill_id, v.vote_date::date, v.vote_result, v.policy_category
FROM public.politicians p
CROSS JOIN (VALUES
  ('Dodd-Frank Rollback Act', 'S. 2155', '2024-06-01', 'yea', 'economy'),
  ('SNAP Benefits Cut', 'S. 3400', '2024-04-22', 'yea', 'economy'),
  ('Universal Pre-K Act', 'S. 1740', '2024-02-10', 'nay', 'economy'),
  ('Carbon Tax Act', 'S. 990', '2023-11-30', 'nay', 'climate'),
  ('Defense Budget Increase FY2024', 'S. 2100', '2023-05-11', 'yea', 'defense')
) AS v(bill_name, bill_id, vote_date, vote_result, policy_category)
WHERE p.slug = 'marcus-webb';

INSERT INTO public.votes (politician_id, bill_name, bill_id, vote_date, vote_result, policy_category)
SELECT p.id, v.bill_name, v.bill_id, v.vote_date::date, v.vote_result, v.policy_category
FROM public.politicians p
CROSS JOIN (VALUES
  ('Student Debt Relief Act', 'H.R. 601', '2024-05-20', 'yea', 'economy'),
  ('School Nutrition Standards Act', 'H.R. 890', '2024-03-05', 'yea', 'economy'),
  ('Childcare Workforce Act', 'H.R. 1450', '2023-12-12', 'yea', 'economy'),
  ('Defense Authorization Act', 'H.R. 4500', '2023-09-14', 'abstain', 'defense'),
  ('Voting Rights Expansion Act', 'H.R. 5602', '2023-06-22', 'yea', 'rights')
) AS v(bill_name, bill_id, vote_date, vote_result, policy_category)
WHERE p.slug = 'diane-okafor';

INSERT INTO public.votes (politician_id, bill_name, bill_id, vote_date, vote_result, policy_category)
SELECT p.id, v.bill_name, v.bill_id, v.vote_date::date, v.vote_result, v.policy_category
FROM public.politicians p
CROSS JOIN (VALUES
  ('Voting ID Requirement Act', 'H.R. 3100', '2024-07-01', 'yea', 'rights'),
  ('Clean Water Rollback Act', 'H.R. 2850', '2024-04-14', 'yea', 'climate'),
  ('Abortion Access Ban', 'H.R. 7', '2024-01-23', 'yea', 'rights'),
  ('Medicare Expansion Act', 'H.R. 1115', '2023-03-22', 'nay', 'healthcare'),
  ('Border Security Appropriations', 'H.R. 5000', '2023-08-09', 'yea', 'rights'),
  ('Green New Deal Resolution', 'H.Res. 109', '2023-04-08', 'nay', 'climate')
) AS v(bill_name, bill_id, vote_date, vote_result, policy_category)
WHERE p.slug = 'greg-perkins';

INSERT INTO public.votes (politician_id, bill_name, bill_id, vote_date, vote_result, policy_category)
SELECT p.id, v.bill_name, v.bill_id, v.vote_date::date, v.vote_result, v.policy_category
FROM public.politicians p
CROSS JOIN (VALUES
  ('CA SB-1 Housing Density Act', 'CA SB-1', '2024-06-15', 'yea', 'housing'),
  ('CA AB-45 Transit Funding', 'CA AB-45', '2024-04-01', 'yea', 'economy'),
  ('CA SB-9 Rent Control Expansion', 'CA SB-9', '2023-10-22', 'yea', 'housing')
) AS v(bill_name, bill_id, vote_date, vote_result, policy_category)
WHERE p.slug = 'maya-reyes';

INSERT INTO public.votes (politician_id, bill_name, bill_id, vote_date, vote_result, policy_category)
SELECT p.id, v.bill_name, v.bill_id, v.vote_date::date, v.vote_result, v.policy_category
FROM public.politicians p
CROSS JOIN (VALUES
  ('NY MTA Funding Cut', 'NY S-5500', '2024-05-10', 'yea', 'economy'),
  ('NY Redistricting Commission Act', 'NY S-3300', '2024-02-28', 'nay', 'rights'),
  ('NY Tenant Protections Act', 'NY S-6700', '2023-09-18', 'nay', 'housing')
) AS v(bill_name, bill_id, vote_date, vote_result, policy_category)
WHERE p.slug = 'patricia-holloway';

INSERT INTO public.votes (politician_id, bill_name, bill_id, vote_date, vote_result, policy_category)
SELECT p.id, v.bill_name, v.bill_id, v.vote_date::date, v.vote_result, v.policy_category
FROM public.politicians p
CROSS JOIN (VALUES
  ('WA Clean Energy 2030 Act', 'WA HB-1211', '2024-03-20', 'yea', 'climate'),
  ('WA Environmental Justice Act', 'WA HB-1619', '2024-01-14', 'yea', 'climate'),
  ('WA Carbon Market Act', 'WA SB-5126', '2023-07-07', 'yea', 'climate')
) AS v(bill_name, bill_id, vote_date, vote_result, policy_category)
WHERE p.slug = 'linda-fujimoto';

-- ── Posts ─────────────────────────────────────────────────────────────────────
DELETE FROM public.posts WHERE politician_ids && ARRAY(
  SELECT id FROM public.politicians WHERE slug IN (
    'jane-doe','richard-cox','sarah-chen','marcus-webb','diane-okafor',
    'greg-perkins','maya-reyes','patricia-holloway','linda-fujimoto',
    'bill-harris','tomas-rivera','andre-jackson'
  )
);

INSERT INTO public.posts (source_platform, source_url, content_text, sentiment_score, politician_ids, geography_id, approved)
SELECT 'twitter', NULL,
  'BREAKING: @JaneDoe just introduced the most aggressive corporate lobbying ban bill we''ve seen in years. No corporate PAC money — she walks the walk. #GetRight',
  0.85, ARRAY[p.id], g.id, true
FROM public.politicians p, public.geographies g
WHERE p.slug = 'jane-doe' AND g.slug = 'united-states';

INSERT INTO public.posts (source_platform, source_url, content_text, sentiment_score, politician_ids, geography_id, approved)
SELECT 'instagram', NULL,
  'Attended Jane Doe''s town hall last night. She answered every single question, stayed two hours late. This is what representation looks like.',
  0.78, ARRAY[p.id], g.id, true
FROM public.politicians p, public.geographies g
WHERE p.slug = 'jane-doe' AND g.slug = 'united-states';

INSERT INTO public.posts (source_platform, source_url, content_text, sentiment_score, politician_ids, geography_id, approved)
SELECT 'twitter', NULL,
  'Cox voted AGAINST the Pharmaceutical Pricing Relief Act while raking in $2.4M from pharma donors. Follow the money. #RichardCox',
  -0.89, ARRAY[p.id], g.id, true
FROM public.politicians p, public.geographies g
WHERE p.slug = 'richard-cox' AND g.slug = 'united-states';

INSERT INTO public.posts (source_platform, source_url, content_text, sentiment_score, politician_ids, geography_id, approved)
SELECT 'instagram', NULL,
  'Senator Cox''s campaign finance disclosures just dropped. Top donors: Pharma lobby, fossil fuel PACs, private prison corps. Surprised? Didn''t think so.',
  -0.76, ARRAY[p.id], g.id, true
FROM public.politicians p, public.geographies g
WHERE p.slug = 'richard-cox' AND g.slug = 'united-states';

INSERT INTO public.posts (source_platform, source_url, content_text, sentiment_score, politician_ids, geography_id, approved)
SELECT 'twitter', NULL,
  'Rep. Sarah Chen on the floor today: "No one in this country should go bankrupt because they got sick." Standing ovation from the gallery. #MedicareForAll',
  0.91, ARRAY[p.id], g.id, true
FROM public.politicians p, public.geographies g
WHERE p.slug = 'sarah-chen' AND g.slug = 'united-states';

INSERT INTO public.posts (source_platform, source_url, content_text, sentiment_score, politician_ids, geography_id, approved)
SELECT 'twitter', NULL,
  'Marcus Webb just voted to gut SNAP benefits for 40 million Americans. His net worth? $47 million. These people do not live in our world.',
  -0.93, ARRAY[p.id], g.id, true
FROM public.politicians p, public.geographies g
WHERE p.slug = 'marcus-webb' AND g.slug = 'texas';

INSERT INTO public.posts (source_platform, source_url, content_text, sentiment_score, politician_ids, geography_id, approved)
SELECT 'twitter', NULL,
  'Diane Okafor''s student debt relief bill could help 6 million borrowers in NY alone. Finally someone fighting for working people. #DebtRelief',
  0.82, ARRAY[p.id], g.id, true
FROM public.politicians p, public.geographies g
WHERE p.slug = 'diane-okafor' AND g.slug = 'new-york';

INSERT INTO public.posts (source_platform, source_url, content_text, sentiment_score, politician_ids, geography_id, approved)
SELECT 'twitter', NULL,
  'Greg Perkins voted to roll back clean water protections for the 8th time. His district sits on a major river system. Unconscionable. #txpolitics',
  -0.88, ARRAY[p.id], g.id, true
FROM public.politicians p, public.geographies g
WHERE p.slug = 'greg-perkins' AND g.slug = 'texas';

INSERT INTO public.posts (source_platform, source_url, content_text, sentiment_score, politician_ids, geography_id, approved)
SELECT 'twitter', NULL,
  'Rep. Fujimoto''s Clean Energy 2030 bill just passed committee. Washington could hit 100% renewables by 2030 if this becomes law. #WAleg',
  0.88, ARRAY[p.id], g.id, true
FROM public.politicians p, public.geographies g
WHERE p.slug = 'linda-fujimoto' AND g.slug = 'washington';

INSERT INTO public.posts (source_platform, source_url, content_text, sentiment_score, politician_ids, geography_id, approved)
SELECT 'instagram', NULL,
  'Senator Reyes held a community listening session in East Oakland last week — 200 residents showed up to talk housing. She listened. She stayed.',
  0.71, ARRAY[p.id], g.id, true
FROM public.politicians p, public.geographies g
WHERE p.slug = 'maya-reyes' AND g.slug = 'california';

INSERT INTO public.posts (source_platform, source_url, content_text, sentiment_score, politician_ids, geography_id, approved)
SELECT 'twitter', NULL,
  'Councilmember Jackson just secured funding for 800 new affordable units in District 11. That''s 800 families who get to stay in their neighborhood. #LA #HousingIsARight',
  0.84, ARRAY[p.id], g.id, true
FROM public.politicians p, public.geographies g
WHERE p.slug = 'andre-jackson' AND g.slug = 'los-angeles';

-- ── Comments (user_id NULL = anonymous community seed) ─────────────────────
DELETE FROM public.comments WHERE politician_id IN (
  SELECT id FROM public.politicians WHERE slug IN (
    'jane-doe','richard-cox','sarah-chen','marcus-webb','diane-okafor',
    'greg-perkins','maya-reyes','patricia-holloway','linda-fujimoto',
    'bill-harris','tomas-rivera','andre-jackson'
  )
);

INSERT INTO public.comments (politician_id, user_id, body, upvotes, downvotes, flagged)
SELECT p.id, NULL, v.body, v.upvotes, v.downvotes, false
FROM public.politicians p
CROSS JOIN (VALUES
  ('She''s the only person in Congress I actually trust. No PAC money, no nonsense. Keep fighting, Jane.', 47, 2),
  ('Attended her town hall last month. She knew our district''s issues better than most of us did. Impressive.', 31, 1),
  ('I didn''t vote for her the first time but I will this year. Her climate work has been legit.', 28, 5),
  ('Not perfect but she at least responds to constituent emails. That alone puts her above 90% of Congress.', 19, 3)
) AS v(body, upvotes, downvotes)
WHERE p.slug = 'jane-doe';

INSERT INTO public.comments (politician_id, user_id, body, upvotes, downvotes, flagged)
SELECT p.id, NULL, v.body, v.upvotes, v.downvotes, false
FROM public.politicians p
CROSS JOIN (VALUES
  ('Voted against every piece of healthcare legislation that could have helped my family. I''ll remember in November.', 62, 4),
  ('His donor list reads like a greatest hits of industries that harm ordinary people. Pharma. Fossil fuels. Private prisons.', 54, 7),
  ('Three terms and what has he actually done for regular people? I''m genuinely asking because I can''t find anything.', 41, 9),
  ('He voted against the climate bill after his state flooded twice last year. Unreal.', 38, 6)
) AS v(body, upvotes, downvotes)
WHERE p.slug = 'richard-cox';

INSERT INTO public.comments (politician_id, user_id, body, upvotes, downvotes, flagged)
SELECT p.id, NULL, v.body, v.upvotes, v.downvotes, false
FROM public.politicians p
CROSS JOIN (VALUES
  ('As a former public defender she actually understands the broken systems she''s trying to fix. Rare.', 55, 3),
  ('Her speech on the bail reform bill was one of the most powerful I''ve heard in years. This is why representation matters.', 43, 2),
  ('Hopefully she survives the next cycle. The people who want to silence her are already spending millions against her.', 37, 4)
) AS v(body, upvotes, downvotes)
WHERE p.slug = 'sarah-chen';

INSERT INTO public.comments (politician_id, user_id, body, upvotes, downvotes, flagged)
SELECT p.id, NULL, v.body, v.upvotes, v.downvotes, false
FROM public.politicians p
CROSS JOIN (VALUES
  ('A hedge fund manager who cuts food stamps and calls it "fiscal responsibility." Words fail me.', 71, 5),
  ('He''s never held a job that wasn''t already rich. He has zero idea what it costs to raise a family right now.', 58, 8),
  ('First year in office and he''s already the most corporate vote in the Senate. Remarkable consistency.', 44, 6)
) AS v(body, upvotes, downvotes)
WHERE p.slug = 'marcus-webb';

INSERT INTO public.comments (politician_id, user_id, body, upvotes, downvotes, flagged)
SELECT p.id, NULL, v.body, v.upvotes, v.downvotes, false
FROM public.politicians p
CROSS JOIN (VALUES
  ('The student debt bill is the first real concrete thing done for my generation in years. Thank you Rep. Okafor.', 49, 3),
  ('She came to my school to talk to teachers. She actually listened, took notes, and followed up. Politicians like that are rare.', 39, 2),
  ('Three terms of consistent, boring, effective governance. We need more of this and less of the circus.', 33, 1)
) AS v(body, upvotes, downvotes)
WHERE p.slug = 'diane-okafor';

INSERT INTO public.comments (politician_id, user_id, body, upvotes, downvotes, flagged)
SELECT p.id, NULL, v.body, v.upvotes, v.downvotes, false
FROM public.politicians p
CROSS JOIN (VALUES
  ('He voted against clean water protections eight times while accepting donations from the same industries polluting our rivers.', 66, 5),
  ('The voting ID bill would remove my grandmother from the rolls. She''s voted for 60 years. This is not about integrity.', 59, 7),
  ('12 years and his district''s roads, schools, and healthcare haven''t improved. Where does all that money go?', 48, 9)
) AS v(body, upvotes, downvotes)
WHERE p.slug = 'greg-perkins';

INSERT INTO public.comments (politician_id, user_id, body, upvotes, downvotes, flagged)
SELECT p.id, NULL, v.body, v.upvotes, v.downvotes, false
FROM public.politicians p
CROSS JOIN (VALUES
  ('Her housing bill finally passed. Took years but she never gave up. That matters.', 36, 3),
  ('Still not sure where she stands on a few issues but she at least shows up and engages. I''ll give her that.', 22, 4)
) AS v(body, upvotes, downvotes)
WHERE p.slug = 'maya-reyes';

INSERT INTO public.comments (politician_id, user_id, body, upvotes, downvotes, flagged)
SELECT p.id, NULL, v.body, v.upvotes, v.downvotes, false
FROM public.politicians p
CROSS JOIN (VALUES
  ('Voted against MTA funding and then complained about traffic on her commute. The audacity.', 53, 6),
  ('The redistricting proposal she backed would have turned competitive districts into guaranteed wins. Courts struck it down.', 44, 7)
) AS v(body, upvotes, downvotes)
WHERE p.slug = 'patricia-holloway';

INSERT INTO public.comments (politician_id, user_id, body, upvotes, downvotes, flagged)
SELECT p.id, NULL, v.body, v.upvotes, v.downvotes, false
FROM public.politicians p
CROSS JOIN (VALUES
  ('800 units. That''s 800 families who get to stay in their neighborhood. Councilmember Jackson delivered.', 61, 2),
  ('He actually returns calls from regular constituents. In LA politics that''s a revolutionary act.', 47, 3)
) AS v(body, upvotes, downvotes)
WHERE p.slug = 'andre-jackson';

INSERT INTO public.comments (politician_id, user_id, body, upvotes, downvotes, flagged)
SELECT p.id, NULL, v.body, v.upvotes, v.downvotes, false
FROM public.politicians p
CROSS JOIN (VALUES
  ('Washington could be a climate leader if people like Fujimoto keep winning. Her clean energy bill is the real deal.', 52, 2),
  ('She came to our town''s environmental forum and stayed for 3 hours. She knew our watershed issues by name. Impressive.', 38, 1)
) AS v(body, upvotes, downvotes)
WHERE p.slug = 'linda-fujimoto';

INSERT INTO public.comments (politician_id, user_id, body, upvotes, downvotes, flagged)
SELECT p.id, NULL, v.body, v.upvotes, v.downvotes, false
FROM public.politicians p
CROSS JOIN (VALUES
  ('His zoning votes have made it nearly impossible to build affordable housing anywhere near the loop. Follow the donor list.', 41, 8),
  ('Good for small business owners, terrible for renters. Depends which side of that line you''re on.', 29, 5)
) AS v(body, upvotes, downvotes)
WHERE p.slug = 'bill-harris';

INSERT INTO public.comments (politician_id, user_id, body, upvotes, downvotes, flagged)
SELECT p.id, NULL, v.body, v.upvotes, v.downvotes, false
FROM public.politicians p
CROSS JOIN (VALUES
  ('Rivera got the minimum wage bill moved further than anyone thought possible in the current Texas climate.', 34, 3),
  ('Came up from labor organizing. He hasn''t forgotten where he came from. That comes through in his votes.', 28, 2)
) AS v(body, upvotes, downvotes)
WHERE p.slug = 'tomas-rivera';
