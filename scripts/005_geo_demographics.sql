-- Migration: 005_geo_demographics.sql
-- Adds demographic and election-result columns to the geographies table.
-- Safe to re-run (ADD COLUMN IF NOT EXISTS guards throughout).

ALTER TABLE public.geographies
  ADD COLUMN IF NOT EXISTS population          integer,
  ADD COLUMN IF NOT EXISTS political_lean      text,
  ADD COLUMN IF NOT EXISTS last_result_dem_pct numeric(5,2),
  ADD COLUMN IF NOT EXISTS last_result_rep_pct numeric(5,2),
  ADD COLUMN IF NOT EXISTS last_election_year  integer;
