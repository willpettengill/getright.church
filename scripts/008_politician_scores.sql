-- Migration 008: Add politician intelligence score columns

ALTER TABLE public.politicians ADD COLUMN IF NOT EXISTS party_line_score numeric(5,2) DEFAULT NULL;
ALTER TABLE public.politicians ADD COLUMN IF NOT EXISTS bipartisan_score numeric(5,2) DEFAULT NULL;
ALTER TABLE public.politicians ADD COLUMN IF NOT EXISTS independence_score numeric(5,2) DEFAULT NULL;
ALTER TABLE public.politicians ADD COLUMN IF NOT EXISTS district_alignment_score numeric(5,2) DEFAULT NULL;
ALTER TABLE public.politicians ADD COLUMN IF NOT EXISTS controversy_score numeric(5,2) DEFAULT NULL;
ALTER TABLE public.politicians ADD COLUMN IF NOT EXISTS consistency_score numeric(5,2) DEFAULT NULL;
ALTER TABLE public.politicians ADD COLUMN IF NOT EXISTS donor_influence_score numeric(5,2) DEFAULT NULL;
ALTER TABLE public.politicians ADD COLUMN IF NOT EXISTS state_abbrev text;
ALTER TABLE public.politicians ADD COLUMN IF NOT EXISTS chamber text CHECK (chamber IN ('senate','house','governor','state_senate','state_house','city_council','mayor'));
