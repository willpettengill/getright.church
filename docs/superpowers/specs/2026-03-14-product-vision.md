# Product Vision: getright.church

**Date:** 2026-03-14
**Status:** Active
**Version:** 1.0

---

## Mission

**Improve American political health through radical transparency and community accountability.**

getright.church is not a news site, not a social network, and not a partisan outlet. It is an intelligence platform — a living, community-powered record of what politicians actually do, who funds them, and how their communities respond.

---

## Target Audience

- **Primary**: Politically engaged Americans (25–45) who distrust mainstream media and want unfiltered, data-backed political signal
- **Secondary**: Activists, organizers, and civic workers who need fast access to voting records and political relationships
- **Tertiary**: Journalists and researchers who want community-sourced political sentiment

---

## Core Value Propositions

1. **Signal over noise** — Community sentiment, voting records, and issue positions in one place
2. **Accountability without spin** — Scores (Epstein, Blunch, Squid) are openly defined and community-validated
3. **Local to federal** — The only platform tracking all three levels of government in one interface
4. **Community-first** — Not just a data viewer; a place for political people to gather, discuss, and act

---

## Success Metrics (6-month targets)

- 500+ politician profiles with real voting records
- 1,000+ active community members
- 50+ political issues tracked
- Weekly engagement: users returning to check "the pulse" on their politicians

---

## Feature Roadmap

### P0 — Already Built ✓

- Politician profiles (scores, bio, voting record, issue positions)
- Issue polling (community votes + politician stances)
- Geography pages (demographics + regional commentary)
- Community comments (anonymous + authenticated)
- Admin tools (ingest, endorsements, portraits)

### P1 — Next Sprint (Highest Impact)

#### 1. Functional Community Comments
- Wire `comment-form.tsx` into politician profile page so logged-in and anonymous users can post
- Wire upvote/downvote buttons to call the API (currently display-only)

#### 2. User Account + Follow System
- Let users follow politicians and receive a personalized feed
- New table: `user_follows` (user_id, politician_id, created_at)
- New page: `/feed` — personalized pulse feed for followed politicians
- Profile page: `/profile` — manage followed politicians, view your comments

#### 3. The Talk (Forum)
- Existing placeholder at `/the-talk`
- Long-form community commentary — threaded discussions on bills, politicians, issues
- New tables: `threads` (title, body, author_id, topic_type, topic_id, created_at), `thread_replies`
- MVP: Single flat discussion board, no threading required for V1
- Link threads to politicians/issues for context

#### 4. Real-Time Pulse Feed
- Expand the admin ingest to pull from real sources (RSS, social scrapers)
- Add a simple submission form so community members can submit posts for approval

### P2 — High Value, Scheduled Next

#### 5. Donor Network Visualization
- `entities` and `relationships` tables exist but are unused
- Visualize donor connections — who funds a politician, via what PACs, corporate ties
- Stack: D3.js or Recharts force-directed graph, client component
- Page: Add a "Network" tab to politician profiles

#### 6. Politician Comparison Tool
- `/compare?a=slug1&b=slug2` — side-by-side view of two politicians
- Show scores, issue positions, voting records head-to-head

#### 7. Bill Tracker
- Track active legislation beyond individual votes
- New table: `bills` (bill_id, title, status, category, introduced_date, summary)
- Link bills to votes
- Show bills relevant to a politician or issue

#### 8. Share Cards + Viral Mechanics
- Generate shareable OG images for politician profiles
- `app/politicians/[slug]/opengraph-image.tsx` — Next.js OG image generation
- Cards show name, endorsement status, top score in a brandable format

### P3 — Future

- **Blunch event platform** — RSVP system, event listings, community organizing
- **Email digest** — Weekly "The Briefing" with top movers, new endorsements, trending issues
- **Mobile app** — React Native with Supabase auth
- **Alerts** — Notify users when a followed politician casts a key vote

---

## Design System

### Aesthetic Identity
- Dark war-room intelligence briefing aesthetic
- Bebas Neue display font, JetBrains Mono body font
- Forest green (#40916c) primary accent on near-black backgrounds
- Scanline texture, grain overlays, radial glows

### Token System
- CSS custom properties in `app/globals.css` as source of truth
- Tailwind config references CSS vars (never duplicates values)
- Typography scale: `--text-xs` through `--text-hero` in CSS vars, mirrored in Tailwind `fontSize`

### Component Library
- Buttons: `.btn-primary`, `.btn-outline`, `.btn-ghost`
- Cards: `.card`, `.card-accented`
- Forms: `.input`, `.label`
- Badges: `.badge`, `.tag`
- Layout: `.page-container`, `.section`, `.grid-auto`

---

## Architecture Notes

- **DB schema** (`scripts/001_schema.sql`) is source of truth
- **Never hand-edit** `lib/database.types.ts` — regenerate via `npm run gen:types`
- **API contract**: All route bodies cast to types from `lib/api-types.ts`; never return raw Supabase rows
- **Auth**: Server components use `lib/supabase/server.ts`; client components use `lib/supabase/client.ts`
- **Admin gate**: Check `user.role === 'admin'` from `users` table, not just auth session

---

*Built with intention. Powered by community. getright.church*
