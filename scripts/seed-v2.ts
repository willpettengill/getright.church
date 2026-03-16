import { config } from 'dotenv';
config({ path: '.env.local' });

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// ── Helpers ──────────────────────────────────────────────────────────────────

function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function hashStr(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h += s.charCodeAt(i);
  return h;
}

function toSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');
}

async function chunkInsert<T extends object>(
  table: string,
  rows: T[],
  upsertKey?: string
): Promise<void> {
  const size = 50;
  for (let i = 0; i < rows.length; i += size) {
    const chunk = rows.slice(i, i + size);
    let q;
    if (upsertKey) {
      q = supabase.from(table).upsert(chunk as any, { onConflict: upsertKey });
    } else {
      q = supabase.from(table).insert(chunk as any);
    }
    const { error } = await q;
    if (error) console.error(`  ✗ ${table} chunk ${i}:`, error.message);
  }
}

// ── Phase 0: Wipe ─────────────────────────────────────────────────────────────

async function phase0() {
  console.log('🗑️  Phase 0: Wiping fictional seed data...');
  const tables = [
    ['relationships', null],
    ['politician_issue_positions', null],
    ['votes', null],
    ['posts', null],
  ] as [string, string | null][];

  for (const [table] of tables) {
    const { error } = await supabase.from(table).delete().neq('id', '00000000-0000-0000-0000-000000000000');
    if (error) console.error(`  ✗ wipe ${table}:`, error.message);
  }

  // politician_similarities (composite PK — no id column)
  {
    const { error } = await supabase
      .from('politician_similarities')
      .delete()
      .neq('politician_a_id', '00000000-0000-0000-0000-000000000000')
    if (error) console.error('  ✗ wipe politician_similarities:', error.message)
  }
  // issue_votes where user_id IS NULL
  {
    const { error } = await supabase.from('issue_votes').delete().is('user_id', null);
    if (error) console.error('  ✗ wipe issue_votes:', error.message);
  }
  // politicians
  {
    const { error } = await supabase.from('politicians').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    if (error) console.error('  ✗ wipe politicians:', error.message);
  }
  // issues
  {
    const { error } = await supabase.from('issues').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    if (error) console.error('  ✗ wipe issues:', error.message);
  }
  // geographies - children first then parents (non-federal)
  {
    const { data: children } = await supabase.from('geographies').select('id').neq('slug', 'us-federal').not('parent_id', 'is', null);
    if (children && children.length) {
      const ids = children.map(r => r.id);
      for (let i = 0; i < ids.length; i += 50) {
        await supabase.from('geographies').delete().in('id', ids.slice(i, i + 50));
      }
    }
    const { data: parents } = await supabase.from('geographies').select('id').neq('slug', 'us-federal').is('parent_id', null);
    if (parents && parents.length) {
      const ids = parents.map(r => r.id);
      for (let i = 0; i < ids.length; i += 50) {
        await supabase.from('geographies').delete().in('id', ids.slice(i, i + 50));
      }
    }
  }
  // entities
  {
    const { error } = await supabase.from('entities').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    if (error) console.error('  ✗ wipe entities:', error.message);
  }
  // bills
  {
    const { error } = await supabase.from('bills').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    if (error) console.error('  ✗ wipe bills:', error.message);
  }
  console.log('  ✓ Wipe complete');
}

// ── Phase 1: Geographies ──────────────────────────────────────────────────────

const STATE_DATA = [
  { name: 'Alabama', abbrev: 'AL', slug: 'alabama', lean: 'deep red', dem: 34.4, rep: 64.8, pop: 5039877 },
  { name: 'Alaska', abbrev: 'AK', slug: 'alaska', lean: 'red', dem: 42.3, rep: 53.7, pop: 733583 },
  { name: 'Arizona', abbrev: 'AZ', slug: 'arizona', lean: 'swing', dem: 49.4, rep: 49.1, pop: 7276316 },
  { name: 'Arkansas', abbrev: 'AR', slug: 'arkansas', lean: 'deep red', dem: 34.8, rep: 63.2, pop: 3011524 },
  { name: 'California', abbrev: 'CA', slug: 'california', lean: 'deep blue', dem: 65.0, rep: 32.0, pop: 39538223 },
  { name: 'Colorado', abbrev: 'CO', slug: 'colorado', lean: 'blue', dem: 55.8, rep: 41.9, pop: 5773714 },
  { name: 'Connecticut', abbrev: 'CT', slug: 'connecticut', lean: 'blue', dem: 59.2, rep: 39.2, pop: 3605944 },
  { name: 'Delaware', abbrev: 'DE', slug: 'delaware', lean: 'blue', dem: 58.7, rep: 39.8, pop: 989948 },
  { name: 'Florida', abbrev: 'FL', slug: 'florida', lean: 'red', dem: 47.9, rep: 51.2, pop: 21538187 },
  { name: 'Georgia', abbrev: 'GA', slug: 'georgia', lean: 'swing', dem: 49.5, rep: 49.3, pop: 10711908 },
  { name: 'Hawaii', abbrev: 'HI', slug: 'hawaii', lean: 'deep blue', dem: 67.0, rep: 30.0, pop: 1455271 },
  { name: 'Idaho', abbrev: 'ID', slug: 'idaho', lean: 'deep red', dem: 33.1, rep: 63.9, pop: 1839106 },
  { name: 'Illinois', abbrev: 'IL', slug: 'illinois', lean: 'blue', dem: 57.5, rep: 40.5, pop: 12812508 },
  { name: 'Indiana', abbrev: 'IN', slug: 'indiana', lean: 'red', dem: 41.0, rep: 57.0, pop: 6785528 },
  { name: 'Iowa', abbrev: 'IA', slug: 'iowa', lean: 'red', dem: 45.0, rep: 53.1, pop: 3190369 },
  { name: 'Kansas', abbrev: 'KS', slug: 'kansas', lean: 'deep red', dem: 37.7, rep: 59.3, pop: 2937880 },
  { name: 'Kentucky', abbrev: 'KY', slug: 'kentucky', lean: 'deep red', dem: 36.1, rep: 62.1, pop: 4505836 },
  { name: 'Louisiana', abbrev: 'LA', slug: 'louisiana', lean: 'deep red', dem: 39.9, rep: 58.5, pop: 4657757 },
  { name: 'Maine', abbrev: 'ME', slug: 'maine', lean: 'swing', dem: 53.1, rep: 44.3, pop: 1362359 },
  { name: 'Maryland', abbrev: 'MD', slug: 'maryland', lean: 'deep blue', dem: 67.0, rep: 32.2, pop: 6177224 },
  { name: 'Massachusetts', abbrev: 'MA', slug: 'massachusetts', lean: 'deep blue', dem: 66.4, rep: 31.1, pop: 7029917 },
  { name: 'Michigan', abbrev: 'MI', slug: 'michigan', lean: 'swing', dem: 50.9, rep: 47.8, pop: 10077331 },
  { name: 'Minnesota', abbrev: 'MN', slug: 'minnesota', lean: 'blue', dem: 52.4, rep: 45.3, pop: 5706494 },
  { name: 'Mississippi', abbrev: 'MS', slug: 'mississippi', lean: 'deep red', dem: 38.9, rep: 59.3, pop: 2961279 },
  { name: 'Missouri', abbrev: 'MO', slug: 'missouri', lean: 'red', dem: 41.4, rep: 56.8, pop: 6154913 },
  { name: 'Montana', abbrev: 'MT', slug: 'montana', lean: 'red', dem: 40.5, rep: 56.9, pop: 1084225 },
  { name: 'Nebraska', abbrev: 'NE', slug: 'nebraska', lean: 'deep red', dem: 39.2, rep: 58.5, pop: 1961504 },
  { name: 'Nevada', abbrev: 'NV', slug: 'nevada', lean: 'swing', dem: 50.0, rep: 47.5, pop: 3104614 },
  { name: 'New Hampshire', abbrev: 'NH', slug: 'new-hampshire', lean: 'swing', dem: 52.8, rep: 45.4, pop: 1377529 },
  { name: 'New Jersey', abbrev: 'NJ', slug: 'new-jersey', lean: 'blue', dem: 56.3, rep: 41.4, pop: 9288994 },
  { name: 'New Mexico', abbrev: 'NM', slug: 'new-mexico', lean: 'blue', dem: 54.3, rep: 43.5, pop: 2117522 },
  { name: 'New York', abbrev: 'NY', slug: 'new-york', lean: 'deep blue', dem: 62.7, rep: 35.7, pop: 20201249 },
  { name: 'North Carolina', abbrev: 'NC', slug: 'north-carolina', lean: 'swing', dem: 48.3, rep: 49.9, pop: 10439388 },
  { name: 'North Dakota', abbrev: 'ND', slug: 'north-dakota', lean: 'deep red', dem: 31.8, rep: 65.1, pop: 779094 },
  { name: 'Ohio', abbrev: 'OH', slug: 'ohio', lean: 'red', dem: 45.1, rep: 53.3, pop: 11799448 },
  { name: 'Oklahoma', abbrev: 'OK', slug: 'oklahoma', lean: 'deep red', dem: 32.3, rep: 65.4, pop: 3959353 },
  { name: 'Oregon', abbrev: 'OR', slug: 'oregon', lean: 'blue', dem: 56.5, rep: 40.5, pop: 4237256 },
  { name: 'Pennsylvania', abbrev: 'PA', slug: 'pennsylvania', lean: 'swing', dem: 50.0, rep: 48.8, pop: 13002700 },
  { name: 'Rhode Island', abbrev: 'RI', slug: 'rhode-island', lean: 'deep blue', dem: 64.0, rep: 34.0, pop: 1097379 },
  { name: 'South Carolina', abbrev: 'SC', slug: 'south-carolina', lean: 'red', dem: 43.4, rep: 55.1, pop: 5118425 },
  { name: 'South Dakota', abbrev: 'SD', slug: 'south-dakota', lean: 'deep red', dem: 35.6, rep: 61.8, pop: 886667 },
  { name: 'Tennessee', abbrev: 'TN', slug: 'tennessee', lean: 'deep red', dem: 36.5, rep: 61.6, pop: 6910840 },
  { name: 'Texas', abbrev: 'TX', slug: 'texas', lean: 'red', dem: 46.5, rep: 52.2, pop: 29145505 },
  { name: 'Utah', abbrev: 'UT', slug: 'utah', lean: 'red', dem: 37.7, rep: 58.3, pop: 3271616 },
  { name: 'Vermont', abbrev: 'VT', slug: 'vermont', lean: 'deep blue', dem: 66.2, rep: 30.6, pop: 643077 },
  { name: 'Virginia', abbrev: 'VA', slug: 'virginia', lean: 'blue', dem: 54.1, rep: 44.3, pop: 8631393 },
  { name: 'Washington', abbrev: 'WA', slug: 'washington', lean: 'blue', dem: 59.3, rep: 38.8, pop: 7705281 },
  { name: 'West Virginia', abbrev: 'WV', slug: 'west-virginia', lean: 'deep red', dem: 28.9, rep: 68.6, pop: 1793716 },
  { name: 'Wisconsin', abbrev: 'WI', slug: 'wisconsin', lean: 'swing', dem: 49.6, rep: 48.8, pop: 5893718 },
  { name: 'Wyoming', abbrev: 'WY', slug: 'wyoming', lean: 'deep red', dem: 26.5, rep: 70.3, pop: 576851 },
];

