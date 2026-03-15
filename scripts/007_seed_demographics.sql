-- Seed: 007_seed_demographics.sql
-- Populates demographic and election-result data on the geographies table.
-- Requires migration 005_geo_demographics.sql to have been applied first.
-- Safe to re-run (UPDATE statements are idempotent).

UPDATE public.geographies SET
  population          = 335000000,
  political_lean      = 'swing',
  last_result_dem_pct = 51.3,
  last_result_rep_pct = 46.8,
  last_election_year  = 2024
WHERE slug = 'united-states';

UPDATE public.geographies SET
  population          = 39000000,
  political_lean      = 'blue',
  last_result_dem_pct = 63.5,
  last_result_rep_pct = 34.2,
  last_election_year  = 2024
WHERE slug = 'california';

UPDATE public.geographies SET
  population          = 30000000,
  political_lean      = 'red',
  last_result_dem_pct = 43.2,
  last_result_rep_pct = 55.3,
  last_election_year  = 2024
WHERE slug = 'texas';

UPDATE public.geographies SET
  population          = 19800000,
  political_lean      = 'blue',
  last_result_dem_pct = 60.8,
  last_result_rep_pct = 37.1,
  last_election_year  = 2024
WHERE slug = 'new-york';

UPDATE public.geographies SET
  population          = 12600000,
  political_lean      = 'blue',
  last_result_dem_pct = 57.5,
  last_result_rep_pct = 40.8,
  last_election_year  = 2024
WHERE slug = 'illinois';

UPDATE public.geographies SET
  population          = 7700000,
  political_lean      = 'blue',
  last_result_dem_pct = 58.0,
  last_result_rep_pct = 39.2,
  last_election_year  = 2024
WHERE slug = 'washington';

UPDATE public.geographies SET
  population          = 2700000,
  political_lean      = 'deep blue',
  last_result_dem_pct = 73.2,
  last_result_rep_pct = 24.1,
  last_election_year  = 2023
WHERE slug = 'chicago';

UPDATE public.geographies SET
  population          = 3900000,
  political_lean      = 'blue',
  last_result_dem_pct = 71.4,
  last_result_rep_pct = 26.3,
  last_election_year  = 2022
WHERE slug = 'los-angeles';
