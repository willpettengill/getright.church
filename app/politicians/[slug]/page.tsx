import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { getPolitician, getPosts, getComments, getVotes, getPoliticianIssuePositions } from '@/lib/api'
import { PoliticianTabs } from '@/components/politician-tabs'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export const revalidate = 3600

export async function generateMetadata(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params
  try {
    const politician = await getPolitician(params.slug)
    return {
      title: `${politician.name} | get-right.church`,
      description: politician.bio || `View ${politician.name}'s profile and engagement metrics`,
    }
  } catch {
    return { title: 'Not Found' }
  }
}

export default async function PoliticianPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params
  let politician
  try {
    politician = await getPolitician(params.slug)
  } catch {
    notFound()
  }

  const [posts, comments, votes, issuePositions] = await Promise.all([
    getPosts(politician.geography_id ?? undefined, politician.id, 10),
    getComments(politician.id, 15),
    getVotes(politician.id, 10),
    getPoliticianIssuePositions(politician.id),
  ])

  const isEndorsed = politician.endorsement_status === 'endorsed'
  const isAntiEndorsed = politician.endorsement_status === 'anti-endorsed'

  const endorsementConfig = isEndorsed
    ? {
        label: '✓ ENDORSED',
        color: 'var(--status-positive)',
        bg: 'rgba(74, 222, 128, 0.06)',
        border: 'rgba(74, 222, 128, 0.3)',
        glow: 'rgba(74, 222, 128, 0.15)',
        portraitBorder: 'rgba(74, 222, 128, 0.6)',
        portraitGlow: '0 0 30px rgba(74, 222, 128, 0.2), 0 0 80px rgba(74, 222, 128, 0.07)',
      }
    : isAntiEndorsed
      ? {
          label: '✗ OPPOSED',
          color: 'var(--status-negative)',
          bg: 'rgba(248, 113, 113, 0.06)',
          border: 'rgba(248, 113, 113, 0.3)',
          glow: 'rgba(248, 113, 113, 0.15)',
          portraitBorder: 'rgba(248, 113, 113, 0.6)',
          portraitGlow: '0 0 30px rgba(248, 113, 113, 0.2), 0 0 80px rgba(248, 113, 113, 0.07)',
        }
      : {
          label: '○ WATCHING',
          color: 'var(--text-tertiary)',
          bg: 'transparent',
          border: 'var(--neutral-muted)',
          glow: 'transparent',
          portraitBorder: 'var(--neutral-mid)',
          portraitGlow: 'none',
        }

  const epsteinVal = politician.epstein_score
  const epsteinColor =
    epsteinVal === null
      ? 'var(--text-tertiary)'
      : epsteinVal < 25
        ? 'var(--status-positive)'
        : epsteinVal <= 60
          ? 'var(--status-warning)'
          : 'var(--status-negative)'

  const sentimentVal = politician.aggregate_sentiment ?? 0
  const sentimentColor =
    sentimentVal > 0.3
      ? 'var(--status-positive)'
      : sentimentVal < -0.3
        ? 'var(--status-negative)'
        : 'var(--text-secondary)'

  const initials = politician.name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <>
      <Header />
      <main style={{ minHeight: '100vh' }}>

        <style>{`
          .pol-breadcrumb { font-size: var(--text-xs); font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--text-tertiary); transition: color 0.15s ease; display: inline-flex; align-items: center; gap: 0.375rem; }
          .pol-breadcrumb:hover { color: var(--accent-primary); }
        `}</style>
        {/* ── Hero banner ─────────────────────────────────── */}
        <div
          style={{
            background: 'linear-gradient(180deg, var(--bg-secondary) 0%, var(--bg-primary) 100%)',
            borderBottom: '1px solid var(--border)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Background glow from endorsement */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: '50%',
              height: '100%',
              background: `radial-gradient(ellipse at top right, ${endorsementConfig.glow} 0%, transparent 60%)`,
              pointerEvents: 'none',
            }}
          />

          <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.25rem' }}>
            {/* Breadcrumb */}
            <div style={{ paddingTop: '1.5rem', paddingBottom: '2rem' }}>
              <Link href="/politicians" className="pol-breadcrumb">
                ← Politicians
              </Link>
            </div>

            {/* Hero grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'clamp(200px, 22vw, 280px) 1fr',
                gap: '3rem',
                paddingBottom: '3rem',
                alignItems: 'start',
              }}
            >
              {/* Portrait */}
              <div>
                <div
                  style={{
                    border: `2px solid ${endorsementConfig.portraitBorder}`,
                    borderRadius: '2px',
                    overflow: 'hidden',
                    aspectRatio: '3/4',
                    background: 'var(--bg-tertiary)',
                    boxShadow: endorsementConfig.portraitGlow,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {politician.portrait_url ? (
                    <img
                      src={politician.portrait_url}
                      alt={politician.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }}
                    />
                  ) : (
                    <span
                      style={{
                        fontFamily: 'var(--font-display), "Bebas Neue", sans-serif',
                        fontSize: '4rem',
                        color: 'var(--text-faint)',
                        letterSpacing: '0.05em',
                      }}
                    >
                      {initials}
                    </span>
                  )}
                </div>
              </div>

              {/* Info */}
              <div style={{ position: 'relative', zIndex: 1 }}>
                {/* Endorsement badge */}
                <div style={{ marginBottom: '1.25rem' }}>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      padding: '0.3rem 0.875rem',
                      background: endorsementConfig.bg,
                      border: `1px solid ${endorsementConfig.border}`,
                      borderRadius: '2px',
                      fontSize: 'var(--text-xs)',
                      fontWeight: 700,
                      letterSpacing: '0.15em',
                      textTransform: 'uppercase',
                      color: endorsementConfig.color,
                    }}
                  >
                    {endorsementConfig.label}
                  </span>
                </div>

                {/* Name */}
                <h1
                  style={{
                    fontFamily: 'var(--font-display), "Bebas Neue", sans-serif',
                    fontSize: 'clamp(3rem, 6vw, 5.5rem)',
                    letterSpacing: '0.04em',
                    lineHeight: 0.95,
                    color: 'var(--text-primary)',
                    marginBottom: '0.75rem',
                  }}
                >
                  {politician.name}
                </h1>

                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', letterSpacing: '0.04em', marginBottom: '1.25rem' }}>
                  {politician.title}
                </p>

                {/* Tags */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '2rem' }}>
                  {politician.party && <span className="tag">{politician.party}</span>}
                  {politician.geography_level && (
                    <span className="tag">{politician.geography_level} level</span>
                  )}
                  {politician.office_held && <span className="tag">{politician.office_held}</span>}
                  {politician.years_in_office != null && (
                    <span className="tag">{politician.years_in_office} yrs in office</span>
                  )}
                </div>

                {/* Score grid */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: '0',
                    background: 'var(--border)',
                    border: '1px solid var(--border)',
                    borderRadius: '2px',
                  }}
                >
                  {[
                    {
                      label: 'Epstein Score',
                      value: epsteinVal != null ? epsteinVal.toFixed(0) : '—',
                      sub: 'higher is worse',
                      color: epsteinColor,
                    },
                    {
                      label: 'Sentiment',
                      value: politician.aggregate_sentiment != null
                        ? (politician.aggregate_sentiment > 0 ? '+' : '') + politician.aggregate_sentiment.toFixed(2)
                        : '—',
                      sub: 'community signal',
                      color: sentimentColor,
                    },
                    {
                      label: 'Blunch',
                      value: politician.blunch === null ? '—' : politician.blunch ? 'YES' : 'NO',
                      sub: politician.blunch ? 'community-aligned' : 'not flagged',
                      color: politician.blunch ? 'var(--status-positive)' : (politician.blunch === false ? 'var(--status-negative)' : 'var(--text-tertiary)'),
                    },
                    {
                      label: 'Squid',
                      value: politician.is_squid === null ? '—' : politician.is_squid ? 'YES' : 'NO',
                      sub: politician.is_squid ? 'flagged squid' : 'not a squid',
                      color: politician.is_squid ? 'var(--status-negative)' : (politician.is_squid === false ? 'var(--status-positive)' : 'var(--text-tertiary)'),
                    },
                  ].map((item, i) => (
                    <div
                      key={item.label}
                      style={{
                        padding: '1rem',
                        background: 'var(--bg-secondary)',
                        borderLeft: i > 0 ? '1px solid var(--border)' : 'none',
                      }}
                    >
                      <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: '0.5rem' }}>
                        {item.label}
                      </p>
                      <p
                        style={{
                          fontFamily: 'var(--font-display), "Bebas Neue", sans-serif',
                          fontSize: '2rem',
                          letterSpacing: '0.03em',
                          lineHeight: 1,
                          color: item.color,
                          marginBottom: '0.3rem',
                        }}
                      >
                        {item.value}
                      </p>
                      <p style={{ fontSize: '10px', color: 'var(--text-tertiary)', letterSpacing: '0.04em' }}>
                        {item.sub}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Bio + Tabs ─────────────────────────────────────── */}
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2.5rem 1.25rem' }}>

          {/* Bio */}
          {politician.bio && (
            <div
              style={{
                borderLeft: '2px solid var(--accent-primary)',
                paddingLeft: '1.25rem',
                marginBottom: '2.5rem',
              }}
            >
              <p className="section-label" style={{ marginBottom: '0.75rem' }}>Background</p>
              <p
                style={{
                  fontSize: 'var(--text-base)',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.75,
                  letterSpacing: '0.02em',
                  maxWidth: '780px',
                }}
              >
                {politician.bio}
              </p>
            </div>
          )}

          {/* Tabs */}
          <PoliticianTabs
            posts={posts}
            votes={votes}
            comments={comments}
            politicianId={politician.id}
            issuePositions={issuePositions}
          />
        </div>

      </main>
      <Footer />
    </>
  )
}
