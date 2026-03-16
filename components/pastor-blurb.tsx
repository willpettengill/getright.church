interface PastorBlurbProps {
  blurb: string | null
}

export function PastorBlurb({ blurb }: PastorBlurbProps) {
  if (!blurb) return null

  return (
    <div
      style={{
        background: '#0a1a12',
        borderLeft: '3px solid var(--accent-primary)',
        padding: '1rem 1.25rem',
        borderRadius: '0 2px 2px 0',
      }}
    >
      <p
        style={{
          fontFamily: 'var(--font-mono), monospace',
          fontSize: '10px',
          fontWeight: 700,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: 'var(--accent-primary)',
          marginBottom: '0.625rem',
        }}
      >
        ✝ The Pastor Says...
      </p>
      <div
        style={{
          fontSize: 'var(--text-sm)',
          color: 'var(--text-secondary)',
          lineHeight: 1.6,
          fontStyle: 'italic',
          letterSpacing: '0.02em',
        }}
        dangerouslySetInnerHTML={{ __html: blurb }}
      />
    </div>
  )
}