async function phase1(): Promise<Record<string, string>> {
  console.log('🗺️  Phase 1: Seeding geographies...');

  // Upsert US Federal
  const { error: fedErr } = await supabase
    .from('geographies')
    .upsert({ slug: 'us-federal', name: 'United States', type: 'federal', population: 331449281 }, { onConflict: 'slug' });
  if (fedErr) { console.error('  ✗ federal geo:', fedErr.message); }

  const { data: fedRow } = await supabase.from('geographies').select('id').eq('slug', 'us-federal').single();
  const federalId = fedRow?.id;

  const stateRows = STATE_DATA.map(s => ({
    slug: s.slug,
    name: s.name,
    type: 'state',
    parent_id: federalId,
    population: s.pop,
    political_lean: s.lean,
    last_result_dem_pct: s.dem,
    last_result_rep_pct: s.rep,
    last_election_year: 2024,
  }));

  await chunkInsert('geographies', stateRows, 'slug');

  // Build slug→id map
  const { data: allGeos } = await supabase.from('geographies').select('id, slug');
  const geoMap: Record<string, string> = {};
  for (const g of allGeos ?? []) geoMap[g.slug] = g.id;

  console.log(`  ✓ ${Object.keys(geoMap).length} geographies`);
  return geoMap;
}

// ── Phase 2: Bills ────────────────────────────────────────────────────────────

