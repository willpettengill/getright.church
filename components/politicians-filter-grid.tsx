'use client'

import { useState } from 'react'
import { PoliticianCard } from '@/components/politician-card'
import type { Politician } from '@/lib/types'

interface PoliticiansFilterGridProps {
  politicians: Politician[]
}

export function PoliticiansFilterGrid({ politicians }: PoliticiansFilterGridProps) {
  const [chamber, setChamber] = useState<'all' | 'senate' | 'house' | 'governor'>('all')
  const [party, setParty] = useState<'all' | 'Democrat' | 'Republican' | 'Independent'>('all')

  const filtered = politicians.filter((p) => {
    if (chamber !== 'all' && p.chamber !== chamber) return false
    if (party !== 'all' && p.party !== party) return false
    return true
  })

  return (
    <>
      {/* Filter bar */}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-tertiary)', alignSelf: 'center' }}>Chamber</span>
          {['all', 'senate', 'house', 'governor'].map((c) => (
            <button
              key={c}
              onClick={() => setChamber(c as 'all' | 'senate' | 'house' | 'governor')}
              style={{
                padding: '0.3rem 0.75rem',
                fontSize: '10px',
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'capitalize',
                background: chamber === c ? 'var(--accent-glow)' : 'var(--bg-secondary)',
                border: `1px solid ${chamber === c ? 'var(--accent-primary)' : 'var(--border)'}`,
                borderRadius: '2px',
                color: chamber === c ? 'var(--accent-primary)' : 'var(--text-tertiary)',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {c === 'all' ? 'All' : c.charAt(0).toUpperCase() + c.slice(1)}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-tertiary)', alignSelf: 'center' }}>Party</span>
          {[{id:'all',label:'All'},{id:'Democrat',label:'Dem'},{id:'Republican',label:'Rep'},{id:'Independent',label:'Ind'}].map((p) => (
            <button
              key={p.id}
              onClick={() => setParty(p.id as 'all' | 'Democrat' | 'Republican' | 'Independent')}
              style={{
                padding: '0.3rem 0.75rem',
                fontSize: '10px',
                fontWeight: 700,
                letterSpacing: '0.1em',
                background: party === p.id ? 'var(--accent-glow)' : 'var(--bg-secondary)',
                border: `1px solid ${party === p.id ? 'var(--accent-primary)' : 'var(--border)'}`,
                borderRadius: '2px',
                color: party === p.id ? 'var(--accent-primary)' : 'var(--text-tertiary)',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {p.label}
            </button>
          ))}
        </div>
        <span style={{ fontSize: '10px', color: 'var(--text-tertiary)', letterSpacing: '0.04em', marginLeft: 'auto' }}>
          {filtered.length} politicians
        </span>
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1px',
            background: 'var(--border)',
          }}
        >
          {filtered.map((politician) => (
            <div key={politician.id} style={{ background: 'var(--bg-primary)' }}>
              <PoliticianCard politician={politician} />
            </div>
          ))}
        </div>
      ) : (
        <div
          style={{
            textAlign: 'center',
            padding: '6rem 1rem',
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
              marginBottom: '1rem',
            }}
          >
            No politicians match the selected filters
          </p>
        </div>
      )}
    </>
  )
}
