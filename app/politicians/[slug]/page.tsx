import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { getPolitician, getPosts, getComments, getVotes, getPoliticianIssuePositions, getSimilarPoliticians, getPoliticianNetwork } from '@/lib/api'
import { ScoreRow } from '@/components/score-row'
import { PastorBlurb } from '@/components/pastor-blurb'
import { PoliticianDetail } from '@/components/politician-detail'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Politician } from '@/lib/types'

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
  let politician: Politician
  try {
    politician = await getPolitician(params.slug)
  } catch {
    notFound()
  }

  const [posts, comments, votes, issuePositions, similarPoliticians, network] = await Promise.all([
    getPosts(politician.geography_id ?? undefined, politician.id, 10),
    getComments(politician.id, 15),
    getVotes(politician.id, 10),
    getPoliticianIssuePositions(politician.id),
    getSimilarPoliticians(politician.id, 5),
    getPoliticianNetwork(politician.id),
  ])

  const isEndorsed = politician.endorsement_status === 'endorsed'
  const isAntiEndorsed = politician.endorsement_status === 'anti-endorsed'

  const endorsementConfig = isEndorsed
    ? {
        label: '✓ ENDORSED',
        color: 'var(--status-positive)',
        bg: 'rgba(74, 222, 128, 0.06)',
        border: 'rgba(74, 222, 128, 0.3)',
        portraitBorder: 'rgba(74, 222, 128, 0.6)',
        portraitGlow: '0 0 30px rgba(74, 222, 128, 0.2), 0 0 80px rgba(74, 222, 128, 0.07)',
      }
    : isAntiEndorsed
      ? {
          label: '✗ OPPOSED',
          color: 'var(--status-negative)',
          bg: 'rgba(248, 113, 113, 0.06)',
          border: 'rgba(248, 113, 113, 0.3)',
          portraitBorder: 'rgba(248, 113, 113, 0.6)',
          portraitGlow: '0 0 30px rgba(248, 113, 113, 0.2), 0 0 80px rgba(248, 113, 113, 0.07)',
        }
      : {
          label: '○ WATCHING',
          color: 'var(--text-tertiary)',
          bg: 'transparent',
          border: 'var(--neutral-muted)',
          portraitBorder: 'var(--neutral-mid)',
          portraitGlow: 'none' as string | undefined,
        }

  const initials = politician.name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const connectionLinks = [
    { label: 'Bills Voted', count: votes.length, tab: 'votes' },
    { label: 'Issue Positions', count: issuePositions.length, tab: 'issues' },
    { label: 'Similar Politicians', count: similarPoliticians.length, tab: 'similar' },
    { label: 'Donors & Network', count: Math.max(0, network.nodes.length - 1), tab: 'network' },
  ]

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
            <Link href="/politicians" style={{ fontFamily: 'var(--font-mono), monospace', fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-tertiary)', textDecoration: 'none' }}>
              ← Politicians
            </Link>
          </div>
        </div>

        <div className="detail-layout">
          {/* SIDEBAR */}
          <aside className="detail-sidebar" style={{ padding: '1.25rem' }}>
            {/* Portrait */}
            <div style={{ marginBottom: '1rem' }}>
              <div style={{
                border: `2px solid ${endorsementConfig.portraitBorder}`,
                borderRadius: '2px',
                overflow: 'hidden',
                aspectRatio: '3/4',
                background: 'var(--bg-tertiary)',
                boxShadow: endorsementConfig.portraitGlow ?? 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {politician.portrait_url ? (
                  <img src={politician.portrait_url} alt={politician.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }} />
                ) : (
                  <span style={{ fontFamily: 'var(--font-display), "Bebas Neue", sans-serif', fontSize: '3rem', color: 'var(--text-faint)', letterSpacing: '0.05em' }}>
                    {initials}
                  </span>
                )}
              </div>
            </div>

            {/* Name + endorsement badge */}
            <div style={{ marginBottom: '0.75rem' }}>
              <span style={{
                display: 'inline-flex', alignItems: 'center',
                padding: '0.2rem 0.6rem',
                background: endorsementConfig.bg,
                border: `1px solid ${endorsementConfig.border}`,
                borderRadius: '2px',
                fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
                color: endorsementConfig.color,
                marginBottom: '0.625rem',
              }}>
                {endorsementConfig.label}
              </span>
              <h1 style={{
                fontFamily: 'var(--font-display), "Bebas Neue", sans-serif',
                fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                letterSpacing: '0.04em', lineHeight: 1, color: 'var(--text-primary)',
                marginBottom: '0.375rem',
              }}>
                {politician.name}
              </h1>
              <p style={{ fontSize: '11px', color: 'var(--text-secondary)', letterSpacing: '0.03em', marginBottom: '0.5rem' }}>
                {politician.title}
              </p>
              <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
                {politician.party && (
                  <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
                    color: politician.party === 'Democrat' ? '#3b82f6' : politician.party === 'Republican' ? '#ef4444' : 'var(--text-tertiary)',
                    background: 'var(--bg-tertiary)', border: '1px solid var(--border)', padding: '0.1rem 0.4rem', borderRadius: '2px' }}>
                    {politician.party === 'Democrat' ? 'D' : politician.party === 'Republican' ? 'R' : politician.party}
                  </span>
                )}
                {politician.state_abbrev && (
                  <span style={{ fontSize: '10px', color: 'var(--text-tertiary)', letterSpacing: '0.04em',
                    background: 'var(--bg-tertiary)', border: '1px solid var(--border)', padding: '0.1rem 0.4rem', borderRadius: '2px' }}>
                    {politician.state_abbrev}
                  </span>
                )}
                {politician.chamber && (
                  <span style={{ fontSize: '10px', color: 'var(--text-tertiary)', letterSpacing: '0.04em',
                    background: 'var(--bg-tertiary)', border: '1px solid var(--border)', padding: '0.1rem 0.4rem', borderRadius: '2px' }}>
                    {politician.chamber}
                  </span>
                )}
              </div>
            </div>

            {/* Blunch / Squid flags */}
            {(politician.blunch || politician.is_squid) && (
              <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                {politician.blunch && (
                  <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
                    color: 'var(--status-positive)', background: 'rgba(74,222,128,0.1)',
                    border: '1px solid rgba(74,222,128,0.3)', padding: '0.2rem 0.5rem', borderRadius: '2px' }}>
                    BLUNCH
                  </span>
                )}
                {politician.is_squid && (
                  <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
                    color: 'var(--status-negative)', background: 'rgba(248,113,113,0.1)',
                    border: '1px solid rgba(248,113,113,0.3)', padding: '0.2rem 0.5rem', borderRadius: '2px' }}>
                    SQUID
                  </span>
                )}
              </div>
            )}

            {/* Bio (truncated) */}
            {politician.bio && (
              <p style={{
                fontSize: '11px', color: 'var(--text-tertiary)', lineHeight: 1.5,
                letterSpacing: '0.02em', marginBottom: '0.75rem',
                display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden',
              }}>
                {politician.bio}
              </p>
            )}

            {/* Scores */}
            <div style={{ borderTop: '1px solid var(--border)', margin: '1rem 0', paddingTop: '1rem' }}>
              <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: '0.75rem' }}>Scores</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <ScoreRow label="Epstein Score" value={politician.epstein_score}
                  colorFn={(v) => v > 50 ? 'var(--status-negative)' : 'var(--status-positive)'} />
                <ScoreRow label="Party Line" value={politician.party_line_score} />
                <ScoreRow label="Bipartisan" value={politician.bipartisan_score}
                  colorFn={(v) => v > 60 ? 'var(--status-positive)' : 'var(--text-primary)'} />
                <ScoreRow label="Independence" value={politician.independence_score} />
                <ScoreRow label="Consistency" value={politician.consistency_score}
                  colorFn={(v) => v > 70 ? 'var(--status-positive)' : 'var(--text-primary)'} />
                <ScoreRow label="District Fit" value={politician.district_alignment_score}
                  colorFn={(v) => v > 70 ? 'var(--status-positive)' : 'var(--text-primary)'} />
                <ScoreRow label="Donor Influence" value={politician.donor_influence_score}
                  colorFn={(v) => v > 50 ? 'var(--status-warning)' : 'var(--text-primary)'} />
                <ScoreRow label="Controversy" value={politician.controversy_score} />
                <ScoreRow
                  label="Sentiment"
                  value={politician.aggregate_sentiment !== null && politician.aggregate_sentiment !== undefined
                    ? Math.round((politician.aggregate_sentiment + 1) * 50)
                    : null}
                  colorFn={(v) => v > 50 ? 'var(--status-positive)' : 'var(--status-negative)'}
                  format={(v) => `${(v - 50) > 0 ? '+' : ''}${(v - 50).toFixed(0)}`}
                />
                <ScoreRow label="Attendance" value={null} />
                <ScoreRow label="Flip-Flop Rate" value={null} />
                <ScoreRow label="Corp. Capture" value={null} />
                <ScoreRow label="Bill Success" value={null} />
              </div>
            </div>

            {/* Connections */}
            <div style={{ borderTop: '1px solid var(--border)', margin: '1rem 0', paddingTop: '1rem' }}>
              <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: '0.75rem' }}>Connections</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {connectionLinks.map((link) => (
                  <div key={link.label} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '0.5rem 0',
                    borderBottom: '1px solid var(--border)',
                  }}>
                    <span style={{ fontSize: '11px', color: 'var(--text-secondary)', letterSpacing: '0.04em' }}>
                      {link.label}
                    </span>
                    <span style={{ fontFamily: 'var(--font-display), "Bebas Neue", sans-serif',
                      fontSize: '1.25rem', color: 'var(--text-primary)', letterSpacing: '0.03em' }}>
                      {link.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          {/* MAIN CONTENT */}
          <div className="detail-main">
            {/* Pastor Blurb */}
            {politician.pastor_blurb && (
              <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--border)' }}>
                <PastorBlurb blurb={politician.pastor_blurb} />
              </div>
            )}

            {/* Tabs + content */}
            <PoliticianDetail
              posts={posts}
              votes={votes}
              comments={comments}
              politicianId={politician.id}
              issuePositions={issuePositions}
              similarPoliticians={similarPoliticians}
              network={network}
              aggregateSentiment={politician.aggregate_sentiment}
            />
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
