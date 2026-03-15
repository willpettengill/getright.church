import { getIssues } from '@/lib/api'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import Link from 'next/link'
import type { IssueWithVotes } from '@/lib/types'

export const metadata = {
  title: 'Issues | get-right.church',
  description: 'Track where politicians and the community stand on key issues',
}

const CATEGORY_COLORS: Record<string, string> = {
  'civil-rights': '#40916c',
  'civil rights': '#40916c',
  economy: '#f59e0b',
  environment: '#4ade80',
  healthcare: '#60a5fa',
}

function getCategoryColor(category: string): string {
  const key = category.toLowerCase()
  return CATEGORY_COLORS[key] ?? 'var(--text-tertiary)'
}

function PollBar({ issue }: { issue: IssueWithVotes }) {
  const total = issue.total_count || 1
  const supportPct = Math.round((issue.support_count / total) * 100)
  const opposePct = Math.round((issue.oppose_count / total) * 100)
  const neutralPct = 100 - supportPct - opposePct

  return (
    <div>
      {/* Bar */}
      <div
        style={{
          height: '4px',
          borderRadius: '2px',
          background: 'var(--bg-tertiary)',
          overflow: 'hidden',
          display: 'flex',
          marginBottom: '0.5rem',
        }}
      >
        {issue.support_count > 0 && (
          <div
            style={{
              width: `${supportPct}%`,
              background: 'var(--status-positive)',
              transition: 'width 0.3s ease',
            }}
          />
        )}
        {issue.oppose_count > 0 && (
          <div
            style={{
              width: `${opposePct}%`,
              background: 'var(--status-negative)',
              transition: 'width 0.3s ease',
            }}
          />
        )}
        {neutralPct > 0 && issue.total_count > 0 && (
          <div
            style={{
              width: `${neutralPct}%`,
              background: 'var(--neutral-mid)',
              transition: 'width 0.3s ease',
            }}
          />
        )}
      </div>
      {/* Labels */}
      {issue.total_count > 0 ? (
        <div style={{ display: 'flex', gap: '0.875rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em', color: 'var(--status-positive)' }}>
            {supportPct}% FOR
          </span>
          <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em', color: 'var(--status-negative)' }}>
            {opposePct}% AGAINST
          </span>
          <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em', color: 'var(--text-tertiary)' }}>
            {neutralPct}% NEUTRAL
          </span>
          <span style={{ fontSize: '10px', color: 'var(--text-faint)', letterSpacing: '0.04em', marginLeft: 'auto' }}>
            {issue.total_count.toLocaleString()} votes
          </span>
        </div>
      ) : (
        <p style={{ fontSize: '10px', color: 'var(--text-faint)', letterSpacing: '0.08em', fontWeight: 700, textTransform: 'uppercase' }}>
          No votes yet
        </p>
      )}
    </div>
  )
}

