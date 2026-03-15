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
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!session) return

    setError(null)
    setLoading(true)
    setSuccess(false)

    try {
      const response = await fetch(`/api/politicians/${politicianId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body }),
      })

      if (!response.ok) throw new Error('Failed to post comment')

      setBody('')
      setSuccess(true)
      onCommentAdded?.()
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  if (!session) {
    return (
      <div
        style={{
          padding: '2rem',
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border)',
          borderLeft: '2px solid var(--accent-primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1.5rem',
          flexWrap: 'wrap',
        }}
      >
        <div>
          <p
            style={{
              fontSize: 'var(--text-xs)',
              fontWeight: 700,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: 'var(--accent-primary)',
              marginBottom: '0.375rem',
            }}
          >
            Join the Discussion
          </p>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', letterSpacing: '0.02em' }}>
            Sign in to leave a comment on this politician.
          </p>
        </div>
        <a href="/auth/login" className="btn-primary">
          Sign In →
        </a>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ marginBottom: '0.75rem' }}>
        <label
          htmlFor="comment"
          style={{
            display: 'block',
            fontSize: 'var(--text-xs)',
            fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'var(--text-tertiary)',
            marginBottom: '0.5rem',
          }}
        >
          Add Comment
        </label>
        <textarea
          id="comment"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={4}
          placeholder="Share your perspective..."
          className="input"
          style={{ resize: 'vertical', minHeight: '100px' }}
          required
        />
      </div>

      {error && (
        <div
          style={{
            marginBottom: '0.75rem',
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

      {success && (
        <div
          style={{
            marginBottom: '0.75rem',
            padding: '0.75rem 1rem',
            background: 'rgba(74, 222, 128, 0.06)',
            border: '1px solid rgba(74, 222, 128, 0.3)',
            borderRadius: '2px',
            fontSize: 'var(--text-xs)',
            fontWeight: 700,
            letterSpacing: '0.06em',
            color: 'var(--status-positive)',
          }}
        >
          Comment posted successfully.
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.75rem' }}>
        {body.trim() && (
          <button
            type="button"
            onClick={() => setBody('')}
            className="btn-ghost"
            style={{ fontSize: 'var(--text-xs)' }}
          >
            Clear
          </button>
        )}
        <button
          type="submit"
          disabled={loading || !body.trim()}
          className="btn-primary"
          style={{ opacity: loading || !body.trim() ? 0.5 : 1, cursor: loading || !body.trim() ? 'not-allowed' : 'pointer' }}
        >
          {loading ? 'Posting...' : 'Post Comment →'}
        </button>
      </div>
    </form>
  )
}
