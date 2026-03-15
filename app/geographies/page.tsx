import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { getGeographies } from '@/lib/api'
import Link from 'next/link'

export const metadata = {
  title: 'Geography | get-right.church',
  description: 'Explore politicians by geographic region',
}

const LEVEL_COLORS: Record<string, string> = {
  federal: 'var(--accent-primary)',
  state: 'var(--status-warning)',
  local: 'var(--accent-light)',
}

export default async function GeographiesPage() {
  const geographies = await getGeographies()

  return (
    <>
      <Header />
      <style>{`
        .geo-card {
          background: var(--bg-secondary);
          padding: 1.5rem;
          transition: background 0.15s ease;
          cursor: pointer;
          height: 100%;
          display: block;
          text-decoration: none;
        }
        .geo-card:hover { background: var(--bg-tertiary); }
      `}</style>
      <main style={{ minHeight: '100vh' }}>

        {/* Page header */}
        <div
          style={{
            borderBottom: '1px solid var(--border)',
            background: 'var(--bg-secondary)',
            padding: '3rem 0 2.5rem',
          }}
        >
          <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.25rem' }}>
            <p className="section-label" style={{ marginBottom: '0.75rem' }}>Browse by Region</p>
            <h1
              style={{
                fontFamily: 'var(--font-display), "Bebas Neue", sans-serif',
                fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
                letterSpacing: '0.04em',
                color: 'var(--text-primary)',
                lineHeight: 1,
                marginBottom: '0.625rem',
              }}
            >
              Geography
            </h1>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)', letterSpacing: '0.02em' }}>
              Explore politicians by federal, state, and local regions.
            </p>
          </div>
        </div>

        {/* Grid */}
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2.5rem 1.25rem' }}>
          {geographies.length > 0 ? (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                gap: '1px',
                background: 'var(--border)',
              }}
            >
              {geographies.map((geo) => {
                const levelColor = LEVEL_COLORS[geo.type] ?? 'var(--text-tertiary)'
                const levelLabel = geo.type.charAt(0).toUpperCase() + geo.type.slice(1)
                return (
                  <Link
                    key={geo.id}
                    href={`/geographies/${geo.slug}`}
                    className="geo-card"
                    style={{ borderLeft: `2px solid ${levelColor}` }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.875rem' }}>
                      <span
                        style={{
                          fontSize: '10px',
                          fontWeight: 700,
                          letterSpacing: '0.12em',
                          textTransform: 'uppercase',
                          color: levelColor,
                        }}
                      >
                        {levelLabel}
                      </span>
                      <span style={{ fontSize: '10px', color: 'var(--text-tertiary)', letterSpacing: '0.06em', fontWeight: 700 }}>
                        →
                      </span>
                    </div>
                    <h3
                      style={{
                        fontFamily: 'var(--font-display), "Bebas Neue", sans-serif',
                        fontSize: '1.75rem',
                        letterSpacing: '0.04em',
                        color: 'var(--text-primary)',
                        lineHeight: 1,
                        marginBottom: '0.5rem',
                      }}
                    >
                      {geo.name.toUpperCase()}
                    </h3>
                    <p style={{ fontSize: '10px', color: 'var(--text-tertiary)', letterSpacing: '0.04em' }}>
                      Browse politicians →
                    </p>
                  </Link>
                )
              })}
            </div>
          ) : (
            <div
              style={{
                textAlign: 'center',
                padding: '5rem 1rem',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border)',
              }}
            >
              <p style={{ fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-tertiary)' }}>
                No regions available
              </p>
            </div>
          )}
        </div>

      </main>
      <Footer />
    </>
  )
}
