'use client'

import { useState } from 'react'
import { useSession } from '@/lib/hooks'

interface CommentFormProps {
  politicianId: string
  onCommentAdded?: () => void
}

export function CommentForm({ politicianId, onCommentAdded }: CommentFormProps) {
  const { session } = useSession()
  const [body, setBody] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!session) return

    setError(null)
    setLoading(true)

    try {
      const response = await fetch(`/api/politicians/${politicianId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body }),
      })

      if (!response.ok) {
        throw new Error('Failed to post comment')
      }

      setBody('')
      onCommentAdded?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  if (!session) {
    return (
      <div className="card bg-neutral-muted/30 text-center py-8">
        <p className="text-text-secondary font-mono mb-4">
          Sign in to join the discussion
        </p>
        <a
          href="/auth/login"
          className="inline-block px-4 py-2 bg-accent-primary text-white font-mono font-bold rounded hover:bg-accent-dark transition-colors"
        >
          Sign In
        </a>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="card">
      <div className="mb-4">
        <label htmlFor="comment" className="block text-sm font-mono text-text-secondary mb-2">
          Your comment
        </label>
        <textarea
          id="comment"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={4}
          placeholder="Share your thoughts..."
          className="w-full px-4 py-2 bg-bg-secondary border border-neutral-muted rounded text-text-primary font-sans text-sm focus:outline-none focus:border-accent-primary"
          required
        />
      </div>

      {error && (
        <div className="mb-4 p-3 bg-status-negative/10 border border-status-negative rounded text-status-negative text-sm font-mono">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading || !body.trim()}
        className="px-4 py-2 bg-accent-primary text-white font-mono font-bold rounded hover:bg-accent-dark disabled:opacity-50 transition-colors"
      >
        {loading ? 'Posting...' : 'Post Comment'}
      </button>
    </form>
  )
}