const BILLS_DATA = [
  // economy (8)
  { bill_id: 'S.3740', name: 'Inflation Reduction Act', description: 'Reduces inflation through tax reform, climate investments, and drug price negotiation.', policy_category: 'economy', chamber: 'senate', congress: 118, introduced_date: '2022-07-27', vote_date: '2022-08-07', party_position_dem: 'yea', party_position_rep: 'nay', is_bipartisan: false },
  { bill_id: 'H.R.3684', name: 'Infrastructure Investment and Jobs Act', description: 'Invests in roads, bridges, broadband, and water systems across the country.', policy_category: 'economy', chamber: 'house', congress: 117, introduced_date: '2021-06-04', vote_date: '2021-11-05', party_position_dem: 'yea', party_position_rep: 'split', is_bipartisan: true },
  { bill_id: 'H.R.1319', name: 'American Rescue Plan Act', description: 'COVID-19 economic relief including stimulus checks and state/local aid.', policy_category: 'economy', chamber: 'house', congress: 117, introduced_date: '2021-02-24', vote_date: '2021-03-10', party_position_dem: 'yea', party_position_rep: 'nay', is_bipartisan: false },
  { bill_id: 'H.R.842', name: 'Protecting the Right to Organize Act', description: 'Strengthens workers right to organize and collectively bargain.', policy_category: 'economy', chamber: 'house', congress: 117, introduced_date: '2021-02-04', vote_date: '2021-03-09', party_position_dem: 'yea', party_position_rep: 'nay', is_bipartisan: false },
  { bill_id: 'H.R.5376', name: 'Build Back Better Act', description: 'Social spending bill covering climate, healthcare, childcare, and housing.', policy_category: 'economy', chamber: 'house', congress: 117, introduced_date: '2021-09-27', vote_date: '2021-11-19', party_position_dem: 'yea', party_position_rep: 'nay', is_bipartisan: false },
  { bill_id: 'S.4654', name: 'CHIPS and Science Act', description: 'Boosts domestic semiconductor manufacturing and science research funding.', policy_category: 'economy', chamber: 'senate', congress: 117, introduced_date: '2022-07-19', vote_date: '2022-07-27', party_position_dem: 'yea', party_position_rep: 'split', is_bipartisan: true },
  { bill_id: 'H.R.5898', name: 'Child Tax Credit Expansion Act', description: 'Permanently expands the child tax credit to reduce childhood poverty.', policy_category: 'economy', chamber: 'house', congress: 118, introduced_date: '2023-09-14', vote_date: '2024-01-19', party_position_dem: 'yea', party_position_rep: 'nay', is_bipartisan: false },
  { bill_id: 'S.1765', name: 'Small Business Relief and Recovery Act', description: 'Provides tax credits and loan access for small businesses post-pandemic.', policy_category: 'economy', chamber: 'senate', congress: 118, introduced_date: '2023-05-24', vote_date: '2023-09-12', party_position_dem: 'yea', party_position_rep: 'split', is_bipartisan: true },
  // healthcare (7)
  { bill_id: 'H.R.3', name: 'Lower Drug Costs Now Act', description: 'Empowers Medicare to negotiate prescription drug prices.', policy_category: 'healthcare', chamber: 'house', congress: 116, introduced_date: '2019-09-19', vote_date: '2019-12-12', party_position_dem: 'yea', party_position_rep: 'nay', is_bipartisan: false },
  { bill_id: 'H.R.6833', name: 'Affordable Insulin Now Act', description: 'Caps insulin costs at $35/month for insured Americans.', policy_category: 'healthcare', chamber: 'house', congress: 117, introduced_date: '2022-02-18', vote_date: '2022-03-31', party_position_dem: 'yea', party_position_rep: 'split', is_bipartisan: false },
  { bill_id: 'S.2019', name: 'Medicare for All Act', description: 'Establishes a single-payer national health insurance program.', policy_category: 'healthcare', chamber: 'senate', congress: 118, introduced_date: '2023-05-11', vote_date: '2023-07-20', party_position_dem: 'split', party_position_rep: 'nay', is_bipartisan: false },
  { bill_id: 'H.R.1425', name: 'Patient Protection and Affordable Care Enhancement Act', description: 'Expands ACA subsidies and adds a public option insurance plan.', policy_category: 'healthcare', chamber: 'house', congress: 117, introduced_date: '2021-02-26', vote_date: '2021-06-16', party_position_dem: 'yea', party_position_rep: 'nay', is_bipartisan: false },
  { bill_id: 'S.3012', name: 'Mental Health Access Improvement Act', description: 'Expands Medicare coverage for mental health services and telehealth.', policy_category: 'healthcare', chamber: 'senate', congress: 118, introduced_date: '2023-10-04', vote_date: '2024-02-14', party_position_dem: 'yea', party_position_rep: 'split', is_bipartisan: true },
  { bill_id: 'H.R.7780', name: 'Opioid Crisis Response and Recovery Act', description: 'Funds addiction treatment and expands overdose prevention programs.', policy_category: 'healthcare', chamber: 'house', congress: 118, introduced_date: '2024-03-21', vote_date: '2024-05-08', party_position_dem: 'yea', party_position_rep: 'yea', is_bipartisan: true },
  { bill_id: 'S.1896', name: 'Telehealth Modernization Act', description: 'Makes permanent the pandemic-era telehealth flexibilities for Medicare.', policy_category: 'healthcare', chamber: 'senate', congress: 118, introduced_date: '2023-06-08', vote_date: '2023-11-15', party_position_dem: 'yea', party_position_rep: 'yea', is_bipartisan: true },
  // climate (7)
  { bill_id: 'H.R.332', name: 'Green New Deal Resolution', description: 'Framework resolution for a green economy transition addressing climate change.', policy_category: 'climate', chamber: 'house', congress: 118, introduced_date: '2023-01-09', vote_date: '2023-03-30', party_position_dem: 'yea', party_position_rep: 'nay', is_bipartisan: false },
  { bill_id: 'S.1589', name: 'Clean Electricity Performance Program Act', description: 'Creates incentives for utilities to rapidly transition to clean energy.', policy_category: 'climate', chamber: 'senate', congress: 117, introduced_date: '2021-05-13', vote_date: '2021-09-22', party_position_dem: 'yea', party_position_rep: 'nay', is_bipartisan: false },
  { bill_id: 'H.R.2534', name: 'Climate Resilience and Coastal Protection Act', description: 'Funds coastal resilience infrastructure and climate adaptation programs.', policy_category: 'climate', chamber: 'house', congress: 118, introduced_date: '2023-04-06', vote_date: '2023-07-19', party_position_dem: 'yea', party_position_rep: 'nay', is_bipartisan: false },
  { bill_id: 'S.2233', name: 'Carbon Border Adjustment Act', description: 'Imposes carbon tariffs on imports from countries without carbon pricing.', policy_category: 'climate', chamber: 'senate', congress: 118, introduced_date: '2023-07-14', vote_date: '2023-10-25', party_position_dem: 'yea', party_position_rep: 'split', is_bipartisan: false },
  { bill_id: 'H.R.4119', name: 'Electric Vehicle Infrastructure Expansion Act', description: 'Funds nationwide EV charging network and clean vehicle tax credits.', policy_category: 'climate', chamber: 'house', congress: 118, introduced_date: '2023-06-22', vote_date: '2023-09-14', party_position_dem: 'yea', party_position_rep: 'nay', is_bipartisan: false },
  { bill_id: 'S.3301', name: 'Methane Emissions Reduction and Accountability Act', description: 'Strengthens EPA regulations on methane leaks from oil and gas operations.', policy_category: 'climate', chamber: 'senate', congress: 118, introduced_date: '2023-11-09', vote_date: '2024-02-28', party_position_dem: 'yea', party_position_rep: 'nay', is_bipartisan: false },
  { bill_id: 'H.R.6122', name: 'Wildfire Prevention and Forest Management Act', description: 'Funds forest management and wildfire suppression with climate adaptation.', policy_category: 'climate', chamber: 'house', congress: 118, introduced_date: '2023-10-30', vote_date: '2024-01-24', party_position_dem: 'yea', party_position_rep: 'split', is_bipartisan: true },
  // rights (7)
  { bill_id: 'H.R.1808', name: 'Assault Weapons Ban of 2022', description: 'Bans the manufacture, sale, and importation of semi-automatic assault weapons.', policy_category: 'rights', chamber: 'house', congress: 117, introduced_date: '2022-05-31', vote_date: '2022-07-29', party_position_dem: 'yea', party_position_rep: 'nay', is_bipartisan: false },
  { bill_id: 'H.R.1', name: 'For the People Act', description: 'Sweeping election reform expanding voting access and campaign finance disclosure.', policy_category: 'rights', chamber: 'house', congress: 117, introduced_date: '2021-01-04', vote_date: '2021-03-03', party_position_dem: 'yea', party_position_rep: 'nay', is_bipartisan: false },
  { bill_id: 'H.R.5', name: 'Equality Act', description: 'Prohibits discrimination based on sexual orientation and gender identity.', policy_category: 'rights', chamber: 'house', congress: 117, introduced_date: '2021-02-18', vote_date: '2021-02-25', party_position_dem: 'yea', party_position_rep: 'nay', is_bipartisan: false },
  { bill_id: 'H.R.1280', name: 'George Floyd Justice in Policing Act', description: 'Police accountability and reform including banning chokeholds and no-knock raids.', policy_category: 'rights', chamber: 'house', congress: 117, introduced_date: '2021-02-24', vote_date: '2021-03-03', party_position_dem: 'yea', party_position_rep: 'nay', is_bipartisan: false },
  { bill_id: 'S.4486', name: 'Women\'s Health Protection Act', description: 'Codifies Roe v. Wade protections for abortion access nationwide.', policy_category: 'rights', chamber: 'senate', congress: 117, introduced_date: '2022-05-10', vote_date: '2022-05-11', party_position_dem: 'yea', party_position_rep: 'nay', is_bipartisan: false },
  { bill_id: 'S.2747', name: 'John Lewis Voting Rights Advancement Act', description: 'Restores and strengthens protections of the Voting Rights Act of 1965.', policy_category: 'rights', chamber: 'senate', congress: 117, introduced_date: '2021-08-17', vote_date: '2022-01-19', party_position_dem: 'yea', party_position_rep: 'nay', is_bipartisan: false },
  { bill_id: 'H.R.4', name: 'Voting Rights Advancement Act', description: 'Updates the Voting Rights Act to combat modern voter suppression tactics.', policy_category: 'rights', chamber: 'house', congress: 117, introduced_date: '2021-08-17', vote_date: '2021-08-24', party_position_dem: 'yea', party_position_rep: 'nay', is_bipartisan: false },
  // defense (6)
  { bill_id: 'S.2226', name: 'National Defense Authorization Act 2024', description: 'Annual defense policy bill authorizing military spending and programs.', policy_category: 'defense', chamber: 'senate', congress: 118, introduced_date: '2023-07-11', vote_date: '2023-12-13', party_position_dem: 'split', party_position_rep: 'yea', is_bipartisan: true },
  { bill_id: 'H.R.8035', name: 'Ukraine Security Supplemental Appropriations Act', description: 'Emergency military and humanitarian aid package for Ukraine.', policy_category: 'defense', chamber: 'house', congress: 118, introduced_date: '2024-04-17', vote_date: '2024-04-20', party_position_dem: 'yea', party_position_rep: 'split', is_bipartisan: false },
  { bill_id: 'S.3108', name: 'Military Housing Privatization Reform Act', description: 'Reforms military housing programs and improves conditions for service members.', policy_category: 'defense', chamber: 'senate', congress: 118, introduced_date: '2023-10-17', vote_date: '2024-01-31', party_position_dem: 'yea', party_position_rep: 'yea', is_bipartisan: true },
  { bill_id: 'H.R.6090', name: 'AUMF Repeal and Reform Act', description: 'Repeals outdated Authorizations for Use of Military Force from 2001 and 2002.', policy_category: 'defense', chamber: 'house', congress: 118, introduced_date: '2023-10-24', vote_date: '2024-03-06', party_position_dem: 'split', party_position_rep: 'split', is_bipartisan: true },
  { bill_id: 'S.1702', name: 'NATO Support and Burden Sharing Act', description: 'Reaffirms U.S. commitment to NATO and requires burden sharing accountability.', policy_category: 'defense', chamber: 'senate', congress: 118, introduced_date: '2023-05-23', vote_date: '2023-08-02', party_position_dem: 'yea', party_position_rep: 'split', is_bipartisan: true },
  { bill_id: 'H.R.3935', name: 'FAA Reauthorization and Aviation Safety Act', description: 'Reauthorizes the FAA and strengthens aviation safety regulations.', policy_category: 'defense', chamber: 'house', congress: 118, introduced_date: '2023-06-09', vote_date: '2024-05-23', party_position_dem: 'yea', party_position_rep: 'yea', is_bipartisan: true },
  // housing (6)
  { bill_id: 'H.R.7191', name: 'Housing Is Infrastructure Act', description: 'Invests in public housing construction and rehabilitation nationwide.', policy_category: 'housing', chamber: 'house', congress: 117, introduced_date: '2021-03-18', vote_date: '2021-06-24', party_position_dem: 'yea', party_position_rep: 'nay', is_bipartisan: false },
  { bill_id: 'S.1224', name: 'American Housing and Economic Mobility Act', description: 'Creates affordable housing tax credits and funds down-payment assistance.', policy_category: 'housing', chamber: 'senate', congress: 118, introduced_date: '2023-04-20', vote_date: '2023-07-13', party_position_dem: 'yea', party_position_rep: 'nay', is_bipartisan: false },
  { bill_id: 'H.R.2936', name: 'Rent Relief Act', description: 'Provides refundable tax credits for renters paying over 30% of income on housing.', policy_category: 'housing', chamber: 'house', congress: 118, introduced_date: '2023-04-27', vote_date: '2023-08-01', party_position_dem: 'yea', party_position_rep: 'nay', is_bipartisan: false },
  { bill_id: 'S.1697', name: 'Yes in My Backyard Act', description: 'Incentivizes communities to eliminate restrictive zoning barriers to housing.', policy_category: 'housing', chamber: 'senate', congress: 118, introduced_date: '2023-05-24', vote_date: '2023-10-19', party_position_dem: 'yea', party_position_rep: 'split', is_bipartisan: true },
  { bill_id: 'H.R.6370', name: 'Affordable Housing Credit Improvement Act', description: 'Expands the Low-Income Housing Tax Credit to build more affordable units.', policy_category: 'housing', chamber: 'house', congress: 118, introduced_date: '2023-11-14', vote_date: '2024-02-07', party_position_dem: 'yea', party_position_rep: 'split', is_bipartisan: true },
  { bill_id: 'S.4042', name: 'Homelessness Prevention and Rapid Re-Housing Act', description: 'Funds programs to prevent homelessness and quickly rehouse displaced individuals.', policy_category: 'housing', chamber: 'senate', congress: 118, introduced_date: '2024-03-14', vote_date: '2024-06-12', party_position_dem: 'yea', party_position_rep: 'nay', is_bipartisan: false },
  // foreign-policy (5)
  { bill_id: 'S.3414', name: 'Taiwan Policy Act', description: 'Strengthens U.S.-Taiwan relations and increases military assistance.', policy_category: 'foreign-policy', chamber: 'senate', congress: 117, introduced_date: '2022-06-17', vote_date: '2022-09-14', party_position_dem: 'yea', party_position_rep: 'yea', is_bipartisan: true },
  { bill_id: 'H.R.7109', name: 'Israel Security Assistance Support Act', description: 'Provides additional military assistance and Iron Dome replenishment to Israel.', policy_category: 'foreign-policy', chamber: 'house', congress: 118, introduced_date: '2024-02-06', vote_date: '2024-04-17', party_position_dem: 'split', party_position_rep: 'yea', is_bipartisan: false },
  { bill_id: 'S.2438', name: 'Countering China\'s Influence Act', description: 'Restricts Chinese government investments and addresses national security threats.', policy_category: 'foreign-policy', chamber: 'senate', congress: 118, introduced_date: '2023-07-25', vote_date: '2023-11-08', party_position_dem: 'split', party_position_rep: 'yea', is_bipartisan: true },
  { bill_id: 'H.R.6126', name: 'Global Fragility Act Reauthorization', description: 'Reauthorizes U.S. programs to prevent violent conflict and stabilize fragile states.', policy_category: 'foreign-policy', chamber: 'house', congress: 118, introduced_date: '2023-10-26', vote_date: '2024-03-14', party_position_dem: 'yea', party_position_rep: 'split', is_bipartisan: true },
  { bill_id: 'S.4341', name: 'Foreign Aid Accountability and Transparency Act', description: 'Requires independent audits of foreign aid programs and outcomes reporting.', policy_category: 'foreign-policy', chamber: 'senate', congress: 118, introduced_date: '2024-05-16', vote_date: '2024-07-11', party_position_dem: 'yea', party_position_rep: 'yea', is_bipartisan: true },
  // education (4)
  { bill_id: 'H.R.4674', name: 'College Affordability Act', description: 'Increases Pell Grants, expands free community college, and caps student loan interest.', policy_category: 'education', chamber: 'house', congress: 116, introduced_date: '2019-10-15', vote_date: '2019-11-21', party_position_dem: 'yea', party_position_rep: 'nay', is_bipartisan: false },
  { bill_id: 'S.2954', name: 'Student Loan Forgiveness and Fairness Act', description: 'Cancels up to $50,000 in federal student loan debt per borrower.', policy_category: 'education', chamber: 'senate', congress: 118, introduced_date: '2023-09-28', vote_date: '2024-01-11', party_position_dem: 'yea', party_position_rep: 'nay', is_bipartisan: false },
  { bill_id: 'H.R.5228', name: 'Universal Pre-K and Child Care Act', description: 'Funds universal pre-kindergarten and subsidized childcare for working families.', policy_category: 'education', chamber: 'house', congress: 118, introduced_date: '2023-08-03', vote_date: '2023-11-09', party_position_dem: 'yea', party_position_rep: 'nay', is_bipartisan: false },
  { bill_id: 'S.1783', name: 'STEM Education and Workforce Act', description: 'Expands STEM education funding and establishes workforce training partnerships.', policy_category: 'education', chamber: 'senate', congress: 118, introduced_date: '2023-06-01', vote_date: '2023-09-20', party_position_dem: 'yea', party_position_rep: 'split', is_bipartisan: true },
];

