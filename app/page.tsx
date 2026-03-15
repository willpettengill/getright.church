import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { PulseFeed } from '@/components/pulse-feed'
import Link from 'next/link'
import { getPoliticiansCount, getIssues, getGeographies, getPostsCount } from '@/lib/api'

export default async function Home() {
  const [politiciansCount, issues, geographies, postsCount] = await Promise.all([
    getPoliticiansCount(),
    getIssues(),
    getGeographies(),
    getPostsCount(),
  ])

  return (
    <>
      <Header />
      <main style={{ minHeight: '100vh' }}>

        {/* ── Hero ──────────────────────────────────────────── */}
        <section
          style={{
            position: 'relative',
            overflow: 'hidden',
            borderBottom: '1px solid var(--border)',
            background: 'linear-gradient(160deg, #111 0%, var(--bg-primary) 50%)',
          }}
        >
          {/* Scanline overlay */}
          <div
            className="scanlines"
            style={{ position: 'absolute', inset: 0, zIndex: 0, opacity: 0.6 }}
          />
          {/* Grain overlay */}
          <div
            style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}
          >
            <div className="grain-overlay" style={{ position: 'absolute', inset: 0 }} />
          </div>
          {/* Primary radial glow — top-left */}
          <div
            style={{
              position: 'absolute',
              top: '-20%',
              left: '-10%',
              width: '90vw',
              height: '90vw',
              maxWidth: '900px',
              maxHeight: '900px',
              background: 'radial-gradient(circle, rgba(64,145,108,0.10) 0%, transparent 65%)',
              pointerEvents: 'none',
              zIndex: 0,
            }}
          />
          {/* Secondary subtler glow — bottom-right */}
          <div
            style={{
              position: 'absolute',
              bottom: '-30%',
              right: '-15%',
              width: '60vw',
              height: '60vw',
              maxWidth: '600px',
              maxHeight: '600px',
              background: 'radial-gradient(circle, rgba(64,145,108,0.05) 0%, transparent 65%)',
              pointerEvents: 'none',
              zIndex: 0,
            }}
          />

          <div
            style={{
              position: 'relative',
              zIndex: 1,
              maxWidth: '1280px',
              margin: '0 auto',
              padding: '7rem 1.25rem 6rem',
            }}
          >
            {/* Eyebrow label */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.625rem',
                marginBottom: '1rem',
              }}
            >
              <span
                className="animate-pulse-dot"
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: 'var(--accent-primary)',
                  boxShadow: '0 0 8px var(--accent-primary)',
                }}
              />
              <span
                style={{
                  fontSize: 'var(--text-xs)',
                  fontWeight: 700,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: 'var(--accent-primary)',
                }}
              >
                Political Intelligence Platform
              </span>
            </div>
            {/* Decorative radar sweep line */}
            <div
              style={{
                width: '120px',
                height: '1px',
                background: 'linear-gradient(90deg, var(--accent-primary), transparent)',
                marginBottom: '1.5rem',
                opacity: 0.6,
              }}
            />

            {/* Main headline */}
            <h1
              style={{
                fontFamily: 'var(--font-display), "Bebas Neue", Impact, sans-serif',
                fontSize: 'clamp(4rem, 12vw, 9rem)',
                letterSpacing: '0.04em',
                lineHeight: 0.92,
                color: 'var(--text-primary)',
                marginBottom: '0.5rem',
                maxWidth: '900px',
                animation: 'slide-up 0.5s var(--ease-out-expo) both',
              }}
            >
              GET
              <br />
              <span style={{ color: 'var(--accent-light)' }}>RIGHT</span>
            </h1>

            <p
              style={{
                fontSize: 'var(--text-base)',
                color: 'var(--text-secondary)',
                maxWidth: '520px',
                lineHeight: 1.7,
                marginBottom: '2.5rem',
                letterSpacing: '0.02em',
                animation: 'slide-up 0.5s var(--ease-out-expo) both',
                animationDelay: '0.1s',
              }}
            >
              Real-time political sentiment, voter accountability, and endorsement
              tracking for the movement. Know who&apos;s with us and who isn&apos;t.
            </p>

            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.75rem',
                animation: 'slide-up 0.5s var(--ease-out-expo) both',
                animationDelay: '0.2s',
              }}
            >
              <Link href="/politicians" className="btn-primary">
                Browse Politicians →
              </Link>
              <Link href="/geographies" className="btn-outline">
                Explore by Region
              </Link>
            </div>
          </div>
        </section>

        {/* ── Stat grid ─────────────────────────────────────── */}
        <section
          style={{
            borderBottom: '1px solid var(--border)',
            background: 'var(--bg-secondary)',
          }}
        >
          <div
            style={{
              maxWidth: '1280px',
              margin: '0 auto',
              padding: '0 1.25rem',
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
            }}
          >
            {[
              { value: politiciansCount,   label: 'Politicians Tracked', sub: 'and counting' },
              { value: issues.length,      label: 'Issues Tracked',      sub: 'active issues' },
              { value: geographies.length, label: 'Geographies',         sub: 'regions covered' },
              { value: postsCount,         label: 'Community Posts',     sub: 'from the movement' },
            ].map((stat, i) => (
              <div
                key={stat.label}
                style={{
                  padding: '2rem 1.5rem',
                  borderLeft: i > 0 ? '1px solid var(--border)' : 'none',
                  animation: 'fade-in 0.4s ease both',
                  animationDelay: '0.3s',
                }}
              >
                <p
                  style={{
                    fontFamily: 'var(--font-display), "Bebas Neue", sans-serif',
                    fontSize: 'clamp(2rem, 4vw, 3rem)',
                    letterSpacing: '0.03em',
                    color: 'var(--accent-light)',
                    lineHeight: 1,
                    marginBottom: '0.375rem',
                  }}
                >
                  {stat.value.toLocaleString()}
                </p>
                <p
                  style={{
                    fontSize: 'var(--text-xs)',
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: 'var(--text-secondary)',
                    marginBottom: '0.25rem',
                  }}
                >
                  {stat.label}
                </p>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', letterSpacing: '0.04em' }}>
                  {stat.sub}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── The Pulse ──────────────────────────────────────── */}
        <section
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            padding: '4rem 1.25rem',
          }}
        >
          {/* Section heading */}
          <div style={{ marginBottom: '2.5rem' }}>
            <p className="section-label" style={{ marginBottom: '0.625rem' }}>Live Feed</p>
            <h2
              style={{
                fontFamily: 'var(--font-display), "Bebas Neue", sans-serif',
                fontSize: 'clamp(2rem, 5vw, 3.25rem)',
                letterSpacing: '0.04em',
                color: 'var(--text-primary)',
                lineHeight: 1,
              }}
            >
              The Pulse
            </h2>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)', marginTop: '0.5rem', letterSpacing: '0.02em' }}>
              Real-time community sentiment from across the platform.
            </p>
          </div>

          <PulseFeed />
        </section>

        {/* ── CTA ────────────────────────────────────────────── */}
        <section
          style={{
            borderTop: '1px solid var(--border)',
            background: 'var(--bg-secondary)',
          }}
        >
          <div
            style={{
              maxWidth: '1280px',
              margin: '0 auto',
              padding: '4rem 1.25rem',
              display: 'grid',
              gridTemplateColumns: '1fr auto',
              gap: '2rem',
              alignItems: 'center',
            }}
          >
            <div>
              <p className="section-label" style={{ marginBottom: '0.75rem' }}>Community</p>
              <h2
                style={{
                  fontFamily: 'var(--font-display), "Bebas Neue", sans-serif',
                  fontSize: 'clamp(2.25rem, 5vw, 3.5rem)',
                  letterSpacing: '0.04em',
                  color: 'var(--text-primary)',
                  lineHeight: 1,
                  marginBottom: '0.875rem',
                }}
              >
                Join the Movement
              </h2>
              <p
                style={{
                  fontSize: 'var(--text-sm)',
                  color: 'var(--text-secondary)',
                  maxWidth: '460px',
                  lineHeight: 1.7,
                  letterSpacing: '0.02em',
                }}
              >
                Engage with politicians, track sentiment, and build community around real political accountability.
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', flexShrink: 0 }}>
              <Link href="/auth/sign-up" className="btn-primary">
                Create Account →
              </Link>
              <Link href="/politicians" className="btn-ghost">
                Browse First
              </Link>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
