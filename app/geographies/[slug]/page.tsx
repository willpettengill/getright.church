import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { ScoreRow } from '@/components/score-row'
import { GeographyDetail } from '@/components/geography-detail'
import { getGeography, getPoliticians, getPosts, getGeographyBills, getSimilarGeographies } from '@/lib/api'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Geography } from '@/lib/types'

export const revalidate = 3600

export async function generateMetadata(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params
  try {
    const geography = await getGeography(params.slug)
    return {
      title: `${geography.name} | get-right.church`,
      description: `Politicians and engagement metrics for ${geography.name}`,
    }
  } catch {
    return { title: 'Not Found' }
  }
}

export default async function GeographyPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params
  let geography: Geography
  try {
    geography = await getGeography(params.slug)
  } catch {
    notFound()
  }

  const [politicians, posts, geographyBills, similarGeos] = await Promise.all([
    getPoliticians(geography.id, 50),
    getPosts(geography.id, undefined, 20),
    getGeographyBills(geography.id, 20),
    getSimilarGeographies(geography.political_lean ?? 'swing', geography.id, 6),
  ])

  const LEVEL_COLORS: Record<string, string> = {
    federal: 'var(--accent-primary)',
    state: 'var(--status-warning)',
    local: 'var(--accent-light)',
  }
  const levelColor = LEVEL_COLORS[geography.type] ?? 'var(--text-tertiary)'

  const LEAN_COLORS: Record<string, string> = {
    'blue': '#60a5fa',
    'deep blue': '#3b82f6',
    'red': '#f87171',
    'deep red': '#ef4444',
    'swing': '#f59e0b',
    'purple': '#a78bfa',
  }

  function formatPopulation(pop: number): string {
    if (pop >= 1_000_000_000) return (pop / 1_000_000_000).toFixed(1).replace(/\.0$/, '') + 'B'
    if (pop >= 1_000_000) return (pop / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M'
    if (pop >= 1_000) return (pop / 1_000).toFixed(1).replace(/\.0$/, '') + 'K'
    return pop.toLocaleString()
  }

  const leanColor = geography.political_lean
    ? (LEAN_COLORS[geography.political_lean.toLowerCase()] ?? null)
    : null

  const dem = geography.last_result_dem_pct
  const rep = geography.last_result_rep_pct
  const margin = dem != null && rep != null ? Math.abs(dem - rep) : null

  return (
    <>
      <Header />
      <main style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
        <style>{`
          .detail-layout { display: grid; grid-template-columns: 220px 1fr; gap: 1px; background: var(--border); max-width: 1280px; margin: 0 auto; min-height: calc(100vh - 56px); }
          @media (max-width: 768px) { .detail-layout { grid-template-columns: 1fr; } }
          .detail-sidebar { background: var(--bg-secondary); position: sticky; top: 56px; height: fit-content; }
          @media (max-width: 768px) { .detail-sidebar { position: static; } }
          .detail-main { background: var(--bg-primary); }
        `}</style>

        {/* Breadcrumb bar */}
        <div style={{ borderBottom: '1px solid var(--border)', padding: '0.625rem 1.25rem' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
            <Link
              href="/geographies"
              style={{
                fontFamily: 'var(--font-mono), monospace',
                fontSize: '10px',
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'var(--text-tertiary)',
                textDecoration: 'none',
              }}
            >
              ← Geographies
            </Link>
          </div>
        </div>

        <div className="detail-layout">
          {/* SIDEBAR */}
          <aside className="detail-sidebar" style={{ padding: '1.25rem' }}>
            {/* Visual anchor — state abbreviation / name */}
            <div style={{
              position: 'relative',
              padding: '1.5rem',
              textAlign: 'center',
              marginBottom: '1rem',
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border)',
              borderRadius: '2px',
              overflow: 'hidden',
            }}>
              {/* Tinted background */}
              <div style={{
                position: 'absolute', inset: 0,
                background: leanColor ? `${leanColor}22` : 'transparent',
                pointerEvents: 'none',
              }} />
              <span style={{
                position: 'relative',
                fontFamily: 'var(--font-display), "Bebas Neue", sans-serif',
                fontSize: '3.5rem',
                letterSpacing: '0.04em',
                color: leanColor ?? 'var(--text-primary)',
                lineHeight: 1,
              }}>
                {geography.name.slice(0, 2).toUpperCase()}
              </span>
            </div>

            {/* Name */}
            <h1 style={{
              fontFamily: 'var(--font-display), "Bebas Neue", sans-serif',
              fontSize: 'clamp(1.5rem, 2.5vw, 2rem)', letterSpacing: '0.04em', lineHeight: 1.05,
              color: 'var(--text-primary)', marginBottom: '0.5rem',
            }}>
              {geography.name}
            </h1>

            {/* Type badge */}
            {geography.type && (
              <span style={{
                fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
                color: levelColor, background: 'var(--bg-tertiary)', border: '1px solid var(--border)',
                padding: '0.2rem 0.5rem', borderRadius: '2px', display: 'inline-block', marginBottom: '0.5rem',
              }}>
                {geography.type}
              </span>
            )}

            {/* Political lean label */}
            {geography.political_lean && (
              <p style={{
                fontSize: '11px', color: leanColor ?? 'var(--text-tertiary)', fontWeight: 700,
                letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '0.75rem',
              }}>
                {geography.political_lean}
              </p>
            )}

            {/* Score / stat rows */}
            <div style={{ borderTop: '1px solid var(--border)', margin: '1rem 0', paddingTop: '1rem' }}>
              <p style={{
                fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em',
                textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: '0.75rem',
              }}>
                Signals
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>

                {/* Political Lean - badge row */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--border)' }}>
                  <span style={{ fontSize: '10px', color: 'var(--text-secondary)', letterSpacing: '0.04em', textTransform: 'uppercase', fontWeight: 700 }}>Political Lean</span>
                  <span style={{ fontSize: '11px', color: leanColor ?? 'var(--text-tertiary)', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                    {geography.political_lean ?? '—'}
                  </span>
                </div>

                {/* Population */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--border)' }}>
                  <span style={{ fontSize: '10px', color: 'var(--text-secondary)', letterSpacing: '0.04em', textTransform: 'uppercase', fontWeight: 700 }}>Population</span>
                  <span style={{ fontFamily: 'var(--font-display), "Bebas Neue", sans-serif', fontSize: '1.25rem', color: 'var(--text-primary)', letterSpacing: '0.03em' }}>
                    {geography.population != null ? formatPopulation(geography.population) : '—'}
                  </span>
                </div>

                {/* Last Election Year */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--border)' }}>
                  <span style={{ fontSize: '10px', color: 'var(--text-secondary)', letterSpacing: '0.04em', textTransform: 'uppercase', fontWeight: 700 }}>Last Election</span>
                  <span style={{ fontFamily: 'var(--font-display), "Bebas Neue", sans-serif', fontSize: '1.25rem', color: 'var(--text-primary)', letterSpacing: '0.03em' }}>
                    {geography.last_election_year ?? '—'}
                  </span>
                </div>

                {/* Dem % */}
                <ScoreRow
                  label="Dem %"
                  value={geography.last_result_dem_pct ?? null}
                  colorFn={(_v) => '#3b82f6'}
                  format={(v) => `${v.toFixed(1)}%`}
                />

                {/* Rep % */}
                <ScoreRow
                  label="Rep %"
                  value={geography.last_result_rep_pct ?? null}
                  colorFn={(_v) => '#ef4444'}
                  format={(v) => `${v.toFixed(1)}%`}
                />

                {/* Electoral Margin */}
                <ScoreRow
                  label="Electoral Margin"
                  value={margin}
                  format={(v) => `${v.toFixed(1)}%`}
                  colorFn={(v) => v < 5 ? 'var(--status-warning)' : 'var(--text-primary)'}
                />

                {/* Total Politicians */}
                <ScoreRow
                  label="Total Politicians"
                  value={politicians.length}
                  maxValue={20}
                  colorFn={(_v) => 'var(--text-primary)'}
                  format={(v) => v.toString()}
                />

                {/* Endorsed Reps */}
                <ScoreRow
                  label="Endorsed Reps"
                  value={politicians.filter(p => p.endorsement_status === 'endorsed').length}
                  maxValue={Math.max(politicians.length, 1)}
                  colorFn={(_v) => 'var(--status-positive)'}
                  format={(v) => v.toString()}
                />
              </div>
            </div>

            {/* Connections */}
            <div style={{ borderTop: '1px solid var(--border)', margin: '1rem 0', paddingTop: '1rem' }}>
              <p style={{
                fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em',
                textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: '0.75rem',
              }}>
                Connections
              </p>
              {[
                { label: 'Politicians', count: politicians.length },
                { label: 'Related Bills', count: geographyBills.length },
                { label: 'Similar States', count: similarGeos.length },
              ].map(({ label, count }) => (
                <div key={label} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '0.5rem 0', borderBottom: '1px solid var(--border)',
                }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-secondary)', letterSpacing: '0.04em' }}>{label}</span>
                  <span style={{ fontFamily: 'var(--font-display), "Bebas Neue", sans-serif', fontSize: '1.25rem', color: 'var(--text-primary)' }}>
                    {count}
                  </span>
                </div>
              ))}
            </div>
          </aside>

          {/* MAIN CONTENT */}
          <GeographyDetail
            geography={geography}
            politicians={politicians}
            posts={posts}
            geographyBills={geographyBills}
            similarGeos={similarGeos}
            pastorBlurb={geography.pastor_blurb ?? null}
          />
        </div>
      </main>
      <Footer />
    </>
  )
}
