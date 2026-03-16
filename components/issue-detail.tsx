'use client'

import { useState } from 'react'
import type { IssuePositionWithPolitician, IssueWithVotes } from '@/lib/types'
import type { BillResponse } from '@/lib/api-types'
import { PastorBlurb } from '@/components/pastor-blurb'

interface IssueDetailProps {
  issue: IssueWithVotes
  positions: IssuePositionWithPolitician[]
  relatedBills: BillResponse[]
}

export function IssueDetail({ issue, positions, relatedBills }: IssueDetailProps) {
  const [activeTab, setActiveTab] = useState<'positions' | 'bills' | 'charts' | 'feed'>('positions')

  const total = issue.total_count || 1
  const supportPct = issue.total_count > 0 ? Math.round((issue.support_count / total) * 100) : 0
  const opposePct = issue.total_count > 0 ? Math.round((issue.oppose_count / total) * 100) : 0
  const neutralPct = issue.total_count > 0 ? 100 - supportPct - opposePct : 0

  const supporting = positions.filter((p) => p.position === 'support')
  const opposing = positions.filter((p) => p.position === 'oppose')
  const demSupport = supporting.filter((p) => p.politician.party === 'Democrat').length
  const repSupport = supporting.filter((p) => p.politician.party === 'Republican').length
  const demOpp = opposing.filter((p) => p.politician.party === 'Democrat').length
  const repOpp = opposing.filter((p) => p.politician.party === 'Republican').length
  const totalDem = demSupport + demOpp
  const totalRep = repSupport + repOpp

  const tabs = [
    { id: 'positions' as const, label: 'Positions', count: positions.length },
    { id: 'bills' as const, label: 'Bills', count: relatedBills.length },
    { id: 'charts' as const, label: 'Charts' },
    { id: 'feed' as const, label: 'Feed' },
  ]

  return (
    <div className="detail-main">
      {/* Pastor blurb */}
      {issue.pastor_blurb && (
        <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--border)' }}>
          <PastorBlurb blurb={issue.pastor_blurb} />
        </div>
      )}

      {/* Tab bar */}
      <div style={{
        display: 'flex', borderBottom: '1px solid var(--border)',
        background: 'var(--bg-secondary)', overflowX: 'auto',
      }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '0.75rem 1.25rem',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === tab.id ? '2px solid var(--accent-primary)' : '2px solid transparent',
              cursor: 'pointer',
              fontFamily: 'var(--font-mono), monospace',
              fontSize: '10px',
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: activeTab === tab.id ? 'var(--accent-primary)' : 'var(--text-tertiary)',
              whiteSpace: 'nowrap',
              transition: 'color 0.15s ease',
              marginBottom: '-1px',
            }}
          >
            {tab.label}
            {'count' in tab && tab.count !== undefined && (
              <span style={{
                marginLeft: '0.375rem',
                fontFamily: 'var(--font-display), "Bebas Neue", sans-serif',
                fontSize: '0.9rem',
                letterSpacing: '0.04em',
                color: activeTab === tab.id ? 'var(--accent-primary)' : 'var(--text-faint)',
              }}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1px' }}>

        {/* Positions Tab */}
        {activeTab === 'positions' && (
          positions.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', background: 'var(--bg-secondary)' }}>
              <p style={{ fontSize: '11px', color: 'var(--text-tertiary)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>No positions recorded</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '1px', background: 'var(--border)' }}>
              {positions.map((ip) => (
                <a
                  key={ip.id}
                  href={`/politicians/${ip.politician.slug}`}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '1rem',
                    background: 'var(--bg-secondary)', padding: '1rem 1.25rem',
                    textDecoration: 'none', borderLeft: '2px solid #a78bfa',
                    transition: 'background 0.1s ease',
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = 'var(--bg-tertiary)' }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = 'var(--bg-secondary)' }}
                >
                  {/* Portrait */}
                  <div style={{
                    width: '40px', height: '40px', borderRadius: '2px', overflow: 'hidden',
                    background: 'var(--bg-tertiary)', flexShrink: 0, border: '1px solid var(--border)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {ip.politician.portrait_url ? (
                      <img
                        src={ip.politician.portrait_url}
                        alt={ip.politician.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }}
                      />
                    ) : (
                      <span style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: 'var(--text-faint)' }}>
                        {ip.politician.name.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase()}
                      </span>
                    )}
                  </div>
                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{
                      fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--text-primary)',
                      marginBottom: '0.2rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>
                      {ip.politician.name}
                    </p>
                    {ip.politician.party && (
                      <p style={{
                        fontSize: '10px',
                        color: ip.politician.party === 'Democrat' ? '#3b82f6' : ip.politician.party === 'Republican' ? '#ef4444' : 'var(--text-tertiary)',
                        letterSpacing: '0.06em', fontWeight: 700,
                      }}>
                        {ip.politician.party === 'Democrat' ? 'D' : ip.politician.party === 'Republican' ? 'R' : ip.politician.party}
                      </p>
                    )}
                  </div>
                  {/* Stance */}
                  <span style={{
                    fontFamily: 'var(--font-display), "Bebas Neue", sans-serif', fontSize: '1.1rem', letterSpacing: '0.06em',
                    color: ip.position === 'support' ? 'var(--status-positive)' : ip.position === 'oppose' ? 'var(--status-negative)' : 'var(--text-secondary)',
                    flexShrink: 0,
                  }}>
                    {ip.position.toUpperCase()}
                  </span>
                </a>
              ))}
            </div>
          )
        )}

        {/* Bills Tab */}
        {activeTab === 'bills' && (
          relatedBills.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', background: 'var(--bg-secondary)' }}>
              <p style={{ fontSize: '11px', color: 'var(--text-tertiary)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>No related bills found</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '1px', background: 'var(--border)' }}>
              {relatedBills.map((bill) => (
                <a
                  key={bill.id}
                  href={bill.slug ? `/bills/${bill.slug}` : '#'}
                  style={{
                    display: 'block', background: 'var(--bg-secondary)', padding: '1rem 1.25rem',
                    textDecoration: 'none', borderLeft: '2px solid #60a5fa',
                    transition: 'background 0.1s ease',
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = 'var(--bg-tertiary)' }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = 'var(--bg-secondary)' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                    <div>
                      <p style={{
                        fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)',
                        marginBottom: '0.25rem', letterSpacing: '0.02em',
                      }}>
                        {bill.name}
                      </p>
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <span style={{
                          fontSize: '10px', color: '#60a5fa', letterSpacing: '0.06em', fontWeight: 700,
                          background: 'rgba(96,165,250,0.1)', border: '1px solid rgba(96,165,250,0.3)',
                          padding: '0.1rem 0.4rem', borderRadius: '2px',
                        }}>
                          {bill.bill_id}
                        </span>
                        {bill.chamber && (
                          <span style={{
                            fontSize: '10px', color: 'var(--text-tertiary)', letterSpacing: '0.04em',
                            background: 'var(--bg-tertiary)', border: '1px solid var(--border)',
                            padding: '0.1rem 0.4rem', borderRadius: '2px',
                          }}>
                            {bill.chamber}
                          </span>
                        )}
                        {bill.is_bipartisan && (
                          <span style={{
                            fontSize: '10px', color: 'var(--accent-primary)', fontWeight: 700, letterSpacing: '0.06em',
                            background: 'rgba(64,145,108,0.1)', border: '1px solid rgba(64,145,108,0.3)',
                            padding: '0.1rem 0.4rem', borderRadius: '2px',
                          }}>
                            BIPARTISAN
                          </span>
                        )}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      {bill.party_position_dem && (
                        <span style={{ fontSize: '10px', color: '#3b82f6', fontWeight: 700, display: 'block', letterSpacing: '0.06em' }}>
                          D: {bill.party_position_dem.toUpperCase()}
                        </span>
                      )}
                      {bill.party_position_rep && (
                        <span style={{ fontSize: '10px', color: '#ef4444', fontWeight: 700, display: 'block', letterSpacing: '0.06em' }}>
                          R: {bill.party_position_rep.toUpperCase()}
                        </span>
                      )}
                    </div>
                  </div>
                </a>
              ))}
            </div>
          )
        )}

        {/* Charts Tab */}
        {activeTab === 'charts' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
            {/* Community vote breakdown */}
            <div style={{ background: 'var(--bg-secondary)', padding: '1.25rem', borderLeft: '2px solid var(--accent-primary)' }}>
              <p style={{
                fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
                color: 'var(--text-tertiary)', marginBottom: '1rem',
              }}>
                Community Vote Breakdown
              </p>
              {issue.total_count === 0 ? (
                <p style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>No community votes yet</p>
              ) : (
                <div>
                  {[
                    { label: 'Support', pct: supportPct, color: 'var(--status-positive)', count: issue.support_count },
                    { label: 'Oppose', pct: opposePct, color: 'var(--status-negative)', count: issue.oppose_count },
                    { label: 'Neutral', pct: neutralPct, color: 'var(--text-tertiary)', count: issue.neutral_count },
                  ].map(({ label, pct, color, count }) => (
                    <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                      <span style={{
                        fontSize: '10px', color: 'var(--text-secondary)', letterSpacing: '0.04em',
                        width: '60px', flexShrink: 0,
                      }}>
                        {label}
                      </span>
                      <div style={{ flex: 1, height: '6px', background: 'var(--border)', borderRadius: '3px' }}>
                        <div style={{
                          height: '100%', width: `${pct}%`, background: color,
                          borderRadius: '3px', transition: 'width 0.4s ease',
                        }} />
                      </div>
                      <span style={{ fontSize: '10px', color, fontWeight: 700, width: '36px', textAlign: 'right' }}>{pct}%</span>
                      <span style={{ fontSize: '10px', color: 'var(--text-tertiary)', width: '40px' }}>{count}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Politician positions by party */}
            <div style={{ background: 'var(--bg-secondary)', padding: '1.25rem', borderLeft: '2px solid #a78bfa' }}>
              <p style={{
                fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
                color: 'var(--text-tertiary)', marginBottom: '1rem',
              }}>
                Politician Positions by Party
              </p>
              {positions.length === 0 ? (
                <p style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>No positions recorded</p>
              ) : (
                <div>
                  {[
                    { label: 'Democrat', support: demSupport, oppose: demOpp, total: totalDem, color: '#3b82f6' },
                    { label: 'Republican', support: repSupport, oppose: repOpp, total: totalRep, color: '#ef4444' },
                  ].filter((row) => row.total > 0).map((row) => (
                    <div key={row.label} style={{ marginBottom: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                        <span style={{ fontSize: '10px', color: row.color, fontWeight: 700, letterSpacing: '0.06em' }}>
                          {row.label.toUpperCase()}
                        </span>
                        <span style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>{row.total} politicians</span>
                      </div>
                      <div style={{
                        height: '8px', background: 'var(--border)', borderRadius: '2px',
                        overflow: 'hidden', display: 'flex',
                      }}>
                        <div style={{
                          height: '100%',
                          width: `${row.total > 0 ? (row.support / row.total) * 100 : 0}%`,
                          background: 'var(--status-positive)', borderRadius: '0',
                        }} />
                        <div style={{
                          height: '100%',
                          width: `${row.total > 0 ? (row.oppose / row.total) * 100 : 0}%`,
                          background: 'var(--status-negative)',
                        }} />
                      </div>
                      <div style={{ display: 'flex', gap: '1rem', marginTop: '0.3rem' }}>
                        <span style={{ fontSize: '10px', color: 'var(--status-positive)' }}>{row.support} support</span>
                        <span style={{ fontSize: '10px', color: 'var(--status-negative)' }}>{row.oppose} oppose</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Feed Tab */}
        {activeTab === 'feed' && (
          <div style={{
            padding: '3rem', textAlign: 'center', background: 'var(--bg-secondary)',
            borderLeft: '2px solid var(--text-tertiary)',
          }}>
            <p style={{
              fontSize: '11px', color: 'var(--text-tertiary)', letterSpacing: '0.1em', textTransform: 'uppercase',
            }}>
              Feed coming soon — posts from politicians with positions on this issue
            </p>
          </div>
        )}

      </div>
    </div>
  )
}
