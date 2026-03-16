'use client'

interface ScoreRowProps {
  label: string
  value: number | null
  format?: (v: number) => string
  colorFn?: (v: number) => string
  maxValue?: number
}

export function ScoreRow({
  label,
  value,
  format,
  colorFn,
  maxValue = 100,
}: ScoreRowProps) {
  const displayValue = value === null
    ? '—'
    : format
      ? format(value)
      : value.toFixed(0)

  const color = value === null
    ? 'var(--text-tertiary)'
    : colorFn
      ? colorFn(value)
      : 'var(--text-primary)'

  const barWidth = value !== null
    ? Math.min(Math.max((value / maxValue) * 100, 0), 100)
    : 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '0.5rem' }}>
        <span
          style={{
            fontFamily: 'var(--font-mono), monospace',
            fontSize: '10px',
            fontWeight: 700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'var(--text-secondary)',
          }}
        >
          {label}
        </span>
        <span
          style={{
            fontFamily: 'var(--font-display), "Bebas Neue", sans-serif',
            fontSize: '1.5rem',
            letterSpacing: '0.03em',
            lineHeight: 1,
            color,
          }}
        >
          {displayValue}
        </span>
      </div>
      <div
        style={{
          height: '2px',
          background: 'var(--border)',
          borderRadius: '1px',
          overflow: 'hidden',
        }}
      >
        {value !== null && (
          <div
            style={{
              height: '100%',
              width: `${barWidth}%`,
              background: color,
              borderRadius: '1px',
            }}
          />
        )}
      </div>
    </div>
  )
}
