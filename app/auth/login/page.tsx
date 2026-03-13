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
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

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
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="mb-12 text-center">
          <h1 className="text-3xl font-bold font-mono text-accent-primary mb-2">
            get-right.church
          </h1>
          <p className="text-text-secondary">Sign in to your account</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          {error && (
            <div className="bg-status-negative/10 border border-status-negative text-status-negative p-3 rounded text-sm font-mono">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-mono text-text-secondary mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-bg-secondary border border-neutral-muted rounded text-text-primary font-mono text-sm focus:outline-none focus:border-accent-primary"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-mono text-text-secondary mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-bg-secondary border border-neutral-muted rounded text-text-primary font-mono text-sm focus:outline-none focus:border-accent-primary"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-3 bg-accent-primary text-white font-mono font-bold rounded hover:bg-accent-dark disabled:opacity-50 transition-colors"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm font-mono text-text-secondary">
          {'Don\'t have an account?'}{' '}
          <Link href="/auth/sign-up" className="text-accent-primary hover:text-accent-light">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <LoginForm />
    </Suspense>
  )
}
