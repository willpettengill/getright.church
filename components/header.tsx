'use client'

import Link from 'next/link'
import { useSession } from '@/lib/hooks'
import { createClient } from '@/lib/supabase/client'

export function Header() {
  const { session } = useSession()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  return (
    <header className="border-b border-neutral-muted bg-bg-secondary sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="font-mono text-2xl font-bold text-accent-primary">
          get-right.church
        </Link>

        <nav className="hidden md:flex gap-6 items-center font-mono text-sm">
          <Link
            href="/politicians"
            className="text-text-secondary hover:text-accent-primary transition-colors"
          >
            Politicians
          </Link>
          <Link
            href="/geographies"
            className="text-text-secondary hover:text-accent-primary transition-colors"
          >
            Geography
          </Link>
          <Link
            href="/the-talk"
            className="text-text-secondary hover:text-accent-primary transition-colors"
          >
            The Talk
          </Link>
          <Link
            href="/blunch"
            className="text-text-secondary hover:text-accent-primary transition-colors"
          >
            Blunch
          </Link>
        </nav>

        <div className="flex gap-4 items-center">
          {session ? (
            <>
              <Link
                href="/admin"
                className="text-text-secondary hover:text-accent-primary transition-colors text-sm font-mono"
              >
                Admin
              </Link>
              <button
                onClick={handleLogout}
                className="text-text-secondary hover:text-accent-primary transition-colors text-sm font-mono"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/auth/login"
              className="text-accent-primary hover:text-accent-light transition-colors text-sm font-mono font-bold"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
