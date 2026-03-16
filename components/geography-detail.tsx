'use client'

import { useState } from 'react'
import { DetailTabs } from '@/components/detail-tabs'
import { PastorBlurb } from '@/components/pastor-blurb'
import type { Politician, Post, Geography } from '@/lib/types'
import type { BillResponse } from '@/lib/api-types'

interface GeographyDetailProps {
  geography: Geography
  politicians: Politician[]
  posts: Post[]
  geographyBills: BillResponse[]
  similarGeos: Geography[]
  pastorBlurb: string | null
}

const PLATFORM_COLORS: Record<string, string> = {
  twitter: '#1DA1F2',
  instagram: '#E1306C',
  tiktok: '#69C9D0',
}

export function GeographyDetail({
  geography,
  politicians,
  posts,
  geographyBills,
  similarGeos,
  pastorBlurb,
}: GeographyDetailProps) {
  const [activeTab, setActiveTab] = useState('politicians')

  const tabs = [
    { id: 'politicians', label: 'Politicians', count: politicians.length },
    { id: 'issues', label: 'Issues' },
    { id: 'bills', label: 'Bills', count: geographyBills.length },
    { id: 'charts', label: 'Charts' },
    { id: 'feed', label: 'Feed', count: posts.length },
  ]

  const demPct = geography.last_result_dem_pct
  const repPct = geography.last_result_rep_pct

  return (
    <div className="detail-main">
      {/* Pastor Blurb */}
      {pastorBlurb && (
        <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--border)' }}>
          <PastorBlurb blurb={pastorBlurb} />
        </div>
      )}

      {/* Tabs */}
      <DetailTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Tab content */}
      {activeTab === 'politicians' && (
        <div style={{ padding: '1.25rem' }}>
          {politicians.length === 0 ? (
            <p style={{ fontSize: '11px', color: 'var(--text-tertiary)', textAlign: 'center', padding: '3rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              No politicians found
            </p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1px', background: 'var(--border)' }}>
              {politicians.map((p) => (
                <a
                  key={p.id}
                  href={`/politicians/${p.slug}`}
                  style={{ display: 'block', background: 'var(--bg-secondary)', padding: '1rem', textDecoration: 'none', transition: 'background 0.1s ease' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = 'var(--bg-tertiary)' }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = 'var(--bg-secondary)' }}
                >
                  <p style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>{p.name}</p>
                  <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
                    {p.party && (
                      <span style={{
                        fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
                        color: p.party === 'Democrat' ? '#3b82f6' : p.party === 'Republican' ? '#ef4444' : 'var(--text-tertiary)',
                        background: 'var(--bg-tertiary)', border: '1px solid var(--border)', padding: '0.1rem 0.4rem', borderRadius: '2px',
                      }}>
                        {p.party === 'Democrat' ? 'D' : p.party === 'Republican' ? 'R' : p.party}
                      </span>
                    )}
                    {p.chamber && (
                      <span style={{ fontSize: '10px', color: 'var(--text-tertiary)', background: 'var(--bg-tertiary)', border: '1px solid var(--border)', padding: '0.1rem 0.4rem', borderRadius: '2px' }}>
                        {p.chamber}
                      </span>
                    )}
                    {p.endorsement_status === 'endorsed' && (
                      <span style={{ fontSize: '10px', color: 'var(--status-positive)', fontWeight: 700, letterSpacing: '0.06em' }}>✓</span>
                    )}
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'issues' && (
        <div style={{ padding: '3rem', textAlign: 'center', background: 'var(--bg-secondary)', borderLeft: '2px solid #a78bfa' }}>
          <p style={{ fontSize: '11px', color: 'var(--text-tertiary)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Issue aggregation by state coming soon
          </p>
        </div>
      )}

      {activeTab === 'bills' && (
        <div>
          {geographyBills.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', background: 'var(--bg-secondary)' }}>
              <p style={{ fontSize: '11px', color: 'var(--text-tertiary)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                No bills found for this geography
              </p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '1px', background: 'var(--border)' }}>
              {geographyBills.map((bill) => (
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
                  <p style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>{bill.name}</p>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '10px', color: '#60a5fa', fontWeight: 700, background: 'rgba(96,165,250,0.1)', border: '1px solid rgba(96,165,250,0.3)', padding: '0.1rem 0.4rem', borderRadius: '2px' }}>
                      {bill.bill_id}
                    </span>
                    {bill.chamber && (
                      <span style={{ fontSize: '10px', color: 'var(--text-tertiary)', background: 'var(--bg-tertiary)', border: '1px solid var(--border)', padding: '0.1rem 0.4rem', borderRadius: '2px' }}>
                        {bill.chamber}
                      </span>
                    )}
                    {bill.is_bipartisan && (
                      <span style={{ fontSize: '10px', color: 'var(--accent-primary)', fontWeight: 700, background: 'rgba(64,145,108,0.1)', border: '1px solid rgba(64,145,108,0.3)', padding: '0.1rem 0.4rem', borderRadius: '2px' }}>
                        BIPARTISAN
                      </span>
                    )}
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'charts' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', background: 'var(--bg-primary)', padding: '1.25rem' }}>
          {/* Election Results */}
          <div style={{ background: 'var(--bg-secondary)', padding: '1.25rem', borderLeft: '2px solid var(--accent-primary)' }}>
            <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: '1rem' }}>
              Election Results
            </p>
            {demPct != null && repPct != null ? (
              <div>
                {[
                  { label: 'Democrat', pct: demPct, color: '#3b82f6' },
                  { label: 'Republican', pct: repPct, color: '#ef4444' },
                ].map(({ label, pct, color }) => (
                  <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                    <span style={{ fontSize: '10px', color: 'var(--text-secondary)', width: '80px', flexShrink: 0 }}>{label}</span>
                    <div style={{ flex: 1, height: '8px', background: 'var(--border)', borderRadius: '4px' }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: '4px', transition: 'width 0.4s ease' }} />
                    </div>
                    <span style={{ fontSize: '10px', color, fontWeight: 700, width: '40px', textAlign: 'right' }}>{pct.toFixed(1)}%</span>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>No election data available</p>
            )}
          </div>

          {/* Politician Endorsements */}
          <div style={{ background: 'var(--bg-secondary)', padding: '1.25rem', borderLeft: '2px solid var(--accent-primary)' }}>
            <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: '1rem' }}>
              Politician Endorsements
            </p>
            {politicians.length === 0 ? (
              <p style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>No politicians</p>
            ) : (
              <div>
                {[
                  { label: 'Endorsed', count: politicians.filter(p => p.endorsement_status === 'endorsed').length, color: 'var(--status-positive)' },
                  { label: 'Opposed', count: politicians.filter(p => p.endorsement_status === 'anti-endorsed').length, color: 'var(--status-negative)' },
                  { label: 'Watching', count: politicians.filter(p => p.endorsement_status !== 'endorsed' && p.endorsement_status !== 'anti-endorsed').length, color: 'var(--text-tertiary)' },
                ].map(({ label, count, color }) => (
                  <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '10px', color: 'var(--text-secondary)', width: '60px', flexShrink: 0 }}>{label}</span>
                    <div style={{ flex: 1, height: '4px', background: 'var(--border)', borderRadius: '2px' }}>
                      <div style={{ height: '100%', width: `${(count / politicians.length) * 100}%`, background: color, borderRadius: '2px' }} />
                    </div>
                    <span style={{ fontSize: '10px', color, fontWeight: 700, width: '24px', textAlign: 'right' }}>{count}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'feed' && (
        <div>
          {posts.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', background: 'var(--bg-secondary)' }}>
              <p style={{ fontSize: '11px', color: 'var(--text-tertiary)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                No posts for this geography
              </p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '1px', background: 'var(--border)' }}>
              {posts.map((post) => (
                <div
                  key={post.id}
                  style={{
                    background: 'var(--bg-secondary)', padding: '1rem 1.25rem',
                    borderLeft: '2px solid var(--text-tertiary)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    {post.source_platform && (
                      <span style={{
                        fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
                        color: PLATFORM_COLORS[post.source_platform.toLowerCase()] ?? 'var(--text-tertiary)',
                        background: 'var(--bg-tertiary)', border: '1px solid var(--border)', padding: '0.1rem 0.5rem', borderRadius: '2px',
                      }}>
                        {post.source_platform}
                      </span>
                    )}
                    {post.created_at && (
                      <span style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>
                        {new Date(post.created_at).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{post.content_text}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
