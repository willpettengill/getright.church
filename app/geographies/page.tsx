import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { getGeographies } from '@/lib/api'
import Link from 'next/link'

export const metadata = {
  title: 'States | get-right.church',
  description: 'Explore politicians and political data for all 50 U.S. states.',
}

const LEAN_COLORS: Record<string, { text: string; bg: string }> = {
  'deep blue': { text: '#3b82f6', bg: 'rgba(59,130,246,0.12)' },
  'blue':      { text: '#60a5fa', bg: 'rgba(96,165,250,0.12)' },
  'swing':     { text: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
  'red':       { text: '#f87171', bg: 'rgba(248,113,113,0.12)' },
  'deep red':  { text: '#ef4444', bg: 'rgba(239,68,68,0.12)' },
  'purple':    { text: '#a78bfa', bg: 'rgba(167,139,250,0.12)' },
}

function formatPopulation(pop: number): string {
  if (pop >= 1_000_000) return (pop / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M'
  if (pop >= 1_000) return (pop / 1_000).toFixed(0) + 'K'
  return pop.toLocaleString()
}

export default async function GeographiesPage() {
  const geographies = await getGeographies(undefined, 'state')

  return (
    <>
      <Header />
      <style>{`
        .geo-card {
          background: var(--bg-secondary);
          padding: 1.5rem;
          transition: background 0.15s ease;
          cursor: pointer;
          height: 100%;
          display: block;
          text-decoration: none;
        }
        .geo-card:hover { background: var(--bg-tertiary); }
      `}</style>
      <main style={{ minHeight: '100vh' }}>

        {/* Page header */}
        <div
          style={{
            borderBottom: '1px solid var(--border)',
            background: 'var(--bg-secondary)',
            padding: '3rem 0 2.5rem',
          }}
        >
          <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.25rem' }}>
            <p className="section-label" style={{ marginBottom: '0.75rem' }}>Browse by State</p>
            <h1
              style={{
                fontFamily: 'var(--font-display), "Bebas Neue", sans-serif',
                fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
                letterSpacing: '0.04em',
                color: 'var(--text-primary)',
                lineHeight: 1,
                marginBottom: '0.625rem',
              }}
            >
              States
            </h1>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)', letterSpacing: '0.02em' }}>
              Explore politicians and political data for all 50 U.S. states.
            </p>
          </div>
        </div>

        {/* Grid */}
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2.5rem 1.25rem' }}>
          {geographies.length > 0 ? (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                gap: '1px',
                background: 'var(--border)',
              }}
            >
              {geographies.map((geo) => {
                const lean = geo.political_lean?.toLowerCase() ?? null
                const leanColor = lean && lean in LEAN_COLORS ? LEAN_COLORS[lean] : null
                const borderColor = leanColor ? leanColor.text : 'var(--text-tertiary)'
                const showElection =
                  geo.last_result_dem_pct != null && geo.last_result_rep_pct != null
                const demPct = geo.last_result_dem_pct ?? 0
                const repPct = geo.last_result_rep_pct ?? 0

                return (
                  <Link
                    key={geo.id}
                    href={`/geographies/${geo.slug}`}
                    className="geo-card"
                    style={{ borderLeft: `2px solid ${borderColor}` }}
                  >
                    {/* Political lean badge */}
                    {geo.political_lean && leanColor && (
                      <div style={{ marginBottom: '0.75rem' }}>
                        <span
                          style={{
                            display: 'inline-block',
                            fontSize: '10px',
                            fontWeight: 700,
                            letterSpacing: '0.1em',
                            textTransform: 'uppercase',
                            color: leanColor.text,
                            background: leanColor.bg,
                            padding: '2px 6px',
                            borderRadius: '2px',
                          }}
                        >
                          {geo.political_lean}
                        </span>
                      </div>
                    )}

                    {/* State name */}
                    <h3
                      style={{
                        fontFamily: 'var(--font-display), "Bebas Neue", sans-serif',
                        fontSize: '1.75rem',
                        letterSpacing: '0.04em',
                        color: 'var(--text-primary)',
                        lineHeight: 1,
                        marginBottom: '0.5rem',
                      }}
                    >
                      {geo.name.toUpperCase()}
                    </h3>

                    {/* Population */}
                    {geo.population != null && (
                      <p
                        style={{
                          fontSize: '11px',
                          color: 'var(--text-tertiary)',
                          letterSpacing: '0.04em',
                          marginBottom: '0.625rem',
                        }}
                      >
                        Pop. {formatPopulation(geo.population)}
                      </p>
                    )}

                    {/* Election bar */}
                    {showElection && (
                      <div style={{ marginBottom: '0.375rem' }}>
                        <div
                          style={{
                            height: '3px',
                            borderRadius: '2px',
                            overflow: 'hidden',
                            display: 'flex',
                            background: 'var(--border)',
                          }}
                        >
                          <div
                            style={{
                              width: `${demPct}%`,
                              background: '#3b82f6',
                              flexShrink: 0,
                            }}
                          />
                          <div
                            style={{
                              width: `${repPct}%`,
                              background: '#ef4444',
                              flexShrink: 0,
                            }}
                          />
                        </div>
                        <div
                          style={{
                            display: 'flex',
                            gap: '0.75rem',
                            marginTop: '0.25rem',
                          }}
                        >
                          <span style={{ fontSize: '9px', color: '#3b82f6', fontWeight: 700, letterSpacing: '0.05em' }}>
                            D {demPct.toFixed(1)}%
                          </span>
                          <span style={{ fontSize: '9px', color: '#ef4444', fontWeight: 700, letterSpacing: '0.05em' }}>
                            R {repPct.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    )}

                    {/* CTA */}
                    <p style={{ fontSize: '10px', color: 'var(--text-tertiary)', letterSpacing: '0.04em', marginTop: 'auto' }}>
                      View politicians →
                    </p>
                  </Link>
                )
              })}
            </div>
          ) : (
            <div
              style={{
                textAlign: 'center',
                padding: '5rem 1rem',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border)',
              }}
            >
              <p style={{ fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-tertiary)' }}>
                No states available
              </p>
            </div>
          )}
        </div>

      </main>
      <Footer />
    </>
  )
}
