import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

export const metadata = {
  title: 'Blunch | get-right.church',
  description: 'Community events and in-person organizing',
}

export default function BlunchPage() {
  return (
    <>
      <Header />
      <style>{`
        .blunch-feature-item { background: var(--bg-secondary); padding: 2rem 1.5rem; transition: background 0.15s ease; }
        .blunch-feature-item:hover { background: var(--bg-elevated, #1e1e1e); }
      `}</style>
      <main style={{ minHeight: '100vh' }}>

        {/* Hero */}
        <div
          style={{
            position: 'relative',
            overflow: 'hidden',
            borderBottom: '1px solid var(--border)',
            background: 'linear-gradient(160deg, var(--bg-secondary) 0%, var(--bg-primary) 70%)',
            padding: '6rem 0 5rem',
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(ellipse at 20% 50%, rgba(64,145,108,0.06) 0%, transparent 60%)',
              pointerEvents: 'none',
            }}
          />
          <div className="scanlines" style={{ position: 'absolute', inset: 0, zIndex: 0, opacity: 0.4 }} />

          <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.25rem', position: 'relative', zIndex: 1 }}>
            <p className="section-label" style={{ marginBottom: '1rem' }}>Coming Soon</p>
            <h1
              style={{
                fontFamily: 'var(--font-display), "Bebas Neue", sans-serif',
                fontSize: 'clamp(4rem, 12vw, 9rem)',
                letterSpacing: '0.04em',
                lineHeight: 0.92,
                color: 'var(--text-primary)',
                marginBottom: '1.5rem',
              }}
            >
              BLUNCH
            </h1>
            <p
              style={{
                fontSize: 'var(--text-base)',
                color: 'var(--text-secondary)',
                maxWidth: '480px',
                lineHeight: 1.7,
                letterSpacing: '0.02em',
              }}
            >
              Where the community gathers in person. Organizing brunches, strategy sessions, and movement-building events in your city.
            </p>
          </div>
        </div>

        {/* Coming soon content */}
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '4rem 1.25rem' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1px',
              background: 'var(--border)',
            }}
          >
            {[
              {
                icon: '○',
                heading: 'City Events',
                body: 'Monthly community brunches and organizing sessions in major cities across the country.',
              },
              {
                icon: '○',
                heading: 'Strategy Sessions',
                body: 'Expert-led workshops on voter outreach, local organizing, and political engagement.',
              },
              {
                icon: '○',
                heading: 'Network Map',
                body: 'Connect with organizers near you. Find your local chapter and get active.',
              },
            ].map((item) => (
              <div key={item.heading} className="blunch-feature-item">
                <p
                  style={{
                    fontFamily: 'var(--font-display), "Bebas Neue", sans-serif',
                    fontSize: '3rem',
                    color: 'var(--accent-primary)',
                    lineHeight: 1,
                    marginBottom: '1rem',
                    opacity: 0.4,
                  }}
                >
                  {item.icon}
                </p>
                <h3
                  style={{
                    fontSize: 'var(--text-xs)',
                    fontWeight: 700,
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    color: 'var(--text-primary)',
                    marginBottom: '0.625rem',
                  }}
                >
                  {item.heading}
                </h3>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)', lineHeight: 1.65, letterSpacing: '0.02em' }}>
                  {item.body}
                </p>
              </div>
            ))}
          </div>

          <div
            style={{
              marginTop: '3rem',
              padding: '2.5rem',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border)',
              borderLeft: '2px solid var(--accent-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '2rem',
              flexWrap: 'wrap',
            }}
          >
            <div>
              <p style={{ fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--accent-primary)', marginBottom: '0.5rem' }}>
                Get Notified
              </p>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', letterSpacing: '0.02em' }}>
                Blunch launches in select cities in 2025. Sign up to be first.
              </p>
            </div>
            <a href="/auth/sign-up" className="btn-primary">Join Waitlist →</a>
          </div>
        </div>

      </main>
      <Footer />
    </>
  )
}
