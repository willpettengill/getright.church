import { getIssue, getIssuePositions } from '@/lib/api'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { IssuePositionWithPolitician } from '@/lib/types'
import { getCategoryColor } from '@/lib/issue-utils'

export const revalidate = 3600

export async function generateMetadata(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params
  try {
    const issue = await getIssue(params.slug)
    return {
      title: `${issue.title} | get-right.church`,
      description: issue.description ?? `Community stance on ${issue.title}`,
    }
  } catch {
    return { title: 'Not Found' }
  }
}

function positionStyle(position: string) {
  if (position === 'support') {
    return { color: 'var(--status-positive)', bg: 'rgba(74, 222, 128, 0.06)', border: 'rgba(74, 222, 128, 0.3)' }
  }
  if (position === 'oppose') {
    return { color: 'var(--status-negative)', bg: 'rgba(248, 113, 113, 0.06)', border: 'rgba(248, 113, 113, 0.3)' }
  }
  return { color: 'var(--text-tertiary)', bg: 'var(--bg-tertiary)', border: 'var(--border)' }
}

function endorsementStyle(status: string) {
  if (status === 'endorsed') {
    return { color: 'var(--status-positive)', border: 'rgba(74, 222, 128, 0.4)', portraitBorder: 'rgba(74, 222, 128, 0.5)' }
  }
  if (status === 'anti-endorsed') {
    return { color: 'var(--status-negative)', border: 'rgba(248, 113, 113, 0.4)', portraitBorder: 'rgba(248, 113, 113, 0.5)' }
  }
  return { color: 'var(--text-tertiary)', border: 'var(--border)', portraitBorder: 'var(--neutral-mid)' }
}

function PoliticianPositionCard({ ip }: { ip: IssuePositionWithPolitician }) {
  const pos = positionStyle(ip.position)
  const end = endorsementStyle(ip.politician.endorsement_status)
  const initials = ip.politician.name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <Link
      href={`/politicians/${ip.politician.slug}`}
      className="pos-card"
      style={{
        display: 'block',
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border)',
        borderRadius: '2px',
        padding: '1.25rem',
        transition: 'background 0.15s ease',
      }}
    >
      {/* Portrait + name row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', marginBottom: '0.875rem' }}>
        <div
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '2px',
            border: `1px solid ${end.portraitBorder}`,
            overflow: 'hidden',
            background: 'var(--bg-tertiary)',
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {ip.politician.portrait_url ? (
            <img
              src={ip.politician.portrait_url}
              alt={ip.politician.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }}
            />
          ) : (
            <span
              style={{
                fontFamily: 'var(--font-display), "Bebas Neue", sans-serif',
                fontSize: '1.125rem',
                color: 'var(--text-faint)',
                letterSpacing: '0.04em',
              }}
            >
              {initials}
            </span>
          )}
        </div>
        <div style={{ minWidth: 0 }}>
          <p
            style={{
              fontSize: 'var(--text-sm)',
              fontWeight: 700,
              color: 'var(--text-primary)',
              letterSpacing: '0.02em',
              lineHeight: 1.2,
              marginBottom: '0.2rem',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {ip.politician.name}
          </p>
          {ip.politician.party && (
            <p
              style={{
                fontSize: '10px',
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: end.color,
              }}
            >
              {ip.politician.party}
            </p>
          )}
        </div>
      </div>

      {/* Position badge */}
      <div style={{ marginBottom: ip.notes ? '0.75rem' : 0 }}>
        <span
          style={{
            display: 'inline-block',
            padding: '0.25rem 0.625rem',
            background: pos.bg,
            border: `1px solid ${pos.border}`,
            borderRadius: '2px',
            fontSize: '10px',
            fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: pos.color,
          }}
        >
          {ip.position}
        </span>
      </div>

      {/* Notes */}
      {ip.notes && (
        <p
          style={{
            fontSize: 'var(--text-xs)',
            color: 'var(--text-secondary)',
            lineHeight: 1.55,
            letterSpacing: '0.02em',
          }}
        >
          {ip.notes}
        </p>
      )}
    </Link>
  )
}