async function phase2(): Promise<Record<string, { id: string; chamber: string; policy_category: string; party_position_dem: string | null; party_position_rep: string | null; is_bipartisan: boolean | null; bill_id: string; name: string; vote_date: string | null }>> {
  console.log('📜  Phase 2: Seeding bills...');
  await chunkInsert('bills', BILLS_DATA, 'bill_id');

  const { data: bills } = await supabase.from('bills').select('id, bill_id, chamber, policy_category, party_position_dem, party_position_rep, is_bipartisan, name, vote_date');
  const billMap: Record<string, any> = {};
  for (const b of bills ?? []) billMap[b.bill_id] = b;
  console.log(`  ✓ ${bills?.length} bills`);
  return billMap;
}

// ── Phase 3: Politicians ───────────────────────────────────────────────────────

interface PoliticianDef {
  name: string;
  party: string;
  title: string;
  stateAbbrev: string;
  stateSlug: string;
  officeHeld: string;
  geoLevel: string;
  chamber: string | null;
  yearsInOffice: number;
  endorsement: 'endorsed' | 'anti-endorsed' | 'watching';
  bio: string;
}

const ENDORSED_NAMES = new Set(['Elizabeth Warren','Bernie Sanders','Alexandria Ocasio-Cortez','Ilhan Omar','Rashida Tlaib','Ayanna Pressley','Pramila Jayapal','Cori Bush','Ed Markey','Cory Booker','Raphael Warnock','Jon Ossoff','Brian Schatz','Mazie Hirono','Tammy Duckworth','Jamie Raskin','Katie Porter','Ro Khanna']);
const ANTI_ENDORSED_NAMES = new Set(['Marjorie Taylor Greene','Lauren Boebert','Matt Gaetz','Ted Cruz','Josh Hawley','Tom Cotton','Rand Paul','Jim Jordan','Mike Lee','Mitch McConnell','Marsha Blackburn','Tommy Tuberville','Rick Scott']);

function getEndorsement(name: string, party: string): 'endorsed' | 'anti-endorsed' | 'watching' {
  if (ENDORSED_NAMES.has(name)) return 'endorsed';
  if (ANTI_ENDORSED_NAMES.has(name)) return 'anti-endorsed';
  return 'watching';
}

function getSentiment(endorsement: 'endorsed' | 'anti-endorsed' | 'watching', seed: number): number {
  const r = seededRandom(seed);
  if (endorsement === 'endorsed') return parseFloat((0.4 + r * 0.5).toFixed(2));
  if (endorsement === 'anti-endorsed') return parseFloat((-0.9 + r * 0.5).toFixed(2));
  return parseFloat((-0.3 + r * 0.6).toFixed(2));
}

const abbrevToSlug: Record<string, string> = {};
for (const s of STATE_DATA) abbrevToSlug[s.abbrev] = s.slug;

function makeBio(name: string, party: string, title: string, state: string): string {
  const p = party === 'Democrat' ? 'Democrat' : party === 'Republican' ? 'Republican' : 'Independent';
  return `${name} is a ${p} ${title} representing ${state}. They serve on key congressional committees and focus on legislative priorities for their constituents.`;
}

