'use client'

import { Suspense, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      const next = searchParams.get('next') || '/admin'
      router.push(next)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign in')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--bg-primary)',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
      }}
    >
      {/* Left panel — branding */}
      <div
        className="hidden md:flex"
        style={{
          position: 'relative',
          overflow: 'hidden',
          background: 'var(--bg-secondary)',
          borderRight: '1px solid var(--border)',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '3rem',
        }}
      >
        {/* Scanline */}
        <div className="scanlines" style={{ position: 'absolute', inset: 0, opacity: 0.5 }} />
        {/* Glow */}
        <div
          style={{
            position: 'absolute',
            bottom: '-10%',
            left: '-20%',
            width: '80%',
            height: '80%',
            background: 'radial-gradient(circle, rgba(64,145,108,0.1) 0%, transparent 65%)',
            pointerEvents: 'none',
          }}
        />

        {/* Top — logo */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <Link
            href="/"
            style={{
              fontFamily: 'var(--font-display), "Bebas Neue", sans-serif',
              fontSize: '1.25rem',
              letterSpacing: '0.06em',
              color: 'var(--accent-light)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: 'var(--accent-primary)',
                boxShadow: '0 0 6px var(--accent-primary)',
                display: 'inline-block',
              }}
            />
            GET-RIGHT.CHURCH
          </Link>
        </div>

        {/* Bottom — headline */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h2
            style={{
              fontFamily: 'var(--font-display), "Bebas Neue", sans-serif',
              fontSize: 'clamp(2.5rem, 4vw, 4rem)',
              letterSpacing: '0.04em',
              lineHeight: 0.95,
              color: 'var(--text-primary)',
              marginBottom: '1rem',
            }}
          >
            ACCOUNTABILITY
            <br />
            <span style={{ color: 'var(--accent-light)' }}>WITHOUT</span>
            <br />
            COMPROMISE
          </h2>
          <p
            style={{
              fontSize: 'var(--text-xs)',
              color: 'var(--text-tertiary)',
              letterSpacing: '0.06em',
              lineHeight: 1.7,
              maxWidth: '300px',
            }}
          >
            Political intelligence for the movement. Track, engage, and hold power accountable.
          </p>
        </div>
      </div>

      {/* Right panel — form */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem 1.25rem',
          gridColumn: 'span 2',
        }}
        className="md:col-span-1"
      >
        <div style={{ width: '100%', maxWidth: '380px' }}>
          {/* Mobile logo */}
          <div className="md:hidden" style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
            <Link
              href="/"
              style={{
                fontFamily: 'var(--font-display), "Bebas Neue", sans-serif',
                fontSize: '1.375rem',
                letterSpacing: '0.06em',
                color: 'var(--accent-light)',
              }}
            >
              GET-RIGHT.CHURCH
            </Link>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <p className="section-label" style={{ marginBottom: '0.625rem' }}>Access</p>
            <h1
              style={{
                fontFamily: 'var(--font-display), "Bebas Neue", sans-serif',
                fontSize: '2.5rem',
                letterSpacing: '0.04em',
                color: 'var(--text-primary)',
                lineHeight: 1,
              }}
            >
              Sign In
            </h1>
          </div>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {error && (
              <div
                style={{
                  padding: '0.75rem 1rem',
                  background: 'rgba(248, 113, 113, 0.06)',
                  border: '1px solid rgba(248, 113, 113, 0.3)',
                  borderRadius: '2px',
                  fontSize: 'var(--text-xs)',
                  fontWeight: 700,
                  letterSpacing: '0.06em',
                  color: 'var(--status-negative)',
                }}
              >
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="label">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="label">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{
                width: '100%',
                justifyContent: 'center',
                padding: '0.75rem',
                opacity: loading ? 0.6 : 1,
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? 'Signing in...' : 'Sign In →'}
            </button>
          </form>

          <p
            style={{
              marginTop: '1.5rem',
              fontSize: 'var(--text-xs)',
              color: 'var(--text-tertiary)',
              letterSpacing: '0.04em',
              textAlign: 'center',
            }}
          >
            No account?{' '}
            <Link
              href="/auth/sign-up"
              style={{
                color: 'var(--accent-primary)',
                fontWeight: 700,
                transition: 'color 0.15s ease',
              }}
              onMouseEnter={(e) => {
                ;(e.currentTarget as HTMLAnchorElement).style.color = 'var(--accent-light)'
              }}
              onMouseLeave={(e) => {
                ;(e.currentTarget as HTMLAnchorElement).style.color = 'var(--accent-primary)'
              }}
            >
              Create one →
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }} />}>
      <LoginForm />
    </Suspense>
  )
}
