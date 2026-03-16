'use client'

import { useState } from 'react'
import { DetailTabs } from '@/components/detail-tabs'
import { PastorBlurb } from '@/components/pastor-blurb'
import type { VoteWithPolitician, BillResponse } from '@/lib/api-types'
import type { Bill } from '@/lib/types'

interface BillDetailProps {
  bill: Bill
  votes: VoteWithPolitician[]
  relatedBills: BillResponse[]
  pastorBlurb: string | null
  yeaCount: number
  nayCount: number
  yeaPct: number
  nayPct: number
  demYeaPct: number | null
  repYeaPct: number | null
}

const voteColor = (result: string) =>
  result === 'yea' ? '#4ade80' : result === 'nay' ? '#f87171' : 'var(--text-tertiary)'

export function BillDetail({
  bill,
  votes,
  relatedBills,
  pastorBlurb,
  yeaCount,
  nayCount,
  yeaPct,
  nayPct,
  demYeaPct,
  repYeaPct,
}: BillDetailProps) {
  const [activeTab, setActiveTab] = useState('votes')
  const [voteFilter, setVoteFilter] = useState<'all' | 'yea' | 'nay'>('all')

  const tabs = [
    { id: 'votes', label: 'Votes', count: votes.length },
    { id: 'charts', label: 'Charts' },
    { id: 'related', label: 'Related', count: relatedBills.length },
  ]

  const filteredVotes = voteFilter === 'all' ? votes : votes.filter(v => v.vote_result === voteFilter)

  const otherBills = relatedBills.filter(b => b.id !== bill.id)

  return (
    <div>
      {/* Pastor Blurb */}
      {pastorBlurb && (
        <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--border)' }}>
          <PastorBlurb blurb={pastorBlurb} />
        </div>
      )}

      {/* Tabs */}
      <DetailTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Votes tab */}
      {activeTab === 'votes' && (
        <div>
          {/* Filter buttons */}
          <div style={{ display: 'flex', gap: '0.5rem', padding: '0.75rem 1.25rem', borderBottom: '1px solid var(--border)' }}>
            {(['all', 'yea', 'nay'] as const).map((f) => (
              <button key={f} onClick={() => setVoteFilter(f)} style={{
                padding: '0.2rem 0.75rem', fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em',
                textTransform: 'uppercase', borderRadius: '2px', cursor: 'pointer',
                background: voteFilter === f ? (f === 'yea' ? 'rgba(74,222,128,0.15)' : f === 'nay' ? 'rgba(248,113,113,0.15)' : 'var(--bg-tertiary)') : 'transparent',
                border: `1px solid ${voteFilter === f ? (f === 'yea' ? '#4ade80' : f === 'nay' ? '#f87171' : 'var(--accent-primary)') : 'var(--border)'}`,
                color: voteFilter === f ? (f === 'yea' ? '#4ade80' : f === 'nay' ? '#f87171' : 'var(--accent-primary)') : 'var(--text-tertiary)',
              }}>
                {f === 'all' ? `All (${votes.length})` : f === 'yea' ? `YEA (${yeaCount})` : `NAY (${nayCount})`}
              </button>
            ))}
          </div>

          {/* Vote cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--border)' }}>
            {filteredVotes.map((vote) => (
              <a key={vote.vote_id} href={`/politicians/${vote.politician_slug}`} style={{
                display: 'flex', alignItems: 'center', gap: '1rem',
                background: 'var(--bg-secondary)', padding: '0.875rem 1.25rem',
                textDecoration: 'none', borderLeft: `2px solid ${voteColor(vote.vote_result)}`,
                transition: 'background 0.1s ease',
              }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = 'var(--bg-tertiary)' }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = 'var(--bg-secondary)' }}
              >
                {/* Portrait */}
                <div style={{ width: '40px', height: '40px', borderRadius: '2px', overflow: 'hidden', background: 'var(--bg-tertiary)', flexShrink: 0, border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {vote.politician_portrait_url ? (
                    <img src={vote.politician_portrait_url} alt={vote.politician_name} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }} />
                  ) : (
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: 'var(--text-faint)' }}>
                      {vote.politician_name.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase()}
                    </span>
                  )}
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.2rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {vote.politician_name}
                  </p>
                  <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
                    {vote.politician_party && (
                      <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.06em',
                        color: vote.politician_party === 'Democrat' ? '#3b82f6' : vote.politician_party === 'Republican' ? '#ef4444' : 'var(--text-tertiary)',
                        background: 'var(--bg-tertiary)', border: '1px solid var(--border)', padding: '0.1rem 0.4rem', borderRadius: '2px' }}>
                        {vote.politician_party === 'Democrat' ? 'D' : vote.politician_party === 'Republican' ? 'R' : vote.politician_party}
                      </span>
                    )}
                    {vote.politician_state_abbrev && (
                      <span style={{ fontSize: '10px', color: 'var(--text-tertiary)', background: 'var(--bg-tertiary)', border: '1px solid var(--border)', padding: '0.1rem 0.4rem', borderRadius: '2px' }}>
                        {vote.politician_state_abbrev}
                      </span>
                    )}
                  </div>
                </div>

                {/* Vote result */}
                <span style={{
                  fontFamily: 'var(--font-display), "Bebas Neue", sans-serif', fontSize: '1.5rem',
                  letterSpacing: '0.06em', color: voteColor(vote.vote_result), flexShrink: 0,
                }}>
                  {vote.vote_result.toUpperCase()}
                </span>
              </a>
            ))}

            {filteredVotes.length === 0 && (
              <div style={{ padding: '3rem', textAlign: 'center', background: 'var(--bg-secondary)' }}>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  No votes found
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Charts tab */}
      {activeTab === 'charts' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--border)', padding: '1px' }}>
          {/* Party Vote Split */}
          <div style={{ background: 'var(--bg-secondary)', padding: '1.25rem', borderLeft: '2px solid var(--accent-primary)' }}>
            <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: '1rem' }}>Party Vote Split</p>
            {demYeaPct !== null || repYeaPct !== null ? (
              <div>
                {[
                  { label: 'Democrat YEA', pct: demYeaPct ?? 0, color: '#3b82f6' },
                  { label: 'Republican YEA', pct: repYeaPct ?? 0, color: '#ef4444' },
                ].map(({ label, pct, color }) => (
                  <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                    <span style={{ fontSize: '10px', color: 'var(--text-secondary)', width: '110px', flexShrink: 0 }}>{label}</span>
                    <div style={{ flex: 1, height: '6px', background: 'var(--border)', borderRadius: '3px' }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: '3px', transition: 'width 0.4s ease' }} />
                    </div>
                    <span style={{ fontSize: '10px', color, fontWeight: 700, width: '36px', textAlign: 'right' }}>{pct}%</span>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>Insufficient party data</p>
            )}
          </div>

          {/* Vote Totals */}
          <div style={{ background: 'var(--bg-secondary)', padding: '1.25rem', borderLeft: '2px solid #60a5fa' }}>
            <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: '1rem' }}>Vote Totals</p>
            {votes.length === 0 ? (
              <p style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>No vote data</p>
            ) : (
              <div>
                {[
                  { label: 'YEA', count: yeaCount, pct: yeaPct, color: '#4ade80' },
                  { label: 'NAY', count: nayCount, pct: nayPct, color: '#f87171' },
                ].map(({ label, count, pct, color }) => (
                  <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                    <span style={{ fontSize: '10px', color, fontWeight: 700, width: '40px', flexShrink: 0 }}>{label}</span>
                    <div style={{ flex: 1, height: '6px', background: 'var(--border)', borderRadius: '3px' }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: '3px', transition: 'width 0.4s ease' }} />
                    </div>
                    <span style={{ fontSize: '10px', color, fontWeight: 700, width: '36px', textAlign: 'right' }}>{pct}%</span>
                    <span style={{ fontSize: '10px', color: 'var(--text-tertiary)', width: '32px' }}>{count}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Related tab */}
      {activeTab === 'related' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--border)' }}>
          {otherBills.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', background: 'var(--bg-secondary)' }}>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                No related bills
              </p>
            </div>
          ) : (
            otherBills.map((b) => (
              <a key={b.id} href={b.slug ? `/bills/${b.slug}` : '#'} style={{
                display: 'block', padding: '1rem 1.25rem',
                background: 'var(--bg-secondary)', textDecoration: 'none',
                borderLeft: '2px solid #60a5fa', transition: 'background 0.1s ease',
              }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = 'var(--bg-tertiary)' }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = 'var(--bg-secondary)' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.375rem', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#60a5fa', background: 'rgba(96,165,250,0.1)', border: '1px solid rgba(96,165,250,0.3)', padding: '0.15rem 0.4rem', borderRadius: '2px' }}>
                    {b.bill_id}
                  </span>
                  {b.policy_category && (
                    <span style={{ fontSize: '10px', color: 'var(--text-tertiary)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                      {b.policy_category}
                    </span>
                  )}
                  {b.chamber && (
                    <span style={{ fontSize: '10px', color: 'var(--text-tertiary)', background: 'var(--bg-tertiary)', border: '1px solid var(--border)', padding: '0.15rem 0.4rem', borderRadius: '2px', letterSpacing: '0.04em' }}>
                      {b.chamber}
                    </span>
                  )}
                </div>
                <p style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.3, letterSpacing: '0.01em' }}>
                  {b.name}
                </p>
              </a>
            ))
          )}
        </div>
      )}
    </div>
  )
}