function buildSenators(): PoliticianDef[] {
  const raw: Array<{ name: string; party: string; abbrev: string }> = [
    { name: 'Tommy Tuberville', party: 'Republican', abbrev: 'AL' },
    { name: 'Katie Britt', party: 'Republican', abbrev: 'AL' },
    { name: 'Lisa Murkowski', party: 'Republican', abbrev: 'AK' },
    { name: 'Dan Sullivan', party: 'Republican', abbrev: 'AK' },
    { name: 'Mark Kelly', party: 'Democrat', abbrev: 'AZ' },
    { name: 'Kyrsten Sinema', party: 'Independent', abbrev: 'AZ' },
    { name: 'Tom Cotton', party: 'Republican', abbrev: 'AR' },
    { name: 'John Boozman', party: 'Republican', abbrev: 'AR' },
    { name: 'Alex Padilla', party: 'Democrat', abbrev: 'CA' },
    { name: 'Adam Schiff', party: 'Democrat', abbrev: 'CA' },
    { name: 'Michael Bennet', party: 'Democrat', abbrev: 'CO' },
    { name: 'John Hickenlooper', party: 'Democrat', abbrev: 'CO' },
    { name: 'Richard Blumenthal', party: 'Democrat', abbrev: 'CT' },
    { name: 'Chris Murphy', party: 'Democrat', abbrev: 'CT' },
    { name: 'Tom Carper', party: 'Democrat', abbrev: 'DE' },
    { name: 'Chris Coons', party: 'Democrat', abbrev: 'DE' },
    { name: 'Marco Rubio', party: 'Republican', abbrev: 'FL' },
    { name: 'Rick Scott', party: 'Republican', abbrev: 'FL' },
    { name: 'Jon Ossoff', party: 'Democrat', abbrev: 'GA' },
    { name: 'Raphael Warnock', party: 'Democrat', abbrev: 'GA' },
    { name: 'Brian Schatz', party: 'Democrat', abbrev: 'HI' },
    { name: 'Mazie Hirono', party: 'Democrat', abbrev: 'HI' },
    { name: 'Mike Crapo', party: 'Republican', abbrev: 'ID' },
    { name: 'Jim Risch', party: 'Republican', abbrev: 'ID' },
    { name: 'Dick Durbin', party: 'Democrat', abbrev: 'IL' },
    { name: 'Tammy Duckworth', party: 'Democrat', abbrev: 'IL' },
    { name: 'Todd Young', party: 'Republican', abbrev: 'IN' },
    { name: 'Mike Braun', party: 'Republican', abbrev: 'IN' },
    { name: 'Chuck Grassley', party: 'Republican', abbrev: 'IA' },
    { name: 'Joni Ernst', party: 'Republican', abbrev: 'IA' },
    { name: 'Jerry Moran', party: 'Republican', abbrev: 'KS' },
    { name: 'Roger Marshall', party: 'Republican', abbrev: 'KS' },
    { name: 'Mitch McConnell', party: 'Republican', abbrev: 'KY' },
    { name: 'Rand Paul', party: 'Republican', abbrev: 'KY' },
    { name: 'Bill Cassidy', party: 'Republican', abbrev: 'LA' },
    { name: 'John Kennedy', party: 'Republican', abbrev: 'LA' },
    { name: 'Susan Collins', party: 'Republican', abbrev: 'ME' },
    { name: 'Angus King', party: 'Independent', abbrev: 'ME' },
    { name: 'Ben Cardin', party: 'Democrat', abbrev: 'MD' },
    { name: 'Chris Van Hollen', party: 'Democrat', abbrev: 'MD' },
    { name: 'Elizabeth Warren', party: 'Democrat', abbrev: 'MA' },
    { name: 'Ed Markey', party: 'Democrat', abbrev: 'MA' },
    { name: 'Debbie Stabenow', party: 'Democrat', abbrev: 'MI' },
    { name: 'Gary Peters', party: 'Democrat', abbrev: 'MI' },
    { name: 'Amy Klobuchar', party: 'Democrat', abbrev: 'MN' },
    { name: 'Tina Smith', party: 'Democrat', abbrev: 'MN' },
    { name: 'Roger Wicker', party: 'Republican', abbrev: 'MS' },
    { name: 'Cindy Hyde-Smith', party: 'Republican', abbrev: 'MS' },
    { name: 'Roy Blunt', party: 'Republican', abbrev: 'MO' },
    { name: 'Josh Hawley', party: 'Republican', abbrev: 'MO' },
    { name: 'Jon Tester', party: 'Democrat', abbrev: 'MT' },
    { name: 'Steve Daines', party: 'Republican', abbrev: 'MT' },
    { name: 'Deb Fischer', party: 'Republican', abbrev: 'NE' },
    { name: 'Ben Sasse', party: 'Republican', abbrev: 'NE' },
    { name: 'Catherine Cortez Masto', party: 'Democrat', abbrev: 'NV' },
    { name: 'Jacky Rosen', party: 'Democrat', abbrev: 'NV' },
    { name: 'Jeanne Shaheen', party: 'Democrat', abbrev: 'NH' },
    { name: 'Maggie Hassan', party: 'Democrat', abbrev: 'NH' },
    { name: 'Bob Menendez', party: 'Democrat', abbrev: 'NJ' },
    { name: 'Cory Booker', party: 'Democrat', abbrev: 'NJ' },
    { name: 'Martin Heinrich', party: 'Democrat', abbrev: 'NM' },
    { name: 'Ben Ray Luján', party: 'Democrat', abbrev: 'NM' },
    { name: 'Chuck Schumer', party: 'Democrat', abbrev: 'NY' },
    { name: 'Kirsten Gillibrand', party: 'Democrat', abbrev: 'NY' },
    { name: 'Thom Tillis', party: 'Republican', abbrev: 'NC' },
    { name: 'Ted Budd', party: 'Republican', abbrev: 'NC' },
    { name: 'John Hoeven', party: 'Republican', abbrev: 'ND' },
    { name: 'Kevin Cramer', party: 'Republican', abbrev: 'ND' },
    { name: 'Sherrod Brown', party: 'Democrat', abbrev: 'OH' },
    { name: 'JD Vance', party: 'Republican', abbrev: 'OH' },
    { name: 'Jim Inhofe', party: 'Republican', abbrev: 'OK' },
    { name: 'James Lankford', party: 'Republican', abbrev: 'OK' },
    { name: 'Ron Wyden', party: 'Democrat', abbrev: 'OR' },
    { name: 'Jeff Merkley', party: 'Democrat', abbrev: 'OR' },
    { name: 'Bob Casey', party: 'Democrat', abbrev: 'PA' },
    { name: 'Pat Toomey', party: 'Republican', abbrev: 'PA' },
    { name: 'Jack Reed', party: 'Democrat', abbrev: 'RI' },
    { name: 'Sheldon Whitehouse', party: 'Democrat', abbrev: 'RI' },
    { name: 'Lindsey Graham', party: 'Republican', abbrev: 'SC' },
    { name: 'Tim Scott', party: 'Republican', abbrev: 'SC' },
    { name: 'John Thune', party: 'Republican', abbrev: 'SD' },
    { name: 'Mike Rounds', party: 'Republican', abbrev: 'SD' },
    { name: 'Marsha Blackburn', party: 'Republican', abbrev: 'TN' },
    { name: 'Bill Hagerty', party: 'Republican', abbrev: 'TN' },
    { name: 'John Cornyn', party: 'Republican', abbrev: 'TX' },
    { name: 'Ted Cruz', party: 'Republican', abbrev: 'TX' },
    { name: 'Mike Lee', party: 'Republican', abbrev: 'UT' },
    { name: 'Mitt Romney', party: 'Republican', abbrev: 'UT' },
    { name: 'Patrick Leahy', party: 'Democrat', abbrev: 'VT' },
    { name: 'Bernie Sanders', party: 'Independent', abbrev: 'VT' },
    { name: 'Mark Warner', party: 'Democrat', abbrev: 'VA' },
    { name: 'Tim Kaine', party: 'Democrat', abbrev: 'VA' },
    { name: 'Patty Murray', party: 'Democrat', abbrev: 'WA' },
    { name: 'Maria Cantwell', party: 'Democrat', abbrev: 'WA' },
    { name: 'Joe Manchin', party: 'Democrat', abbrev: 'WV' },
    { name: 'Shelley Moore Capito', party: 'Republican', abbrev: 'WV' },
    { name: 'Ron Johnson', party: 'Republican', abbrev: 'WI' },
    { name: 'Tammy Baldwin', party: 'Democrat', abbrev: 'WI' },
    { name: 'John Barrasso', party: 'Republican', abbrev: 'WY' },
    { name: 'Cynthia Lummis', party: 'Republican', abbrev: 'WY' },
  ];

  const yearsMap: Record<string, number> = {
    'Mitch McConnell': 38, 'Chuck Grassley': 24, 'Patrick Leahy': 28, 'Dick Durbin': 22,
    'Ron Wyden': 26, 'Jack Reed': 22, 'Patty Murray': 24, 'Maria Cantwell': 18,
    'Bernie Sanders': 14, 'Elizabeth Warren': 10, 'Ed Markey': 10, 'Amy Klobuchar': 14,
    'Bob Casey': 14, 'Sheldon Whitehouse': 14, 'Mark Warner': 16, 'Tim Kaine': 8,
    'Lindsey Graham': 20, 'Marco Rubio': 10, 'Ted Cruz': 10, 'Tom Cotton': 6,
    'Chuck Schumer': 22, 'Kirsten Gillibrand': 12, 'Richard Blumenthal': 10,
    'Debbie Stabenow': 18, 'Gary Peters': 8, 'Sherrod Brown': 14, 'Jon Tester': 14,
    'Chris Murphy': 8, 'Jeff Merkley': 12, 'Cory Booker': 8, 'Susan Collins': 22,
    'Lisa Murkowski': 20, 'John Cornyn': 18, 'John Thune': 16, 'Mike Crapo': 20,
  };

  return raw.map(r => ({
    name: r.name,
    party: r.party,
    title: 'U.S. Senator',
    stateAbbrev: r.abbrev,
    stateSlug: abbrevToSlug[r.abbrev],
    officeHeld: 'U.S. Senate',
    geoLevel: 'federal',
    chamber: 'senate',
    yearsInOffice: yearsMap[r.name] ?? Math.floor(2 + seededRandom(hashStr(r.name)) * 20),
    endorsement: getEndorsement(r.name, r.party),
    bio: makeBio(r.name, r.party, 'U.S. Senator', STATE_DATA.find(s => s.abbrev === r.abbrev)?.name ?? r.abbrev),
  }));
}

function buildHouseReps(): PoliticianDef[] {
  const raw = [
    { name: 'Kevin McCarthy', party: 'Republican', abbrev: 'CA' },
    { name: 'Hakeem Jeffries', party: 'Democrat', abbrev: 'NY' },
    { name: 'Alexandria Ocasio-Cortez', party: 'Democrat', abbrev: 'NY' },
    { name: 'Ilhan Omar', party: 'Democrat', abbrev: 'MN' },
    { name: 'Rashida Tlaib', party: 'Democrat', abbrev: 'MI' },
    { name: 'Ayanna Pressley', party: 'Democrat', abbrev: 'MA' },
    { name: 'Cori Bush', party: 'Democrat', abbrev: 'MO' },
    { name: 'Matt Gaetz', party: 'Republican', abbrev: 'FL' },
    { name: 'Marjorie Taylor Greene', party: 'Republican', abbrev: 'GA' },
    { name: 'Lauren Boebert', party: 'Republican', abbrev: 'CO' },
    { name: 'Jim Jordan', party: 'Republican', abbrev: 'OH' },
    { name: 'Nancy Pelosi', party: 'Democrat', abbrev: 'CA' },
    { name: 'Adam Kinzinger', party: 'Republican', abbrev: 'IL' },
    { name: 'Liz Cheney', party: 'Republican', abbrev: 'WY' },
    { name: 'Ro Khanna', party: 'Democrat', abbrev: 'CA' },
    { name: 'Katie Porter', party: 'Democrat', abbrev: 'CA' },
    { name: 'Jamie Raskin', party: 'Democrat', abbrev: 'MD' },
    { name: 'Eric Swalwell', party: 'Democrat', abbrev: 'CA' },
    { name: 'Pramila Jayapal', party: 'Democrat', abbrev: 'WA' },
    { name: 'Greg Steube', party: 'Republican', abbrev: 'FL' },
    { name: 'Byron Donalds', party: 'Republican', abbrev: 'FL' },
    { name: 'Mike Waltz', party: 'Republican', abbrev: 'FL' },
    { name: 'Brad Schneider', party: 'Democrat', abbrev: 'IL' },
    { name: 'Josh Gottheimer', party: 'Democrat', abbrev: 'NJ' },
    { name: 'Henry Cuellar', party: 'Democrat', abbrev: 'TX' },
  ];

  return raw.map(r => ({
    name: r.name,
    party: r.party,
    title: 'U.S. Representative',
    stateAbbrev: r.abbrev,
    stateSlug: abbrevToSlug[r.abbrev],
    officeHeld: 'U.S. House',
    geoLevel: 'federal',
    chamber: 'house',
    yearsInOffice: Math.floor(2 + seededRandom(hashStr(r.name + 'house')) * 20),
    endorsement: getEndorsement(r.name, r.party),
    bio: makeBio(r.name, r.party, 'U.S. Representative', STATE_DATA.find(s => s.abbrev === r.abbrev)?.name ?? r.abbrev),
  }));
}

