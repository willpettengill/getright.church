# getright.church

## Stack
- **Framework:** Next.js (bootstrapped via Vercel v0), TypeScript
- **Backend:** Supabase — Auth, Database (Postgres), Storage, Edge Functions
- **Hosting:** Vercel

## Project
getright.church — a church-related web application.

## Architecture

### Data flow
- DB schema (`scripts/001_schema.sql`) is the source of truth
- `lib/database.types.ts` — generated from Supabase; **never hand-edit** this file
- `lib/types.ts` — re-exports convenience types derived from `lib/database.types.ts`; add exports here, not column shapes
- `lib/api.ts` — all Supabase query functions live here; components must not call Supabase directly
- `lib/api-types.ts` — shared request/response interfaces for all API routes

### Schema changes
1. Add a new incremental file `scripts/002_<description>.sql` (do **not** edit `scripts/001_schema.sql`)
2. Apply in Supabase dashboard or via CLI
3. Run `npm run gen:types` to regenerate `lib/database.types.ts`
4. Export new types from `lib/types.ts` if needed
5. `npm run build` must pass (zero TypeScript errors) before committing

### API contract rules
- All API route request bodies must be cast to a type from `lib/api-types.ts`
- All API route responses must return shapes defined in `lib/api-types.ts`
- Never return raw Supabase rows — map to the typed response shape

### Auth rules
- Server components / route handlers: use `createClient()` from `lib/supabase/server.ts`
- Client components: use `createClient()` from `lib/supabase/client.ts`
- Never import the server client in a client component
- Admin-gated routes must check `user.role === 'admin'` from the `users` table, not just the auth session

### Adding a new table
1. Add SQL to `scripts/` (new incremental file)
2. Apply migration
3. Run `npm run gen:types`
4. Export convenience types from `lib/types.ts`
5. Add query function to `lib/api.ts`
6. Add request/response types to `lib/api-types.ts` if API routes are needed

## Useful Commands
```bash
npm run dev        # Start dev server
npm run build      # Production build
npm run lint       # Run linter
npm run gen:types  # Regenerate lib/database.types.ts from Supabase schema
npm run db:status  # Print live row counts for every table
```

## Verifying DB State

**Never report entity counts by reading seed SQL files.** Seed files are scripts —
they may not have been applied, may have been applied partially, or may have been
superseded. To get accurate counts:

```bash
npm run db:status
```

This queries the live Supabase database and prints row counts for every table.

### Applied migrations (update this list when running migrations)
- `001_schema.sql` — base schema
- `002_scores.sql` — epstein_score, blunch, is_squid columns
- `003_seed_expanded.sql` — 12 politicians, geographies, votes, posts, comments
- `004_issues.sql` — issues + politician_issue_positions tables
- `005_geo_demographics.sql` — demographics columns on geographies
- `006_seed_issues.sql` — 8 issues, issue_votes
- `007_seed_demographics.sql` — geography demographic data
- `008_politician_scores.sql` — intelligence score columns + state_abbrev + chamber ✓ applied 2026-03-15
- `009_bills.sql` — bills table + votes.bill_uuid + votes.party_vote ✓ applied 2026-03-15
- `010_similarities.sql` — politician_similarities table ✓ applied 2026-03-15
- `011_fix_rls_recursion.sql` — is_admin() SECURITY DEFINER function + fix users_admin_all recursion ✓ applied 2026-03-15
- `012_pastor_blurb.sql` — pastor_blurb text column on all 4 entity tables + bills.slug ✓ applied 2026-03-16

### Seed state
- `seed-v2.ts` last run 2026-03-15 — 51 geographies, 50 bills, 138 politicians, 2445 votes, 16 issues, 2208 positions, 1271 similarity pairs, 800 issue_votes, 350 posts
