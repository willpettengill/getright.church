'use client'

import Link from 'next/link'
import { useSession } from '@/lib/hooks'
import { createClient } from '@/lib/supabase/client'
import { useState } from 'react'

export function Header() {
  const { session } = useSession()
  const [menuOpen, setMenuOpen] = useState(false)

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  return (
    <header
      style={{
        background: 'var(--bg-secondary)',
        borderBottom: '1px solid var(--border)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}
    >
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 1.25rem',
          height: '56px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '2rem',
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          style={{
            fontFamily: 'var(--font-display), "Bebas Neue", Impact, sans-serif',
            fontSize: '1.375rem',
            letterSpacing: '0.06em',
            color: 'var(--accent-light)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            flexShrink: 0,
          }}
          onMouseEnter={(e) => {
            ;(e.currentTarget as HTMLAnchorElement).style.color = 'var(--accent-bright)'
          }}
          onMouseLeave={(e) => {
            ;(e.currentTarget as HTMLAnchorElement).style.color = 'var(--accent-light)'
          }}
        >
          {/* Live signal dot */}
          <span
            className="animate-pulse-dot"
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: 'var(--accent-primary)',
              display: 'inline-block',
              boxShadow: '0 0 6px var(--accent-primary)',
              flexShrink: 0,
            }}
          />
          GET-RIGHT.CHURCH
        </Link>

        {/* Desktop nav */}
        <nav
          className="hidden md:flex"
          style={{ gap: '0.125rem', alignItems: 'center' }}
        >
          {[
            { href: '/politicians', label: 'Politicians' },
            { href: '/issues', label: 'Issues' },
            { href: '/geographies', label: 'Geography' },
            { href: '/the-talk', label: 'The Talk' },
            { href: '/blunch', label: 'Blunch' },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              style={{
                padding: '0.375rem 0.75rem',
                fontSize: 'var(--text-xs)',
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'var(--text-secondary)',
                borderRadius: '2px',
                transition: 'color 0.15s ease, background 0.15s ease',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLAnchorElement
                el.style.color = 'var(--accent-bright)'
                el.style.background = 'var(--accent-glow)'
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLAnchorElement
                el.style.color = 'var(--text-secondary)'
                el.style.background = 'transparent'
              }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
          {session ? (
            <>
              <Link
                href="/admin"
                style={{
                  fontSize: 'var(--text-xs)',
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: 'var(--text-tertiary)',
                  transition: 'color 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  ;(e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-primary)'
                }}
                onMouseLeave={(e) => {
                  ;(e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-tertiary)'
                }}
              >
                Admin
              </Link>
              <button
                onClick={handleLogout}
                style={{
                  padding: '0.375rem 0.875rem',
                  fontSize: 'var(--text-xs)',
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: 'var(--text-secondary)',
                  background: 'transparent',
                  border: '1px solid var(--neutral-muted)',
                  borderRadius: '2px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLButtonElement
                  el.style.color = 'var(--text-primary)'
                  el.style.borderColor = 'var(--neutral-mid)'
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLButtonElement
                  el.style.color = 'var(--text-secondary)'
                  el.style.borderColor = 'var(--neutral-muted)'
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/auth/login"
              style={{
                padding: '0.375rem 0.875rem',
                fontSize: 'var(--text-xs)',
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: '#fff',
                background: 'var(--accent-primary)',
                border: '1px solid var(--accent-primary)',
                borderRadius: '2px',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLAnchorElement
                el.style.background = 'var(--accent-light)'
                el.style.borderColor = 'var(--accent-light)'
                el.style.boxShadow = '0 0 16px var(--accent-glow-lg)'
                el.style.color = '#fff'
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLAnchorElement
                el.style.background = 'var(--accent-primary)'
                el.style.borderColor = 'var(--accent-primary)'
                el.style.boxShadow = 'none'
              }}
            >
              Sign In
            </Link>
          )}

          {/* Mobile menu toggle */}
          <button
            className="md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              padding: '0.375rem',
              color: 'var(--text-secondary)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
            }}
            aria-label="Toggle menu"
          >
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                style={{
                  display: 'block',
                  width: '18px',
                  height: '1.5px',
                  background: 'var(--text-secondary)',
                  transition: 'all 0.2s ease',
                  transform:
                    menuOpen && i === 0
                      ? 'translateY(5.5px) rotate(45deg)'
                      : menuOpen && i === 2
                        ? 'translateY(-5.5px) rotate(-45deg)'
                        : menuOpen && i === 1
                          ? 'scaleX(0)'
                          : 'none',
                }}
              />
            ))}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          className="md:hidden"
          style={{
            borderTop: '1px solid var(--border)',
            padding: '1rem 1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.25rem',
          }}
        >
          {[
            { href: '/politicians', label: 'Politicians' },
            { href: '/issues', label: 'Issues' },
            { href: '/geographies', label: 'Geography' },
            { href: '/the-talk', label: 'The Talk' },
            { href: '/blunch', label: 'Blunch' },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              style={{
                padding: '0.625rem 0.5rem',
                fontSize: 'var(--text-xs)',
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'var(--text-secondary)',
                borderRadius: '2px',
              }}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  )
}
