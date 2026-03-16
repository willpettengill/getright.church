'use client'

import { useState } from 'react'
import type { BillResponse } from '@/lib/api-types'

const CATEGORY_COLORS: Record<string, string> = {
  economy: '#F59E0B',
  healthcare: '#34D399',
  climate: '#60A5FA',
  rights: '#A78BFA',
  defense: '#F87171',
  housing: '#FB923C',
  'foreign-policy': '#E879F9',
  education: '#38BDF8',
}

function getDemStyle(pos: string): React.CSSProperties {
  if (pos === 'yea') return { color: '#60A5FA', background: 'rgba(96, 165, 250, 0.1)', border: '1px solid rgba(96, 165, 250, 0.3)' }
  if (pos === 'nay') return { color: '#F87171', background: 'rgba(248, 113, 113, 0.1)', border: '1px solid rgba(248, 113, 113, 0.3)' }
  return { color: 'var(--text-tertiary)', background: 'var(--bg-tertiary)', border: '1px solid var(--border)' }
}

function getRepStyle(pos: string): React.CSSProperties {
  if (pos === 'yea') return { color: '#60A5FA', background: 'rgba(96, 165, 250, 0.1)', border: '1px solid rgba(96, 165, 250, 0.3)' }
  if (pos === 'nay') return { color: '#F87171', background: 'rgba(248, 113, 113, 0.1)', border: '1px solid rgba(248, 113, 113, 0.3)' }
  return { color: 'var(--text-tertiary)', background: 'var(--bg-tertiary)', border: '1px solid var(--border)' }
}

type Category = 'all' | 'economy' | 'healthcare' | 'climate' | 'rights' | 'defense' | 'housing' | 'foreign-policy' | 'education'

interface BillsListProps {
  bills: BillResponse[]
}

export function BillsList({ bills }: BillsListProps) {
  const [category, setCategory] = useState<Category>('all')

  const filtered = category === 'all'
    ? bills
    : bills.filter((b) => b.policy_category === category)

  return (
    <div>
      {/* Filter bar */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem', alignItems: 'center' }}>
        {(['all', 'economy', 'healthcare', 'climate', 'rights', 'defense', 'housing', 'foreign-policy', 'education'] as Category[]).map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            style={{
              padding: '0.3rem 0.75rem',
              fontSize: '10px',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'capitalize',
              background: category === cat ? (CATEGORY_COLORS[cat] ? `${CATEGORY_COLORS[cat]}20` : 'var(--accent-glow)') : 'var(--bg-secondary)',
              border: `1px solid ${category === cat ? (CATEGORY_COLORS[cat] ?? 'var(--accent-primary)') : 'var(--border)'}`,
              borderRadius: '2px',
              color: category === cat ? (CATEGORY_COLORS[cat] ?? 'var(--accent-primary)') : 'var(--text-tertiary)',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            {cat === 'all' ? 'All' : cat}
          </button>
        ))}
        <span style={{ marginLeft: 'auto', fontSize: '10px', color: 'var(--text-tertiary)', letterSpacing: '0.04em' }}>
          {filtered.length} bills
        </span>
      </div>

      {/* Bill cards grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(480px, 1fr))', gap: '1px', background: 'var(--border)' }}>
        {filtered.map((bill) => {
          const categoryColor = CATEGORY_COLORS[bill.policy_category] ?? 'var(--accent-primary)'
          return (
            <div
              key={bill.id}
              style={{
                background: 'var(--bg-secondary)',
                padding: '1.25rem',
                borderLeft: `3px solid ${categoryColor}`,
                transition: 'background 0.1s ease',
              }}
            >
              {/* Header row: bill_id + category + bipartisan */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-tertiary)', background: 'var(--bg-tertiary)', border: '1px solid var(--border)', padding: '0.2rem 0.5rem', borderRadius: '2px' }}>
                  {bill.bill_id}
                </span>
                <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: categoryColor }}>
                  {bill.policy_category}
                </span>
                <span style={{ fontSize: '10px', color: 'var(--text-tertiary)', background: 'var(--bg-tertiary)', border: '1px solid var(--border)', padding: '0.2rem 0.5rem', borderRadius: '2px', letterSpacing: '0.04em', textTransform: 'uppercase', fontWeight: 700 }}>
                  {bill.chamber}
                </span>
                {bill.is_bipartisan && (
                  <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--status-positive)', background: 'rgba(74, 222, 128, 0.06)', border: '1px solid rgba(74, 222, 128, 0.3)', padding: '0.2rem 0.5rem', borderRadius: '2px' }}>
                    Bipartisan
                  </span>
                )}
                {bill.congress && <span style={{ fontSize: '10px', color: 'var(--text-tertiary)', marginLeft: 'auto' }}>{bill.congress}th Congress</span>}
              </div>

              {/* Bill name */}
              <p style={{ fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.75rem', letterSpacing: '0.01em', lineHeight: 1.3 }}>
                {bill.name}
              </p>

              {/* Description */}
              {bill.description && (
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginBottom: '0.75rem', lineHeight: 1.6, letterSpacing: '0.02em' }}>
                  {bill.description}
                </p>
              )}

              {/* Party positions */}
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
                {bill.party_position_dem && (
                  <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', padding: '0.2rem 0.6rem', borderRadius: '2px', ...getDemStyle(bill.party_position_dem) }}>
                    DEM: {bill.party_position_dem.toUpperCase()}
                  </span>
                )}
                {bill.party_position_rep && (
                  <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', padding: '0.2rem 0.6rem', borderRadius: '2px', ...getRepStyle(bill.party_position_rep) }}>
                    REP: {bill.party_position_rep.toUpperCase()}
                  </span>
                )}
                {bill.vote_date && (
                  <span style={{ fontSize: '10px', color: 'var(--text-tertiary)', letterSpacing: '0.04em', marginLeft: 'auto' }}>
                    {bill.vote_date ? new Date(bill.vote_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : ''}
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <div style={{ padding: '3rem', textAlign: 'center' }}>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            No bills found for this category
          </p>
        </div>
      )}
    </div>
  )
}
