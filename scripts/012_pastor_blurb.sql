ALTER TABLE public.politicians  ADD COLUMN IF NOT EXISTS pastor_blurb text;
ALTER TABLE public.issues       ADD COLUMN IF NOT EXISTS pastor_blurb text;
ALTER TABLE public.bills        ADD COLUMN IF NOT EXISTS pastor_blurb text;
ALTER TABLE public.geographies  ADD COLUMN IF NOT EXISTS pastor_blurb text;

-- Bills need a URL-safe slug (bill_id like "HR-1201" → "hr-1201")
ALTER TABLE public.bills ADD COLUMN IF NOT EXISTS slug text UNIQUE;
UPDATE public.bills SET slug = lower(replace(bill_id, '/', '-')) WHERE slug IS NULL;