function buildGovernors(): PoliticianDef[] {
  const raw = [
    { name: 'Gavin Newsom', party: 'Democrat', abbrev: 'CA' },
    { name: 'Greg Abbott', party: 'Republican', abbrev: 'TX' },
    { name: 'Ron DeSantis', party: 'Republican', abbrev: 'FL' },
    { name: 'Kathy Hochul', party: 'Democrat', abbrev: 'NY' },
    { name: 'Josh Shapiro', party: 'Democrat', abbrev: 'PA' },
    { name: 'Mike DeWine', party: 'Republican', abbrev: 'OH' },
    { name: 'Brian Kemp', party: 'Republican', abbrev: 'GA' },
    { name: 'Roy Cooper', party: 'Democrat', abbrev: 'NC' },
    { name: 'Gretchen Whitmer', party: 'Democrat', abbrev: 'MI' },
    { name: 'Katie Hobbs', party: 'Democrat', abbrev: 'AZ' },
    { name: 'Jay Inslee', party: 'Democrat', abbrev: 'WA' },
    { name: 'Jared Polis', party: 'Democrat', abbrev: 'CO' },
    { name: 'JB Pritzker', party: 'Democrat', abbrev: 'IL' },
  ];

  return raw.map(r => ({
    name: r.name,
    party: r.party,
    title: 'Governor',
    stateAbbrev: r.abbrev,
    stateSlug: abbrevToSlug[r.abbrev],
    officeHeld: 'Governor',
    geoLevel: 'state',
    chamber: null,
    yearsInOffice: Math.floor(1 + seededRandom(hashStr(r.name + 'gov')) * 8),
    endorsement: getEndorsement(r.name, r.party),
    bio: makeBio(r.name, r.party, 'Governor', STATE_DATA.find(s => s.abbrev === r.abbrev)?.name ?? r.abbrev),
  }));
}

async function phase3(geoMap: Record<string, string>): Promise<Record<string, { id: string; party: string; chamber: string | null; endorsement: string; name: string }>> {
  console.log('👤  Phase 3: Seeding politicians...');

  const allPols = [...buildSenators(), ...buildHouseReps(), ...buildGovernors()];

  const rows = allPols.map(p => {
    const slug = toSlug(p.name);
    const endorsement = p.endorsement;
    const sentiment = getSentiment(endorsement, hashStr(p.name + 'sentiment'));
    return {
      slug,
      name: p.name,
      title: p.title,
      party: p.party,
      bio: p.bio,
      endorsement_status: endorsement,
      geography_id: geoMap[p.stateSlug] ?? null,
      years_in_office: p.yearsInOffice,
      geography_level: p.geoLevel,
      office_held: p.officeHeld,
      aggregate_sentiment: sentiment,
      state_abbrev: p.stateAbbrev,
      chamber: p.chamber,
    };
  });

  await chunkInsert('politicians', rows, 'slug');

  const { data: politicians } = await supabase.from('politicians').select('id, slug, name, party, chamber, endorsement_status');
  const polMap: Record<string, any> = {};
  for (const pol of politicians ?? []) {
    polMap[pol.slug] = pol;
  }
  console.log(`  ✓ ${politicians?.length} politicians`);
  return polMap;
}

// ── Phase 4: Votes ─────────────────────────────────────────────────────────────

async function phase4(polMap: Record<string, any>, billMap: Record<string, any>): Promise<void> {
  console.log('🗳️  Phase 4: Seeding voting records...');

  const senateBills = Object.values(billMap).filter((b: any) => b.chamber === 'senate' || b.chamber === 'joint');
  const houseBills = Object.values(billMap).filter((b: any) => b.chamber === 'house' || b.chamber === 'joint');

  const voteRows: any[] = [];

  for (const pol of Object.values(polMap) as any[]) {
    if (!pol.chamber) continue; // governors skip

    const eligibleBills = pol.chamber === 'senate' ? senateBills : houseBills;
    if (eligibleBills.length === 0) continue;

    // Pick 15-25 bills deterministically
    const numVotes = 15 + Math.floor(seededRandom(hashStr(pol.id)) * 11);
    const shuffled = [...eligibleBills].sort((a: any, b: any) => {
      return seededRandom(hashStr(pol.id + a.bill_id)) - seededRandom(hashStr(pol.id + b.bill_id));
    });
    const pickedBills = shuffled.slice(0, Math.min(numVotes, shuffled.length));

    const conformity = pol.party === 'Democrat' ? 0.80 : pol.party === 'Republican' ? 0.82 : 0.50;

    for (const bill of pickedBills as any[]) {
      const r = seededRandom(hashStr(pol.id + bill.id));
      const partyPos = pol.party === 'Democrat' ? bill.party_position_dem : pol.party === 'Republican' ? bill.party_position_rep : (seededRandom(hashStr(pol.id)) > 0.5 ? bill.party_position_dem : bill.party_position_rep);

      // Normalize party position: if 'split', treat as 'yea' for simplicity
      const normalizedPos = partyPos === 'split' ? 'yea' : partyPos === 'none' ? 'nay' : partyPos ?? 'yea';
      const opposite = normalizedPos === 'yea' ? 'nay' : 'yea';

      let voteResult: string;
      let partyVote: string;

      if (r < conformity) {
        voteResult = normalizedPos;
        partyVote = 'with_party';
      } else if (r < conformity + 0.04) {
        voteResult = 'abstain';
        partyVote = 'abstain';
      } else {
        voteResult = opposite;
        partyVote = 'against_party';
      }

      voteRows.push({
        politician_id: pol.id,
        bill_name: bill.name,
        bill_id: bill.bill_id,
        vote_date: bill.vote_date,
        vote_result: voteResult,
        policy_category: bill.policy_category,
        bill_uuid: bill.id,
        party_vote: partyVote,
      });
    }
  }

  await chunkInsert('votes', voteRows);
  console.log(`  ✓ ${voteRows.length} votes`);
}

// ── Phase 5: Issues + Positions ───────────────────────────────────────────────

const ISSUES_DATA = [
  { slug: 'gun-rights', title: 'Gun Rights', description: 'Second Amendment rights and firearms regulation', category: 'rights' },
  { slug: 'immigration', title: 'Immigration', description: 'Border security and immigration policy', category: 'rights' },
  { slug: 'healthcare', title: 'Healthcare Access', description: 'Universal healthcare and insurance access', category: 'healthcare' },
  { slug: 'climate', title: 'Climate Action', description: 'Environmental regulation and clean energy', category: 'environment' },
  { slug: 'corruption', title: 'Anti-Corruption', description: 'Campaign finance and government ethics', category: 'governance' },
  { slug: 'taxes', title: 'Tax Policy', description: 'Federal taxation and wealth distribution', category: 'economy' },
  { slug: 'abortion', title: 'Reproductive Rights', description: 'Abortion access and reproductive healthcare', category: 'rights' },
  { slug: 'trade', title: 'Trade Policy', description: 'International trade agreements and tariffs', category: 'economy' },
  { slug: 'housing', title: 'Housing Affordability', description: 'Affordable housing and rent control', category: 'economy' },
  { slug: 'student-debt', title: 'Student Debt Relief', description: 'Student loan forgiveness and higher education costs', category: 'education' },
  { slug: 'police-reform', title: 'Police Reform', description: 'Law enforcement accountability and criminal justice', category: 'rights' },
  { slug: 'drug-policy', title: 'Drug Policy', description: 'Drug legalization and addiction treatment', category: 'healthcare' },
  { slug: 'social-security', title: 'Social Security', description: 'Social Security and Medicare funding', category: 'economy' },
  { slug: 'childcare', title: 'Childcare', description: 'Universal childcare and early education', category: 'education' },
  { slug: 'ai-regulation', title: 'AI Regulation', description: 'Artificial intelligence governance and safety', category: 'technology' },
  { slug: 'tariffs', title: 'Tariffs & Trade Wars', description: 'Import tariffs and trade protectionism', category: 'economy' },
];

const DEM_DEFAULTS: Record<string, string> = {
  'gun-rights': 'oppose', 'immigration': 'support', 'healthcare': 'support', 'climate': 'support',
  'corruption': 'support', 'taxes': 'support', 'abortion': 'support', 'trade': 'neutral',
  'housing': 'support', 'student-debt': 'support', 'police-reform': 'support', 'drug-policy': 'neutral',
  'social-security': 'support', 'childcare': 'support', 'ai-regulation': 'support', 'tariffs': 'oppose',
};

const REP_DEFAULTS: Record<string, string> = {
  'gun-rights': 'support', 'immigration': 'oppose', 'healthcare': 'oppose', 'climate': 'oppose',
  'corruption': 'neutral', 'taxes': 'oppose', 'abortion': 'oppose', 'trade': 'neutral',
  'housing': 'neutral', 'student-debt': 'oppose', 'police-reform': 'oppose', 'drug-policy': 'oppose',
  'social-security': 'neutral', 'childcare': 'neutral', 'ai-regulation': 'neutral', 'tariffs': 'support',
};

const IND_DEFAULTS: Record<string, string> = {
  'gun-rights': 'neutral', 'immigration': 'neutral', 'healthcare': 'support', 'climate': 'support',
  'corruption': 'support', 'taxes': 'neutral', 'abortion': 'support', 'trade': 'neutral',
  'housing': 'support', 'student-debt': 'neutral', 'police-reform': 'neutral', 'drug-policy': 'neutral',
  'social-security': 'support', 'childcare': 'support', 'ai-regulation': 'neutral', 'tariffs': 'neutral',
};

async function phase5(polMap: Record<string, any>): Promise<void> {
  console.log('💡  Phase 5: Seeding issues & positions...');

  await chunkInsert('issues', ISSUES_DATA, 'slug');

  const { data: issues } = await supabase.from('issues').select('id, slug');
  const issueMap: Record<string, string> = {};
  for (const i of issues ?? []) issueMap[i.slug] = i.id;

  const positionRows: any[] = [];

  for (const pol of Object.values(polMap) as any[]) {
    const defaults = pol.party === 'Democrat' ? DEM_DEFAULTS : pol.party === 'Republican' ? REP_DEFAULTS : IND_DEFAULTS;
    for (const issue of ISSUES_DATA) {
      const issueId = issueMap[issue.slug];
      if (!issueId) continue;
      const r = seededRandom(hashStr(pol.id + issue.slug));
      const position = r < 0.15 ? 'neutral' : (defaults[issue.slug] ?? 'neutral');
      positionRows.push({
        politician_id: pol.id,
        issue_id: issueId,
        position,
      });
    }
  }

  await chunkInsert('politician_issue_positions', positionRows, 'politician_id,issue_id');
  console.log(`  ✓ ${ISSUES_DATA.length} issues, ${positionRows.length} positions`);
}

