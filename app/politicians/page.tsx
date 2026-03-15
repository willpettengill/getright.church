import Link from 'next/link'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { getPoliticians } from '@/lib/api'
import { PoliticiansFilterGrid } from '@/components/politicians-filter-grid'

export const metadata = {
  title: 'Politicians | get-right.church',
  description: 'Browse all tracked politicians and their endorsement status',
}

export default async function PoliticiansPage() {
  const politicians = await getPoliticians(undefined, 100)

  const endorsed = politicians.filter((p) => p.endorsement_status === 'endorsed')
  const opposed = politicians.filter((p) => p.endorsement_status === 'anti-endorsed')
  const watching = politicians.filter((p) => p.endorsement_status === 'watching')

  return (
    <>
      <Header />
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
            <p className="section-label" style={{ marginBottom: '0.75rem' }}>Database</p>
            <h1
              style={{
                fontFamily: 'var(--font-display), "Bebas Neue", sans-serif',
                fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
                letterSpacing: '0.04em',
                color: 'var(--text-primary)',
                lineHeight: 1,
                marginBottom: '1rem',
              }}
            >
              Politicians
            </h1>

            {/* Count summary */}
            <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
              {[
                { label: 'All', count: politicians.length, color: 'var(--text-secondary)' },
                { label: 'Endorsed', count: endorsed.length, color: 'var(--status-positive)' },
                { label: 'Opposed', count: opposed.length, color: 'var(--status-negative)' },
                { label: 'Watching', count: watching.length, color: 'var(--text-tertiary)' },
              ].map((item) => (
                <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span
                    style={{
                      fontFamily: 'var(--font-display), "Bebas Neue", sans-serif',
                      fontSize: '1.5rem',
                      letterSpacing: '0.03em',
                      color: item.color,
                      lineHeight: 1,
                    }}
                  >
                    {item.count}
                  </span>
                  <span
                    style={{
                      fontSize: 'var(--text-xs)',
                      fontWeight: 700,
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      color: 'var(--text-tertiary)',
                    }}
                  >
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Rankings */}
        {politicians.length > 0 && (
          <div
            style={{
              borderBottom: '1px solid var(--border)',
              background: 'var(--bg-primary)',
              padding: '2rem 0',
            }}
          >
            <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.25rem' }}>
              <p className="section-label" style={{ marginBottom: '1.25rem' }}>Rankings</p>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                  gap: '1px',
                  background: 'var(--border)',
                }}
              >
                {/* Most Endorsed */}
                <div style={{ background: 'var(--bg-secondary)', padding: '1.25rem' }}>
                  <p
                    style={{
                      fontSize: '10px',
                      fontWeight: 700,
                      letterSpacing: '0.15em',
                      textTransform: 'uppercase',
                      color: 'var(--status-positive)',
                      marginBottom: '1rem',
                    }}
                  >
                    Most Endorsed
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {[...politicians]
                      .filter((p) => p.endorsement_status === 'endorsed')
                      .sort((a, b) => (b.aggregate_sentiment ?? 0) - (a.aggregate_sentiment ?? 0))
                      .slice(0, 3)
                      .map((p, i) => (
                        <Link
                          key={p.id}
                          href={`/politicians/${p.slug}`}
                          style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.875rem', cursor: 'pointer' }}
                        >
                          <span
                            style={{
                              fontFamily: 'var(--font-display), "Bebas Neue", sans-serif',
                              fontSize: '2rem',
                              letterSpacing: '0.04em',
                              color: 'var(--text-tertiary)',
                              lineHeight: 1,
                              width: '28px',
                              flexShrink: 0,
                            }}
                          >
                            {String(i + 1).padStart(2, '0')}
                          </span>
                          {/* Portrait thumbnail */}
                          <div
                            style={{
                              width: '36px',
                              height: '36px',
                              borderRadius: '2px',
                              overflow: 'hidden',
                              background: 'var(--bg-tertiary)',
                              flexShrink: 0,
                              border: '1px solid var(--border)',
                            }}
                          >
                            {p.portrait_url ? (
                              <img
                                src={p.portrait_url}
                                alt={p.name}
                                style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }}
                              />
                            ) : (
                              <span
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  height: '100%',
                                  fontFamily: 'var(--font-display), "Bebas Neue", sans-serif',
                                  fontSize: '0.875rem',
                                  color: 'var(--text-faint)',
                                  letterSpacing: '0.04em',
                                }}
                              >
                                {p.name.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase()}
                              </span>
                            )}
                          </div>
                          <div style={{ minWidth: 0, flex: 1 }}>
                            <p
                              style={{
                                fontSize: 'var(--text-sm)',
                                fontWeight: 700,
                                color: 'var(--text-primary)',
                                letterSpacing: '0.02em',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                marginBottom: '0.15rem',
                              }}
                            >
                              {p.name}
                            </p>
                            <p
                              style={{
                                fontSize: '10px',
                                color: 'var(--text-tertiary)',
                                letterSpacing: '0.04em',
                              }}
                            >
                              Sentiment:{' '}
                              <span style={{ color: 'var(--status-positive)', fontWeight: 700 }}>
                                {p.aggregate_sentiment != null
                                  ? (p.aggregate_sentiment > 0 ? '+' : '') + p.aggregate_sentiment.toFixed(2)
                                  : '—'}
                              </span>
                            </p>
                          </div>
                          <span
                            style={{
                              flexShrink: 0,
                              padding: '0.2rem 0.5rem',
                              background: 'rgba(74, 222, 128, 0.06)',
                              border: '1px solid rgba(74, 222, 128, 0.3)',
                              borderRadius: '2px',
                              fontSize: '10px',
                              fontWeight: 700,
                              letterSpacing: '0.1em',
                              textTransform: 'uppercase',
                              color: 'var(--status-positive)',
                            }}
                          >
                            Endorsed
                          </span>
                        </Link>
                      ))}
                    {politicians.filter((p) => p.endorsement_status === 'endorsed').length === 0 && (
                      <p
                        style={{
                          fontSize: 'var(--text-xs)',
                          color: 'var(--text-tertiary)',
                          fontWeight: 700,
                          letterSpacing: '0.1em',
                          textTransform: 'uppercase',
                        }}
                      >
                        No endorsed politicians
                      </p>
                    )}
                  </div>
                </div>

                {/* Most Opposed */}
                <div style={{ background: 'var(--bg-secondary)', padding: '1.25rem' }}>
                  <p
                    style={{
                      fontSize: '10px',
                      fontWeight: 700,
                      letterSpacing: '0.15em',
                      textTransform: 'uppercase',
                      color: 'var(--status-negative)',
                      marginBottom: '1rem',
                    }}
                  >
                    Most Opposed
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {[...politicians]
                      .filter((p) => p.endorsement_status === 'anti-endorsed')
                      .sort((a, b) => (b.epstein_score ?? 0) - (a.epstein_score ?? 0))
                      .slice(0, 3)
                      .map((p, i) => (
                        <Link
                          key={p.id}
                          href={`/politicians/${p.slug}`}
                          style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.875rem', cursor: 'pointer' }}
                        >
                          <span
                            style={{
                              fontFamily: 'var(--font-display), "Bebas Neue", sans-serif',
                              fontSize: '2rem',
                              letterSpacing: '0.04em',
                              color: 'var(--text-tertiary)',
                              lineHeight: 1,
                              width: '28px',
                              flexShrink: 0,
                            }}
                          >
                            {String(i + 1).padStart(2, '0')}
                          </span>
                          {/* Portrait thumbnail */}
                          <div
                            style={{
                              width: '36px',
                              height: '36px',
                              borderRadius: '2px',
                              overflow: 'hidden',
                              background: 'var(--bg-tertiary)',
                              flexShrink: 0,
                              border: '1px solid var(--border)',
                            }}
                          >
                            {p.portrait_url ? (
                              <img
                                src={p.portrait_url}
                                alt={p.name}
                                style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }}
                              />
                            ) : (
                              <span
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  height: '100%',
                                  fontFamily: 'var(--font-display), "Bebas Neue", sans-serif',
                                  fontSize: '0.875rem',
                                  color: 'var(--text-faint)',
                                  letterSpacing: '0.04em',
                                }}
                              >
                                {p.name.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase()}
                              </span>
                            )}
                          </div>
                          <div style={{ minWidth: 0, flex: 1 }}>
                            <p
                              style={{
                                fontSize: 'var(--text-sm)',
                                fontWeight: 700,
                                color: 'var(--text-primary)',
                                letterSpacing: '0.02em',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                marginBottom: '0.15rem',
                              }}
                            >
                              {p.name}
                            </p>
                            <p
                              style={{
                                fontSize: '10px',
                                color: 'var(--text-tertiary)',
                                letterSpacing: '0.04em',
                              }}
                            >
                              Epstein:{' '}
                              <span style={{ color: 'var(--status-negative)', fontWeight: 700 }}>
                                {p.epstein_score != null ? p.epstein_score.toFixed(0) : '—'}
                              </span>
                            </p>
                          </div>
                          <span
                            style={{
                              flexShrink: 0,
                              padding: '0.2rem 0.5rem',
                              background: 'rgba(248, 113, 113, 0.06)',
                              border: '1px solid rgba(248, 113, 113, 0.3)',
                              borderRadius: '2px',
                              fontSize: '10px',
                              fontWeight: 700,
                              letterSpacing: '0.1em',
                              textTransform: 'uppercase',
                              color: 'var(--status-negative)',
                            }}
                          >
                            Anti
                          </span>
                        </Link>
                      ))}
                    {politicians.filter((p) => p.endorsement_status === 'anti-endorsed').length === 0 && (
                      <p
                        style={{
                          fontSize: 'var(--text-xs)',
                          color: 'var(--text-tertiary)',
                          fontWeight: 700,
                          letterSpacing: '0.1em',
                          textTransform: 'uppercase',
                        }}
                      >
                        No anti-endorsed politicians
                      </p>
                    )}
                  </div>
                </div>

                {/* Most Bipartisan */}
                <div style={{ background: 'var(--bg-secondary)', padding: '1.25rem' }}>
                  <p
                    style={{
                      fontSize: '10px',
                      fontWeight: 700,
                      letterSpacing: '0.15em',
                      textTransform: 'uppercase',
                      color: '#60A5FA',
                      marginBottom: '1rem',
                    }}
                  >
                    Most Bipartisan
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {[...politicians]
                      .filter((p) => p.bipartisan_score != null)
                      .sort((a, b) => (b.bipartisan_score ?? 0) - (a.bipartisan_score ?? 0))
                      .slice(0, 3)
                      .map((p, i) => (
                        <div
                          key={p.id}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.875rem',
                          }}
                        >
                          <span
                            style={{
                              fontFamily: 'var(--font-display), "Bebas Neue", sans-serif',
                              fontSize: '1.5rem',
                              letterSpacing: '0.04em',
                              color: 'var(--text-faint)',
                              lineHeight: 1,
                              width: '28px',
                              flexShrink: 0,
                            }}
                          >
                            {String(i + 1).padStart(2, '0')}
                          </span>
                          <div style={{ minWidth: 0, flex: 1 }}>
                            <p
                              style={{
                                fontSize: 'var(--text-sm)',
                                fontWeight: 700,
                                color: 'var(--text-primary)',
                                letterSpacing: '0.02em',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                marginBottom: '0.15rem',
                              }}
                            >
                              {p.name}
                            </p>
                            <p
                              style={{
                                fontSize: '10px',
                                color: 'var(--text-tertiary)',
                                letterSpacing: '0.04em',
                              }}
                            >
                              Bipartisan:{' '}
                              <span style={{ color: '#60A5FA', fontWeight: 700 }}>
                                {p.bipartisan_score != null ? p.bipartisan_score.toFixed(0) : '—'}
                              </span>
                            </p>
                          </div>
                          <span
                            style={{
                              flexShrink: 0,
                              padding: '0.2rem 0.5rem',
                              background: 'rgba(96, 165, 250, 0.06)',
                              border: '1px solid rgba(96, 165, 250, 0.3)',
                              borderRadius: '2px',
                              fontSize: '10px',
                              fontWeight: 700,
                              letterSpacing: '0.1em',
                              textTransform: 'uppercase',
                              color: '#60A5FA',
                            }}
                          >
                            Bipartisan
                          </span>
                        </div>
                      ))}
                    {politicians.filter((p) => p.bipartisan_score != null).length === 0 && (
                      <p
                        style={{
                          fontSize: 'var(--text-xs)',
                          color: 'var(--text-tertiary)',
                          fontWeight: 700,
                          letterSpacing: '0.1em',
                          textTransform: 'uppercase',
                        }}
                      >
                        No bipartisan score data
                      </p>
                    )}
                  </div>
                </div>

                {/* Most Independent */}
                <div style={{ background: 'var(--bg-secondary)', padding: '1.25rem' }}>
                  <p
                    style={{
                      fontSize: '10px',
                      fontWeight: 700,
                      letterSpacing: '0.15em',
                      textTransform: 'uppercase',
                      color: 'var(--accent-primary)',
                      marginBottom: '1rem',
                    }}
                  >
                    Most Independent
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {[...politicians]
                      .filter((p) => p.independence_score != null)
                      .sort((a, b) => (b.independence_score ?? 0) - (a.independence_score ?? 0))
                      .slice(0, 3)
                      .map((p, i) => (
                        <div
                          key={p.id}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.875rem',
                          }}
                        >
                          <span
                            style={{
                              fontFamily: 'var(--font-display), "Bebas Neue", sans-serif',
                              fontSize: '1.5rem',
                              letterSpacing: '0.04em',
                              color: 'var(--text-faint)',
                              lineHeight: 1,
                              width: '28px',
                              flexShrink: 0,
                            }}
                          >
                            {String(i + 1).padStart(2, '0')}
                          </span>
                          <div style={{ minWidth: 0, flex: 1 }}>
                            <p
                              style={{
                                fontSize: 'var(--text-sm)',
                                fontWeight: 700,
                                color: 'var(--text-primary)',
                                letterSpacing: '0.02em',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                marginBottom: '0.15rem',
                              }}
                            >
                              {p.name}
                            </p>
                            <p
                              style={{
                                fontSize: '10px',
                                color: 'var(--text-tertiary)',
                                letterSpacing: '0.04em',
                              }}
                            >
                              Independence:{' '}
                              <span style={{ color: 'var(--accent-primary)', fontWeight: 700 }}>
                                {p.independence_score != null ? p.independence_score.toFixed(0) : '—'}
                              </span>
                            </p>
                          </div>
                          <span
                            style={{
                              flexShrink: 0,
                              padding: '0.2rem 0.5rem',
                              background: 'var(--accent-glow)',
                              border: '1px solid var(--accent-primary)',
                              borderRadius: '2px',
                              fontSize: '10px',
                              fontWeight: 700,
                              letterSpacing: '0.1em',
                              textTransform: 'uppercase',
                              color: 'var(--accent-primary)',
                            }}
                          >
                            Independent
                          </span>
                        </div>
                      ))}
                    {politicians.filter((p) => p.independence_score != null).length === 0 && (
                      <p
                        style={{
                          fontSize: 'var(--text-xs)',
                          color: 'var(--text-tertiary)',
                          fontWeight: 700,
                          letterSpacing: '0.1em',
                          textTransform: 'uppercase',
                        }}
                      >
                        No independence score data
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Grid */}
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2.5rem 1.25rem' }}>
          <PoliticiansFilterGrid politicians={politicians} />
        </div>
      </main>
      <Footer />
    </>
  )
}
