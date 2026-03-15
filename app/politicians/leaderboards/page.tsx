import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { getScoreLeaderboard } from '@/lib/api'
import type { ScoreLeaderboardEntry } from '@/lib/api-types'
import Link from 'next/link'

export const metadata = {
  title: 'Leaderboards | get-right.church',
  description: 'Score rankings for all tracked politicians',
}

const SCORE_CONFIGS: {
  key: string
  title: string
  label: string
  description: string
  accent: string
  entries: ScoreLeaderboardEntry[]
}[] = [] // populated at runtime — see below

function partyStyle(party: string | null): React.CSSProperties {
  if (party === 'Democrat') {
    return {
      fontWeight: 700,
      letterSpacing: '0.06em',
      color: '#60A5FA',
      background: 'rgba(96, 165, 250, 0.08)',
      border: '1px solid rgba(96, 165, 250, 0.3)',
      borderRadius: '2px',
      padding: '0.1rem 0.35rem',
    }
  }
  if (party === 'Republican') {
    return {
      fontWeight: 700,
      letterSpacing: '0.06em',
      color: '#F87171',
      background: 'rgba(248, 113, 113, 0.08)',
      border: '1px solid rgba(248, 113, 113, 0.3)',
      borderRadius: '2px',
      padding: '0.1rem 0.35rem',
    }
  }
  return {
    fontWeight: 700,
    letterSpacing: '0.06em',
    color: 'var(--text-tertiary)',
    background: 'rgba(255, 255, 255, 0.04)',
    border: '1px solid var(--border)',
    borderRadius: '2px',
    padding: '0.1rem 0.35rem',
  }
}

function partyLetter(party: string | null): string {
  if (party === 'Democrat') return 'D'
  if (party === 'Republican') return 'R'
  return 'I'
}

interface LeaderboardCardProps {
  title: string
  label: string
  description: string
  accent: string
  entries: ScoreLeaderboardEntry[]
}

function LeaderboardCard({ title, label, description, accent, entries }: LeaderboardCardProps) {
  return (
    <div style={{ background: 'var(--bg-secondary)', padding: '1.5rem' }}>
      <p
        style={{
          fontSize: '10px',
          fontWeight: 700,
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          color: accent,
          marginBottom: '0.25rem',
        }}
      >
        {title}
      </p>
      <p
        style={{
          fontSize: 'var(--text-xs)',
          color: 'var(--text-tertiary)',
          marginBottom: '1.25rem',
        }}
      >
        {description}
      </p>

      {entries.length === 0 ? (
        <p
          style={{
            fontSize: 'var(--text-xs)',
            fontWeight: 700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'var(--text-tertiary)',
          }}
        >
          No data available
        </p>
      ) : (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1px',
            background: 'var(--border)',
          }}
        >
          {entries.map((entry, i) => (
            <Link
              key={entry.id}
              href={`/politicians/${entry.slug}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                background: 'var(--bg-primary)',
                padding: '0.75rem 1rem',
                textDecoration: 'none',
                transition: 'background 0.1s',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-display), "Bebas Neue", sans-serif',
                  fontSize: '1.25rem',
                  color: 'var(--text-faint)',
                  width: '28px',
                  flexShrink: 0,
                }}
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p
                  style={{
                    fontSize: 'var(--text-sm)',
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {entry.name}
                </p>
                <div
                  style={{
                    display: 'flex',
                    gap: '0.5rem',
                    marginTop: '0.2rem',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                  }}
                >
                  {entry.party && (
                    <span style={{ fontSize: '10px', ...partyStyle(entry.party) }}>
                      {partyLetter(entry.party)}
                    </span>
                  )}
                  {entry.state_abbrev && (
                    <span style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>
                      {entry.state_abbrev}
                    </span>
                  )}
                  {entry.chamber && (
                    <span
                      style={{
                        fontSize: '10px',
                        color: 'var(--text-tertiary)',
                        textTransform: 'capitalize',
                      }}
                    >
                      {entry.chamber}
                    </span>
                  )}
                </div>
              </div>
              <span
                style={{
                  fontFamily: 'var(--font-display), "Bebas Neue", sans-serif',
                  fontSize: '1.5rem',
                  color: accent,
                  letterSpacing: '0.03em',
                  flexShrink: 0,
                }}
              >
                {entry.score_value.toFixed(0)}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default async function LeaderboardsPage() {
  const [
    partyLineTop,
    bipartisanTop,
    independenceTop,
    controversyTop,
    consistencyTop,
    donorInfluenceTop,
  ] = await Promise.all([
    getScoreLeaderboard('party_line_score', 'desc', 10),
    getScoreLeaderboard('bipartisan_score', 'desc', 10),
    getScoreLeaderboard('independence_score', 'desc', 10),
    getScoreLeaderboard('controversy_score', 'desc', 10),
    getScoreLeaderboard('consistency_score', 'desc', 10),
    getScoreLeaderboard('donor_influence_score', 'desc', 10),
  ])

  const boards = [
    {
      key: 'party_line',
      title: 'Party Line Score',
      label: 'Caucus Loyalty',
      description: 'How often politicians vote with their party caucus',
      accent: '#F87171',
      entries: partyLineTop,
    },
    {
      key: 'bipartisan',
      title: 'Bipartisan Score',
      label: 'Cross-Aisle Votes',
      description: 'Frequency of voting against party on non-bipartisan bills',
      accent: '#60A5FA',
      entries: bipartisanTop,
    },
    {
      key: 'independence',
      title: 'Independence Score',
      label: 'Party Deviation',
      description: 'Composite independence from party position',
      accent: 'var(--accent-primary)',
      entries: independenceTop,
    },
    {
      key: 'controversy',
      title: 'Controversy Score',
      label: 'Public Controversy',
      description: 'How polarizing this politician is in community opinion',
      accent: '#F59E0B',
      entries: controversyTop,
    },
    {
      key: 'consistency',
      title: 'Consistency Score',
      label: 'Position Consistency',
      description: 'How closely stated positions match voting record',
      accent: '#34D399',
      entries: consistencyTop,
    },
    {
      key: 'donor_influence',
      title: 'Donor Influence Score',
      label: 'Donor Exposure',
      description: 'Relative level of PAC and corporate donor influence',
      accent: '#A78BFA',
      entries: donorInfluenceTop,
    },
  ]

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
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                marginBottom: '0.75rem',
              }}
            >
              <Link
                href="/politicians"
                style={{
                  fontSize: 'var(--text-xs)',
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: 'var(--text-tertiary)',
                  textDecoration: 'none',
                }}
              >
                ← Politicians
              </Link>
            </div>
            <p className="section-label" style={{ marginBottom: '0.75rem' }}>Intelligence</p>
            <h1
              style={{
                fontFamily: 'var(--font-display), "Bebas Neue", sans-serif',
                fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
                letterSpacing: '0.04em',
                color: 'var(--text-primary)',
                lineHeight: 1,
              }}
            >
              Leaderboards
            </h1>
          </div>
        </div>

        {/* Leaderboard grid */}
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            padding: '2.5rem 1.25rem',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
              gap: '1px',
              background: 'var(--border)',
            }}
          >
            {boards.map((board) => (
              <LeaderboardCard
                key={board.key}
                title={board.title}
                label={board.label}
                description={board.description}
                accent={board.accent}
                entries={board.entries}
              />
            ))}
          </div>
        </div>

      </main>
      <Footer />
    </>
  )
}