// ── Phase 6: Entities + Relationships ─────────────────────────────────────────

const ENTITIES_DATA = [
  { name: "NRA Political Victory Fund", type: "pac" },
  { name: "EMILY's List", type: "pac" },
  { name: "ActBlue", type: "pac" },
  { name: "WinRed", type: "pac" },
  { name: "Koch Industries PAC", type: "pac" },
  { name: "Planned Parenthood Action Fund", type: "pac" },
  { name: "Club for Growth", type: "pac" },
  { name: "SEIU Political Action", type: "pac" },
  { name: "AFL-CIO COPE", type: "ngo" },
  { name: "Chamber of Commerce PAC", type: "pac" },
  { name: "Pharmaceutical Research PAC", type: "pac" },
  { name: "Big Oil & Gas Industry Fund", type: "pac" },
  { name: "Silicon Valley Leadership PAC", type: "pac" },
  { name: "Wall Street Coalition Fund", type: "pac" },
  { name: "Defense Industry Alliance", type: "industry" },
  { name: "American Israel PAC (AIPAC)", type: "pac" },
  { name: "Teachers Unions PAC", type: "ngo" },
  { name: "Healthcare Industry Fund", type: "industry" },
  { name: "Real Estate Roundtable PAC", type: "pac" },
  { name: "National Rifle Association", type: "ngo" },
  { name: "Sierra Club Action", type: "ngo" },
  { name: "Wall Street Bankers PAC", type: "pac" },
  { name: "Fossil Fuels Action Fund", type: "pac" },
  { name: "Progressive Change PAC", type: "pac" },
  { name: "Senate Leadership Fund", type: "pac" },
  { name: "Majority Forward", type: "pac" },
  { name: "American Crossroads", type: "pac" },
  { name: "NextGen Climate PAC", type: "pac" },
  { name: "Democracy Alliance", type: "ngo" },
  { name: "FreedomWorks PAC", type: "pac" },
  { name: "John Bolton Super PAC", type: "pac" },
  { name: "Move On Political Action", type: "pac" },
  { name: "Citizens United PAC", type: "pac" },
  { name: "Amazon Political Action", type: "pac" },
  { name: "Google Government Affairs", type: "corporation" },
  { name: "Alphabet Inc. Political Fund", type: "corporation" },
  { name: "ExxonMobil PAC", type: "corporation" },
  { name: "Goldman Sachs Employees PAC", type: "corporation" },
  { name: "JPMorgan Chase PAC", type: "corporation" },
  { name: "Teamsters United PAC", type: "ngo" },
];

const GOP_ALIGNED = new Set(["NRA Political Victory Fund","WinRed","Koch Industries PAC","Club for Growth","Senate Leadership Fund","American Crossroads","FreedomWorks PAC","John Bolton Super PAC","Citizens United PAC","Fossil Fuels Action Fund","National Rifle Association","ExxonMobil PAC"]);
const DEM_ALIGNED = new Set(["EMILY's List","ActBlue","Planned Parenthood Action Fund","SEIU Political Action","AFL-CIO COPE","Teachers Unions PAC","Sierra Club Action","Progressive Change PAC","Majority Forward","NextGen Climate PAC","Democracy Alliance","Move On Political Action","Teamsters United PAC"]);
const BIPARTISAN_ALIGNED = new Set(["Chamber of Commerce PAC","Pharmaceutical Research PAC","Big Oil & Gas Industry Fund","Silicon Valley Leadership PAC","Wall Street Coalition Fund","Defense Industry Alliance","American Israel PAC (AIPAC)","Healthcare Industry Fund","Real Estate Roundtable PAC","Wall Street Bankers PAC","Amazon Political Action","Google Government Affairs","Alphabet Inc. Political Fund","Goldman Sachs Employees PAC","JPMorgan Chase PAC"]);

async function phase6(polMap: Record<string, any>): Promise<void> {
  console.log('🏦  Phase 6: Seeding entities & relationships...');

  await chunkInsert('entities', ENTITIES_DATA);

  const { data: entities } = await supabase.from('entities').select('id, name');
  const entityMap: Record<string, string> = {};
  for (const e of entities ?? []) entityMap[e.name] = e.id;

  const repPols = Object.values(polMap).filter((p: any) => p.party === 'Republican');
  const demPols = Object.values(polMap).filter((p: any) => p.party === 'Democrat' || p.party === 'Independent');
  const allPols = Object.values(polMap);

  const relRows: any[] = [];
  let relIdx = 0;

  for (const entity of ENTITIES_DATA) {
    const entityId = entityMap[entity.name];
    if (!entityId) continue;

    let pool: any[];
    if (GOP_ALIGNED.has(entity.name)) pool = repPols;
    else if (DEM_ALIGNED.has(entity.name)) pool = demPols;
    else pool = allPols;

    const numRels = 5 + Math.floor(seededRandom(hashStr(entity.name)) * 6); // 5-10
    const shuffled = [...pool].sort((a: any, b: any) => seededRandom(hashStr(entity.name + a.id)) - seededRandom(hashStr(entity.name + b.id)));
    const picked = shuffled.slice(0, Math.min(numRels, shuffled.length));

    for (const pol of picked as any[]) {
      const weight = parseFloat((0.1 + seededRandom(hashStr(entity.name + pol.id + 'weight')) * 8.4).toFixed(2));
      relRows.push({
        entity_a_id: entityId,
        entity_a_type: 'entity',
        entity_b_id: pol.id,
        entity_b_type: 'politician',
        relationship_type: 'donated_to',
        weight,
      });
      relIdx++;
    }
  }

  await chunkInsert('relationships', relRows);
  console.log(`  ✓ ${entities?.length} entities, ${relRows.length} relationships`);
}

// ── Phase 7: Score Computation ────────────────────────────────────────────────

async function phase7(polMap: Record<string, any>): Promise<void> {
  console.log('📊  Phase 7: Computing scores...');

  // Load all votes
  const { data: allVotes } = await supabase.from('votes').select('politician_id, party_vote, bill_uuid, policy_category');
  // Load all bills for bipartisan check
  const { data: allBills } = await supabase.from('bills').select('id, is_bipartisan');
  const billBipartisan: Record<string, boolean> = {};
  for (const b of allBills ?? []) billBipartisan[b.id] = b.is_bipartisan ?? false;

  // Load all relationships for donor influence
  const { data: allRels } = await supabase.from('relationships').select('entity_b_id, weight').eq('entity_b_type', 'politician');
  const donorTotals: Record<string, number> = {};
  for (const r of allRels ?? []) {
    donorTotals[r.entity_b_id] = (donorTotals[r.entity_b_id] ?? 0) + (r.weight ?? 0);
  }

  // Min-max for donor influence
  const donorValues = Object.values(donorTotals);
  const minDonor = Math.min(...donorValues, 0);
  const maxDonor = Math.max(...donorValues, 1);

  const updates: any[] = [];

  for (const pol of Object.values(polMap) as any[]) {
    const votes = (allVotes ?? []).filter(v => v.politician_id === pol.id);
    if (votes.length === 0) {
      // Governors — compute simpler scores
      const controversyScore = Math.min(100, Math.abs(pol.aggregate_sentiment ?? 0) * 60 + seededRandom(hashStr(pol.id)) * 40);
      updates.push({
        id: pol.id,
        party_line_score: null,
        bipartisan_score: null,
        independence_score: null,
        district_alignment_score: 50,
        controversy_score: parseFloat(controversyScore.toFixed(1)),
        consistency_score: null,
        donor_influence_score: parseFloat((((donorTotals[pol.id] ?? 0) - minDonor) / (maxDonor - minDonor) * 100).toFixed(1)),
      });
      continue;
    }

    const withParty = votes.filter(v => v.party_vote === 'with_party').length;
    const againstParty = votes.filter(v => v.party_vote === 'against_party').length;
    const totalDecisive = withParty + againstParty;
    const partyLineScore = totalDecisive > 0 ? (withParty / totalDecisive) * 100 : 50;

    // bipartisan score: against_party on non-bipartisan bills / total
    const againstOnPartisan = votes.filter(v => v.party_vote === 'against_party' && v.bill_uuid && !billBipartisan[v.bill_uuid]).length;
    const bipartisanScore = votes.length > 0 ? (againstOnPartisan / votes.length) * 100 : 0;

    // independence score
    const base = 100 - partyLineScore;
    const categories = [...new Set(votes.map(v => v.policy_category))];
    let varianceBonus = 0;
    for (const cat of categories) {
      const catVotes = votes.filter(v => v.policy_category === cat);
      const catAgainst = catVotes.filter(v => v.party_vote === 'against_party').length;
      if (catAgainst >= 2) varianceBonus += 4;
    }
    const independenceScore = Math.min(100, base + Math.min(20, varianceBonus));

    // district alignment (simplified: 50 base + noise)
    const districtAlignmentScore = 40 + seededRandom(hashStr(pol.id + 'district')) * 40;

    // controversy
    const controversyScore = Math.min(100, Math.abs(pol.aggregate_sentiment ?? 0) * 60 + seededRandom(hashStr(pol.id)) * 40);

    // consistency
    const consistencyScore = Math.min(100, partyLineScore * 0.8 + seededRandom(hashStr(pol.id + 'consistency')) * 20);

    // donor influence
    const rawDonor = donorTotals[pol.id] ?? 0;
    const donorInfluenceScore = maxDonor > minDonor ? ((rawDonor - minDonor) / (maxDonor - minDonor)) * 100 : 0;

    updates.push({
      id: pol.id,
      party_line_score: parseFloat(partyLineScore.toFixed(1)),
      bipartisan_score: parseFloat(bipartisanScore.toFixed(1)),
      independence_score: parseFloat(independenceScore.toFixed(1)),
      district_alignment_score: parseFloat(districtAlignmentScore.toFixed(1)),
      controversy_score: parseFloat(controversyScore.toFixed(1)),
      consistency_score: parseFloat(consistencyScore.toFixed(1)),
      donor_influence_score: parseFloat(donorInfluenceScore.toFixed(1)),
    });
  }

  // Batch update
  for (let i = 0; i < updates.length; i += 50) {
    const chunk = updates.slice(i, i + 50);
    for (const u of chunk) {
      const { id, ...rest } = u;
      const { error } = await supabase.from('politicians').update(rest).eq('id', id);
      if (error) console.error(`  ✗ score update ${id}:`, error.message);
    }
  }
  console.log(`  ✓ Scores computed for ${updates.length} politicians`);
}