export default async function IssueDetailPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params

  let issue
  try {
    issue = await getIssue(params.slug)
  } catch {
    notFound()
  }

  const positions = await getIssuePositions(issue.id)

  const total = issue.total_count || 1
  const supportPct = issue.total_count > 0 ? Math.round((issue.support_count / total) * 100) : 0
  const opposePct = issue.total_count > 0 ? Math.round((issue.oppose_count / total) * 100) : 0
  const neutralPct = issue.total_count > 0 ? 100 - supportPct - opposePct : 0

  const catColor = getCategoryColor(issue.category)

  const supporting = positions.filter((p) => p.position === 'support')
  const opposing = positions.filter((p) => p.position === 'oppose')
  const neutral = positions.filter((p) => p.position === 'neutral')

  return (
    <>
      <Header />
      <style>{`
        .pos-card:hover { background: var(--bg-tertiary) !important; }
        .issue-breadcrumb { font-size: var(--text-xs); font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--text-tertiary); display: inline-flex; align-items: center; gap: 0.375rem; transition: color 0.15s ease; }
        .issue-breadcrumb:hover { color: var(--accent-primary); }
      `}</style>
      <main style={{ minHeight: '100vh' }}>

        {/* Hero */}
        <div
          style={{
            borderBottom: '1px solid var(--border)',
            background: 'var(--bg-secondary)',
            padding: '2rem 0 2.5rem',
          }}
        >
          <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.25rem' }}>
            {/* Breadcrumb */}
            <div style={{ marginBottom: '1.5rem' }}>
              <Link href="/issues" className="issue-breadcrumb">
                ← Issues
              </Link>
            </div>

            {/* Category badge */}
            <div style={{ marginBottom: '0.75rem' }}>
              <span
                style={{
                  fontSize: '10px',
                  fontWeight: 700,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  color: catColor,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <span
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: catColor,
                    display: 'inline-block',
                    flexShrink: 0,
                  }}
                />
                {issue.category.toUpperCase()}
              </span>
            </div>

            {/* Title */}
            <h1
              style={{
                fontFamily: 'var(--font-display), "Bebas Neue", sans-serif',
                fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
                letterSpacing: '0.04em',
                color: 'var(--text-primary)',
                lineHeight: 1,
                marginBottom: '1rem',
                maxWidth: '800px',
              }}
            >
              {issue.title}
            </h1>

            {/* Description */}
            {issue.description && (
              <p
                style={{
                  fontSize: 'var(--text-base)',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.7,
                  letterSpacing: '0.02em',
                  maxWidth: '680px',
                }}
              >
                {issue.description}
              </p>
            )}
          </div>
        </div>

        {/* Community Signal */}
        <div
          style={{
            borderBottom: '1px solid var(--border)',
            background: 'var(--bg-primary)',
            padding: '2rem 0',
          }}
        >
          <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.25rem' }}>
            <p className="section-label" style={{ marginBottom: '1.25rem' }}>Community Signal</p>

            {issue.total_count === 0 ? (
              <p
                style={{
                  fontSize: 'var(--text-xs)',
                  fontWeight: 700,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  color: 'var(--text-tertiary)',
                }}
              >
                No community votes yet
              </p>
            ) : (
              <div style={{ maxWidth: '640px' }}>
                {/* Large poll bar */}
                <div
                  style={{
                    height: '20px',
                    borderRadius: '3px',
                    background: 'var(--bg-tertiary)',
                    overflow: 'hidden',
                    display: 'flex',
                    marginBottom: '1rem',
                  }}
                >
                  {issue.support_count > 0 && (
                    <div
                      className="poll-fill-slow"
                      style={{ '--target-w': `${supportPct}%`, background: 'var(--status-positive)', animationDelay: '0s' } as React.CSSProperties}
                    />
                  )}
                  {issue.oppose_count > 0 && (
                    <div
                      className="poll-fill-slow"
                      style={{ '--target-w': `${opposePct}%`, background: 'var(--status-negative)', animationDelay: '0.15s' } as React.CSSProperties}
                    />
                  )}
                  {neutralPct > 0 && (
                    <div
                      className="poll-fill-slow"
                      style={{ '--target-w': `${neutralPct}%`, background: 'var(--neutral-mid)', animationDelay: '0.3s' } as React.CSSProperties}
                    />
                  )}
                </div>

                {/* Stats row */}
                <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
                  {[
                    { label: 'Support', count: issue.support_count, pct: supportPct, color: 'var(--status-positive)' },
                    { label: 'Oppose', count: issue.oppose_count, pct: opposePct, color: 'var(--status-negative)' },
                    { label: 'Neutral', count: issue.neutral_count, pct: neutralPct, color: 'var(--text-tertiary)' },
                  ].map((s) => (
                    <div key={s.label}>
                      <p
                        style={{
                          fontFamily: 'var(--font-display), "Bebas Neue", sans-serif',
                          fontSize: '2rem',
                          letterSpacing: '0.03em',
                          color: s.color,
                          lineHeight: 1,
                          marginBottom: '0.2rem',
                        }}
                      >
                        {s.pct}%
                      </p>
                      <p
                        style={{
                          fontSize: '10px',
                          fontWeight: 700,
                          letterSpacing: '0.1em',
                          textTransform: 'uppercase',
                          color: 'var(--text-tertiary)',
                          marginBottom: '0.2rem',
                        }}
                      >
                        {s.label}
                      </p>
                      <p style={{ fontSize: '10px', color: 'var(--text-faint)', letterSpacing: '0.04em' }}>
                        {s.count.toLocaleString()} votes
                      </p>
                    </div>
                  ))}
                  <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                    <p
                      style={{
                        fontFamily: 'var(--font-display), "Bebas Neue", sans-serif',
                        fontSize: '2rem',
                        letterSpacing: '0.03em',
                        color: 'var(--text-secondary)',
                        lineHeight: 1,
                        marginBottom: '0.2rem',
                      }}
                    >
                      {issue.total_count.toLocaleString()}
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
                      Total Votes
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Politician Positions */}
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2.5rem 1.25rem' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
              marginBottom: '1.5rem',
              flexWrap: 'wrap',
            }}
          >
            <p className="section-label">Politician Positions</p>
            {positions.length > 0 && (
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                {supporting.length > 0 && (
                  <span
                    style={{
                      fontSize: '10px',
                      fontWeight: 700,
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      color: 'var(--status-positive)',
                    }}
                  >
                    {supporting.length} Support
                  </span>
                )}
                {opposing.length > 0 && (
                  <span
                    style={{
                      fontSize: '10px',
                      fontWeight: 700,
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      color: 'var(--status-negative)',
                    }}
                  >
                    {opposing.length} Oppose
                  </span>
                )}
                {neutral.length > 0 && (
                  <span
                    style={{
                      fontSize: '10px',
                      fontWeight: 700,
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      color: 'var(--text-tertiary)',
                    }}
                  >
                    {neutral.length} Neutral
                  </span>
                )}
              </div>
            )}
          </div>

          {positions.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '5rem 1rem',
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
                No politician positions recorded
              </p>
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                gap: '1rem',
              }}
            >
              {positions.map((ip) => (
                <PoliticianPositionCard key={ip.id} ip={ip} />
              ))}
            </div>
          )}
        </div>

      </main>
      <Footer />
    </>
  )
}
