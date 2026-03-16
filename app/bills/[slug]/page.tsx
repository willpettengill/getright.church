import { getBill, getVotesForBill, getBills } from '@/lib/api'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { ScoreRow } from '@/components/score-row'
import { PastorBlurb } from '@/components/pastor-blurb'
import { BillDetail } from '@/components/bill-detail'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Bill } from '@/lib/types'

export const revalidate = 3600

export async function generateMetadata(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params
  try {
    const bill = await getBill(params.slug)
    return {
      title: `${bill.name} | get-right.church`,
      description: bill.description ?? `${bill.bill_id} - ${bill.name}`,
    }
  } catch {
    return { title: 'Not Found' }
  }
}

export default async function BillPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params
  let bill: Bill
  try {
    bill = await getBill(params.slug)
  } catch {
    notFound()
  }

  const [votes, relatedBills] = await Promise.all([
    getVotesForBill(bill.id),
    getBills(bill.policy_category ?? undefined, undefined, 10),
  ])

  // Derive vote statistics
  const yeaVotes = votes.filter(v => v.vote_result === 'yea')
  const nayVotes = votes.filter(v => v.vote_result === 'nay')
  const totalVotes = votes.length
  const yeaPct = totalVotes > 0 ? Math.round((yeaVotes.length / totalVotes) * 100) : 0
  const nayPct = totalVotes > 0 ? Math.round((nayVotes.length / totalVotes) * 100) : 0

  const demVotes = votes.filter(v => v.politician_party === 'Democrat')
  const repVotes = votes.filter(v => v.politician_party === 'Republican')
  const demYea = demVotes.filter(v => v.vote_result === 'yea').length
  const repYea = repVotes.filter(v => v.vote_result === 'yea').length
  const demYeaPct = demVotes.length > 0 ? Math.round((demYea / demVotes.length) * 100) : null
  const repYeaPct = repVotes.length > 0 ? Math.round((repYea / repVotes.length) * 100) : null

  const bipartisanScore = demVotes.length > 0 && repVotes.length > 0
    ? Math.round(((demYeaPct ?? 0) + (repYeaPct ?? 0)) / 2)
    : null
  const passageMargin = totalVotes > 0 ? yeaPct - nayPct : null
  const controversyIndex = totalVotes > 0 ? 100 - Math.abs(yeaPct - 50) * 2 : null

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

        {/* Breadcrumb */}
        <div style={{ borderBottom: '1px solid var(--border)', padding: '0.625rem 1.25rem' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
            <Link href="/bills" style={{ fontFamily: 'var(--font-mono), monospace', fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-tertiary)', textDecoration: 'none' }}>
              ← Bills
            </Link>
          </div>
        </div>

        <div className="detail-layout">
          <aside className="detail-sidebar" style={{ padding: '1.25rem' }}>
            {/* Bill ID visual anchor */}
            <div style={{
              background: 'var(--bg-tertiary)', border: '1px solid var(--border)',
              padding: '1.25rem', marginBottom: '1rem', textAlign: 'center', borderRadius: '2px',
            }}>
              <span style={{
                fontFamily: 'var(--font-display), "Bebas Neue", sans-serif',
                fontSize: '2rem', letterSpacing: '0.08em', color: '#60a5fa', lineHeight: 1,
              }}>
                {bill.bill_id}
              </span>
              {bill.chamber && (
                <p style={{ fontSize: '10px', color: 'var(--text-tertiary)', letterSpacing: '0.06em', textTransform: 'uppercase', marginTop: '0.375rem' }}>
                  {bill.chamber}
                </p>
              )}
            </div>

            {/* Bill name */}
            <h1 style={{
              fontFamily: 'var(--font-display), "Bebas Neue", sans-serif',
              fontSize: 'clamp(1.25rem, 2vw, 1.75rem)', letterSpacing: '0.04em', lineHeight: 1.1,
              color: 'var(--text-primary)', marginBottom: '0.625rem',
            }}>
              {bill.name}
            </h1>

            {/* Category + bipartisan badges */}
            <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
              {bill.policy_category && (
                <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
                  color: '#60a5fa', background: 'rgba(96,165,250,0.1)', border: '1px solid rgba(96,165,250,0.3)',
                  padding: '0.2rem 0.5rem', borderRadius: '2px' }}>
                  {bill.policy_category}
                </span>
              )}
              {bill.is_bipartisan && (
                <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
                  color: 'var(--accent-primary)', background: 'rgba(64,145,108,0.1)', border: '1px solid rgba(64,145,108,0.3)',
                  padding: '0.2rem 0.5rem', borderRadius: '2px' }}>
                  BIPARTISAN
                </span>
              )}
            </div>

            {/* Description truncated */}
            {bill.description && (
              <p style={{
                fontSize: '11px', color: 'var(--text-tertiary)', lineHeight: 1.5,
                letterSpacing: '0.02em', marginBottom: '0.75rem',
                display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden',
              } as React.CSSProperties}>
                {bill.description}
              </p>
            )}

            {/* Scores section */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', marginBottom: '1rem' }}>
              <ScoreRow label="Bipartisan Score" value={bipartisanScore}
                colorFn={(v) => v > 40 ? 'var(--status-positive)' : 'var(--text-primary)'} />
              <ScoreRow label="Passage Margin" value={passageMargin}
                colorFn={(v) => v > 0 ? 'var(--status-positive)' : 'var(--status-negative)'}
                format={(v) => `${v > 0 ? '+' : ''}${v}%`}
                maxValue={100} />
              <ScoreRow label="Dem Yea %" value={demYeaPct} colorFn={(_v) => '#3b82f6'} format={(v) => `${v}%`} />
              <ScoreRow label="Rep Yea %" value={repYeaPct} colorFn={(_v) => '#ef4444'} format={(v) => `${v}%`} />
              <ScoreRow label="Controversy Index" value={controversyIndex}
                colorFn={(v) => v > 70 ? 'var(--status-warning)' : 'var(--text-primary)'} />
            </div>

            {/* Inline stat rows */}
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '0.75rem', display: 'flex', flexDirection: 'column' }}>
              {/* Total Votes Cast */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--border)' }}>
                <span style={{ fontSize: '10px', color: 'var(--text-secondary)', letterSpacing: '0.04em', textTransform: 'uppercase', fontWeight: 700 }}>Total Votes</span>
                <span style={{ fontFamily: 'var(--font-display), "Bebas Neue", sans-serif', fontSize: '1.25rem', color: 'var(--text-primary)' }}>{totalVotes}</span>
              </div>

              {/* DEM Party Position */}
              {bill.party_position_dem && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--border)' }}>
                  <span style={{ fontSize: '10px', color: 'var(--text-secondary)', letterSpacing: '0.04em', textTransform: 'uppercase', fontWeight: 700 }}>DEM Position</span>
                  <span style={{ fontSize: '11px', color: bill.party_position_dem === 'yea' ? '#3b82f6' : '#ef4444', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                    {bill.party_position_dem}
                  </span>
                </div>
              )}

              {/* REP Party Position */}
              {bill.party_position_rep && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--border)' }}>
                  <span style={{ fontSize: '10px', color: 'var(--text-secondary)', letterSpacing: '0.04em', textTransform: 'uppercase', fontWeight: 700 }}>REP Position</span>
                  <span style={{ fontSize: '11px', color: bill.party_position_rep === 'yea' ? '#3b82f6' : '#ef4444', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                    {bill.party_position_rep}
                  </span>
                </div>
              )}

              {/* Congress */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--border)' }}>
                <span style={{ fontSize: '10px', color: 'var(--text-secondary)', letterSpacing: '0.04em', textTransform: 'uppercase', fontWeight: 700 }}>Congress</span>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: 'var(--text-primary)' }}>
                  {bill.congress ?? '—'}
                </span>
              </div>
            </div>

            {/* Connections section */}
            <div style={{ marginTop: '0.75rem' }}>
              {[
                { label: 'YEA Votes', count: yeaVotes.length },
                { label: 'NAY Votes', count: nayVotes.length },
                { label: 'Related Bills', count: relatedBills.length },
              ].map(({ label, count }) => (
                <div key={label} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '0.5rem 0', borderBottom: '1px solid var(--border)',
                }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-secondary)', letterSpacing: '0.04em' }}>{label}</span>
                  <span style={{ fontFamily: 'var(--font-display), "Bebas Neue", sans-serif', fontSize: '1.25rem',
                    color: label === 'YEA Votes' ? '#4ade80' : label === 'NAY Votes' ? '#f87171' : 'var(--text-primary)' }}>
                    {count}
                  </span>
                </div>
              ))}
            </div>
          </aside>

          <div className="detail-main">
            <BillDetail
              bill={bill}
              votes={votes}
              relatedBills={relatedBills}
              pastorBlurb={bill.pastor_blurb}
              yeaCount={yeaVotes.length}
              nayCount={nayVotes.length}
              yeaPct={yeaPct}
              nayPct={nayPct}
              demYeaPct={demYeaPct}
              repYeaPct={repYeaPct}
            />
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
