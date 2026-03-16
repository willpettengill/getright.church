import { getIssue, getIssuePositions, getBills } from '@/lib/api'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { ScoreRow } from '@/components/score-row'
import { IssueDetail } from '@/components/issue-detail'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getCategoryColor } from '@/lib/issue-utils'
import type { IssueWithVotes } from '@/lib/types'

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

export default async function IssueDetailPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params

  let issue: IssueWithVotes
  try {
    issue = await getIssue(params.slug)
  } catch {
    notFound()
  }

  const [positions, relatedBills] = await Promise.all([
    getIssuePositions(issue.id),
    getBills(issue.category, undefined, 10),
  ])

  const catColor = getCategoryColor(issue.category)

  // Derived score values
  const total = issue.total_count || 1
  const supportPct = issue.total_count > 0 ? Math.round((issue.support_count / total) * 100) : 0
  const opposePct = issue.total_count > 0 ? Math.round((issue.oppose_count / total) * 100) : 0

  const supporting = positions.filter((p) => p.position === 'support')
  const opposing = positions.filter((p) => p.position === 'oppose')
  const demSupport = supporting.filter((p) => p.politician.party === 'Democrat').length
  const repSupport = supporting.filter((p) => p.politician.party === 'Republican').length
  const demOpp = opposing.filter((p) => p.politician.party === 'Democrat').length
  const repOpp = opposing.filter((p) => p.politician.party === 'Republican').length
  const totalDem = demSupport + demOpp
  const totalRep = repSupport + repOpp
  const demSupportPct = totalDem > 0 ? Math.round((demSupport / totalDem) * 100) : null
  const repSupportPct = totalRep > 0 ? Math.round((repSupport / totalRep) * 100) : null
  const bipartisanSupport =
    demSupportPct !== null && repSupportPct !== null
      ? Math.round((demSupportPct + repSupportPct) / 2)
      : null
  const partisanDivide =
    demSupportPct !== null && repSupportPct !== null
      ? Math.abs(demSupportPct - repSupportPct)
      : null

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
              href="/issues"
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
              ← Issues
            </Link>
          </div>
        </div>

        <div className="detail-layout">
          {/* SIDEBAR */}
          <aside className="detail-sidebar" style={{ padding: '1.25rem' }}>
            {/* Category badge */}
            <div style={{ marginBottom: '0.75rem' }}>
              <span style={{
                fontSize: '10px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase',
                color: catColor, display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
              }}>
                <span style={{
                  width: '6px', height: '6px', borderRadius: '50%',
                  background: catColor, display: 'inline-block', flexShrink: 0,
                }} />
                {issue.category.toUpperCase()}
              </span>
            </div>

            {/* Title */}
            <h1 style={{
              fontFamily: 'var(--font-display), "Bebas Neue", sans-serif',
              fontSize: 'clamp(1.5rem, 2.5vw, 2rem)', letterSpacing: '0.04em', lineHeight: 1.05,
              color: 'var(--text-primary)', marginBottom: '0.625rem',
            }}>
              {issue.title}
            </h1>

            {/* Description (2-line truncated) */}
            {issue.description && (
              <p style={{
                fontSize: '11px', color: 'var(--text-tertiary)', lineHeight: 1.5,
                letterSpacing: '0.02em', marginBottom: '0.75rem',
                display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
              } as React.CSSProperties}>
                {issue.description}
              </p>
            )}

            {/* Signals */}
            <div style={{ borderTop: '1px solid var(--border)', margin: '1rem 0', paddingTop: '1rem' }}>
              <p style={{
                fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em',
                textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: '0.75rem',
              }}>
                Signals
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <ScoreRow
                  label="Community Support %"
                  value={issue.total_count > 0 ? supportPct : null}
                  colorFn={(v) => v > 60 ? 'var(--status-positive)' : v < 40 ? 'var(--status-negative)' : 'var(--text-primary)'}
                />
                <ScoreRow
                  label="Community Oppose %"
                  value={issue.total_count > 0 ? opposePct : null}
                  colorFn={(v) => v > 60 ? 'var(--status-negative)' : 'var(--text-primary)'}
                />
                <ScoreRow label="Bipartisan Support" value={bipartisanSupport} />
                <ScoreRow
                  label="Politicians Supporting"
                  value={supporting.length}
                  maxValue={Math.max(positions.length, 1)}
                  colorFn={(_v) => 'var(--status-positive)'}
                />
                <ScoreRow
                  label="Politicians Opposing"
                  value={opposing.length}
                  maxValue={Math.max(positions.length, 1)}
                  colorFn={(_v) => 'var(--status-negative)'}
                />
                <ScoreRow label="Legislative Activity" value={relatedBills.length} maxValue={20} />
                <ScoreRow
                  label="Partisan Divide"
                  value={partisanDivide}
                  colorFn={(v) => v > 40 ? 'var(--status-warning)' : 'var(--text-primary)'}
                />
                <ScoreRow label="Electoral Impact" value={null} />
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
                { label: 'Supporting', count: supporting.length, extra: undefined },
                { label: 'Opposing', count: opposing.length, extra: undefined },
                { label: 'Related Bills', count: relatedBills.length, extra: undefined },
                { label: 'Category', count: null, extra: issue.category },
              ].map(({ label, count, extra }) => (
                <div key={label} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '0.5rem 0', borderBottom: '1px solid var(--border)',
                }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-secondary)', letterSpacing: '0.04em' }}>
                    {label}
                  </span>
                  {count !== null ? (
                    <span style={{
                      fontFamily: 'var(--font-display), "Bebas Neue", sans-serif',
                      fontSize: '1.25rem', color: 'var(--text-primary)',
                    }}>
                      {count}
                    </span>
                  ) : (
                    <span style={{
                      fontSize: '10px', color: catColor, fontWeight: 700,
                      letterSpacing: '0.06em', textTransform: 'uppercase',
                    }}>
                      {extra}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </aside>

          {/* MAIN CONTENT */}
          <IssueDetail issue={issue} positions={positions} relatedBills={relatedBills} />
        </div>
      </main>
      <Footer />
    </>
  )
}