// ── Phase 8: Similarity Matrix ────────────────────────────────────────────────

async function phase8(polMap: Record<string, any>): Promise<void> {
  console.log('🔗  Phase 8: Computing similarity matrix...');

  const { data: allVotes } = await supabase.from('votes').select('politician_id, bill_uuid, vote_result');

  // Group by politician
  const votesByPol: Record<string, Record<string, string>> = {};
  for (const v of allVotes ?? []) {
    if (!v.bill_uuid) continue;
    if (!votesByPol[v.politician_id]) votesByPol[v.politician_id] = {};
    votesByPol[v.politician_id][v.bill_uuid] = v.vote_result;
  }

  const senators = Object.values(polMap).filter((p: any) => p.chamber === 'senate');
  const houseReps = Object.values(polMap).filter((p: any) => p.chamber === 'house');

  const simRows: any[] = [];

  function processChamber(group: any[]) {
    for (let i = 0; i < group.length; i++) {
      for (let j = i + 1; j < group.length; j++) {
        const a = group[i];
        const b = group[j];
        const aVotes = votesByPol[a.id] ?? {};
        const bVotes = votesByPol[b.id] ?? {};

        const sharedBillIds = Object.keys(aVotes).filter(bId => bId in bVotes);
        if (sharedBillIds.length < 5) continue;

        const agreements = sharedBillIds.filter(bId => aVotes[bId] === bVotes[bId]).length;
        const similarity = agreements / sharedBillIds.length;
        if (similarity < 0.30) continue;

        // Canonical order: string comparison
        const [pA, pB] = a.id < b.id ? [a, b] : [b, a];
        simRows.push({
          politician_a_id: pA.id,
          politician_b_id: pB.id,
          similarity: parseFloat(similarity.toFixed(3)),
          shared_votes: sharedBillIds.length,
        });
      }
    }
  }

  processChamber(senators);
  processChamber(houseReps);

  await chunkInsert('politician_similarities', simRows, 'politician_a_id,politician_b_id');
  console.log(`  ✓ ${simRows.length} similarity pairs`);
}

// ── Phase 9: Community Issue Votes ────────────────────────────────────────────

const ISSUE_DISTRIBUTIONS: Record<string, { support: number; oppose: number; neutral: number }> = {
  'gun-rights':     { support: 35, oppose: 50, neutral: 15 },
  'immigration':    { support: 40, oppose: 40, neutral: 20 },
  'healthcare':     { support: 65, oppose: 25, neutral: 10 },
  'climate':        { support: 60, oppose: 25, neutral: 15 },
  'corruption':     { support: 70, oppose: 15, neutral: 15 },
  'taxes':          { support: 50, oppose: 35, neutral: 15 },
  'abortion':       { support: 55, oppose: 35, neutral: 10 },
  'trade':          { support: 35, oppose: 30, neutral: 35 },
  'housing':        { support: 62, oppose: 18, neutral: 20 },
  'student-debt':   { support: 55, oppose: 35, neutral: 10 },
  'police-reform':  { support: 58, oppose: 28, neutral: 14 },
  'drug-policy':    { support: 48, oppose: 35, neutral: 17 },
  'social-security':{ support: 72, oppose: 15, neutral: 13 },
  'childcare':      { support: 68, oppose: 18, neutral: 14 },
  'ai-regulation':  { support: 55, oppose: 20, neutral: 25 },
  'tariffs':        { support: 38, oppose: 42, neutral: 20 },
};

async function phase9(): Promise<void> {
  console.log('📣  Phase 9: Seeding community issue votes...');

  const { data: issues } = await supabase.from('issues').select('id, slug');
  const issueVoteRows: any[] = [];
  let idx = 0;

  for (const issue of issues ?? []) {
    const dist = ISSUE_DISTRIBUTIONS[issue.slug] ?? { support: 33, oppose: 33, neutral: 34 };
    for (let v = 0; v < 50; v++) {
      const r = seededRandom(hashStr(issue.slug + String(v) + 'issuevote')) * 100;
      let vote: string;
      if (r < dist.support) vote = 'support';
      else if (r < dist.support + dist.oppose) vote = 'oppose';
      else vote = 'neutral';
      issueVoteRows.push({ issue_id: issue.id, user_id: null, vote });
      idx++;
    }
  }

  await chunkInsert('issue_votes', issueVoteRows);
  console.log(`  ✓ ${issueVoteRows.length} issue votes`);
}

// ── Phase 10: Posts ───────────────────────────────────────────────────────────

const POST_TEMPLATES: Record<string, string[]> = {
  endorsed: [
    "Fighting for universal healthcare because every American deserves coverage regardless of income. This is a moral imperative.",
    "Proud to stand with workers and push for stronger labor protections. The PRO Act is essential for American families.",
    "Climate change is the defining challenge of our generation. We must act boldly with a Green New Deal now.",
    "Our democracy is under attack from dark money and voter suppression. The For the People Act must pass.",
  ],
  'anti-endorsed': [
    "The radical left's assault on the Second Amendment will not stand. I'll always defend your right to bear arms.",
    "Open borders destroy communities and undermine national security. We need a wall and strict enforcement.",
    "Woke ideology has no place in our schools or military. Parents have the right to protect their children.",
    "Biden's inflation is crushing working families. Stop the reckless spending and get government out of the way.",
  ],
  watching: [
    "Proud to work across the aisle to deliver results for my constituents. Washington needs more common sense.",
    "Held a town hall today to hear directly from voters about the issues that matter most to them.",
    "Visited local businesses and heard about the challenges they face. Washington needs to listen more.",
    "Committed to fiscal responsibility and protecting the programs our seniors depend on.",
  ],
};

const PLATFORMS = ['twitter', 'instagram', 'tiktok'];

async function phase10(polMap: Record<string, any>, geoMap: Record<string, string>): Promise<void> {
  console.log('📱  Phase 10: Seeding posts...');

  const postRows: any[] = [];
  let postIdx = 0;

  for (const pol of Object.values(polMap) as any[]) {
    const numPosts = pol.chamber === 'senate' ? (2 + Math.floor(seededRandom(hashStr(pol.id + 'posts')) * 3)) : (1 + Math.floor(seededRandom(hashStr(pol.id + 'posts')) * 2));
    const templates = POST_TEMPLATES[pol.endorsement_status] ?? POST_TEMPLATES['watching'];
    const sentiment = pol.endorsement_status === 'endorsed' ? 0.4 + seededRandom(hashStr(pol.id + 'sent')) * 0.4
      : pol.endorsement_status === 'anti-endorsed' ? -0.8 + seededRandom(hashStr(pol.id + 'sent')) * 0.3
      : -0.2 + seededRandom(hashStr(pol.id + 'sent')) * 0.4;

    for (let p = 0; p < numPosts; p++) {
      const templateIdx = Math.floor(seededRandom(hashStr(pol.id + String(p))) * templates.length);
      const platformIdx = Math.floor(seededRandom(hashStr(pol.id + String(p) + 'platform')) * PLATFORMS.length);
      postRows.push({
        source_platform: PLATFORMS[platformIdx],
        source_url: null,
        content_text: templates[templateIdx],
        sentiment_score: parseFloat(sentiment.toFixed(2)),
        politician_ids: [pol.id],
        geography_id: null,
        approved: true,
      });
    }
    postIdx++;
  }

  await chunkInsert('posts', postRows);
  console.log(`  ✓ ${postRows.length} posts`);
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log('🌱 Starting getright.church seed-v2...\n');

  try { await phase0(); } catch (e) { console.error('Phase 0 failed:', e); }

  let geoMap: Record<string, string> = {};
  try { geoMap = await phase1(); } catch (e) { console.error('Phase 1 failed:', e); }

  let billMap: Record<string, any> = {};
  try { billMap = await phase2(); } catch (e) { console.error('Phase 2 failed:', e); }

  let polMap: Record<string, any> = {};
  try { polMap = await phase3(geoMap); } catch (e) { console.error('Phase 3 failed:', e); }

  try { await phase4(polMap, billMap); } catch (e) { console.error('Phase 4 failed:', e); }
  try { await phase5(polMap); } catch (e) { console.error('Phase 5 failed:', e); }
  try { await phase6(polMap); } catch (e) { console.error('Phase 6 failed:', e); }
  try { await phase7(polMap); } catch (e) { console.error('Phase 7 failed:', e); }
  try { await phase8(polMap); } catch (e) { console.error('Phase 8 failed:', e); }
  try { await phase9(); } catch (e) { console.error('Phase 9 failed:', e); }
  try { await phase10(polMap, geoMap); } catch (e) { console.error('Phase 10 failed:', e); }

  console.log('\n✅ Seed complete!');
}

main().catch(console.error);
