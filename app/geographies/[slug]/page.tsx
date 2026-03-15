import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { getGeography, getPoliticians, getPosts } from '@/lib/api'
import { PoliticianCard } from '@/components/politician-card'
import Link from 'next/link'
import { notFound } from 'next/navigation'

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
  let geography
  try {
    geography = await getGeography(params.slug)
  } catch {
    notFound()
  }

  const [politicians, posts] = await Promise.all([
    getPoliticians(geography.id, 50),
    getPosts(geography.id, undefined, 15),
  ])
  const endorsed = politicians.filter((p) => p.endorsement_status === 'endorsed')
  const opposed = politicians.filter((p) => p.endorsement_status === 'anti-endorsed')

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

  const PLATFORM_COLORS: Record<string, string> = {
    twitter: '#1DA1F2',
    instagram: '#E1306C',
    tiktok: '#69C9D0',
  }

  function formatPopulation(pop: number): string {
    if (pop >= 1_000_000_000) return (pop / 1_000_000_000).toFixed(1).replace(/\.0$/, '') + 'B'
    if (pop >= 1_000_000) return (pop / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M'
    if (pop >= 1_000) return (pop / 1_000).toFixed(1).replace(/\.0$/, '') + 'K'
    return pop.toLocaleString()
  }

  return (
    <>
      <Header />
      <style>{`
        .geo-post-item:hover { background: var(--bg-tertiary) !important; }
      `}</style>
      <main style={{ minHeight: '100vh' }}>

        {/* Page header */}
        <div
          style={{
            borderBottom: '1px solid var(--border)',
            background: 'var(--bg-secondary)',
            padding: '2rem 0 2.5rem',
            borderLeft: `3px solid ${levelColor}`,
          }}
        >
          <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.25rem' }}>
            <div style={{ marginBottom: '1.25rem' }}>
              <Link
                href="/geographies"
                style={{
                  fontSize: 'var(--text-xs)',
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: 'var(--text-tertiary)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.375rem',
                  transition: 'color 0.15s ease',
                }}
              >
                ← Geography
              </Link>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem' }}>
              <div>
                <span
                  style={{
                    display: 'inline-block',
                    fontSize: '10px',
                    fontWeight: 700,
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    color: levelColor,
                    marginBottom: '0.625rem',
                  }}
                >
                  {geography.type.toUpperCase()} Level
                </span>
                <h1
                  style={{
                    fontFamily: 'var(--font-display), "Bebas Neue", sans-serif',
                    fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
                    letterSpacing: '0.04em',
                    color: 'var(--text-primary)',
                    lineHeight: 1,
                  }}
                >
                  {geography.name.toUpperCase()}
                </h1>
              </div>

              <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                {[
                  { value: politicians.length, label: 'Total', color: 'var(--text-secondary)' },
                  { value: endorsed.length, label: 'Endorsed', color: 'var(--status-positive)' },
                  { value: opposed.length, label: 'Opposed', color: 'var(--status-negative)' },
                ].map((s) => (
                  <div key={s.label}>
                    <p style={{ fontFamily: 'var(--font-display), "Bebas Neue", sans-serif', fontSize: '2rem', letterSpacing: '0.03em', color: s.color, lineHeight: 1 }}>
                      {s.value}
                    </p>
                    <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-tertiary)' }}>
                      {s.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Demographics Panel */}
        {geography.population != null && (
          <div
            style={{
              borderBottom: '1px solid var(--border)',
              background: 'var(--bg-primary)',
              padding: '1.5rem 0',
            }}
          >
            <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.25rem' }}>
              <p className="section-label" style={{ marginBottom: '1.25rem' }}>Demographics</p>
              <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>

                {/* Population */}
                <div>
                  <p
                    style={{
                      fontFamily: 'var(--font-display), "Bebas Neue", sans-serif',
                      fontSize: '2rem',
                      letterSpacing: '0.03em',
                      color: 'var(--text-primary)',
                      lineHeight: 1,
                      marginBottom: '0.2rem',
                    }}
                  >
                    {formatPopulation(geography.population)}
                  </p>
                  <p
                    style={{
                      fontSize: '10px',
                      fontWeight: 700,
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      color: 'var(--text-tertiary)',
                    }}
                  >
                    Population
                  </p>
                </div>

                {/* Political Lean */}
                {geography.political_lean && (
                  <div>
                    <p
                      style={{
                        fontFamily: 'var(--font-display), "Bebas Neue", sans-serif',
                        fontSize: '2rem',
                        letterSpacing: '0.03em',
                        color: LEAN_COLORS[geography.political_lean.toLowerCase()] ?? 'var(--text-secondary)',
                        lineHeight: 1,
                        marginBottom: '0.2rem',
                      }}
                    >
                      {geography.political_lean}
                    </p>
                    <p
                      style={{
                        fontSize: '10px',
                        fontWeight: 700,
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        color: 'var(--text-tertiary)',
                      }}
                    >
                      Political Lean
                    </p>
                  </div>
                )}

                {/* Last Election Results */}
                {(geography.last_result_dem_pct != null || geography.last_result_rep_pct != null) && (
                  <div style={{ minWidth: '200px' }}>
                    <p
                      style={{
                        fontSize: '10px',
                        fontWeight: 700,
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        color: 'var(--text-tertiary)',
                        marginBottom: '0.75rem',
                      }}
                    >
                      Last Election{geography.last_election_year ? ` (${geography.last_election_year})` : ''}
                    </p>

                    {geography.last_result_dem_pct != null && (
                      <div style={{ marginBottom: '0.625rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.3rem' }}>
                          <span
                            style={{
                              fontSize: '10px',
                              fontWeight: 700,
                              letterSpacing: '0.1em',
                              textTransform: 'uppercase',
                              color: '#60a5fa',
                            }}
                          >
                            DEM
                          </span>
                          <span
                            style={{
                              fontFamily: 'var(--font-display), "Bebas Neue", sans-serif',
                              fontSize: '1.25rem',
                              letterSpacing: '0.03em',
                              color: '#60a5fa',
                              lineHeight: 1,
                            }}
                          >
                            {geography.last_result_dem_pct.toFixed(1)}%
                          </span>
                        </div>
                        <div style={{ height: '4px', background: 'var(--bg-tertiary)', borderRadius: '2px', overflow: 'hidden' }}>
                          <div
                            className="demo-bar"
                            style={{ '--target-w': `${geography.last_result_dem_pct}%`, height: '100%', background: '#60a5fa', animationDelay: '0s' } as React.CSSProperties}
                          />
                        </div>
                      </div>
                    )}

                    {geography.last_result_rep_pct != null && (
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.3rem' }}>
                          <span
                            style={{
                              fontSize: '10px',
                              fontWeight: 700,
                              letterSpacing: '0.1em',
                              textTransform: 'uppercase',
                              color: '#f87171',
                            }}
                          >
                            REP
                          </span>
                          <span
                            style={{
                              fontFamily: 'var(--font-display), "Bebas Neue", sans-serif',
                              fontSize: '1.25rem',
                              letterSpacing: '0.03em',
                              color: '#f87171',
                              lineHeight: 1,
                            }}
                          >
                            {geography.last_result_rep_pct.toFixed(1)}%
                          </span>
                        </div>
                        <div style={{ height: '4px', background: 'var(--bg-tertiary)', borderRadius: '2px', overflow: 'hidden' }}>
                          <div
                            className="demo-bar"
                            style={{ '--target-w': `${geography.last_result_rep_pct}%`, height: '100%', background: '#f87171', animationDelay: '0.15s' } as React.CSSProperties}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Politicians grid */}
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2.5rem 1.25rem' }}>
          <p className="section-label" style={{ marginBottom: '1.5rem' }}>
            Politicians in {geography.name}
          </p>

          {politicians.length > 0 ? (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '1px',
                background: 'var(--border)',
              }}
            >
              {politicians.map((politician) => (
                <div key={politician.id} style={{ background: 'var(--bg-primary)' }}>
                  <PoliticianCard politician={politician} />
                </div>
              ))}
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
                No politicians found for this region
              </p>
            </div>
          )}
        </div>

        {/* Regional Commentary */}
        {posts.length > 0 && (
          <div
            style={{
              borderTop: '1px solid var(--border)',
              background: 'var(--bg-secondary)',
              padding: '2.5rem 0',
            }}
          >
            <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.25rem' }}>
              <p className="section-label" style={{ marginBottom: '1.5rem' }}>Regional Commentary</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--border)' }}>
                {posts.map((post) => {
                  const score = post.sentiment_score ?? 0
                  const sentimentColor =
                    score > 0.3
                      ? 'var(--status-positive)'
                      : score < -0.3
                        ? 'var(--status-negative)'
                        : 'var(--text-tertiary)'
                  const platformColor = PLATFORM_COLORS[post.source_platform?.toLowerCase() ?? ''] ?? 'var(--text-tertiary)'
                  return (
                    <div
                      key={post.id}
                      className="geo-post-item"
                      style={{
                        background: 'var(--bg-secondary)',
                        padding: '1.125rem 1.25rem',
                        display: 'grid',
                        gridTemplateColumns: '1fr auto',
                        gap: '1rem',
                        alignItems: 'start',
                        transition: 'background 0.1s ease',
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.5rem' }}>
                          <span
                            style={{
                              fontSize: '10px',
                              fontWeight: 700,
                              letterSpacing: '0.1em',
                              textTransform: 'uppercase',
                              color: platformColor,
                            }}
                          >
                            {post.source_platform}
                          </span>
                          <span style={{ width: '1px', height: '10px', background: 'var(--border)' }} />
                          <span style={{ fontSize: '10px', color: 'var(--text-tertiary)', letterSpacing: '0.04em' }}>
                            {new Date(post.created_at).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </span>
                        </div>
                        <p
                          style={{
                            fontSize: 'var(--text-sm)',
                            color: 'var(--text-primary)',
                            lineHeight: 1.65,
                            letterSpacing: '0.02em',
                          }}
                        >
                          {post.content_text}
                        </p>
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <p
                          style={{
                            fontFamily: 'var(--font-display), "Bebas Neue", sans-serif',
                            fontSize: '1.5rem',
                            letterSpacing: '0.03em',
                            color: sentimentColor,
                            lineHeight: 1,
                          }}
                        >
                          {score > 0 ? '+' : ''}{score.toFixed(2)}
                        </p>
                        <p
                          style={{
                            fontSize: '10px',
                            color: 'var(--text-tertiary)',
                            letterSpacing: '0.1em',
                            textTransform: 'uppercase',
                            marginTop: '0.2rem',
                          }}
                        >
                          Signal
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

      </main>
      <Footer />
    </>
  )
}
