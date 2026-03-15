'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Politician } from '@/lib/types'

interface PoliticianCardProps {
  politician: Politician
}

function endorsementStyles(status: string) {
  if (status === 'endorsed') {
    return {
      bar: 'var(--status-positive)',
      badge: {
        background: 'rgba(74, 222, 128, 0.06)',
        border: '1px solid rgba(74, 222, 128, 0.35)',
        color: 'var(--status-positive)',
      },
      label: '✓ Endorsed',
    }
  }
  if (status === 'anti-endorsed') {
    return {
      bar: 'var(--status-negative)',
      badge: {
        background: 'rgba(248, 113, 113, 0.06)',
        border: '1px solid rgba(248, 113, 113, 0.35)',
        color: 'var(--status-negative)',
      },
      label: '✗ Opposed',
    }
  }
  return {
    bar: 'var(--neutral-mid)',
    badge: {
      background: 'transparent',
      border: '1px solid var(--neutral-muted)',
      color: 'var(--text-tertiary)',
    },
    label: '○ Watching',
  }
}

function sentimentDisplay(val: number | null) {
  if (val === null) return { text: '—', color: 'var(--text-tertiary)' }
  if (val > 0.3) return { text: `+${val.toFixed(2)}`, color: 'var(--status-positive)' }
  if (val < -0.3) return { text: val.toFixed(2), color: 'var(--status-negative)' }
  return { text: val > 0 ? `+${val.toFixed(2)}` : val.toFixed(2), color: 'var(--text-secondary)' }
}

function epsteinDisplay(val: number | null) {
  if (val === null) return { text: '—', color: 'var(--text-tertiary)' }
  if (val < 25) return { text: val.toFixed(0), color: 'var(--status-positive)' }
  if (val <= 60) return { text: val.toFixed(0), color: 'var(--status-warning)' }
  return { text: val.toFixed(0), color: 'var(--status-negative)' }
}

export function PoliticianCard({ politician }: PoliticianCardProps) {
  const es = endorsementStyles(politician.endorsement_status)
  const sentiment = sentimentDisplay(politician.aggregate_sentiment)
  const epstein = epsteinDisplay(politician.epstein_score)
  const [hovered, setHovered] = useState(false)

  return (
    <Link href={`/politicians/${politician.slug}`} style={{ textDecoration: 'none', display: 'block' }}>
      <div
        style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border)',
          borderLeft: `2px solid ${es.bar}`,
          borderRadius: '2px',
          overflow: 'hidden',
          transition: 'border-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease',
          transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
          boxShadow: hovered ? '0 8px 24px rgba(0,0,0,0.4), 0 0 0 1px var(--neutral-mid)' : 'none',
          cursor: 'pointer',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Portrait */}
        {politician.portrait_url ? (
          <div style={{ position: 'relative', paddingBottom: '75%', background: 'var(--bg-tertiary)', flexShrink: 0 }}>
            <img
              src={politician.portrait_url}
              alt={politician.name}
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center top',
              }}
            />
            {/* Endorsement overlay tag */}
            <div
              style={{
                position: 'absolute',
                top: '0.625rem',
                right: '0.625rem',
                ...es.badge,
                padding: '0.2rem 0.5rem',
                borderRadius: '2px',
                fontSize: 'var(--text-xs)',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              {es.label}
            </div>
          </div>
        ) : (
          <div
            style={{
              height: '200px',
              background: 'var(--bg-tertiary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              position: 'relative',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-display), "Bebas Neue", sans-serif',
                fontSize: '3rem',
                color: 'var(--text-faint)',
                letterSpacing: '0.05em',
              }}
            >
              {politician.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()}
            </span>
            <div
              style={{
                position: 'absolute',
                top: '0.625rem',
                right: '0.625rem',
                ...es.badge,
                padding: '0.2rem 0.5rem',
                borderRadius: '2px',
                fontSize: 'var(--text-xs)',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              {es.label}
            </div>
          </div>
        )}

        {/* Body */}
        <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', flex: 1, gap: '0.625rem' }}>
          {/* Name + party */}
          <div>
            <h3
              style={{
                fontSize: 'var(--text-base)',
                fontWeight: 700,
                letterSpacing: '0.01em',
                color: 'var(--text-primary)',
                marginBottom: '0.25rem',
                fontFamily: 'var(--font-mono), monospace',
              }}
            >
              {politician.name}
            </h3>
            <p
              style={{
                fontSize: 'var(--text-xs)',
                color: 'var(--text-tertiary)',
                letterSpacing: '0.04em',
                lineHeight: 1.5,
              }}
            >
              {politician.title}
            </p>
          </div>

          {/* Tags */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
            {politician.party && <span className="tag">{politician.party}</span>}
            {politician.office_held && <span className="tag">{politician.office_held}</span>}
            {politician.years_in_office != null && (
              <span className="tag">{politician.years_in_office} YRS</span>
            )}
          </div>

          {/* Bio */}
          {politician.bio && (
            <p
              style={{
                fontSize: 'var(--text-xs)',
                color: 'var(--text-tertiary)',
                letterSpacing: '0.02em',
                lineHeight: 1.65,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {politician.bio}
            </p>
          )}

          {/* Scores */}
          <div
            style={{
              marginTop: 'auto',
              paddingTop: '0.75rem',
              borderTop: '1px solid var(--border)',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gap: '0.5rem',
            }}
          >
            {/* Sentiment */}
            <div>
              <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-faint)', marginBottom: '0.25rem' }}>
                Sentiment
              </p>
              <p style={{ fontFamily: 'var(--font-display), "Bebas Neue", sans-serif', fontSize: '1.625rem', letterSpacing: '0.03em', color: sentiment.color, lineHeight: 1 }}>
                {sentiment.text}
              </p>
            </div>

            {/* Epstein */}
            <div>
              <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-faint)', marginBottom: '0.25rem' }}>
                Epstein
              </p>
              <p style={{ fontFamily: 'var(--font-display), "Bebas Neue", sans-serif', fontSize: '1.625rem', letterSpacing: '0.03em', color: epstein.color, lineHeight: 1 }}>
                {epstein.text}
              </p>
            </div>

            {/* Blunch / Squid */}
            <div>
              <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-faint)', marginBottom: '0.375rem' }}>
                Flags
              </p>
              <div style={{ display: 'flex', gap: '0.25rem', flexDirection: 'column' }}>
                {politician.blunch ? (
                  <span
                    style={{
                      fontSize: '9px',
                      fontWeight: 700,
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                      color: 'var(--status-positive)',
                      background: 'rgba(74, 222, 128, 0.1)',
                      border: '1px solid rgba(74, 222, 128, 0.35)',
                      borderRadius: '2px',
                      padding: '0.1rem 0.3rem',
                      display: 'inline-block',
                    }}
                  >
                    BLUNCH ✓
                  </span>
                ) : null}
                {politician.is_squid ? (
                  <span
                    style={{
                      fontSize: '9px',
                      fontWeight: 700,
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                      color: 'var(--status-negative)',
                      background: 'rgba(248, 113, 113, 0.1)',
                      border: '1px solid rgba(248, 113, 113, 0.35)',
                      borderRadius: '2px',
                      padding: '0.1rem 0.3rem',
                      display: 'inline-block',
                    }}
                  >
                    SQUID
                  </span>
                ) : null}
                {!politician.blunch && !politician.is_squid ? (
                  <span style={{ fontSize: '10px', color: 'var(--text-faint)' }}>—</span>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
