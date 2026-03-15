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
```