export default async function IssuesPage() {
  const issues = await getIssues()

  // Group by category
  const grouped = issues.reduce<Record<string, IssueWithVotes[]>>((acc, issue) => {
    const cat = issue.category ?? 'other'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(issue)
    return acc
  }, {})

  const categories = Object.keys(grouped).sort()

  return (
    <>
      <Header />
      <style>{`
        .issue-card:hover { background: var(--bg-tertiary) !important; }
        .issue-cat-link:hover { color: var(--accent-primary) !important; }
      `}</style>
      <main style={{ minHeight: '100vh' }}>

        {/* Hero */}
        <div
          style={{
            borderBottom: '1px solid var(--border)',
            background: 'var(--bg-secondary)',
            padding: '3rem 0 2.5rem',
          }}
        >
          <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.25rem' }}>
            <p className="section-label" style={{ marginBottom: '0.75rem' }}>Signal Tracker</p>
            <h1
              style={{
                fontFamily: 'var(--font-display), "Bebas Neue", sans-serif',
                fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
                letterSpacing: '0.04em',
                color: 'var(--text-primary)',
                lineHeight: 1,
                marginBottom: '0.875rem',
              }}
            >
              Issues
            </h1>
            <p
              style={{
                fontSize: 'var(--text-sm)',
                color: 'var(--text-secondary)',
                letterSpacing: '0.02em',
                maxWidth: '480px',
              }}
            >
              Track where politicians and the community stand.
            </p>

            {/* Category summary */}
            <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', marginTop: '1.5rem' }}>
              {[
                { label: 'Total Issues', count: issues.length, color: 'var(--text-secondary)' },
                { label: 'Categories', count: categories.length, color: 'var(--accent-primary)' },
                { label: 'Total Votes', count: issues.reduce((s, i) => s + i.total_count, 0), color: 'var(--text-tertiary)' },
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
                    {item.count.toLocaleString()}
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

        {/* Content */}
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2.5rem 1.25rem' }}>
          {issues.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '6rem 1rem',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border)',
              }}
            >
              <p
                style={{
                  fontSize: 'var(--text-xs)',
                  fontWeight: 700,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  color: 'var(--text-tertiary)',
                }}
              >
                No issues tracked yet
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
              {categories.map((category) => {
                const catColor = getCategoryColor(category)
                const catIssues = grouped[category]
                return (
                  <section key={category}>
                    {/* Category header */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.875rem',
                        marginBottom: '1.25rem',
                        paddingBottom: '0.75rem',
                        borderBottom: `1px solid var(--border)`,
                      }}
                    >
                      <span
                        style={{
                          width: '3px',
                          height: '18px',
                          background: catColor,
                          borderRadius: '1px',
                          flexShrink: 0,
                        }}
                      />
                      <h2
                        style={{
                          fontFamily: 'var(--font-display), "Bebas Neue", sans-serif',
                          fontSize: '1.375rem',
                          letterSpacing: '0.08em',
                          color: 'var(--text-primary)',
                          lineHeight: 1,
                        }}
                      >
                        {category.toUpperCase()}
                      </h2>
                      <span
                        style={{
                          fontSize: '10px',
                          fontWeight: 700,
                          letterSpacing: '0.1em',
                          textTransform: 'uppercase',
                          color: 'var(--text-tertiary)',
                          background: 'var(--bg-tertiary)',
                          border: '1px solid var(--border)',
                          padding: '0.1rem 0.5rem',
                          borderRadius: '2px',
                        }}
                      >
                        {catIssues.length}
                      </span>
                    </div>

                    {/* Issue cards grid */}
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                        gap: '1px',
                        background: 'var(--border)',
                      }}
                    >
                      {catIssues.map((issue) => (
                        <Link
                          key={issue.id}
                          href={`/issues/${issue.slug}`}
                          className="issue-card"
                          style={{
                            display: 'block',
                            background: 'var(--bg-secondary)',
                            padding: '1.25rem',
                            transition: 'background 0.15s ease',
                          }}
                        >
                          {/* Category badge */}
                          <div style={{ marginBottom: '0.625rem' }}>
                            <span
                              style={{
                                fontSize: '10px',
                                fontWeight: 700,
                                letterSpacing: '0.12em',
                                textTransform: 'uppercase',
                                color: catColor,
                              }}
                            >
                              {issue.category}
                            </span>
                          </div>

                          {/* Title */}
                          <h3
                            style={{
                              fontFamily: 'var(--font-display), "Bebas Neue", sans-serif',
                              fontSize: '1.25rem',
                              letterSpacing: '0.04em',
                              color: 'var(--text-primary)',
                              lineHeight: 1.1,
                              marginBottom: '0.625rem',
                            }}
                          >
                            {issue.title}
                          </h3>

                          {/* Description */}
                          {issue.description && (
                            <p
                              style={{
                                fontSize: 'var(--text-xs)',
                                color: 'var(--text-secondary)',
                                lineHeight: 1.6,
                                letterSpacing: '0.02em',
                                marginBottom: '1rem',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                              }}
                            >
                              {issue.description}
                            </p>
                          )}

                          {/* Poll bar */}
                          <PollBar issue={issue} />
                        </Link>
                      ))}
                    </div>
                  </section>
                )
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
